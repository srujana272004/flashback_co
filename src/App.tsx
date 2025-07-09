import React, { useState } from 'react';
import { PhotoTemplate, AppState } from './types'; // Make sure AppState includes 'filter-selection' and 'camera-error'
import LandingPage from './components/LandingPage';
import TemplateSelector from './components/TemplateSelector';
import PhotoBooth from './components/PhotoBooth';

function App() {
  const [state, setState] = useState<AppState>('landing');
  const [selectedTemplate, setSelectedTemplate] = useState<PhotoTemplate | null>(null);

  const handleStart = () => {
    setState('template-selection');
  };

  const handleTemplateSelect = (template: PhotoTemplate) => {
    setSelectedTemplate(template);
    setState('camera-setup');
  };

  const handleBackToLanding = () => {
    setState('landing');
    setSelectedTemplate(null); // Clear selected template if going back to landing
  };

  const handleBackToTemplates = () => {
    setState('template-selection');
    setSelectedTemplate(null); // Clear selected template when going back to templates
  };

  const handleComplete = () => {
    // This function is called from PhotoBooth when a session is completely finished (e.g., photo downloaded/shared)
    // You might want to go back to the landing page, or a final summary page here.
    setState('landing'); // Or 'final-summary' if you implement one
    setSelectedTemplate(null);
  };

  return (
    <div className="App">
      {state === 'landing' && (
        <LandingPage onStart={handleStart} />
      )}
      
      {state === 'template-selection' && (
        <TemplateSelector
          onSelectTemplate={handleTemplateSelect}
          onBack={handleBackToLanding} // 'TemplateSelector's back button should go to LandingPage
        />
      )}
    
      {(state === 'camera-setup' ||
  state === 'countdown' ||
  state === 'capturing' ||
  state === 'filter-selection' || // This was the crucial ADDITION
  state === 'final-preview' ||
  state === 'camera-error' // ADDED THIS LINE
) && selectedTemplate && (
  <PhotoBooth
    template={selectedTemplate}
    onBack={handleBackToTemplates} // Or handleBackToLanding, your choice
    onComplete={handleComplete}
  />
)}
    </div>
  );
}

export default App;