import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { makeId } from './utils';

// импорт компонентов, которые вы уже добавили в src/components/applicabilities/
import {
  PropertyApplicability,
  PartOfApplicability,
  MaterialApplicability,
  ClassificationApplicability,
  EntityApplicability
} from './applicabilities';

/**
 * Props:
 * - value: array of applicability items
 * - onChange: (newArray) => void
 * - filter, activeTab - optional UI controls
 *
 * Структура item должна содержать поле `type` с одним из значений:
 * 'Property', 'Part of', 'Material', 'Classification', 'Entity'
 */
export default function ApplicabilityEditor({ value = [], onChange = () => {}, filter = '', activeTab = 'All' }) {
  const TYPES = ['Property', 'Part of', 'Material', 'Classification', 'Entity'];
  const [inputModeDropdowns, setInputModeDropdowns] = useState({});

  const addItem = (type = 'Property') => {
    const newItem = {
      id: makeId(),
      type,
      // поля по-умолчанию; компоненты обновят через onChange
      propertyName: '',
      propertySet: '',
      dataType: 'IfcLabel',
      value: '',
      relation: '',
      entity: '',
      predefinedType: '',
      material: '',
      system: '',
      attributes: []
    };
    onChange([...value, newItem]);
  };

  const updateItem = (id, patch) => {
    const next = value.map((it) => (it.id === id ? { ...it, ...patch } : it));
    onChange(next);
  };

  const removeItem = (id) => {
    onChange(value.filter((it) => it.id !== id));
  };

  const handleInputModeToggle = (itemId, fieldName) => {
    const key = `${itemId}-${fieldName}`;
    setInputModeDropdowns(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleInputModeClose = () => {
    setInputModeDropdowns({});
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.input-mode-wrapper')) {
        handleInputModeClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(value);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onChange(items);
  };

  const renderItem = (item) => {
    const commonProps = {
      item,
      onChange: (patch) => updateItem(item.id, patch),
      onRemove: () => removeItem(item.id),
      inputModeDropdowns,
      onInputModeToggle: (fieldName) => handleInputModeToggle(item.id, fieldName),
      onInputModeClose: handleInputModeClose,
      // передавайте опции, если есть: nameOptions, entityOptions, materialOptions...
    };

    switch ((item.type || '').toLowerCase()) {
      case 'property':
        return <PropertyApplicability key={item.id} {...commonProps} nameOptions={[]} dataTypeOptions={['IfcLabel', 'IfcText', 'IfcInteger', 'IfcReal']} />;
      case 'part of':
      case 'partof':
      case 'part_of':
        return <PartOfApplicability key={item.id} {...commonProps} relationOptions={['IFCRELAGGREGATES', 'IFCRELDECOMPOSES']} entityOptions={[]} />;
      case 'material':
        return <MaterialApplicability key={item.id} {...commonProps} materialOptions={[]} />;
      case 'classification':
        return <ClassificationApplicability key={item.id} {...commonProps} />;
      case 'entity':
        return <EntityApplicability key={item.id} {...commonProps} entityOptions={[]} />;
      default:
        // fallback: рендер простой карточки с возможностью выбрать тип
        return (
          <div className="card" key={item.id}>
            <div className="card-head">
              <div>
                <div className="card-type">Unknown Applicability</div>
                <div className="card-sub">Change type to render proper editor.</div>
              </div>
            </div>
            <div className="card-body">
              <div className="row">
                <label>Type</label>
                <select value={item.type || ''} onChange={(e) => updateItem(item.id, { type: e.target.value })}>
                  <option value="">Select type...</option>
                  {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
          </div>
        );
    }
  };

  const filtered = value.filter((it) => {
    if (activeTab === 'Applicability' && !TYPES.includes(it.type)) return false;
    if (!filter) return true;
    const q = filter.toLowerCase();
    return (it.name || it.propertyName || '').toLowerCase().includes(q) || (it.type || '').toLowerCase().includes(q);
  });

  return (
    <div className="applicability-editor">
      <div className="controls-row">
        <div>
          {TYPES.map((t) => (
            <button key={t} className="small-btn" onClick={() => addItem(t)}>{`Add ${t}`}</button>
          ))}
        </div>
        <div className="count">{filtered.length} items</div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="applicability-list">
          {(provided, snapshot) => (
            <div 
              className={`cards-grid ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {filtered.length === 0 && (
                <div className="empty">No items. Add Applicability from the sidebar or buttons above.</div>
              )}
              {filtered.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`card-wrapper ${snapshot.isDragging ? 'dragging' : ''}`}
                    >
                      {renderItem(item)}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

    </div>
  );
}