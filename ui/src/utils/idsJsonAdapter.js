// Утилиты для работы с "namespaced" JSON (xml2js-like) IDS формата.
// Экспортирует функции для преобразования в "внутренний" простой JSON и обратно.

/**
 * Преобразует xml2js-like namespaced JSON (как в вашем примере) в упрощённую внутреннюю структуру:
 * { spec: { title, ifcVersion, name }, applicability: [ { type, ... } ] }
 */
export function parseNamespacedIdsJson(nsJson) {
  if (!nsJson || !nsJson.ids) return { spec: {}, applicability: [] };

  const ids = nsJson.ids;
  const info = ids.info || {};
  const title = info.title && (info.title.__text || (info.title['__text'])) ? (info.title.__text || info.title['__text']) : '';

  const specNode = ids.specifications && ids.specifications.specification ? ids.specifications.specification : {};
  const spec = {
    title: title || '',
    ifcVersion: specNode._ifcVersion || '',
    name: specNode._name || ''
  };

  const appl = specNode.applicability || {};
  const items = [];

  // helper: extract simpleValue text
  const getSimple = (node) => {
    if (!node) return '';
    // node may be { simpleValue: { __text: 'x' }, __prefix: 'ids' }
    if (node.simpleValue) {
      const sv = node.simpleValue;
      return sv.__text || sv['__text'] || '';
    }
    // or node itself may be { __text: 'x' }
    return node.__text || node['__text'] || '';
  };

  // helper: normalize single or array
  const normList = (x) => {
    if (!x) return [];
    return Array.isArray(x) ? x : [x];
  };

  // entity (could be list or single)
  normList(appl.entity).forEach((e) => {
    items.push({
      type: 'Entity',
      name: getSimple(e.name),
      predefinedType: getSimple(e.predefinedType)
    });
  });

  // partOf
  normList(appl.partOf).forEach((p) => {
    const ent = p.entity || {};
    items.push({
      type: 'Part of',
      relation: p._relation || p['_relation'] || '',
      name: getSimple(ent.name),
      predefinedType: getSimple(ent.predefinedType)
    });
  });

  // classification
  normList(appl.classification).forEach((c) => {
    items.push({
      type: 'Classification',
      value: getSimple(c.value),
      system: getSimple(c.system)
    });
  });

  // attribute
  normList(appl.attribute).forEach((a) => {
    items.push({
      type: 'Attribute',
      name: getSimple(a.name),
      value: getSimple(a.value)
    });
  });

  // material
  normList(appl.material).forEach((m) => {
    // value.simpleValue or material field
    items.push({
      type: 'Material',
      value: getSimple(m.value) || getSimple(m.material) || ''
    });
  });

  return { spec, applicability: items };
}

/**
 * Построить namespaced JSON (xml2js-like) из внутреннего вида.
 * internal = { spec: { title, ifcVersion, name }, applicability: [...] }
 * Возвращает объект в стиле вашего примера (ключи: __prefix, __text, _ifcVersion и т.д.)
 */
export function buildNamespacedIdsJson(internal) {
  const makeSimpleValue = (text) => ({ __prefix: 'ids', simpleValue: { __prefix: 'ids', __text: text != null ? String(text) : '' } });

  const ids = {};
  // info/title
  ids.info = {
    title: { __prefix: 'ids', __text: (internal?.spec?.title) || '' },
    __prefix: 'ids'
  };

  // specification
  const spec = {
    __prefix: 'ids',
    _ifcVersion: internal?.spec?.ifcVersion || '',
    _name: internal?.spec?.name || '',
    applicability: { __prefix: 'ids' },
    requirements: { __prefix: 'ids' }
  };

  // build applicability children
  const appl = {};

  (internal?.applicability || []).forEach((it) => {
    const type = (it.type || '').toLowerCase();
    if (type === 'entity') {
      const node = { __prefix: 'ids' };
      if (it.name != null) node.name = { simpleValue: { __prefix: 'ids', __text: String(it.name) }, __prefix: 'ids' };
      if (it.predefinedType != null) node.predefinedType = { simpleValue: { __prefix: 'ids', __text: String(it.predefinedType) }, __prefix: 'ids' };
      // if already exists, convert to array
      if (appl.entity) {
        appl.entity = Array.isArray(appl.entity) ? appl.entity.concat(node) : [appl.entity, node];
      } else appl.entity = node;
    } else if (type === 'part of' || type === 'partof') {
      const ent = { __prefix: 'ids' };
      if (it.name != null) ent.name = { simpleValue: { __prefix: 'ids', __text: String(it.name) }, __prefix: 'ids' };
      if (it.predefinedType != null) ent.predefinedType = { simpleValue: { __prefix: 'ids', __text: String(it.predefinedType) }, __prefix: 'ids' };
      const node = { entity: ent, __prefix: 'ids' };
      if (it.relation) node._relation = it.relation;
      if (appl.partOf) {
        appl.partOf = Array.isArray(appl.partOf) ? appl.partOf.concat(node) : [appl.partOf, node];
      } else appl.partOf = node;
    } else if (type === 'classification') {
      const node = { __prefix: 'ids' };
      if (it.value != null) node.value = { simpleValue: { __prefix: 'ids', __text: String(it.value) }, __prefix: 'ids' };
      if (it.system != null) node.system = { simpleValue: { __prefix: 'ids', __text: String(it.system) }, __prefix: 'ids' };
      if (appl.classification) appl.classification = Array.isArray(appl.classification) ? appl.classification.concat(node) : [appl.classification, node];
      else appl.classification = node;
    } else if (type === 'attribute') {
      const node = { __prefix: 'ids' };
      if (it.name != null) node.name = { simpleValue: { __prefix: 'ids', __text: String(it.name) }, __prefix: 'ids' };
      if (it.value != null) node.value = { simpleValue: { __prefix: 'ids', __text: String(it.value) }, __prefix: 'ids' };
      if (appl.attribute) appl.attribute = Array.isArray(appl.attribute) ? appl.attribute.concat(node) : [appl.attribute, node];
      else appl.attribute = node;
    } else if (type === 'material') {
      const node = { __prefix: 'ids' };
      if (it.value != null) node.value = { simpleValue: { __prefix: 'ids', __text: String(it.value) }, __prefix: 'ids' };
      if (appl.material) appl.material = Array.isArray(appl.material) ? appl.material.concat(node) : [appl.material, node];
      else appl.material = node;
    }
  });

  // add min/max occurs attributes if needed (kept from example)
  if (Object.keys(appl).length > 0) {
    appl._minOccurs = '0';
    appl._maxOccurs = 'unbounded';
    appl.__prefix = 'ids';
    spec.applicability = appl;
  } else {
    spec.applicability = { __prefix: 'ids' };
  }

  ids.specifications = { specification: spec, __prefix: 'ids' };

  // top-level ids wrapper
  const result = {
    ids: {
      ...ids,
      _xmlns: 'http://standards.buildingsmart.org/IDS',
      // keep the prefixed xmlns keys as in your example
      '_xmlns:ids': 'http://standards.buildingsmart.org/IDS',
      '_xmlns:xs': 'http://www.w3.org/2001/XMLSchema',
      '_xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
      '_xsi:schemaLocation': 'http://standards.buildingsmart.org/IDS http://standards.buildingsmart.org/IDS/1.0/ids.xsd',
      __prefix: 'ids'
    }
  };

  return result;
}