import React from 'react';

const SettingsTab = ({
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
  isRecordingGif,      // New prop
  setIsRecordingGif,   // New prop
}) => {
  return (
    <div className="space-y-4">
      {/* Output Format Setting */}
      <div>
        <label className="block text-slate-700 dark:text-white font-medium mb-2 text-sm">
          Output Format
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setIsRecordingGif(false)}
            className={`p-2 rounded-lg font-medium transition-all text-sm backdrop-blur-sm ${
              !isRecordingGif
                ? "bg-purple-100 text-purple-700 border-purple-300 dark:bg-purple-500/20 dark:text-purple-400 dark:border-purple-500/30"
                : "bg-gray-200/70 text-slate-700 hover:bg-gray-300/70 dark:bg-gray-700/30 dark:text-gray-300 dark:hover:bg-gray-600/30 border border-gray-300/70 dark:border-gray-600/30"
            }`}
          >
            Video (webm)
          </button>
          <button
            onClick={() => setIsRecordingGif(true)}
            className={`p-2 rounded-lg font-medium transition-all text-sm backdrop-blur-sm ${
              isRecordingGif
                ? "bg-purple-100 text-purple-700 border-purple-300 dark:bg-purple-500/20 dark:text-purple-400 dark:border-purple-500/30"
                : "bg-gray-200/70 text-slate-700 hover:bg-gray-300/70 dark:bg-gray-700/30 dark:text-gray-300 dark:hover:bg-gray-600/30 border border-gray-300/70 dark:border-gray-600/30"
            }`}
          >
            Animated GIF
          </button>
        </div>
      </div>

      <div>
        <label className="block text-slate-700 dark:text-white font-medium mb-2 text-sm">
          Duration
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="5"
            max="300"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
            className="flex-1 h-2 bg-gray-300/70 dark:bg-gray-700/50 backdrop-blur-sm rounded-lg appearance-none cursor-pointer slider"
          />
          <span className="text-blue-600 dark:text-blue-400 font-bold text-sm min-w-[50px] bg-blue-500/10 dark:bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20 dark:border-blue-500/20">
            {duration}s
          </span>
        </div>
      </div>

      <div>
        <label className="block text-slate-700 dark:text-white font-medium mb-2 text-sm">
          Count Mode
        </label>
        <div className="grid grid-cols-1 gap-2">
          <button
            onClick={() => setCountMode("countdown")}
            className={`p-2 rounded-lg font-medium transition-all text-sm backdrop-blur-sm ${
              countMode === "countdown"
                ? "bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30"
                : "bg-gray-200/70 text-slate-700 hover:bg-gray-300/70 dark:bg-gray-700/30 dark:text-gray-300 dark:hover:bg-gray-600/30 border border-gray-300/70 dark:border-gray-600/30"
            }`}
          >
            Countdown
          </button>
          <button
            onClick={() => setCountMode("countup")}
            className={`p-2 rounded-lg font-medium transition-all text-sm backdrop-blur-sm ${
              countMode === "countup"
                ? "bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30"
                : "bg-gray-200/70 text-slate-700 hover:bg-gray-300/70 dark:bg-gray-700/30 dark:text-gray-300 dark:hover:bg-gray-600/30 border border-gray-300/70 dark:border-gray-600/30"
            }`}
          >
            Count Up
          </button>
        </div>
      </div>
      <div>
        <label className="block text-slate-700 dark:text-white font-medium mb-2 text-sm">
          Counter Type
        </label>
        <div className="grid grid-cols-1 gap-2">
          <button
            onClick={() => setCounterType("time")}
            className={`p-2 rounded-lg font-medium transition-all text-sm backdrop-blur-sm ${
              counterType === "time"
                ? "bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30"
                : "bg-gray-200/70 text-slate-700 hover:bg-gray-300/70 dark:bg-gray-700/30 dark:text-gray-300 dark:hover:bg-gray-600/30 border border-gray-300/70 dark:border-gray-600/30"
            }`}
          >
            Time Counter
          </button>
          <button
            onClick={() => setCounterType("number")}
            className={`p-2 rounded-lg font-medium transition-all text-sm backdrop-blur-sm ${
              counterType === "number"
                ? "bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30"
                : "bg-gray-200/70 text-slate-700 hover:bg-gray-300/70 dark:bg-gray-700/30 dark:text-gray-300 dark:hover:bg-gray-600/30 border border-gray-300/70 dark:border-gray-600/30"
            }`}
          >
            Number Counter
          </button>
        </div>
      </div>
      {counterType === "number" && (
        <div className="space-y-4 p-3 bg-blue-500/5 dark:bg-blue-500/5 rounded-lg border border-blue-300/50 dark:border-blue-500/20">
          <div>
            <label className="block text-slate-700 dark:text-white font-medium mb-2 text-sm">
              Number Range
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-600 dark:text-gray-400 text-xs mb-1">
                  From
                </label>
                <input
                  type="number"
                  value={startNumber}
                  onChange={(e) =>
                    setStartNumber(parseInt(e.target.value) || 0)
                  }
                  className="w-full p-2 bg-white/80 dark:bg-gray-700/30 backdrop-blur-sm text-slate-900 dark:text-white rounded-lg border border-gray-300 dark:border-gray-600/30 focus:border-blue-500 dark:focus:border-blue-500/50 focus:outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-slate-600 dark:text-gray-400 text-xs mb-1">
                  To
                </label>
                <input
                  type="number"
                  value={endNumber}
                  onChange={(e) =>
                    setEndNumber(parseInt(e.target.value) || 100)
                  }
                  className="w-full p-2 bg-white/80 dark:bg-gray-700/30 backdrop-blur-sm text-slate-900 dark:text-white rounded-lg border border-gray-300 dark:border-gray-600/30 focus:border-blue-500 dark:focus:border-blue-500/50 focus:outline-none text-sm"
                />
              </div>
            </div>
            <div className="text-xs text-slate-600 dark:text-gray-400 mt-1">
              Total: {Math.abs(endNumber - startNumber) + 1} numbers
            </div>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-white font-medium mb-2 text-sm">
              Number Count Mode
            </label>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => setNumberCountMode("countup")}
                className={`p-2 rounded-lg font-medium transition-all text-sm backdrop-blur-sm ${
                  numberCountMode === "countup"
                    ? "bg-green-100 text-green-700 border-green-300 dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/30"
                    : "bg-gray-200/70 text-slate-700 hover:bg-gray-300/70 dark:bg-gray-700/30 dark:text-gray-300 dark:hover:bg-gray-600/30 border border-gray-300/70 dark:border-gray-600/30"
                }`}
              >
                Count Up ({startNumber} → {endNumber})
              </button>
              <button
                onClick={() => setNumberCountMode("countdown")}
                className={`p-2 rounded-lg font-medium transition-all text-sm backdrop-blur-sm ${
                  numberCountMode === "countdown"
                    ? "bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-500/20 dark:text-orange-400 dark:border-orange-500/30"
                    : "bg-gray-200/70 text-slate-700 hover:bg-gray-300/70 dark:bg-gray-700/30 dark:text-gray-300 dark:hover:bg-gray-600/30 border border-gray-300/70 dark:border-gray-600/30"
                }`}
              >
                Count Down ({endNumber} → {startNumber})
              </button>
            </div>
          </div>
        </div>
      )}
      <div>
        <label className="block text-slate-700 dark:text-white font-medium mb-2 text-sm">
          Speed
        </label>
        <select
          value={speed}
          onChange={(e) => setSpeed(parseFloat(e.target.value))}
          className="w-full p-2 bg-white/80 dark:bg-gray-700/30 backdrop-blur-sm text-slate-900 dark:text-white rounded-lg border border-gray-300 dark:border-gray-600/30 focus:border-blue-500 dark:focus:border-blue-500/50 focus:outline-none text-sm"
        >
          <option value="0.5">0.5x (Slow)</option>
          <option value="1">1x (Normal)</option>
          <option value="1.5">1.5x (Fast)</option>
          <option value="2">2x (Very Fast)</option>
        </select>
      </div>

      <div>
        <label className="flex items-center gap-2 text-slate-700 dark:text-white font-medium mb-2 text-sm">
          <input
            type="checkbox"
            checked={useCustomSpeed}
            onChange={(e) => setUseCustomSpeed(e.target.checked)}
            className="w-4 h-4 text-blue-500 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:text-blue-600 dark:bg-gray-700/50 dark:border-gray-600/50 dark:focus:ring-blue-600"
          />
          Custom Speed
        </label>
        {useCustomSpeed && (
          <div className="space-y-2">
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={customSpeed}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                if (!isNaN(value) && value > 0) {
                  setCustomSpeed(value);
                }
              }}
              placeholder="Enter speed (e.g., 0.5, 1.5, 10, 100)"
              className="w-full p-2 bg-white/80 dark:bg-gray-700/30 backdrop-blur-sm text-slate-900 dark:text-white rounded-lg border border-gray-300 dark:border-gray-600/30 focus:border-blue-500 dark:focus:border-blue-500/50 focus:outline-none text-sm"
            />
            <div className="text-xs text-slate-600 dark:text-gray-400">
              Current:{" "}
              <span className="text-blue-600 dark:text-blue-400 font-medium">
                {customSpeed}x
              </span>
              {customSpeed < 1 && " (Slow motion)"}
              {customSpeed > 5 && " (Ultra fast)"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsTab;
