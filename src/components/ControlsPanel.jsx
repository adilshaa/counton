import React from 'react';
import { Settings, Palette, Zap } from 'lucide-react';
import SettingsTab from './SettingsTab';
import StyleTab from './StyleTab';
import EffectsTab from './EffectsTab';

const ControlsPanel = ({
  activeTab,
  setActiveTab,
  duration,
  setDuration,
  countMode,
  setCountMode,
  counterType,
  setCounterType,
  startNumber,
  setStartNumber,
  endNumber,
  setEndNumber,
  numberCountMode,
  setNumberCountMode,
  speed,
  setSpeed,
  useCustomSpeed,
  setUseCustomSpeed,
  customSpeed,
  setCustomSpeed,
  background,
  setBackground,
  counterStyle,
  setCounterStyle,
  // Add other props that might be identified as necessary later
}) => {
  return (
    <div className="w-80 h-full bg-gray-900/30 backdrop-blur-xl border-r border-gray-700/20 overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header in Sidebar */}
        <div className="text-left">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Timer Studio
          </h1>
          <p className="text-gray-400 text-sm">
            Create professional timer videos
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-gray-800/30 backdrop-blur-xl rounded-xl p-1 border border-gray-700/20">
          <div className="flex flex-col space-y-1">
            <button
              onClick={() => setActiveTab("settings")}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all ${
                activeTab === "settings"
                  ? "bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-lg backdrop-blur-sm"
                  : "text-gray-400 hover:text-white hover:bg-gray-700/30"
              }`}
            >
              <Settings size={16} />
              Settings
            </button>
            <button
              onClick={() => setActiveTab("style")}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all ${
                activeTab === "style"
                  ? "bg-purple-500/20 text-purple-400 border border-purple-500/30 shadow-lg backdrop-blur-sm"
                  : "text-gray-400 hover:text-white hover:bg-gray-700/30"
              }`}
            >
              <Palette size={16} />
              Style
            </button>
            <button
              onClick={() => setActiveTab("effects")}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all ${
                activeTab === "effects"
                  ? "bg-pink-500/20 text-pink-400 border border-pink-500/30 shadow-lg backdrop-blur-sm"
                  : "text-gray-400 hover:text-white hover:bg-gray-700/30"
              }`}
            >
              <Zap size={16} />
              Effects
            </button>
          </div>
        </div>

        {/* Settings Content */}
        <div className="bg-gray-800/20 backdrop-blur-xl rounded-xl p-4 border border-gray-700/20">
          {/* Settings Tab */}
          {activeTab === "settings" && (
            <SettingsTab
              duration={duration}
              setDuration={setDuration}
              countMode={countMode}
              setCountMode={setCountMode}
              counterType={counterType}
              setCounterType={setCounterType}
              startNumber={startNumber}
              setStartNumber={setStartNumber}
              endNumber={endNumber}
              setEndNumber={setEndNumber}
              numberCountMode={numberCountMode}
              setNumberCountMode={setNumberCountMode}
              speed={speed}
              setSpeed={setSpeed}
              useCustomSpeed={useCustomSpeed}
              setUseCustomSpeed={setUseCustomSpeed}
              customSpeed={customSpeed}
              setCustomSpeed={setCustomSpeed}
            />
          )}

          {/* Style Tab */}
          {activeTab === "style" && (
            <StyleTab background={background} setBackground={setBackground} />
          )}

          {/* Effects Tab */}
          {activeTab === "effects" && (
            <EffectsTab
              counterStyle={counterStyle}
              setCounterStyle={setCounterStyle}
            />
          )}
        </div>
      </div>
      {/* Enhanced Glassmorphism Styles - Copied from original, can be refactored later if needed */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: linear-gradient(45deg, #3b82f6, #8b5cf6);
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(59, 130, 246, 0.4);
          border: 1px solid rgba(59, 130, 246, 0.3);
        }

        .slider::-webkit-slider-track {
          background: rgba(55, 65, 81, 0.5);
          border-radius: 4px;
          border: 1px solid rgba(75, 85, 99, 0.3);
        }

        .bg-checkered {
          background-image: linear-gradient(
              45deg,
              rgba(156, 163, 175, 0.3) 25%,
              transparent 25%
            ),
            linear-gradient(
              -45deg,
              rgba(156, 163, 175, 0.3) 25%,
              transparent 25%
            ),
            linear-gradient(
              45deg,
              transparent 75%,
              rgba(156, 163, 175, 0.3) 75%
            ),
            linear-gradient(
              -45deg,
              transparent 75%,
              rgba(156, 163, 175, 0.3) 75%
            );
          background-size: 8px 8px;
          background-position: 0 0, 0 4px, 4px -4px, -4px 0px;
        }

        /* Custom scrollbar for sidebar */
        .overflow-y-auto::-webkit-scrollbar {
          width: 4px;
        }

        .overflow-y-auto::-webkit-scrollbar-track {
          background: rgba(55, 65, 81, 0.2);
          border-radius: 2px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: rgba(75, 85, 99, 0.5);
          border-radius: 2px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: rgba(75, 85, 99, 0.7);
        }
      `}</style>
    </div>
  );
};

export default ControlsPanel;
