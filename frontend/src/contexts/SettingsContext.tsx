import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface FeatureSettings {
  showCommunityFeatures: boolean;
  showDeliveryIntegration: boolean;
  showMLPredictions: boolean;
  showRealTimePricing: boolean;
}

interface SettingsContextType {
  features: FeatureSettings;
  updateFeature: (feature: keyof FeatureSettings, enabled: boolean) => void;
  resetToDefaults: () => void;
}

const defaultSettings: FeatureSettings = {
  showCommunityFeatures: true,
  showDeliveryIntegration: true,
  showMLPredictions: true,
  showRealTimePricing: true,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [features, setFeatures] = useState<FeatureSettings>(() => {
    const savedSettings = localStorage.getItem('bitebudget-settings');
    if (savedSettings) {
      try {
        return { ...defaultSettings, ...JSON.parse(savedSettings) };
      } catch (error) {
        console.error('Error parsing saved settings:', error);
        return defaultSettings;
      }
    }
    return defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('bitebudget-settings', JSON.stringify(features));
  }, [features]);

  const updateFeature = (feature: keyof FeatureSettings, enabled: boolean) => {
    setFeatures(prev => ({
      ...prev,
      [feature]: enabled
    }));
  };

  const resetToDefaults = () => {
    setFeatures(defaultSettings);
    localStorage.removeItem('bitebudget-settings');
  };

  const value = {
    features,
    updateFeature,
    resetToDefaults,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
