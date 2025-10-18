import React from 'react';
import {
  SingleInput,
  OptionsInput,
  StartsWithInput,
  EndsWithInput,
  RegexPatternInput,
  ComplexInput
} from './inputModes';

/**
 * Props:
 * - item: { id, type, material }
 * - onChange: (patch) => void
 * - inputModeDropdowns: object
 * - onInputModeToggle: (fieldName) => void
 * - onInputModeClose: () => void
 * - materialOptions?: array of strings
 */
export default function MaterialApplicability({
  item = {},
  onChange = () => {},
  onRemove = () => {},
  inputModeDropdowns = {},
  onInputModeToggle = () => {},
  onInputModeClose = () => {},
  materialOptions = []
}) {
  const update = (patch) => onChange(patch);

  // Comprehensive material list based on IFC materials and common building materials
  const MATERIAL_LIST = [
    // Metals
    'Steel',
    'Aluminum',
    'Stainless Steel',
    'Cast Iron',
    'Wrought Iron',
    'Copper',
    'Brass',
    'Bronze',
    'Galvanized Steel',
    'Carbon Steel',
    
    // Concrete & Masonry
    'Concrete',
    'Reinforced Concrete',
    'Precast Concrete',
    'Lightweight Concrete',
    'High-Strength Concrete',
    'Brick',
    'Clay Brick',
    'Concrete Block',
    'Stone',
    'Natural Stone',
    'Limestone',
    'Granite',
    'Marble',
    'Sandstone',
    'Mortar',
    
    // Wood & Timber
    'Wood',
    'Hardwood',
    'Softwood',
    'Plywood',
    'OSB (Oriented Strand Board)',
    'MDF (Medium Density Fiberboard)',
    'Particleboard',
    'Laminated Veneer Lumber',
    'Glulam',
    'Cross-Laminated Timber (CLT)',
    
    // Glass
    'Glass',
    'Tempered Glass',
    'Laminated Glass',
    'Double Glazed Glass',
    'Low-E Glass',
    'Tinted Glass',
    'Safety Glass',
    
    // Plastics & Polymers
    'PVC',
    'HDPE',
    'Polystyrene',
    'Polycarbonate',
    'Acrylic',
    'Fiberglass',
    'EPDM',
    'TPO',
    'Polyurethane',
    
    // Insulation Materials
    'Mineral Wool',
    'Fiberglass Insulation',
    'Foam Insulation',
    'Cellulose Insulation',
    'Spray Foam',
    'Rigid Foam',
    'Reflective Insulation',
    
    // Roofing Materials
    'Asphalt Shingles',
    'Metal Roofing',
    'Clay Tiles',
    'Concrete Tiles',
    'Slate',
    'EPDM Membrane',
    'TPO Membrane',
    'Built-up Roofing',
    'Modified Bitumen',
    
    // Finishes & Coatings
    'Paint',
    'Stain',
    'Varnish',
    'Epoxy',
    'Ceramic Tile',
    'Porcelain Tile',
    'Natural Stone Tile',
    'Carpet',
    'Vinyl Flooring',
    'Linoleum',
    'Hardwood Flooring',
    'Laminate Flooring',
    'Wallpaper',
    'Fabric',
    
    // Other Materials
    'Gypsum',
    'Drywall',
    'Plaster',
    'Cement',
    'Aggregate',
    'Sand',
    'Gravel',
    'Soil',
    'Rubber',
    'Cork',
    'Bamboo',
    'Composite',
    'Unknown',
    'Other'
  ];

  // Combine provided options with default material list, removing duplicates
  const allMaterialOptions = [...new Set([...materialOptions, ...MATERIAL_LIST])].sort();

  const INPUT_MODES = [
    { value: 'single', label: 'Single', icon: 'T', description: 'Simple text input' },
    { value: 'options', label: 'Options', icon: '☰', description: 'Selection from predefined choices' },
    { value: 'startsWith', label: 'Starts With', icon: 'a_', description: 'Value must start with specified string' },
    { value: 'endsWith', label: 'Ends With', icon: '_a', description: 'Value must end with specified string' },
    { value: 'regex', label: 'Regex Pattern', icon: '.*', description: 'Value defined by regular expression' },
    { value: 'complex', label: 'Complex', icon: '⊞', description: 'Advanced structured input method' }
  ];

  const getCurrentInputMode = (fieldName) => {
    return item[`${fieldName}InputMode`] || 'single';
  };

  const getCurrentModeIcon = (fieldName) => {
    const currentMode = getCurrentInputMode(fieldName);
    const mode = INPUT_MODES.find(m => m.value === currentMode);
    return mode ? mode.icon : 'T';
  };

  const handleInputModeSelect = (fieldName, mode) => {
    update({ [`${fieldName}InputMode`]: mode });
    onInputModeClose();
  };

  const renderInputModeDropdown = (fieldName) => {
    const dropdownKey = `${item.id}-${fieldName}`;
    const isOpen = inputModeDropdowns[dropdownKey];
    const currentMode = getCurrentInputMode(fieldName);
    
    return (
      <div className="relative input-mode-wrapper">
        <button 
          className="flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 transition-colors duration-200" 
          onClick={() => onInputModeToggle(fieldName)}
          title={`Current mode: ${INPUT_MODES.find(m => m.value === currentMode)?.label || 'Single'}`}
        >
          {getCurrentModeIcon(fieldName)}
        </button>
        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
            {INPUT_MODES.map(mode => (
              <div
                key={mode.value}
                className={`flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors duration-200 ${
                  mode.value === currentMode ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                }`}
                onClick={() => handleInputModeSelect(fieldName, mode.value)}
                title={mode.description}
              >
                <span className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded text-sm font-medium">
                  {mode.icon}
                </span>
                <div>
                  <div className="font-medium text-gray-900">{mode.label}</div>
                  <div className="text-sm text-gray-500">{mode.description}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderInputField = (fieldName, placeholder, options = [], type = 'text') => {
    const currentMode = getCurrentInputMode(fieldName);
    const fieldValue = item[fieldName];
    
    const handleFieldChange = (newValue) => {
      update({ [fieldName]: newValue });
    };

    switch (currentMode) {
      case 'options':
        return <OptionsInput value={fieldValue} onChange={handleFieldChange} placeholder={placeholder} />;
      case 'startsWith':
        return <StartsWithInput value={fieldValue} onChange={handleFieldChange} placeholder={placeholder} />;
      case 'endsWith':
        return <EndsWithInput value={fieldValue} onChange={handleFieldChange} placeholder={placeholder} />;
      case 'regex':
        return <RegexPatternInput value={fieldValue} onChange={handleFieldChange} placeholder={placeholder} />;
      case 'complex':
        return <ComplexInput value={fieldValue} onChange={handleFieldChange} placeholder={placeholder} />;
      case 'single':
      default:
        return <SingleInput value={fieldValue} onChange={handleFieldChange} placeholder={placeholder} options={options} type={type} />;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-start justify-between p-6 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center shadow-md">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17v4a2 2 0 002 2h4M13 13h4a2 2 0 012 2v4a2 2 0 01-2 2h-4m-6-6V9a2 2 0 012-2h2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v2m-6 6a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2a2 2 0 00-2 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Material Applicability</h3>
            <p className="text-sm text-gray-500">Define material constraints and requirements</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button className="text-gray-400 hover:text-gray-600 transition-colors duration-200" title="More actions">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
          <button
            onClick={onRemove}
            className="text-gray-400 hover:text-red-500 transition-colors duration-200"
            title="Remove applicability"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 pb-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Material</label>
          <div className="flex gap-2">
            {renderInputField('material', 'Select material...', allMaterialOptions, 'select')}
            {renderInputModeDropdown('material')}
          </div>
        </div>
      </div>
    </div>
  );
}