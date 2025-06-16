import React from 'react';

const VideoPreview = ({
  canvasRef,
  isRecording,
  isPaused,
  currentTime,
  duration,
}) => {
  return (
    <div className="flex-1 p-6 flex flex-col">
      <div className="flex-1 bg-gray-800/20 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/20">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white mb-1">
            Video Preview
          </h2>
          <p className="text-gray-400 text-sm">
            Live preview of your timer video
          </p>
        </div>

        <div className="relative flex-1 flex items-center justify-center">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="max-w-full max-h-full border border-gray-600/30 rounded-xl shadow-2xl bg-gray-900/50 backdrop-blur-sm"
            style={{ maxWidth: "100%", height: "auto" }}
          />

          {/* Recording Overlay */}
          {isRecording && (
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-500/20 backdrop-blur-xl border border-red-500/30 px-3 py-2 rounded-lg">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
              <span className="text-red-400 font-medium text-sm">
                {isPaused ? "PAUSED" : "RECORDING"}
              </span>
            </div>
          )}

          {/* Progress Bar */}
          {isRecording && (
            <div className="absolute bottom-4 left-4 right-4 bg-black/30 backdrop-blur-xl border border-gray-700/30 rounded-lg p-3">
              <div className="flex justify-between text-white text-sm mb-2">
                <span>{Math.floor(currentTime)}s</span>
                <span>{duration}s</span>
              </div>
              <div className="w-full bg-gray-700/50 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(
                      (currentTime / duration) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPreview;
