import React from 'react';

const VideoPreview = ({
  canvasRef,
  isRecording,
  isPaused,
  currentTime,
  duration,
}) => {
  return (
    <div className="flex-1 p-6 flex flex-col min-h-0">
      <div className="flex-1 bg-white/70 dark:bg-gray-800/20 backdrop-blur-xl rounded-2xl p-6 border border-gray-300/60 dark:border-gray-700/20 transition-colors duration-300">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-1">
            Video Preview
          </h2>
          <p className="text-slate-600 dark:text-gray-400 text-sm">
            Live preview of your timer video
          </p>
        </div>

        <div className="relative flex-1 flex items-center justify-center min-h-0">
          <canvas
            ref={canvasRef}
            // width and height attributes removed
            className="max-w-full max-h-full border border-gray-300/70 bg-gray-200/50 dark:border-gray-600/30 dark:bg-gray-900/50 rounded-xl shadow-2xl backdrop-blur-sm transition-colors duration-300"
            style={{ width: "100%", height: "100%" }}
          />

          {/* Recording Overlay */}
          {isRecording && (
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-100/80 dark:bg-red-500/20 backdrop-blur-xl border border-red-400/50 dark:border-red-500/30 px-3 py-2 rounded-lg">
              <div className="w-2 h-2 bg-red-500 dark:bg-red-400 rounded-full animate-pulse"></div>
              <span className="text-red-700 dark:text-red-400 font-medium text-sm">
                {isPaused ? "PAUSED" : "RECORDING"}
              </span>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default VideoPreview;
