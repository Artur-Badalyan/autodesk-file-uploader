// Утилиты конвертации JSON <-> XML для IDS формата.
export function jsonToXml(json) {
  const { spec = {}, applicability = [] } = json || {};
  const doc = document.implementation.createDocument('', '', null);
  
  // Create root element with proper namespaces
  const root = doc.createElementNS('http://standards.buildingsmart.org/IDS', 'ids:ids');
  root.setAttribute('xmlns:ids', 'http://standards.buildingsmart.org/IDS');
  root.setAttribute('xmlns:xs', 'http://www.w3.org/2001/XMLSchema');
  root.setAttribute('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance');
  root.setAttribute('xsi:schemaLocation', 'http://standards.buildingsmart.org/IDS http://standards.buildingsmart.org/IDS/1.0/ids.xsd');
  doc.appendChild(root);

  // Add info section
  const info = doc.createElementNS('http://standards.buildingsmart.org/IDS', 'ids:info');
  const title = doc.createElementNS('http://standards.buildingsmart.org/IDS', 'ids:title');
  title.textContent = spec.title || '';
  info.appendChild(title);
  root.appendChild(info);

  // Add specifications section
  const specifications = doc.createElementNS('http://standards.buildingsmart.org/IDS', 'ids:specifications');
  const specification = doc.createElementNS('http://standards.buildingsmart.org/IDS', 'ids:specification');
  specification.setAttribute('ifcVersion', spec.ifcVersion || 'IFC4');
  specification.setAttribute('name', spec.name || '');
  specifications.appendChild(specification);
  root.appendChild(specifications);

  // Add applicability section
  const appl = doc.createElementNS('http://standards.buildingsmart.org/IDS', 'ids:applicability');
  appl.setAttribute('minOccurs', '0');
  appl.setAttribute('maxOccurs', 'unbounded');

  applicability.forEach((item) => {
    const type = (item.type || '').toLowerCase();
    
    if (type === 'property') {
      const property = doc.createElementNS('http://standards.buildingsmart.org/IDS', 'ids:property');
      
      if (item.propertyName) {
        const name = doc.createElementNS('http://standards.buildingsmart.org/IDS', 'ids:name');
        const simpleValue = doc.createElementNS('http://standards.buildingsmart.org/IDS', 'ids:simpleValue');
        simpleValue.textContent = item.propertyName;
        name.appendChild(simpleValue);
        property.appendChild(name);
      }
      
      if (item.propertySet) {
        const propertySet = doc.createElementNS('http://standards.buildingsmart.org/IDS', 'ids:propertySet');
        const simpleValue = doc.createElementNS('http://standards.buildingsmart.org/IDS', 'ids:simpleValue');
        simpleValue.textContent = item.propertySet;
        propertySet.appendChild(simpleValue);
        property.appendChild(propertySet);
      }
      
      if (item.dataType) {
        const dataType = doc.createElementNS('http://standards.buildingsmart.org/IDS', 'ids:dataType');
        const simpleValue = doc.createElementNS('http://standards.buildingsmart.org/IDS', 'ids:simpleValue');
        simpleValue.textContent = item.dataType;
        dataType.appendChild(simpleValue);
        property.appendChild(dataType);
      }
      
      if (item.value) {
        const value = doc.createElementNS('http://standards.buildingsmart.org/IDS', 'ids:value');
        const simpleValue = doc.createElementNS('http://standards.buildingsmart.org/IDS', 'ids:simpleValue');
        simpleValue.textContent = item.value;
        value.appendChild(simpleValue);
        property.appendChild(value);
      }
      
      appl.appendChild(property);
    } else if (type === 'part of' || type === 'partof') {
      const partOf = doc.createElementNS('http://standards.buildingsmart.org/IDS', 'ids:partOf');
      if (item.relation) partOf.setAttribute('relation', item.relation);
      
      const entity = doc.createElementNS('http://standards.buildingsmart.org/IDS', 'ids:entity');
      
      if (item.entity) {
        const name = doc.createElementNS('http://standards.buildingsmart.org/IDS', 'ids:name');
        const simpleValue = doc.createElementNS('http://standards.buildingsmart.org/IDS', 'ids:simpleValue');
        simpleValue.textContent = item.entity;
        name.appendChild(simpleValue);
        entity.appendChild(name);
      }
      
      if (item.predefinedType) {
        const predefinedType = doc.createElementNS('http://standards.buildingsmart.org/IDS', 'ids:predefinedType');
        const simpleValue = doc.createElementNS('http://standards.buildingsmart.org/IDS', 'ids:simpleValue');
        simpleValue.textContent = item.predefinedType;
        predefinedType.appendChild(simpleValue);
        entity.appendChild(predefinedType);
      }
      
      partOf.appendChild(entity);
      appl.appendChild(partOf);
    } else if (type === 'material') {
      const material = doc.createElementNS('http://standards.buildingsmart.org/IDS', 'ids:material');
      
      if (item.material || item.value) {
        const value = doc.createElementNS('http://standards.buildingsmart.org/IDS', 'ids:value');
        const simpleValue = doc.createElementNS('http://standards.buildingsmart.org/IDS', 'ids:simpleValue');
        simpleValue.textContent = item.material || item.value || '';
        value.appendChild(simpleValue);
        material.appendChild(value);
      }
      
      appl.appendChild(material);
    } else if (type === 'classification') {
      const classification = doc.createElementNS('http://standards.buildingsmart.org/IDS', 'ids:classification');
      
      if (item.system) {
        const system = doc.createElementNS('http://standards.buildingsmart.org/IDS', 'ids:system');
        const simpleValue = doc.createElementNS('http://standards.buildingsmart.org/IDS', 'ids:simpleValue');
        simpleValue.textContent = item.system;
        system.appendChild(simpleValue);
        classification.appendChild(system);
      }
      
      if (item.value) {
        const value = doc.createElementNS('http://standards.buildingsmart.org/IDS', 'ids:value');
        const simpleValue = doc.createElementNS('http://standards.buildingsmart.org/IDS', 'ids:simpleValue');
        simpleValue.textContent = item.value;
        value.appendChild(simpleValue);
        classification.appendChild(value);
      }
      
      appl.appendChild(classification);
    } else if (type === 'entity') {
      const entity = doc.createElementNS('http://standards.buildingsmart.org/IDS', 'ids:entity');
      
      if (item.entity || item.name) {
        const name = doc.createElementNS('http://standards.buildingsmart.org/IDS', 'ids:name');
        const simpleValue = doc.createElementNS('http://standards.buildingsmart.org/IDS', 'ids:simpleValue');
        simpleValue.textContent = item.entity || item.name || '';
        name.appendChild(simpleValue);
        entity.appendChild(name);
      }
      
      if (item.predefinedType) {
        const predefinedType = doc.createElementNS('http://standards.buildingsmart.org/IDS', 'ids:predefinedType');
        const simpleValue = doc.createElementNS('http://standards.buildingsmart.org/IDS', 'ids:simpleValue');
        simpleValue.textContent = item.predefinedType;
        predefinedType.appendChild(simpleValue);
        entity.appendChild(predefinedType);
      }
      
      appl.appendChild(entity);
    }
  });

  specification.appendChild(appl);
  root.appendChild(specifications);

  const serializer = new XMLSerializer();
  const xmlString = serializer.serializeToString(doc);
  return formatXml(xmlString);
}

function formatXml(xml) {
  const PADDING = '  ';
  const reg = /(>)(<)(\/*)/g;
  let xmlString = xml.replace(reg, '$1\r\n$2$3');
  let pad = 0;
  return xmlString
    .split('\r\n')
    .map((node) => {
      let indent = 0;
      if (node.match(/.+<\/\w[^>]*>$/)) {
        indent = 0;
      } else if (node.match(/^<\/\w/)) {
        if (pad !== 0) pad -= 1;
      } else if (node.match(/^<\w([^>]*[^/])?>.*$/)) {
        indent = 1;
      } else {
        indent = 0;
      }
      const line = PADDING.repeat(pad) + node;
      pad += indent;
      return line;
    })
    .join('\r\n');
}

export function xmlToJson(xmlText) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, 'application/xml');
  const parseError = doc.querySelector('parsererror');
  if (parseError) {
    throw new Error('XML parse error: ' + parseError.textContent);
  }

  // Extract spec information
  const spec = {};
  const titleNode = doc.querySelector('ids\\:title, title');
  if (titleNode) {
    spec.title = titleNode.textContent || '';
  }

  const specNode = doc.querySelector('ids\\:specification, specification');
  if (specNode) {
    spec.ifcVersion = specNode.getAttribute('ifcVersion') || '';
    spec.name = specNode.getAttribute('name') || '';
  }

  // Extract applicability items
  const items = [];
  const applNode = doc.querySelector('ids\\:applicability, applicability');
  
  if (applNode) {
    // Helper function to get text content from simpleValue elements
    const getSimpleValue = (parent) => {
      const simpleValue = parent.querySelector('ids\\:simpleValue, simpleValue');
      return simpleValue ? simpleValue.textContent : '';
    };

    // Process property elements
    applNode.querySelectorAll('ids\\:property, property').forEach((node) => {
      const item = {
        id: 'id_' + Math.random().toString(36).slice(2, 9),
        type: 'Property'
      };

      const nameNode = node.querySelector('ids\\:name, name');
      if (nameNode) item.propertyName = getSimpleValue(nameNode);

      const propertySetNode = node.querySelector('ids\\:propertySet, propertySet');
      if (propertySetNode) item.propertySet = getSimpleValue(propertySetNode);

      const dataTypeNode = node.querySelector('ids\\:dataType, dataType');
      if (dataTypeNode) item.dataType = getSimpleValue(dataTypeNode);

      const valueNode = node.querySelector('ids\\:value, value');
      if (valueNode) item.value = getSimpleValue(valueNode);

      items.push(item);
    });

    // Process partOf elements
    applNode.querySelectorAll('ids\\:partOf, partOf').forEach((node) => {
      const item = {
        id: 'id_' + Math.random().toString(36).slice(2, 9),
        type: 'Part of',
        relation: node.getAttribute('relation') || ''
      };

      const entityNode = node.querySelector('ids\\:entity, entity');
      if (entityNode) {
        const nameNode = entityNode.querySelector('ids\\:name, name');
        if (nameNode) item.entity = getSimpleValue(nameNode);

        const predefinedTypeNode = entityNode.querySelector('ids\\:predefinedType, predefinedType');
        if (predefinedTypeNode) item.predefinedType = getSimpleValue(predefinedTypeNode);
      }

      items.push(item);
    });

    // Process material elements
    applNode.querySelectorAll('ids\\:material, material').forEach((node) => {
      const item = {
        id: 'id_' + Math.random().toString(36).slice(2, 9),
        type: 'Material'
      };

      const valueNode = node.querySelector('ids\\:value, value');
      if (valueNode) item.material = getSimpleValue(valueNode);

      items.push(item);
    });

    // Process classification elements
    applNode.querySelectorAll('ids\\:classification, classification').forEach((node) => {
      const item = {
        id: 'id_' + Math.random().toString(36).slice(2, 9),
        type: 'Classification'
      };

      const systemNode = node.querySelector('ids\\:system, system');
      if (systemNode) item.system = getSimpleValue(systemNode);

      const valueNode = node.querySelector('ids\\:value, value');
      if (valueNode) item.value = getSimpleValue(valueNode);

      items.push(item);
    });

    // Process entity elements
    applNode.querySelectorAll('ids\\:entity, entity').forEach((node) => {
      const item = {
        id: 'id_' + Math.random().toString(36).slice(2, 9),
        type: 'Entity'
      };

      const nameNode = node.querySelector('ids\\:name, name');
      if (nameNode) item.entity = getSimpleValue(nameNode);

      const predefinedTypeNode = node.querySelector('ids\\:predefinedType, predefinedType');
      if (predefinedTypeNode) item.predefinedType = getSimpleValue(predefinedTypeNode);

      items.push(item);
    });
  }

  return { spec, applicability: items };
}