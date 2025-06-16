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
      <div className="bg-gray-800/20 backdrop-blur-xl rounded-2xl p-4 border border-gray-700/20">
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={startRecording}
            disabled={isRecording}
            className="flex items-center gap-2 bg-gradient-to-r from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 disabled:from-gray-600/20 disabled:to-gray-700/20 disabled:cursor-not-allowed text-red-400 disabled:text-gray-500 px-4 py-2 rounded-xl font-medium transition-all transform hover:scale-105 border border-red-500/30 disabled:border-gray-600/30 backdrop-blur-sm"
          >
            <Play size={16} />
            Start
          </button>

          <button
            onClick={pauseRecording}
            disabled={!isRecording}
            className="flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 hover:from-yellow-500/30 hover:to-orange-500/30 disabled:from-gray-600/20 disabled:to-gray-700/20 disabled:cursor-not-allowed text-yellow-400 disabled:text-gray-500 px-4 py-2 rounded-xl font-medium transition-all transform hover:scale-105 border border-yellow-500/30 disabled:border-gray-600/30 backdrop-blur-sm"
          >
            <Pause size={16} />
            {isPaused ? "Resume" : "Pause"}
          </button>

          <button
            onClick={stopRecording}
            disabled={!isRecording}
            className="flex items-center gap-2 bg-gradient-to-r from-gray-500/20 to-gray-600/20 hover:from-gray-500/30 hover:to-gray-600/30 disabled:from-gray-600/20 disabled:to-gray-700/20 disabled:cursor-not-allowed text-gray-400 disabled:text-gray-500 px-4 py-2 rounded-xl font-medium transition-all transform hover:scale-105 border border-gray-500/30 disabled:border-gray-600/30 backdrop-blur-sm"
          >
            <Square size={16} />
            Stop
          </button>

          <button
            onClick={downloadVideo}
            disabled={!isComplete}
            className="flex items-center gap-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 disabled:from-gray-600/20 disabled:to-gray-700/20 disabled:cursor-not-allowed text-green-400 disabled:text-gray-500 px-4 py-2 rounded-xl font-medium transition-all transform hover:scale-105 border border-green-500/30 disabled:border-gray-600/30 backdrop-blur-sm"
          >
            <Download size={16} />
            Download
          </button>
        </div>

        {isComplete && (
          <div className="mt-3 text-center">
            <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-400 px-3 py-1 rounded-lg backdrop-blur-sm">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
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
