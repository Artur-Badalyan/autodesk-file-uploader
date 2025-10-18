# IDS Editor - Frontend Application

A complete frontend IDS Editor single-page application built with React. This application allows users to create, edit, and manage IDS (Information Delivery Specification) files with support for multiple import/export formats.

## Features

- **Complete IDS Editor Interface**: Create and manage IDS specifications with a modern, responsive UI
- **Multiple Applicability Types**: Support for Property, Part of, Material, Classification, and Entity applicability rules
- **Import/Export Support**: 
  - Internal JSON format
  - Namespaced JSON format (xml2js-like)
  - IDS XML format
- **Template Editor**: Advanced field configuration with variable insertion
- **Drag & Drop**: Reorder applicability rules with intuitive drag-and-drop functionality
- **Onboarding Tour**: Guided tour for new users
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Accessibility**: Full ARIA support and keyboard navigation
- **Internationalization**: Support for English and Russian languages

## Quick Start

### Prerequisites

- Node.js 14 or higher
- npm or yarn package manager

### Installation

1. Clone or download the project files
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
```

### Running Tests

```bash
npm test
```

## Project Structure

```
src/
├── components/
│   ├── Header.js                 # Main header with search and export options
│   ├── Sidebar.js                # Specification sidebar with add buttons
│   ├── ApplicabilityEditor.js    # Main editor with drag & drop
│   ├── TemplateEditorModal.js    # Template editor modal
│   ├── OnboardingTour.js         # Guided tour component
│   ├── utils.js                  # Utility functions
│   └── applicabilities/          # Applicability card components
│       ├── PropertyApplicability.js
│       ├── PartOfApplicability.js
│       ├── MaterialApplicability.js
│       ├── ClassificationApplicability.js
│       ├── EntityApplicability.js
│       └── index.js
├── data/
│   └── dataTypes.js              # IFC data types configuration
├── utils/
│   ├── xml.js                    # XML/JSON conversion utilities
│   └── idsJsonAdapter.js         # Namespaced JSON adapter
├── i18n/                         # Internationalization files
│   ├── en/
│   │   └── cursorText.js
│   └── ru/
│       └── cursorText.js
├── tests/                        # Unit tests
│   └── utils/
│       ├── xml.test.js
│       └── idsJsonAdapter.test.js
├── App.js                        # Main application component
├── App.css                       # Main stylesheet
└── index.js                      # Application entry point
```

## Usage

### Creating a New Specification

1. **Set Specification Details**: Use the sidebar to enter the specification title, description, and IFC version
2. **Add Applicability Rules**: Click "Add Applicability" in the sidebar or use the quick-add buttons in the main area
3. **Configure Rules**: Fill in the required fields for each applicability rule type
4. **Use Templates**: Click the "T" button next to any field to open the template editor for advanced configuration
5. **Reorder Rules**: Drag and drop cards to reorder applicability rules
6. **Export**: Use the export buttons in the header to save your work

### Importing Existing Files

The application supports three import formats:

1. **Internal JSON**: The application's native format
2. **Namespaced JSON**: XML2JS-like format with namespaces
3. **IDS XML**: Standard IDS XML format

Simply click the import button (⬆) in the header and select your file.

### Template Editor

The template editor allows you to create dynamic field values using variables:

- `{{project.name}}` - Project name
- `{{project.description}}` - Project description
- `{{project.ifcVersion}}` - IFC version
- `{{user.name}}` - Current user name
- `{{user.email}}` - Current user email
- `{{date.today}}` - Current date
- `{{date.timestamp}}` - Current timestamp
- `{{spec.title}}` - Specification title
- `{{spec.name}}` - Specification name

## Sample Data

### Internal JSON Format

```json
{
  "spec": {
    "title": "Sample Building Specification",
    "description": "A sample specification for building elements",
    "ifcVersion": "IFC4",
    "name": "sample-building-spec"
  },
  "applicability": [
    {
      "id": "prop-1",
      "type": "Property",
      "propertyName": "FireRating",
      "propertySet": "Pset_WallCommon",
      "dataType": "IfcLabel",
      "value": "2 hours"
    },
    {
      "id": "entity-1",
      "type": "Entity",
      "entity": "IfcWall",
      "predefinedType": "STANDARD"
    },
    {
      "id": "material-1",
      "type": "Material",
      "material": "Concrete"
    },
    {
      "id": "classification-1",
      "type": "Classification",
      "system": "OmniClass",
      "value": "23-11 11 00"
    },
    {
      "id": "partof-1",
      "type": "Part of",
      "relation": "IFCRELAGGREGATES",
      "entity": "IfcBuilding",
      "predefinedType": "BUILDING"
    }
  ]
}
```

### Namespaced JSON Format

```json
{
  "ids": {
    "info": {
      "title": { "__text": "Sample Building Specification" },
      "__prefix": "ids"
    },
    "specifications": {
      "specification": {
        "_ifcVersion": "IFC4",
        "_name": "sample-building-spec",
        "applicability": {
          "property": {
            "name": {
              "simpleValue": { "__text": "FireRating" },
              "__prefix": "ids"
            },
            "propertySet": {
              "simpleValue": { "__text": "Pset_WallCommon" },
              "__prefix": "ids"
            },
            "dataType": {
              "simpleValue": { "__text": "IfcLabel" },
              "__prefix": "ids"
            },
            "value": {
              "simpleValue": { "__text": "2 hours" },
              "__prefix": "ids"
            },
            "__prefix": "ids"
          },
          "entity": {
            "name": {
              "simpleValue": { "__text": "IfcWall" },
              "__prefix": "ids"
            },
            "predefinedType": {
              "simpleValue": { "__text": "STANDARD" },
              "__prefix": "ids"
            },
            "__prefix": "ids"
          },
          "__prefix": "ids"
        },
        "__prefix": "ids"
      },
      "__prefix": "ids"
    },
    "_xmlns": "http://standards.buildingsmart.org/IDS",
    "_xmlns:ids": "http://standards.buildingsmart.org/IDS",
    "_xmlns:xs": "http://www.w3.org/2001/XMLSchema",
    "_xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
    "_xsi:schemaLocation": "http://standards.buildingsmart.org/IDS http://standards.buildingsmart.org/IDS/1.0/ids.xsd",
    "__prefix": "ids"
  }
}
```

### IDS XML Format

```xml
<?xml version="1.0" encoding="UTF-8"?>
<ids:ids xmlns:ids="http://standards.buildingsmart.org/IDS"
         xmlns:xs="http://www.w3.org/2001/XMLSchema"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://standards.buildingsmart.org/IDS http://standards.buildingsmart.org/IDS/1.0/ids.xsd">
  <ids:info>
    <ids:title>Sample Building Specification</ids:title>
  </ids:info>
  <ids:specifications>
    <ids:specification ifcVersion="IFC4" name="sample-building-spec">
      <ids:applicability minOccurs="0" maxOccurs="unbounded">
        <ids:property>
          <ids:name>
            <ids:simpleValue>FireRating</ids:simpleValue>
          </ids:name>
          <ids:propertySet>
            <ids:simpleValue>Pset_WallCommon</ids:simpleValue>
          </ids:propertySet>
          <ids:dataType>
            <ids:simpleValue>IfcLabel</ids:simpleValue>
          </ids:dataType>
          <ids:value>
            <ids:simpleValue>2 hours</ids:simpleValue>
          </ids:value>
        </ids:property>
        <ids:entity>
          <ids:name>
            <ids:simpleValue>IfcWall</ids:simpleValue>
          </ids:name>
          <ids:predefinedType>
            <ids:simpleValue>STANDARD</ids:simpleValue>
          </ids:predefinedType>
        </ids:entity>
        <ids:material>
          <ids:value>
            <ids:simpleValue>Concrete</ids:simpleValue>
          </ids:value>
        </ids:material>
        <ids:classification>
          <ids:system>
            <ids:simpleValue>OmniClass</ids:simpleValue>
          </ids:system>
          <ids:value>
            <ids:simpleValue>23-11 11 00</ids:simpleValue>
          </ids:value>
        </ids:classification>
        <ids:partOf relation="IFCRELAGGREGATES">
          <ids:entity>
            <ids:name>
              <ids:simpleValue>IfcBuilding</ids:simpleValue>
            </ids:name>
            <ids:predefinedType>
              <ids:simpleValue>BUILDING</ids:simpleValue>
            </ids:predefinedType>
          </ids:entity>
        </ids:partOf>
      </ids:applicability>
    </ids:specification>
  </ids:specifications>
</ids:ids>
```

## Dependencies

- **React 19.2.0** - UI framework
- **react-beautiful-dnd 13.1.1** - Drag and drop functionality
- **react-select 5.8.0** - Enhanced select components
- **@testing-library/react 16.3.0** - Testing utilities

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Development

### Adding New Applicability Types

1. Create a new component in `src/components/applicabilities/`
2. Follow the existing pattern with props: `item`, `onChange`, `onRemove`, `onOpenTemplateEditor`
3. Add the component to `src/components/applicabilities/index.js`
4. Update the type mapping in `ApplicabilityEditor.js`

### Adding New Template Variables

1. Update the `variables` array in `TemplateEditorModal.js`
2. Add corresponding sample data in the `sampleData` object
3. Update the i18n files if needed

### Customizing Styles

The application uses CSS custom properties (variables) for theming. Key variables are defined in `src/App.css`:

- `--primary-color`: Main brand color
- `--secondary-color`: Secondary actions
- `--bg-color`: Background color
- `--text-color`: Text color
- `--border-color`: Border color
- `--spacing-*`: Spacing scale
- `--font-size-*`: Typography scale

## Testing

The application includes comprehensive unit tests for the core adapters:

- `xml.test.js`: Tests XML/JSON conversion functions
- `idsJsonAdapter.test.js`: Tests namespaced JSON conversion functions

Run tests with:
```bash
npm test
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please create an issue in the project repository.

## Changelog

### Version 1.0.0
- Initial release
- Complete IDS Editor interface
- Support for all five applicability types
- Import/export for JSON and XML formats
- Template editor with variable support
- Drag and drop functionality
- Onboarding tour
- Responsive design
- Internationalization support
- Comprehensive test suite