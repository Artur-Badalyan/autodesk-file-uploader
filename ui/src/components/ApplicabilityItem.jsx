import React, { useState } from 'react';

export default function ApplicabilityItem({ item, onChange, onRemove }) {
  const [open, setOpen] = useState(true);

  const update = (patch) => onChange({ ...patch });

  const addAttribute = () => {
    const attrs = item.attributes || [];
    update({ attributes: [...attrs, { key: '', value: '' }] });
  };

  const updateAttribute = (index, patch) => {
    const attrs = (item.attributes || []).slice();
    attrs[index] = { ...attrs[index], ...patch };
    update({ attributes: attrs });
  };

  const removeAttribute = (index) => {
    const attrs = (item.attributes || []).slice();
    attrs.splice(index, 1);
    update({ attributes: attrs });
  };

  return (
    <div className="card">
      <div className="card-head">
        <div>
          <div className="card-type">{item.type} Applicability</div>
          <div className="card-sub">Must contain a property of type IfcLabel where the name must ??.</div>
        </div>

        <div className="card-actions">
          <button className="icon" onClick={() => setOpen((s) => !s)}>{open ? '▾' : '▸'}</button>
          <button className="icon" onClick={onRemove}>⋮</button>
        </div>
      </div>

      {open && (
        <div className="card-body">
          <div className="row">
            <label>Property Name</label>
            <input value={item.name || ''} onChange={(e) => update({ name: e.target.value })} placeholder="Select..." />
          </div>

          <div className="row">
            <label>Property Set</label>
            <input value={item.propertySet || ''} onChange={(e) => update({ propertySet: e.target.value })} placeholder="" />
          </div>

          <div className="row">
            <label>Data Type</label>
            <input value={item.dataType || 'IfcLabel'} onChange={(e) => update({ dataType: e.target.value })} />
          </div>

          <div className="row attributes">
            <div className="attr-list">
              <label>Attributes</label>
              {(item.attributes || []).map((a, idx) => (
                <div className="attr-row" key={idx}>
                  <input className="attr-key" placeholder="Key" value={a.key} onChange={(e) => updateAttribute(idx, { key: e.target.value })} />
                  <input className="attr-val" placeholder="Value" value={a.value} onChange={(e) => updateAttribute(idx, { value: e.target.value })} />
                  <button className="del" onClick={() => removeAttribute(idx)}>✕</button>
                </div>
              ))}
              <button className="add-attr" onClick={addAttribute}>Add attribute</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}