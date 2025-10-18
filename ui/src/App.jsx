import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ApplicabilityEditor from './components/ApplicabilityEditor';
import OnboardingTour from './components/OnboardingTour';
import Home from './components/Home';
import { jsonToXml, xmlToJson } from './utils/xml';
import { parseNamespacedIdsJson, buildNamespacedIdsJson } from './utils/idsJsonAdapter';

const createNewSpec = () => ({
  id: Date.now().toString(),
  title: 'New Specification',
  description: '',
  ifcVersion: ['IFC4'],
  applicability: [],
  createdAt: Date.now(),
  modifiedAt: Date.now()
});

const STORAGE_KEY = 'ids-specifications';

function download(filename, content, mime = 'application/octet-stream') {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// helpers to normalize incoming data
function ensureArray(v) {
  if (Array.isArray(v)) return v;
  if (v == null) return [];
  return [v];
}
function normalizeSpec(spec = {}) {
  return { ...spec, ifcVersion: ensureArray(spec.ifcVersion) };
}
function normalizeData(d = {}) {
  return {
    spec: normalizeSpec(d.spec || {}),
    applicability: d.applicability || []
  };
}

export default function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home' or 'editor'
  const [currentSpecId, setCurrentSpecId] = useState(null);
  const [specifications, setSpecifications] = useState([]);
  const [filter, setFilter] = useState('');
  const [tab, setTab] = useState('All');
  const [showTour, setShowTour] = useState(false);

  // Load specifications from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const specs = JSON.parse(saved);
        setSpecifications(Array.isArray(specs) ? specs : []);
      } catch (err) {
        console.error('Error loading specifications:', err);
      }
    }
  }, []);

  // Save specifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(specifications));
  }, [specifications]);

  const getCurrentSpec = () => {
    return specifications.find(spec => spec.id === currentSpecId) || createNewSpec();
  };

  const updateCurrentSpec = (updates) => {
    if (!currentSpecId) return;
    
    setSpecifications(prev => prev.map(spec => 
      spec.id === currentSpecId 
        ? { ...spec, ...updates, modifiedAt: Date.now() }
        : spec
    ));
  };

  const setApplicability = (arr) => {
    updateCurrentSpec({ applicability: arr });
  };

  const setSpec = (specPatch) => {
    updateCurrentSpec(specPatch);
  };

  // Check if this is the first visit and show tour
  useEffect(() => {
    const hasSeenTour = localStorage.getItem('ids-editor-tour-seen');
    if (!hasSeenTour) {
      setShowTour(true);
    }
  }, []);

  const handleTourComplete = () => {
    setShowTour(false);
    localStorage.setItem('ids-editor-tour-seen', 'true');
  };

  const handleTourSkip = () => {
    setShowTour(false);
    localStorage.setItem('ids-editor-tour-seen', 'true');
  };

  // Home view handlers
  const handleCreateNew = () => {
    const newSpec = createNewSpec();
    setSpecifications(prev => [...prev, newSpec]);
    setCurrentSpecId(newSpec.id);
    setCurrentView('editor');
  };

  const handleOpenSpec = (specId) => {
    setCurrentSpecId(specId);
    setCurrentView('editor');
  };

  const handleDeleteSpec = (specId) => {
    setSpecifications(prev => prev.filter(spec => spec.id !== specId));
    if (currentSpecId === specId) {
      setCurrentView('home');
      setCurrentSpecId(null);
    }
  };

  const handleDuplicateSpec = (specId) => {
    const originalSpec = specifications.find(spec => spec.id === specId);
    if (originalSpec) {
      const duplicatedSpec = {
        ...originalSpec,
        id: Date.now().toString(),
        title: `${originalSpec.title} (Copy)`,
        createdAt: Date.now(),
        modifiedAt: Date.now()
      };
      setSpecifications(prev => [...prev, duplicatedSpec]);
    }
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setCurrentSpecId(null);
    setFilter('');
    setTab('All');
  };

  const handleImportFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const trimmed = text.trim();

      let importedData = null;

      // JSON (either flat internal format or namespaced xml2js-like)
      if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
        try {
          const parsed = JSON.parse(trimmed);

          // namespaced xml2js-like JSON (has root "ids")
          if (parsed && parsed.ids) {
            try {
              const internal = parseNamespacedIdsJson(parsed);
              importedData = normalizeData({ spec: internal.spec || {}, applicability: internal.applicability || [] });
            } catch (err) {
              console.error('Error parsing namespaced IDS JSON:', err);
              alert('Ошибка при обработке namespaced IDS JSON: ' + err.message);
              return;
            }
          }

          // internal flat JSON shape (our app format)
          else if (parsed && parsed.applicability !== undefined) {
            importedData = normalizeData(parsed);
          } else {
            alert('JSON не соответствует ожидаемой структуре (ожидается ключ "ids" или "applicability").');
            return;
          }
        } catch (err) {
          alert('Ошибка парсинга JSON: ' + err.message);
          return;
        }
      }

      // XML (IDS XML)
      else if (trimmed.startsWith('<')) {
        try {
          const parsed = xmlToJson(trimmed); // returns { spec: {...}, applicability: [...] }
          if (parsed && parsed.applicability !== undefined) {
            importedData = normalizeData(parsed);
          } else {
            alert('XML не соответствует ожидаемой структуре.');
            return;
          }
        } catch (err) {
          alert('Ошибка парсинга XML: ' + err.message);
          return;
        }
      }

      // unknown
      else {
        alert('Неизвестный формат файла. Поддерживаются namespaced JSON, внутренний JSON и XML.');
        return;
      }

      // Create new specification from imported data
      if (importedData) {
        const newSpec = {
          ...createNewSpec(),
          title: importedData.spec?.title || 'Imported Specification',
          description: importedData.spec?.description || '',
          ifcVersion: importedData.spec?.ifcVersion || ['IFC4'],
          applicability: importedData.applicability || []
        };
        
        setSpecifications(prev => [...prev, newSpec]);
        setCurrentSpecId(newSpec.id);
        setCurrentView('editor');
      }
    };
    reader.readAsText(file);
  };

  const exportJSON = () => {
    const currentSpec = getCurrentSpec();
    const exportData = {
      spec: {
        title: currentSpec.title,
        description: currentSpec.description,
        ifcVersion: currentSpec.ifcVersion
      },
      applicability: currentSpec.applicability
    };
    download('ids.json', JSON.stringify(exportData, null, 2), 'application/json');
  };

  const exportNamespacedJSON = () => {
    const currentSpec = getCurrentSpec();
    const exportData = {
      spec: {
        title: currentSpec.title,
        description: currentSpec.description,
        ifcVersion: currentSpec.ifcVersion
      },
      applicability: currentSpec.applicability
    };
    const namespaced = buildNamespacedIdsJson(exportData);
    download('ids-namespaced.json', JSON.stringify(namespaced, null, 2), 'application/json');
  };

  const exportXML = () => {
    const currentSpec = getCurrentSpec();
    const exportData = {
      spec: {
        title: currentSpec.title,
        description: currentSpec.description,
        ifcVersion: currentSpec.ifcVersion
      },
      applicability: currentSpec.applicability
    };
    download('ids.xml', jsonToXml(exportData), 'application/xml');
  };

  // Home view
  if (currentView === 'home') {
    return (
      <div className="app-shell">
        <Home
          specifications={specifications}
          onCreateNew={handleCreateNew}
          onOpenSpec={handleOpenSpec}
          onDeleteSpec={handleDeleteSpec}
          onDuplicateSpec={handleDuplicateSpec}
        />
        
        <OnboardingTour
          isActive={showTour}
          onComplete={handleTourComplete}
          onSkip={handleTourSkip}
        />
      </div>
    );
  }

  // Editor view
  const currentSpec = getCurrentSpec();
  const specForSidebar = { 
    title: currentSpec.title,
    description: currentSpec.description,
    ifcVersion: ensureArray(currentSpec.ifcVersion) 
  };

  return (
    <div className="app-shell">
      <Header
        title={currentSpec.title}
        tabs={['All', 'Applicability', 'Requirements']}
        activeTab={tab}
        onTabChange={setTab}
        onSearch={setFilter}
        onImport={handleImportFile}
        onExportJSON={exportJSON}
        onExportNamespacedJSON={exportNamespacedJSON}
        onExportXML={exportXML}
        onBackToHome={handleBackToHome}
        showBackButton={true}
      />

      <div className="layout">
        <main className="main-col">
          <ApplicabilityEditor
            value={currentSpec.applicability}
            onChange={setApplicability}
            filter={filter}
            activeTab={tab}
          />
        </main>

        <aside className="sidebar-col">
          <Sidebar
            spec={specForSidebar}
            onSpecChange={setSpec}
            onAddApplicability={(item) => setApplicability([...(currentSpec.applicability || []), item])}
          />
        </aside>
      </div>

      <OnboardingTour
        isActive={showTour}
        onComplete={handleTourComplete}
        onSkip={handleTourSkip}
      />
    </div>
  );
}