import React from 'react';

const StyleTab = ({ background, setBackground }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-white font-medium mb-2 text-sm">
          Background
        </label>
        <div className="grid grid-cols-1 gap-2">
          <button
            onClick={() => setBackground("black")}
            className={`p-3 rounded-lg border transition-all backdrop-blur-sm ${
              background === "black"
                ? "border-blue-500/50 bg-blue-500/10"
                : "border-gray-600/30 bg-gray-700/20 hover:border-gray-500/50"
            }`}
          >
            <div className="w-full h-6 bg-black rounded border border-gray-600/30 mb-1"></div>
            <span className="text-white text-xs">Black</span>
          </button>
          <button
            onClick={() => setBackground("white")}
            className={`p-3 rounded-lg border transition-all backdrop-blur-sm ${
              background === "white"
                ? "border-blue-500/50 bg-blue-500/10"
                : "border-gray-600/30 bg-gray-700/20 hover:border-gray-500/50"
            }`}
          >
            <div className="w-full h-6 bg-white rounded border border-gray-300/50 mb-1"></div>
            <span className="text-white text-xs">White</span>
          </button>
          <button
            onClick={() => setBackground("transparent")}
            className={`p-3 rounded-lg border transition-all backdrop-blur-sm ${
              background === "transparent"
                ? "border-blue-500/50 bg-blue-500/10"
                : "border-gray-600/30 bg-gray-700/20 hover:border-gray-500/50"
            }`}
          >
            <div className="w-full h-6 bg-transparent rounded border border-gray-400/30 bg-checkered mb-1"></div>
            <span className="text-white text-xs">Transparent</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StyleTab;
