import React from 'react';
import { Settings, Palette, Zap, ChevronsLeft, ChevronsRight, Film } from 'lucide-react';
import { UserButton } from '@clerk/clerk-react'; // Import UserButton

// SettingsTab, StyleTab, EffectsTab imports are removed as they are no longer rendered here.

const ControlsPanel = ({
  activeModal,
  setActiveModal,
  isSidebarCollapsed,    // New prop
  setIsSidebarCollapsed, // New prop
}) => {
  return (
    <div
      className={`h-full bg-white/70 dark:bg-gray-900/30 backdrop-blur-xl border-r border-gray-200/80 dark:border-gray-700/20 overflow-y-auto transition-all duration-300 ease-in-out shadow-2xl ${
        isSidebarCollapsed ? 'w-20' : 'w-80' // Dynamic width
      }`}
    >
      <div className="p-6 space-y-6 flex flex-col h-full"> {/* Added flex flex-col h-full */}
        {/* Header in Sidebar */}
        {isSidebarCollapsed ? (
          <div className="flex justify-center py-2 my-1"> {/* Adjusted padding for icon */}
            <Film size={28} className="text-slate-300 dark:text-gray-500" />
          </div>
        ) : (
          <div className="text-left">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              Timer Studio
            </h1>
            <p className="text-slate-600 dark:text-gray-400 text-sm">
              Create professional timer videos
            </p>
          </div>
        )}

        {/* Modal Trigger Buttons (formerly Tab Navigation) */}
        <div className="bg-gray-200/50 dark:bg-gray-800/30 backdrop-blur-xl rounded-xl p-1 border border-gray-300/70 dark:border-gray-700/20 transition-colors duration-300">
          <div className="flex flex-col space-y-1">
            <button
              onClick={() => setActiveModal("settings")}
              title={isSidebarCollapsed ? "Settings" : undefined}
              className={`flex items-center justify-center sm:justify-start gap-2 px-3 py-2 rounded-lg font-medium transition-all ${
                activeModal === "settings"
                  ? "bg-blue-100 text-blue-700 border border-blue-300 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30 shadow-lg backdrop-blur-sm"
                  : "text-slate-600 hover:text-slate-800 hover:bg-gray-300/50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700/30"
              }`}
            >
              <Settings size={16} />
              {!isSidebarCollapsed && <span>Settings</span>}
            </button>
            <button
              onClick={() => setActiveModal("style")}
              title={isSidebarCollapsed ? "Style" : undefined}
              className={`flex items-center justify-center sm:justify-start gap-2 px-3 py-2 rounded-lg font-medium transition-all ${
                activeModal === "style"
                  ? "bg-purple-100 text-purple-700 border border-purple-300 dark:bg-purple-500/20 dark:text-purple-400 dark:border-purple-500/30 shadow-lg backdrop-blur-sm"
                  : "text-slate-600 hover:text-slate-800 hover:bg-gray-300/50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700/30"
              }`}
            >
              <Palette size={16} />
              {!isSidebarCollapsed && <span>Style</span>}
            </button>
            <button
              onClick={() => setActiveModal("effects")}
              title={isSidebarCollapsed ? "Effects" : undefined}
              className={`flex items-center justify-center sm:justify-start gap-2 px-3 py-2 rounded-lg font-medium transition-all ${
                activeModal === "effects"
                  ? "bg-pink-100 text-pink-700 border border-pink-300 dark:bg-pink-500/20 dark:text-pink-400 dark:border-pink-500/30 shadow-lg backdrop-blur-sm"
                  : "text-slate-600 hover:text-slate-800 hover:bg-gray-300/50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700/30"
              }`}
            >
              <Zap size={16} />
              {!isSidebarCollapsed && <span>Effects</span>}
            </button>
          </div>
        </div>

        {/* Spacer to push toggle button to bottom */}
        <div className="flex-grow"></div>

        {/* UserButton section */}
        <div className={`py-3 border-t border-gray-300/60 dark:border-gray-700/20 ${isSidebarCollapsed ? 'flex justify-center' : 'px-3'}`}>
          <UserButton afterSignOutUrl="/login" />
        </div>

        {/* Toggle Button */}
        <div className="pt-4 border-t border-gray-300/60 dark:border-gray-700/20"> {/* Removed mt-auto as UserButton is now also at bottom */}
          <button
            onClick={() => setIsSidebarCollapsed(prev => !prev)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-medium transition-all text-slate-600 hover:text-slate-800 hover:bg-gray-300/50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700/30"
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isSidebarCollapsed ? <ChevronsRight size={20} /> : <ChevronsLeft size={20} />}
          </button>
        </div>
        {/* The section that rendered SettingsTab, StyleTab, EffectsTab is REMOVED. */}
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
