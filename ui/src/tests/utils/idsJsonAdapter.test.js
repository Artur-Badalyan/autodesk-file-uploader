import { parseNamespacedIdsJson, buildNamespacedIdsJson } from '../../utils/idsJsonAdapter';

describe('IDS JSON Adapters', () => {
  describe('parseNamespacedIdsJson', () => {
    it('should parse namespaced JSON with single applicability items', () => {
      const namespacedJson = {
        ids: {
          info: {
            title: { __text: 'Test Specification' }
          },
          specifications: {
            specification: {
              _ifcVersion: 'IFC4',
              _name: 'test-spec',
              applicability: {
                entity: {
                  name: { simpleValue: { __text: 'IfcWall' } },
                  predefinedType: { simpleValue: { __text: 'STANDARD' } }
                }
              }
            }
          }
        }
      };

      const result = parseNamespacedIdsJson(namespacedJson);

      expect(result).toEqual({
        spec: {
          title: 'Test Specification',
          ifcVersion: 'IFC4',
          name: 'test-spec'
        },
        applicability: [
          {
            type: 'Entity',
            name: 'IfcWall',
            predefinedType: 'STANDARD'
          }
        ]
      });
    });

    it('should parse namespaced JSON with multiple applicability items', () => {
      const namespacedJson = {
        ids: {
          info: {
            title: { __text: 'Multi Item Spec' }
          },
          specifications: {
            specification: {
              _ifcVersion: 'IFC4',
              _name: 'multi-spec',
              applicability: {
                entity: [
                  {
                    name: { simpleValue: { __text: 'IfcWall' } },
                    predefinedType: { simpleValue: { __text: 'STANDARD' } }
                  },
                  {
                    name: { simpleValue: { __text: 'IfcDoor' } },
                    predefinedType: { simpleValue: { __text: 'DOOR' } }
                  }
                ],
                property: {
                  name: { simpleValue: { __text: 'TestProperty' } },
                  propertySet: { simpleValue: { __text: 'TestPropertySet' } },
                  dataType: { simpleValue: { __text: 'IfcLabel' } },
                  value: { simpleValue: { __text: 'TestValue' } }
                }
              }
            }
          }
        }
      };

      const result = parseNamespacedIdsJson(namespacedJson);

      expect(result.spec.title).toBe('Multi Item Spec');
      expect(result.applicability).toHaveLength(3);
      expect(result.applicability[0].type).toBe('Entity');
      expect(result.applicability[0].name).toBe('IfcWall');
      expect(result.applicability[1].type).toBe('Entity');
      expect(result.applicability[1].name).toBe('IfcDoor');
      expect(result.applicability[2].type).toBe('Attribute');
      expect(result.applicability[2].name).toBe('TestProperty');
    });

    it('should handle empty or missing data', () => {
      const emptyJson = {};
      const result = parseNamespacedIdsJson(emptyJson);

      expect(result).toEqual({
        spec: {},
        applicability: []
      });
    });

    it('should handle missing applicability section', () => {
      const namespacedJson = {
        ids: {
          info: {
            title: { __text: 'No Applicability' }
          },
          specifications: {
            specification: {
              _ifcVersion: 'IFC4',
              _name: 'no-appl-spec'
            }
          }
        }
      };

      const result = parseNamespacedIdsJson(namespacedJson);

      expect(result.spec.title).toBe('No Applicability');
      expect(result.applicability).toEqual([]);
    });

    it('should handle different applicability types', () => {
      const namespacedJson = {
        ids: {
          info: {
            title: { __text: 'All Types Spec' }
          },
          specifications: {
            specification: {
              _ifcVersion: 'IFC4',
              _name: 'all-types-spec',
              applicability: {
                entity: {
                  name: { simpleValue: { __text: 'IfcWall' } }
                },
                partOf: {
                  _relation: 'IFCRELAGGREGATES',
                  entity: {
                    name: { simpleValue: { __text: 'IfcBuilding' } }
                  }
                },
                classification: {
                  system: { simpleValue: { __text: 'OmniClass' } },
                  value: { simpleValue: { __text: '23-11 11 00' } }
                },
                attribute: {
                  name: { simpleValue: { __text: 'TestAttribute' } },
                  value: { simpleValue: { __text: 'TestValue' } }
                },
                material: {
                  value: { simpleValue: { __text: 'Concrete' } }
                }
              }
            }
          }
        }
      };

      const result = parseNamespacedIdsJson(namespacedJson);

      expect(result.applicability).toHaveLength(5);
      expect(result.applicability[0].type).toBe('Entity');
      expect(result.applicability[1].type).toBe('Part of');
      expect(result.applicability[1].relation).toBe('IFCRELAGGREGATES');
      expect(result.applicability[2].type).toBe('Classification');
      expect(result.applicability[3].type).toBe('Attribute');
      expect(result.applicability[4].type).toBe('Material');
    });
  });

  describe('buildNamespacedIdsJson', () => {
    it('should build namespaced JSON from internal format', () => {
      const internalData = {
        spec: {
          title: 'Test Specification',
          ifcVersion: 'IFC4',
          name: 'test-spec'
        },
        applicability: [
          {
            type: 'Entity',
            name: 'IfcWall',
            predefinedType: 'STANDARD'
          }
        ]
      };

      const result = buildNamespacedIdsJson(internalData);

      expect(result).toHaveProperty('ids');
      expect(result.ids).toHaveProperty('info');
      expect(result.ids).toHaveProperty('specifications');
      expect(result.ids.info.title.__text).toBe('Test Specification');
      expect(result.ids.specifications.specification._ifcVersion).toBe('IFC4');
      expect(result.ids.specifications.specification._name).toBe('test-spec');
      expect(result.ids.specifications.specification.applicability).toHaveProperty('entity');
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

      const result = buildNamespacedIdsJson(internalData);

      expect(result.ids.specifications.specification.applicability).toEqual({ __prefix: 'ids' });
    });

    it('should handle multiple items of the same type', () => {
      const internalData = {
        spec: {
          title: 'Multiple Items',
          ifcVersion: 'IFC4',
          name: 'multi-spec'
        },
        applicability: [
          {
            type: 'Entity',
            name: 'IfcWall',
            predefinedType: 'STANDARD'
          },
          {
            type: 'Entity',
            name: 'IfcDoor',
            predefinedType: 'DOOR'
          }
        ]
      };

      const result = buildNamespacedIdsJson(internalData);

      expect(Array.isArray(result.ids.specifications.specification.applicability.entity)).toBe(true);
      expect(result.ids.specifications.specification.applicability.entity).toHaveLength(2);
    });

    it('should handle different applicability types', () => {
      const internalData = {
        spec: {
          title: 'All Types',
          ifcVersion: 'IFC4',
          name: 'all-types'
        },
        applicability: [
          {
            type: 'Property',
            propertyName: 'TestProperty',
            propertySet: 'TestPropertySet',
            dataType: 'IfcLabel',
            value: 'TestValue'
          },
          {
            type: 'Part of',
            relation: 'IFCRELAGGREGATES',
            entity: 'IfcBuilding',
            predefinedType: 'BUILDING'
          },
          {
            type: 'Material',
            material: 'Concrete'
          },
          {
            type: 'Classification',
            system: 'OmniClass',
            value: '23-11 11 00'
          },
          {
            type: 'Entity',
            entity: 'IfcWall',
            predefinedType: 'STANDARD'
          }
        ]
      };

      const result = buildNamespacedIdsJson(internalData);

      expect(result.ids.specifications.specification.applicability).toHaveProperty('property');
      expect(result.ids.specifications.specification.applicability).toHaveProperty('partOf');
      expect(result.ids.specifications.specification.applicability).toHaveProperty('material');
      expect(result.ids.specifications.specification.applicability).toHaveProperty('classification');
      expect(result.ids.specifications.specification.applicability).toHaveProperty('entity');
    });

    it('should handle missing spec data', () => {
      const internalData = {
        spec: {},
        applicability: []
      };

      const result = buildNamespacedIdsJson(internalData);

      expect(result.ids.info.title.__text).toBe('');
      expect(result.ids.specifications.specification._ifcVersion).toBe('');
      expect(result.ids.specifications.specification._name).toBe('');
    });
  });

  describe('Round-trip conversion', () => {
    it('should maintain data integrity through parseNamespacedIdsJson -> buildNamespacedIdsJson', () => {
      const originalNamespaced = {
        ids: {
          info: {
            title: { __text: 'Round Trip Test' }
          },
          specifications: {
            specification: {
              _ifcVersion: 'IFC4',
              _name: 'roundtrip-spec',
              applicability: {
                entity: {
                  name: { simpleValue: { __text: 'IfcWall' } },
                  predefinedType: { simpleValue: { __text: 'STANDARD' } }
                },
                property: {
                  name: { simpleValue: { __text: 'TestProperty' } },
                  dataType: { simpleValue: { __text: 'IfcLabel' } }
                }
              }
            }
          }
        }
      };

      const internal = parseNamespacedIdsJson(originalNamespaced);
      const namespaced = buildNamespacedIdsJson(internal);

      expect(namespaced.ids.info.title.__text).toBe('Round Trip Test');
      expect(namespaced.ids.specifications.specification._ifcVersion).toBe('IFC4');
      expect(namespaced.ids.specifications.specification._name).toBe('roundtrip-spec');
      expect(namespaced.ids.specifications.specification.applicability).toHaveProperty('entity');
      expect(namespaced.ids.specifications.specification.applicability).toHaveProperty('property');
    });

    it('should handle complex nested structures', () => {
      const internalData = {
        spec: {
          title: 'Complex Test',
          ifcVersion: 'IFC4',
          name: 'complex-spec'
        },
        applicability: [
          {
            type: 'Part of',
            relation: 'IFCRELAGGREGATES',
            entity: 'IfcBuilding',
            predefinedType: 'BUILDING'
          },
          {
            type: 'Classification',
            system: 'OmniClass',
            value: '23-11 11 00'
          }
        ]
      };

      const namespaced = buildNamespacedIdsJson(internalData);
      const internal = parseNamespacedIdsJson(namespaced);

      expect(internal.spec.title).toBe('Complex Test');
      expect(internal.applicability).toHaveLength(2);
      expect(internal.applicability[0].type).toBe('Part of');
      expect(internal.applicability[0].relation).toBe('IFCRELAGGREGATES');
      expect(internal.applicability[1].type).toBe('Classification');
      expect(internal.applicability[1].system).toBe('OmniClass');
    });
  });
});
