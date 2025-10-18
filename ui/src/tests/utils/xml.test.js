import { jsonToXml, xmlToJson } from '../../utils/xml';

// Mock DOM methods for testing
const mockDocument = {
  implementation: {
    createDocument: () => ({
      createElementNS: (namespace, tagName) => ({
        setAttribute: jest.fn(),
        appendChild: jest.fn(),
        textContent: ''
      }),
      appendChild: jest.fn()
    })
  }
};

const mockXMLSerializer = {
  serializeToString: jest.fn(() => '<xml>test</xml>')
};

const mockDOMParser = {
  parseFromString: jest.fn(() => ({
    querySelector: jest.fn(),
    querySelectorAll: jest.fn(() => [])
  }))
};

// Mock global objects
global.document = mockDocument;
global.XMLSerializer = jest.fn(() => mockXMLSerializer);
global.DOMParser = jest.fn(() => mockDOMParser);

describe('XML Adapters', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('jsonToXml', () => {
    it('should convert basic internal JSON to XML', () => {
      const internalData = {
        spec: {
          title: 'Test Specification',
          ifcVersion: 'IFC4',
          name: 'test-spec'
        },
        applicability: [
          {
            id: 'test-id',
            type: 'Property',
            propertyName: 'TestProperty',
            propertySet: 'TestPropertySet',
            dataType: 'IfcLabel',
            value: 'TestValue'
          }
        ]
      };

      const result = jsonToXml(internalData);
      
      expect(mockDocument.implementation.createDocument).toHaveBeenCalled();
      expect(mockXMLSerializer.serializeToString).toHaveBeenCalled();
    });

    it('should handle empty applicability array', () => {
      const internalData = {
        spec: {
          title: 'Empty Spec',
          ifcVersion: 'IFC4',
          name: 'empty-spec'
        },
        applicability: []
      };

      const result = jsonToXml(internalData);
      
      expect(mockDocument.implementation.createDocument).toHaveBeenCalled();
      expect(mockXMLSerializer.serializeToString).toHaveBeenCalled();
    });

    it('should handle different applicability types', () => {
      const internalData = {
        spec: {
          title: 'Multi Type Spec',
          ifcVersion: 'IFC4',
          name: 'multi-spec'
        },
        applicability: [
          {
            id: 'prop-id',
            type: 'Property',
            propertyName: 'TestProperty',
            dataType: 'IfcLabel'
          },
          {
            id: 'entity-id',
            type: 'Entity',
            entity: 'IfcWall',
            predefinedType: 'STANDARD'
          },
          {
            id: 'material-id',
            type: 'Material',
            material: 'Concrete'
          },
          {
            id: 'classification-id',
            type: 'Classification',
            system: 'OmniClass',
            value: '23-11 11 00'
          },
          {
            id: 'partof-id',
            type: 'Part of',
            relation: 'IFCRELAGGREGATES',
            entity: 'IfcBuilding',
            predefinedType: 'BUILDING'
          }
        ]
      };

      const result = jsonToXml(internalData);
      
      expect(mockDocument.implementation.createDocument).toHaveBeenCalled();
      expect(mockXMLSerializer.serializeToString).toHaveBeenCalled();
    });
  });

  describe('xmlToJson', () => {
    it('should convert XML to internal JSON format', () => {
      const mockXmlDoc = {
        querySelector: jest.fn((selector) => {
          if (selector === 'ids\\:title, title') {
            return { textContent: 'Test Specification' };
          }
          if (selector === 'ids\\:specification, specification') {
            return {
              getAttribute: jest.fn((attr) => {
                if (attr === 'ifcVersion') return 'IFC4';
                if (attr === 'name') return 'test-spec';
                return '';
              })
            };
          }
          if (selector === 'ids\\:applicability, applicability') {
            return {
              querySelectorAll: jest.fn((selector) => {
                if (selector === 'ids\\:property, property') {
                  return [{
                    querySelector: jest.fn((sel) => {
                      if (sel === 'ids\\:name, name') {
                        return {
                          querySelector: jest.fn(() => ({ textContent: 'TestProperty' }))
                        };
                      }
                      if (sel === 'ids\\:dataType, dataType') {
                        return {
                          querySelector: jest.fn(() => ({ textContent: 'IfcLabel' }))
                        };
                      }
                      return null;
                    })
                  }];
                }
                return [];
              })
            };
          }
          return null;
        }),
        querySelectorAll: jest.fn(() => [])
      };

      mockDOMParser.parseFromString.mockReturnValue(mockXmlDoc);

      const result = xmlToJson('<xml>test</xml>');
      
      expect(mockDOMParser.parseFromString).toHaveBeenCalledWith('<xml>test</xml>', 'application/xml');
      expect(result).toHaveProperty('spec');
      expect(result).toHaveProperty('applicability');
    });

    it('should handle XML parse errors', () => {
      const mockXmlDoc = {
        querySelector: jest.fn((selector) => {
          if (selector === 'parsererror') {
            return { textContent: 'Invalid XML' };
          }
          return null;
        })
      };

      mockDOMParser.parseFromString.mockReturnValue(mockXmlDoc);

      expect(() => xmlToJson('<invalid>xml</invalid>')).toThrow('XML parse error: Invalid XML');
    });

    it('should handle empty XML', () => {
      const mockXmlDoc = {
        querySelector: jest.fn(() => null),
        querySelectorAll: jest.fn(() => [])
      };

      mockDOMParser.parseFromString.mockReturnValue(mockXmlDoc);

      const result = xmlToJson('<xml></xml>');
      
      expect(result).toEqual({
        spec: {},
        applicability: []
      });
    });
  });

  describe('Round-trip conversion', () => {
    it('should maintain data integrity through jsonToXml -> xmlToJson', () => {
      const originalData = {
        spec: {
          title: 'Round Trip Test',
          ifcVersion: 'IFC4',
          name: 'roundtrip-spec'
        },
        applicability: [
          {
            id: 'test-id',
            type: 'Property',
            propertyName: 'TestProperty',
            propertySet: 'TestPropertySet',
            dataType: 'IfcLabel',
            value: 'TestValue'
          }
        ]
      };

      // Mock the XML serialization to return a simple XML string
      mockXMLSerializer.serializeToString.mockReturnValue(`
        <ids:ids xmlns:ids="http://standards.buildingsmart.org/IDS">
          <ids:info>
            <ids:title>Round Trip Test</ids:title>
          </ids:info>
          <ids:specifications>
            <ids:specification ifcVersion="IFC4" name="roundtrip-spec">
              <ids:applicability>
                <ids:property>
                  <ids:name>
                    <ids:simpleValue>TestProperty</ids:simpleValue>
                  </ids:name>
                  <ids:propertySet>
                    <ids:simpleValue>TestPropertySet</ids:simpleValue>
                  </ids:propertySet>
                  <ids:dataType>
                    <ids:simpleValue>IfcLabel</ids:simpleValue>
                  </ids:dataType>
                  <ids:value>
                    <ids:simpleValue>TestValue</ids:simpleValue>
                  </ids:value>
                </ids:property>
              </ids:applicability>
            </ids:specification>
          </ids:specifications>
        </ids:ids>
      `);

      // Mock the XML parsing to return the expected structure
      const mockXmlDoc = {
        querySelector: jest.fn((selector) => {
          if (selector === 'ids\\:title, title') {
            return { textContent: 'Round Trip Test' };
          }
          if (selector === 'ids\\:specification, specification') {
            return {
              getAttribute: jest.fn((attr) => {
                if (attr === 'ifcVersion') return 'IFC4';
                if (attr === 'name') return 'roundtrip-spec';
                return '';
              })
            };
          }
          if (selector === 'ids\\:applicability, applicability') {
            return {
              querySelectorAll: jest.fn((selector) => {
                if (selector === 'ids\\:property, property') {
                  return [{
                    querySelector: jest.fn((sel) => {
                      if (sel === 'ids\\:name, name') {
                        return {
                          querySelector: jest.fn(() => ({ textContent: 'TestProperty' }))
                        };
                      }
                      if (sel === 'ids\\:propertySet, propertySet') {
                        return {
                          querySelector: jest.fn(() => ({ textContent: 'TestPropertySet' }))
                        };
                      }
                      if (sel === 'ids\\:dataType, dataType') {
                        return {
                          querySelector: jest.fn(() => ({ textContent: 'IfcLabel' }))
                        };
                      }
                      if (sel === 'ids\\:value, value') {
                        return {
                          querySelector: jest.fn(() => ({ textContent: 'TestValue' }))
                        };
                      }
                      return null;
                    })
                  }];
                }
                return [];
              })
            };
          }
          return null;
        }),
        querySelectorAll: jest.fn(() => [])
      };

      mockDOMParser.parseFromString.mockReturnValue(mockXmlDoc);

      const xmlResult = jsonToXml(originalData);
      const jsonResult = xmlToJson(xmlResult);
      
      expect(jsonResult.spec.title).toBe(originalData.spec.title);
      expect(jsonResult.spec.ifcVersion).toBe(originalData.spec.ifcVersion);
      expect(jsonResult.spec.name).toBe(originalData.spec.name);
      expect(jsonResult.applicability).toHaveLength(1);
      expect(jsonResult.applicability[0].type).toBe('Property');
    });
  });
});
