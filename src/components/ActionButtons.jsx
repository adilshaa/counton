import React from 'react';
import { Play, Pause, Square, Download } from 'lucide-react';

const ActionButtons = ({
  isRecording,
  isPaused,
  isComplete,
  startRecording,
  pauseRecording,
  stopRecording,
  downloadVideo,
}) => {
  return (
    <div className="p-6 pt-0">
      <div className="bg-white/70 dark:bg-gray-800/20 backdrop-blur-xl rounded-2xl p-4 border border-gray-300/60 dark:border-gray-700/20 transition-colors duration-300">
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={startRecording}
            disabled={isRecording}
            className="flex items-center gap-2 bg-gradient-to-r from-red-100/80 to-red-200/80 hover:from-red-200/80 hover:to-red-300/80 disabled:from-gray-200/50 disabled:to-gray-300/50 disabled:cursor-not-allowed text-red-600 disabled:text-gray-400 px-4 py-2 rounded-xl font-medium transition-all transform hover:scale-105 border border-red-300/50 disabled:border-gray-300/50 backdrop-blur-sm dark:from-red-500/20 dark:to-red-600/20 dark:hover:from-red-500/30 dark:hover:to-red-600/30 dark:disabled:from-gray-600/20 dark:disabled:to-gray-700/20 dark:text-red-400 dark:disabled:text-gray-500 dark:border-red-500/30 dark:disabled:border-gray-600/30"
          >
            <Play size={16} />
            Start
          </button>

          <button
            onClick={pauseRecording}
            disabled={!isRecording}
            className="flex items-center gap-2 bg-gradient-to-r from-yellow-100/80 to-orange-200/80 hover:from-yellow-200/80 hover:to-orange-300/80 disabled:from-gray-200/50 disabled:to-gray-300/50 disabled:cursor-not-allowed text-yellow-700 disabled:text-gray-400 px-4 py-2 rounded-xl font-medium transition-all transform hover:scale-105 border border-yellow-300/50 disabled:border-gray-300/50 backdrop-blur-sm dark:from-yellow-500/20 dark:to-orange-500/20 dark:hover:from-yellow-500/30 dark:hover:to-orange-500/30 dark:disabled:from-gray-600/20 dark:disabled:to-gray-700/20 dark:text-yellow-400 dark:disabled:text-gray-500 dark:border-yellow-500/30 dark:disabled:border-gray-600/30"
          >
            <Pause size={16} />
            {isPaused ? "Resume" : "Pause"}
          </button>

          <button
            onClick={stopRecording}
            disabled={!isRecording}
            className="flex items-center gap-2 bg-gradient-to-r from-gray-300/80 to-gray-400/80 hover:from-gray-400/80 hover:to-gray-500/80 disabled:from-gray-200/50 disabled:to-gray-300/50 disabled:cursor-not-allowed text-gray-700 disabled:text-gray-400 px-4 py-2 rounded-xl font-medium transition-all transform hover:scale-105 border border-gray-400/50 disabled:border-gray-300/50 backdrop-blur-sm dark:from-gray-500/20 dark:to-gray-600/20 dark:hover:from-gray-500/30 dark:hover:to-gray-600/30 dark:disabled:from-gray-600/20 dark:disabled:to-gray-700/20 dark:text-gray-400 dark:disabled:text-gray-500 dark:border-gray-500/30 dark:disabled:border-gray-600/30"
          >
            <Square size={16} />
            Stop
          </button>

          <button
            onClick={downloadVideo}
            disabled={!isComplete}
            className="flex items-center gap-2 bg-gradient-to-r from-green-100/80 to-emerald-200/80 hover:from-green-200/80 hover:to-emerald-300/80 disabled:from-gray-200/50 disabled:to-gray-300/50 disabled:cursor-not-allowed text-green-700 disabled:text-gray-400 px-4 py-2 rounded-xl font-medium transition-all transform hover:scale-105 border border-green-300/50 disabled:border-gray-300/50 backdrop-blur-sm dark:from-green-500/20 dark:to-emerald-500/20 dark:hover:from-green-500/30 dark:hover:to-emerald-500/30 dark:disabled:from-gray-600/20 dark:disabled:to-gray-700/20 dark:text-green-400 dark:disabled:text-gray-500 dark:border-green-500/30 dark:disabled:border-gray-600/30"
          >
            <Download size={16} />
            Download
          </button>
        </div>

        {isComplete && (
          <div className="mt-3 text-center">
            <div className="inline-flex items-center gap-2 bg-green-100/80 dark:bg-green-500/10 border border-green-300/50 dark:border-green-500/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-lg backdrop-blur-sm">
              <div className="w-1.5 h-1.5 bg-green-500 dark:bg-green-400 rounded-full"></div>
              <span className="text-sm">
                Recording complete! Ready to download.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActionButtons;
