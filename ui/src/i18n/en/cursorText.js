// English tooltips and microcopy for IDS Editor
export const tooltips = {
  // Header actions
  back: 'Go back to previous page',
  search: 'Search applicability rules by name or type',
  import: 'Import IDS file (JSON or XML)',
  exportJSON: 'Export as internal JSON format',
  exportXML: 'Export as IDS XML format',
  
  // Sidebar actions
  addApplicability: 'Add new applicability rule',
  addRequirement: 'Add new requirement',
  chooseFields: 'Choose which fields to display',
  
  // Applicability types
  propertyApplicability: 'Property Applicability - Must contain a property of specified type',
  partOfApplicability: 'Part Of Applicability - Must be related to an entity',
  materialApplicability: 'Material Applicability - Must have specified material',
  classificationApplicability: 'Classification Applicability - Must be classified with specified system',
  entityApplicability: 'Entity Applicability - Must be of specified entity type',
  
  // Field tooltips
  propertyName: 'Name of the property to check',
  propertySet: 'Property set containing the property',
  dataType: 'Expected data type of the property value',
  propertyValue: 'Expected value of the property',
  relation: 'Type of relationship (e.g., IFCRELAGGREGATES)',
  entity: 'Entity type to check',
  predefinedType: 'Predefined type of the entity',
  material: 'Material name or identifier',
  system: 'Classification system (e.g., OmniClass, Uniclass)',
  classificationValue: 'Classification value or code',
  
  // Template editor
  templateEditor: 'Template Editor - Insert variables like {{project.name}}',
  insertVariable: 'Insert variable',
  preview: 'Preview template with sample data',
  save: 'Save template',
  cancel: 'Cancel changes',
  
  // Validation messages
  required: 'This field is required',
  invalidDataType: 'Invalid data type format',
  invalidXmlBaseType: 'Value must be a valid XML base type (xs:double, xs:integer, etc.)',
  
  // Onboarding tour
  tourWelcome: 'Welcome to IDS Editor! Let\'s take a quick tour.',
  tourHeader: 'This is the header with search, import/export options.',
  tourSidebar: 'Use the sidebar to add new applicability rules and manage specification.',
  tourMainArea: 'This is where your applicability rules are displayed as cards.',
  tourCard: 'Each card represents an applicability rule. You can edit, reorder, or remove them.',
  tourTemplate: 'Click the T button to open the template editor for advanced field configuration.',
  tourComplete: 'You\'re all set! Start by adding your first applicability rule.'
};

export const validation = {
  required: 'This field is required',
  invalidEmail: 'Please enter a valid email address',
  invalidUrl: 'Please enter a valid URL',
  invalidNumber: 'Please enter a valid number',
  invalidInteger: 'Please enter a valid integer',
  invalidDouble: 'Please enter a valid decimal number',
  invalidBoolean: 'Please enter true or false',
  invalidDate: 'Please enter a valid date (YYYY-MM-DD)',
  invalidDateTime: 'Please enter a valid date and time (YYYY-MM-DDTHH:mm:ss)',
  invalidTime: 'Please enter a valid time (HH:mm:ss)',
  invalidDuration: 'Please enter a valid duration (PnYnMnDTnHnMnS)',
  minLength: (min) => `Must be at least ${min} characters long`,
  maxLength: (max) => `Must be no more than ${max} characters long`,
  minValue: (min) => `Must be at least ${min}`,
  maxValue: (max) => `Must be no more than ${max}`,
  pattern: 'Please match the required pattern'
};

export const tour = {
  steps: [
    {
      target: '.header',
      content: tooltips.tourHeader,
      placement: 'bottom'
    },
    {
      target: '.sidebar-col',
      content: tooltips.tourSidebar,
      placement: 'left'
    },
    {
      target: '.main-col',
      content: tooltips.tourMainArea,
      placement: 'right'
    },
    {
      target: '.card',
      content: tooltips.tourCard,
      placement: 'top'
    },
    {
      target: '.tmpl-btn',
      content: tooltips.tourTemplate,
      placement: 'top'
    }
  ]
};
