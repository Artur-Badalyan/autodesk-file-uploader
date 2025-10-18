import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ApplicabilityEditor from './components/ApplicabilityEditor';
import OnboardingTour from './components/OnboardingTour';
import { jsonToXml, xmlToJson } from './utils/xml';
import { parseNamespacedIdsJson, buildNamespacedIdsJson } from './utils/idsJsonAdapter';

const initialData = {
  applicability: [

  ],
  spec: {
    title: 'New Specification 1',
    description: '',
    ifcVersion: ['IFC4']
  }
};

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
  const [data, setData] = useState(initialData);
  const [filter, setFilter] = useState('');
  const [tab, setTab] = useState('All');
  const [showTour, setShowTour] = useState(false);

  const setApplicability = (arr) => setData((d) => ({ ...d, applicability: arr }));
  const setSpec = (specPatch) => setData((d) => ({ ...d, spec: { ...d.spec, ...specPatch } }));

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

  const handleImportFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const trimmed = text.trim();

      // JSON (either flat internal format or namespaced xml2js-like)
      if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
        try {
          const parsed = JSON.parse(trimmed);

          // namespaced xml2js-like JSON (has root "ids")
          if (parsed && parsed.ids) {
            try {
              const internal = parseNamespacedIdsJson(parsed);
              // internal: { spec: {...}, applicability: [...] }
              setData(normalizeData({ spec: internal.spec || {}, applicability: internal.applicability || [] }));
            } catch (err) {
              console.error('Error parsing namespaced IDS JSON:', err);
              alert('Ошибка при обработке namespaced IDS JSON: ' + err.message);
            }
          }

          // internal flat JSON shape (our app format)
          else if (parsed && parsed.applicability) {
            setData(normalizeData(parsed));
          } else {
            alert('JSON не соответствует ожидаемой структуре (ожидается ключ "ids" или "applicability").');
          }
        } catch (err) {
          alert('Ошибка парсинга JSON: ' + err.message);
        }
      }

      // XML (IDS XML)
      else if (trimmed.startsWith('<')) {
        try {
          const parsed = xmlToJson(trimmed); // returns { spec: {...}, applicability: [...] }
          if (parsed && parsed.applicability) {
            setData(normalizeData({ spec: parsed.spec || data.spec, applicability: parsed.applicability }));
          } else {
            alert('XML не соответствует ожидаемой структуре.');
          }
        } catch (err) {
          alert('Ошибка парсинга XML: ' + err.message);
        }
      }

      // unknown
      else {
        alert('Неизвестный формат файла. Поддерживаются namespaced JSON, внутренний JSON и XML.');
      }
    };
    reader.readAsText(file);
  };

  const exportJSON = () => {
    download('ids.json', JSON.stringify(data, null, 2), 'application/json');
  };

  const exportNamespacedJSON = () => {
    const namespaced = buildNamespacedIdsJson(data);
    download('ids-namespaced.json', JSON.stringify(namespaced, null, 2), 'application/json');
  };

  const exportXML = () => {
    download('ids.xml', jsonToXml(data), 'application/xml');
  };

  // ensure we always pass an object with ifcVersion as an array to Sidebar
  const specForSidebar = { ...data.spec, ifcVersion: ensureArray(data.spec && data.spec.ifcVersion) };

  return (
    <div className="app-shell">
      <Header
        title={data.spec.title}
        tabs={['All', 'Applicability', 'Requirements']}
        activeTab={tab}
        onTabChange={setTab}
        onSearch={setFilter}
        onImport={handleImportFile}
        onExportJSON={exportJSON}
        onExportNamespacedJSON={exportNamespacedJSON}
        onExportXML={exportXML}
      />

      <div className="layout">
        <main className="main-col">
          <ApplicabilityEditor
            value={data.applicability}
            onChange={setApplicability}
            filter={filter}
            activeTab={tab}
          />
        </main>

        <aside className="sidebar-col">
          <Sidebar
            spec={specForSidebar}
            onSpecChange={setSpec}
            onAddApplicability={(item) => setApplicability([...(data.applicability || []), item])}
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