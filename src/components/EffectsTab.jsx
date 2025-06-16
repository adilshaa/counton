import React from 'react';

const EffectsTab = ({ counterStyle, setCounterStyle }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-white font-medium mb-2 text-sm">
          Counter Animation
        </label>
        <div className="grid grid-cols-1 gap-2">
          {[
            { value: "fade", name: "Fade", desc: "Smooth fading" },
            {
              value: "scroll",
              name: "Scroll",
              desc: "Vertical slide",
            },
            { value: "fold", name: "Fold", desc: "Flip animation" },
            { value: "roll", name: "Roll", desc: "Odometer style" },
            {
              value: "slide",
              name: "Slide",
              desc: "Top/Bottom reveal",
            },
            { value: "swap", name: "Swap Seconds", desc: "Seconds slide, minutes static" },
            { value: "none", name: "None", desc: "Static display" },
          ].map((style) => (
            <button
              key={style.value}
              onClick={() => setCounterStyle(style.value)}
              className={`p-2 rounded-lg border text-left transition-all backdrop-blur-sm ${
                counterStyle === style.value
                  ? "border-pink-500/50 bg-pink-500/10"
                  : "border-gray-600/30 bg-gray-700/20 hover:border-gray-500/50"
              }`}
            >
              <div className="text-white font-medium text-xs">
                {style.name}
              </div>
              <div className="text-gray-400 text-xs">
                {style.desc}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EffectsTab;
