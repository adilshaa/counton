import React from 'react';

const StyleTab = ({ background, setBackground, timerFontSize, setTimerFontSize }) => {
  return (
    <div className="space-y-6"> {/* Increased spacing for new section */}
      {/* Background Settings */}
      <div className="p-4 border-b border-gray-700">
        <label className="block text-sm font-medium text-gray-300 mb-2"> {/* Consistent label styling */}
          Canvas Background
        </label>
        <div className="grid grid-cols-1 gap-2">
          <button
            onClick={() => setBackground("black")}
            className={`p-3 rounded-lg border transition-all backdrop-blur-sm ${
              background === "black"
                ? "border-blue-500/50 bg-blue-500/10 dark:bg-blue-500/10" // Ensure dark mode active state is distinct if needed
                : "border-gray-300/70 bg-gray-200/50 hover:border-gray-400/70 dark:border-gray-600/30 dark:bg-gray-700/20 dark:hover:border-gray-500/50"
            }`}
          >
            <div className="w-full h-6 bg-black rounded border border-gray-600/30 mb-1"></div>
            <span className="text-slate-700 dark:text-white text-xs">Black</span>
          </button>
          <button
            onClick={() => setBackground("white")}
            className={`p-3 rounded-lg border transition-all backdrop-blur-sm ${
              background === "white"
                ? "border-blue-500/50 bg-blue-500/10 dark:bg-blue-500/10"
                : "border-gray-300/70 bg-gray-200/50 hover:border-gray-400/70 dark:border-gray-600/30 dark:bg-gray-700/20 dark:hover:border-gray-500/50"
            }`}
          >
            <div className="w-full h-6 bg-white rounded border border-gray-300/50 mb-1"></div>
            <span className="text-slate-700 dark:text-white text-xs">White</span>
          </button>
          <button
            onClick={() => setBackground("transparent")}
            className={`p-3 rounded-lg border transition-all backdrop-blur-sm ${
              background === "transparent"
                ? "border-blue-500/50 bg-blue-500/10 dark:bg-blue-500/10"
                : "border-gray-300/70 bg-gray-200/50 hover:border-gray-400/70 dark:border-gray-600/30 dark:bg-gray-700/20 dark:hover:border-gray-500/50"
            }`}
          >
            <div className="w-full h-6 bg-transparent rounded border border-gray-400/30 bg-checkered mb-1"></div>
            <span className="text-slate-700 dark:text-white text-xs">Transparent</span>
          </button>
        </div>
      </div>

      {/* Timer Font Size Setting */}
      <div className="p-4 border-b border-gray-700">
        <label htmlFor="timerFontSize" className="block text-sm font-medium text-gray-300 mb-1">
          Timer Font Size: {timerFontSize}px
        </label>
        <input
          type="range"
          id="timerFontSize"
          name="timerFontSize"
          min="1"
          max="100"
          value={timerFontSize}
          onChange={(e) => setTimerFontSize(Number(e.target.value))}
          className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider accent-pink-500"
        />
      </div>
    </div>
  );
};

export default StyleTab;
