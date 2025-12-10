import React, { useState } from 'react';
import { HashRouter } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Wardrobe } from './components/Wardrobe';
import { OutfitGenerator } from './components/OutfitGenerator';
import { OutfitMixer } from './components/OutfitMixer';
import { OutfitGallery } from './components/OutfitGallery';
import { LandingPage } from './components/LandingPage';
import { ApiKeyModal } from './components/ApiKeyModal';
import { ApiKeyWarningPill } from './components/ApiKeyWarningPill';
import { ScreenState, WardrobeItem, Outfit, ItemType } from './types';

// Default items for quick start
const DEFAULT_WARDROBE: WardrobeItem[] = [
  {
    id: 'def-person-1',
    type: ItemType.PERSON,
    name: '(Demo Profile)',
    imageData: 'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Professional woman standing
    createdAt: Date.now(),
    category: 'Model'
  },
  {
    id: 'def-upper-1',
    type: ItemType.UPPER_WEAR,
    name: 'White Linen Shirt(Example)',
    imageData: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=1000&auto=format&fit=crop', // White shirt
    createdAt: Date.now(),
    category: 'Tops'
  },
  {
    id: 'def-upper-2',
    type: ItemType.UPPER_WEAR,
    name: ' Loose Soft Kaftan(Example)',
    imageData: 'https://images.unsplash.com/photo-1753192104240-209f3fb568ef?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Leather jacket
    createdAt: Date.now(),
    category: 'Outerwear'
  },
  {
    id: 'def-lower-1',
    type: ItemType.LOWER_WEAR,
    name: 'Classic Blue Jeans(Example)',
    imageData: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1000&auto=format&fit=crop', // Jeans
    createdAt: Date.now(),
    category: 'Pants'
  },
  {
    id: 'def-lower-2',
    type: ItemType.LOWER_WEAR,
    name: 'Pleated Skirt(Example)',
    imageData: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=697&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Skirt
    createdAt: Date.now(),
    category: 'Skirts'
  }
];

const App: React.FC = () => {

  const [activeScreen, setActiveScreen] = useState<ScreenState>('landing');
  const [preferredModel, setPreferredModel] = useState<string>('gemini-2.5-flash-image');

  // API Key State
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('GEMINI_API_KEY') || '');
  const [showApiKeyModal, setShowApiKeyModal] = useState<boolean>(() => !localStorage.getItem('GEMINI_API_KEY'));
  const [hasSkipped, setHasSkipped] = useState(false);

  // App State - Initialized with Defaults
  const [wardrobeItems, setWardrobeItems] = useState<WardrobeItem[]>(DEFAULT_WARDROBE);
  const [outfits, setOutfits] = useState<Outfit[]>([]);

  const handleSaveApiKey = (key: string) => {
    localStorage.setItem('GEMINI_API_KEY', key);
    setApiKey(key);
    setShowApiKeyModal(false);
    setHasSkipped(false);
  };

  const handleSkipApiKey = () => {
    setShowApiKeyModal(false);
    setHasSkipped(true);
  };

  const handleAddItem = (item: WardrobeItem) => {
    setWardrobeItems(prev => [...prev, item]);
  };

  const handleRemoveItem = (id: string) => {
    setWardrobeItems(prev => prev.filter(i => i.id !== id));
  };

  const handleAddOutfit = (outfit: Outfit) => {
    setOutfits(prev => [...prev, outfit]);
  };

  const handleUpdateOutfit = (id: string, updates: Partial<Outfit>) => {
    setOutfits(prev => prev.map(o => o.id === id ? { ...o, ...updates } : o));
  };

  const handleDeleteOutfit = (id: string) => {
    setOutfits(prev => prev.filter(o => o.id !== id));
  };

  const handleRetryOutfit = (id: string) => {
    handleDeleteOutfit(id);
    setActiveScreen('generator');
  };

  // If on landing page, render full screen without app layout
  if (activeScreen === 'landing') {
    return <LandingPage onNavigate={setActiveScreen} />;
  }

  // App Internal Screens
  const renderScreen = () => {
    switch (activeScreen) {
      case 'wardrobe':
        return (
          <Wardrobe
            items={wardrobeItems}
            onAddItem={handleAddItem}
            onRemoveItem={handleRemoveItem}
          />
        );
      case 'mixer':
        return (
          <OutfitMixer
            items={wardrobeItems}
            outfits={outfits}
            onAddOutfit={handleAddOutfit}
            onUpdateOutfit={handleUpdateOutfit}
            initialModel={preferredModel}
            apiKey={apiKey}
            onOpenApiKeyModal={() => setShowApiKeyModal(true)}
          />
        );
      case 'generator':
        return (
          <OutfitGenerator
            items={wardrobeItems}
            outfits={outfits}
            onAddOutfit={handleAddOutfit}
            onUpdateOutfit={handleUpdateOutfit}
            initialModel={preferredModel}
            apiKey={apiKey}
            onOpenApiKeyModal={() => setShowApiKeyModal(true)}
          />
        );
      case 'gallery':
        return (
          <OutfitGallery
            outfits={outfits}
            items={wardrobeItems}
            onDeleteOutfit={handleDeleteOutfit}
            onRetryOutfit={handleRetryOutfit}
          />
        );
      case 'settings':
        return (
          <div className="bg-white rounded-xl shadow-sm p-6 max-w-lg mx-auto">
            <h2 className="text-xl font-bold mb-4">Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-gray-700">Google API Status</span>
                {apiKey ? (
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      Connected
                    </span>
                    <button onClick={() => setShowApiKeyModal(true)} className="text-xs text-blue-600 hover:underline">Change</button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-red-500 font-medium flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span>
                      Missing Key
                    </span>
                    <button onClick={() => setShowApiKeyModal(true)} className="text-xs text-blue-600 hover:underline">Add Key</button>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-gray-700">Clear All Data</span>
                <button
                  onClick={() => {
                    if (confirm('Are you sure? This will delete all clothes and generated images.')) {
                      setWardrobeItems([]);
                      setOutfits([]);
                    }
                  }}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Reset App
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-4">
                Style v1.3 • Powered by Gemini
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <HashRouter>
      {showApiKeyModal && (
        <ApiKeyModal onSave={handleSaveApiKey} onSkip={handleSkipApiKey} />
      )}
      {!apiKey && hasSkipped && !showApiKeyModal && (
        <ApiKeyWarningPill onOpenModal={() => setShowApiKeyModal(true)} />
      )}
      <Layout activeScreen={activeScreen} onNavigate={setActiveScreen}>
        {/* Desktop Sidebar Adjuster Wrapper removed - Layout handles flex */}
        {renderScreen()}
      </Layout>
    </HashRouter>
  );
};

export default App;