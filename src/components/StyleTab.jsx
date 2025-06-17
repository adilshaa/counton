import React from 'react';
import WebFont from 'webfontloader'; // Import WebFontLoader

const StyleTab = ({
  background,
  setBackground,
  timerFontSize,
  setTimerFontSize,
  selectedFontFamily,
  setSelectedFontFamily,
  customFontInput,
  setCustomFontInput,
  defaultFonts,
  loadedCustomFonts,
  setLoadedCustomFonts, // Now using this prop
}) => {
  const handleLoadCustomFont = () => {
    const fontFamilyName = customFontInput.trim();
    if (!fontFamilyName) {
      alert("Please enter a font family name.");
      return;
    }

    console.log(`Attempting to load font: '${fontFamilyName}'`);

    WebFont.load({
      google: {
        families: [fontFamilyName] // e.g., ['Roboto:400,700italic', 'Lobster']
      },
      active: () => {
        console.log(`Font '${fontFamilyName}' loaded successfully.`);
        // Extract a clean name for display, e.g., "Roboto" from "Roboto:400,700italic"
        const cleanName = fontFamilyName.split(':')[0].trim();
        const newCustomFont = { name: cleanName, family: fontFamilyName, type: 'custom' };

        setLoadedCustomFonts(prevFonts => {
          if (!prevFonts.find(f => f.family === fontFamilyName)) {
            return [...prevFonts, newCustomFont];
          }
          return prevFonts;
        });
        setSelectedFontFamily(fontFamilyName); // Set it as active
        // Optionally clear the input:
        // setCustomFontInput(''); // Decided against auto-clearing for now, user might want to tweak.
      },
      inactive: () => {
        console.error(`Failed to load font '${fontFamilyName}'.`);
        alert(`Failed to load font '${fontFamilyName}'. It might be misspelled, not available on Google Fonts, or network issue.`);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Background Settings */}
      <div className="p-4 border-b border-gray-300/60 dark:border-gray-700/20">
        <label className="block text-sm font-medium text-slate-700 dark:text-white mb-2">
          Canvas Background
        </label>
        <div className="grid grid-cols-1 gap-2">
          <button
            onClick={() => setBackground("black")}
            className={`p-3 rounded-lg border transition-all backdrop-blur-sm ${
              background === "black"
                ? "border-blue-500/50 bg-blue-500/10 dark:bg-blue-500/20"
                : "border-gray-300/70 bg-gray-200/50 hover:border-gray-400/70 dark:border-gray-600/30 dark:bg-gray-700/30 dark:hover:border-gray-500/50"
            }`}
          >
            <div className="w-full h-6 bg-black rounded border border-gray-600/30 mb-1"></div>
            <span className="text-slate-700 dark:text-white text-xs">Black</span>
          </button>
          <button
            onClick={() => setBackground("white")}
            className={`p-3 rounded-lg border transition-all backdrop-blur-sm ${
              background === "white"
                ? "border-blue-500/50 bg-blue-500/10 dark:bg-blue-500/20"
                : "border-gray-300/70 bg-gray-200/50 hover:border-gray-400/70 dark:border-gray-600/30 dark:bg-gray-700/30 dark:hover:border-gray-500/50"
            }`}
          >
            <div className="w-full h-6 bg-white rounded border border-gray-300/50 mb-1"></div>
            <span className="text-slate-700 dark:text-white text-xs">White</span>
          </button>
          <button
            onClick={() => setBackground("transparent")}
            className={`p-3 rounded-lg border transition-all backdrop-blur-sm ${
              background === "transparent"
                ? "border-blue-500/50 bg-blue-500/10 dark:bg-blue-500/20"
                : "border-gray-300/70 bg-gray-200/50 hover:border-gray-400/70 dark:border-gray-600/30 dark:bg-gray-700/30 dark:hover:border-gray-500/50"
            }`}
          >
            <div className="w-full h-6 bg-transparent rounded border border-gray-400/30 bg-checkered mb-1"></div>
            <span className="text-slate-700 dark:text-white text-xs">Transparent</span>
          </button>
        </div>
      </div>

      {/* Timer Font Size Setting */}
      <div className="p-4 border-b border-gray-300/60 dark:border-gray-700/20">
        <label htmlFor="timerFontSize" className="block text-sm font-medium text-slate-700 dark:text-white mb-1">
          Timer Font Size: <span className="font-bold text-blue-600 dark:text-blue-400">{timerFontSize}px</span>
        </label>
        <input
          type="range"
          id="timerFontSize"
          name="timerFontSize"
          min="10"
          max="200"
          value={timerFontSize}
          onChange={(e) => setTimerFontSize(Number(e.target.value))}
          className="w-full h-2 bg-gray-300/70 dark:bg-gray-700/50 backdrop-blur-sm rounded-lg appearance-none cursor-pointer slider"
        />
      </div>

      {/* Timer Font Family Setting */}
      <div className="p-4">
        <label htmlFor="timerFontFamily" className="block text-sm font-medium text-slate-700 dark:text-white mb-2">
          Timer Font Family
        </label>
        <select
          id="timerFontFamily"
          value={selectedFontFamily}
          onChange={(e) => setSelectedFontFamily(e.target.value)}
          className="w-full p-2 bg-white/80 dark:bg-gray-700/30 backdrop-blur-sm text-slate-900 dark:text-white rounded-lg border border-gray-300 dark:border-gray-600/30 focus:border-blue-500 dark:focus:border-blue-500/50 focus:outline-none text-sm"
        >
          {defaultFonts.map(font => (
            <option key={font.family} value={font.family}>
              {font.name}
            </option>
          ))}
          {loadedCustomFonts.map(font => (
            <option key={font.family} value={font.family}>
              {font.name} (Custom)
            </option>
          ))}
        </select>

        <div className="mt-4">
          <label htmlFor="customFontInput" className="block text-xs font-medium text-slate-600 dark:text-gray-400 mb-1">
            Load Google Font (Family Name e.g. "Roboto" or "Open Sans:wght@700")
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="customFontInput"
              placeholder="Enter Google Font family"
              value={customFontInput}
              onChange={(e) => setCustomFontInput(e.target.value)}
              className="flex-grow p-2 bg-white/80 dark:bg-gray-700/30 backdrop-blur-sm text-slate-900 dark:text-white rounded-lg border border-gray-300 dark:border-gray-600/30 focus:border-blue-500 dark:focus:border-blue-500/50 focus:outline-none text-sm"
            />
            <button
              onClick={handleLoadCustomFont}
              className="px-4 py-2 bg-blue-500/80 hover:bg-blue-600/80 text-white rounded-lg text-sm font-medium transition-colors backdrop-blur-sm border border-blue-600/50 dark:bg-blue-600/50 dark:hover:bg-blue-700/50 dark:border-blue-700/50"
            >
              Load Font
            </button>
          </div>
           <p className="text-xs text-slate-500 dark:text-gray-500 mt-1">
            Ensure exact font name from <a href="https://fonts.google.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-500">Google Fonts</a>.
            Font loading will be implemented in the next step.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StyleTab;
