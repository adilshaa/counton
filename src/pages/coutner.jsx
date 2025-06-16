import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Play,
  Pause,
  Square,
  Download,
  Settings,
  Palette,
  Film,
  Zap,
} from "lucide-react";

const TimeCounterVideoApp = () => {
  const [duration, setDuration] = useState(60);
  const [countMode, setCountMode] = useState("countdown");
  const [speed, setSpeed] = useState(1);
  const [customSpeed, setCustomSpeed] = useState(1.0);
  const [useCustomSpeed, setUseCustomSpeed] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [isComplete, setIsComplete] = useState(false);

  // Styling options
  const [background, setBackground] = useState("black");
  const [counterStyle, setCounterStyle] = useState("fade");
  const [activeTab, setActiveTab] = useState("settings");
  const [theme, setTheme] = useState("dark");

  const [counterType, setCounterType] = useState("time"); // "time" or "number"
  const [startNumber, setStartNumber] = useState(1);
  const [endNumber, setEndNumber] = useState(100);
  const [numberCountMode, setNumberCountMode] = useState("countup"); // "countup" or "countdown"

  const canvasRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const intervalRef = useRef(null);
  const streamRef = useRef(null);
  const animationPhase = useRef(0);
  const previousTime = useRef(-1);

  const formatTime = (seconds) => {
    const totalSeconds = Math.max(0, Math.floor(seconds));
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return {
      minutes: mins.toString().padStart(2, "0"),
      seconds: secs.toString().padStart(2, "0"),
      formatted: `${mins.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`,
    };
  };

  const formatNumber = (num) => {
    const displayNum = Math.max(0, Math.floor(num));
    return {
      number: displayNum,
      formatted: displayNum.toString().padStart(3, "0"),
    };
  };

  const getDigitTransition = (currentDigit, previousDigit, progress) => {
    if (previousDigit === null || currentDigit === previousDigit) {
      return { digit: currentDigit, offset: 0, alpha: 1 };
    }

    return {
      current: { digit: currentDigit, offset: progress * 60, alpha: progress },
      previous: {
        digit: previousDigit,
        offset: (progress - 1) * 60,
        alpha: 1 - progress,
      },
    };
  };

  const drawIndividualDigit = (
    ctx,
    digit,
    x,
    y,
    fontSize,
    transition = null
  ) => {
    ctx.save();

    if (transition && transition.previous) {
      // Draw previous digit
      ctx.globalAlpha = transition.previous.alpha;
      ctx.fillText(
        transition.previous.digit,
        x,
        y + transition.previous.offset
      );

      // Draw current digit
      ctx.globalAlpha = transition.current.alpha;
      ctx.fillText(transition.current.digit, x, y + transition.current.offset);
    } else {
      ctx.fillText(digit, x, y);
    }

    ctx.restore();
  };

  const drawCounterWithStyle = (
    ctx,
    timeData,
    width,
    height,
    progress,
    previousTimeData
  ) => {
    const fontSize = 180;
    ctx.font = `bold ${fontSize}px Inter, system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const centerX = width / 2;
    const centerY = height / 2;

    // Get individual digits
    const minTens = timeData.minutes[0];
    const minOnes = timeData.minutes[1];
    const secTens = timeData.seconds[0];
    const secOnes = timeData.seconds[1];

    // Get previous digits for transition
    const prevMinTens = previousTimeData ? previousTimeData.minutes[0] : null;
    const prevMinOnes = previousTimeData ? previousTimeData.minutes[1] : null;
    const prevSecTens = previousTimeData ? previousTimeData.seconds[0] : null;
    const prevSecOnes = previousTimeData ? previousTimeData.seconds[1] : null;

    // Calculate positions
    const digitWidth = ctx.measureText("0").width;
    const colonWidth = ctx.measureText(":").width;
    const totalWidth = digitWidth * 4 + colonWidth;

    const minTensX = centerX - totalWidth / 2 + digitWidth / 2;
    const minOnesX = minTensX + digitWidth;
    const colonX = minOnesX + digitWidth / 2 + colonWidth / 2;
    const secTensX = colonX + colonWidth / 2 + digitWidth / 2;
    const secOnesX = secTensX + digitWidth;

    // Calculate transition progress for smooth animation
    const transitionProgress = (animationPhase.current % 30) / 30;

    ctx.save();

    if (counterStyle === "fade") {
      const alpha = 0.3 + (Math.sin(animationPhase.current * 0.1) + 1) * 0.35;
      ctx.globalAlpha = alpha;
    } else if (counterStyle === "curtain") {
      // New curtain effect - visibility from top and bottom
      const curtainPhase = (animationPhase.current % 120) / 120;
      const revealHeight =
        Math.sin(curtainPhase * Math.PI) * fontSize + fontSize / 4;

      // Create clipping path for curtain effect
      ctx.save();
      ctx.beginPath();
      ctx.rect(
        secTensX - digitWidth / 2,
        centerY - revealHeight / 2,
        digitWidth,
        revealHeight
      );
      ctx.clip();
      drawIndividualDigit(ctx, secTens, secTensX, centerY, fontSize);
      ctx.restore();

      ctx.save();
      ctx.beginPath();
      ctx.rect(
        secOnesX - digitWidth / 2,
        centerY - revealHeight / 2,
        digitWidth,
        revealHeight
      );
      ctx.clip();
      drawIndividualDigit(ctx, secOnes, secOnesX, centerY, fontSize);
      ctx.restore();

      // Draw minutes normally
      drawIndividualDigit(ctx, minTens, minTensX, centerY, fontSize);
      drawIndividualDigit(ctx, minOnes, minOnesX, centerY, fontSize);
      ctx.fillText(":", colonX, centerY);

      ctx.restore();
      animationPhase.current += 1;
      return;
    }

    // Draw minutes (usually static, but can change)
    if (counterStyle === "scroll" && prevMinTens && minTens !== prevMinTens) {
      const transition = getDigitTransition(
        minTens,
        prevMinTens,
        transitionProgress
      );
      drawIndividualDigit(
        ctx,
        minTens,
        minTensX,
        centerY,
        fontSize,
        transition
      );
    } else {
      drawIndividualDigit(ctx, minTens, minTensX, centerY, fontSize);
    }

    if (counterStyle === "scroll" && prevMinOnes && minOnes !== prevMinOnes) {
      const transition = getDigitTransition(
        minOnes,
        prevMinOnes,
        transitionProgress
      );
      drawIndividualDigit(
        ctx,
        minOnes,
        minOnesX,
        centerY,
        fontSize,
        transition
      );
    } else {
      drawIndividualDigit(ctx, minOnes, minOnesX, centerY, fontSize);
    }

    // Draw colon
    ctx.fillText(":", colonX, centerY);

    // Draw seconds with individual digit animation
    if (counterStyle === "scroll") {
      // Animate tens digit of seconds
      if (prevSecTens && secTens !== prevSecTens) {
        const transition = getDigitTransition(
          secTens,
          prevSecTens,
          transitionProgress
        );
        drawIndividualDigit(
          ctx,
          secTens,
          secTensX,
          centerY,
          fontSize,
          transition
        );
      } else {
        drawIndividualDigit(ctx, secTens, secTensX, centerY, fontSize);
      }

      // Animate ones digit of seconds (this changes most frequently)
      if (prevSecOnes && secOnes !== prevSecOnes) {
        const transition = getDigitTransition(
          secOnes,
          prevSecOnes,
          transitionProgress
        );
        drawIndividualDigit(
          ctx,
          secOnes,
          secOnesX,
          centerY,
          fontSize,
          transition
        );
      } else {
        drawIndividualDigit(ctx, secOnes, secOnesX, centerY, fontSize);
      }
    } else if (counterStyle === "roll") {
      // Rolling effect for individual digits
      const rollPhase = (animationPhase.current % 30) / 30;

      // Roll tens digit when it changes
      if (prevSecTens && secTens !== prevSecTens && rollPhase < 0.5) {
        const scaleY = 1 - rollPhase * 2;
        ctx.save();
        ctx.translate(secTensX, centerY);
        ctx.scale(1, scaleY);
        ctx.fillText(prevSecTens, 0, 0);
        ctx.restore();
      } else if (prevSecTens && secTens !== prevSecTens && rollPhase >= 0.5) {
        const scaleY = (rollPhase - 0.5) * 2;
        ctx.save();
        ctx.translate(secTensX, centerY);
        ctx.scale(1, scaleY);
        ctx.fillText(secTens, 0, 0);
        ctx.restore();
      } else {
        drawIndividualDigit(ctx, secTens, secTensX, centerY, fontSize);
      }

      // Roll ones digit
      if (prevSecOnes && secOnes !== prevSecOnes && rollPhase < 0.5) {
        const scaleY = 1 - rollPhase * 2;
        ctx.save();
        ctx.translate(secOnesX, centerY);
        ctx.scale(1, scaleY);
        ctx.fillText(prevSecOnes, 0, 0);
        ctx.restore();
      } else if (prevSecOnes && secOnes !== prevSecOnes && rollPhase >= 0.5) {
        const scaleY = (rollPhase - 0.5) * 2;
        ctx.save();
        ctx.translate(secOnesX, centerY);
        ctx.scale(1, scaleY);
        ctx.fillText(secOnes, 0, 0);
        ctx.restore();
      } else {
        drawIndividualDigit(ctx, secOnes, secOnesX, centerY, fontSize);
      }
    } else if (counterStyle === "fold") {
      // Folding effect for individual digits
      const scale =
        0.8 + Math.abs(Math.sin(animationPhase.current * 0.05)) * 0.4;

      ctx.save();
      ctx.translate(secTensX, centerY);
      ctx.scale(scale, 1);
      ctx.fillText(secTens, 0, 0);
      ctx.restore();

      ctx.save();
      ctx.translate(secOnesX, centerY);
      ctx.scale(scale, 1);
      ctx.fillText(secOnes, 0, 0);
      ctx.restore();
    } else if (counterStyle === "slide") {
      // Slide effect with top/bottom reveal animation
      const slidePhase = (animationPhase.current % 60) / 60;
      const clipHeight = Math.sin(slidePhase * Math.PI * 2) * 30 + 30;

      // Create clipping mask for seconds digits
      ctx.save();

      // Clip from top and bottom
      ctx.beginPath();
      ctx.rect(
        secTensX - digitWidth / 2,
        centerY - clipHeight / 2,
        digitWidth,
        clipHeight
      );
      ctx.clip();
      drawIndividualDigit(ctx, secTens, secTensX, centerY, fontSize);
      ctx.restore();

      ctx.save();
      ctx.beginPath();
      ctx.rect(
        secOnesX - digitWidth / 2,
        centerY - clipHeight / 2,
        digitWidth,
        clipHeight
      );
      ctx.clip();
      drawIndividualDigit(ctx, secOnes, secOnesX, centerY, fontSize);
      ctx.restore();

      // Add subtle glow effect
      ctx.save();
      ctx.shadowColor = background === "white" ? "#000000" : "#ffffff";
      ctx.shadowBlur = 10;
      ctx.globalAlpha = 0.3;
      drawIndividualDigit(ctx, secTens, secTensX, centerY, fontSize);
      drawIndividualDigit(ctx, secOnes, secOnesX, centerY, fontSize);
      ctx.restore();
    } else {
      // Default - draw normally
      drawIndividualDigit(ctx, secTens, secTensX, centerY, fontSize);
      drawIndividualDigit(ctx, secOnes, secOnesX, centerY, fontSize);
    }

    ctx.restore();
    animationPhase.current += 1;
  };

  const drawNumberCounter = (
    ctx,
    numberData,
    width,
    height,
    progress,
    previousNumberData
  ) => {
    const fontSize = 240;
    ctx.font = `bold ${fontSize}px Inter, system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const centerX = width / 2;
    const centerY = height / 2;

    const currentNumber = numberData.number.toString();
    const previousNumber = previousNumberData
      ? previousNumberData.number.toString()
      : null;

    ctx.save();

    if (counterStyle === "fade") {
      const alpha = 0.3 + (Math.sin(animationPhase.current * 0.1) + 1) * 0.35;
      ctx.globalAlpha = alpha;
      ctx.fillText(currentNumber, centerX, centerY);
    } else if (
      counterStyle === "scroll" &&
      previousNumber &&
      currentNumber !== previousNumber
    ) {
      const transitionProgress = (animationPhase.current % 30) / 30;

      // Draw previous number sliding up
      ctx.globalAlpha = 1 - transitionProgress;
      ctx.fillText(
        previousNumber,
        centerX,
        centerY - transitionProgress * fontSize
      );

      // Draw current number sliding in
      ctx.globalAlpha = transitionProgress;
      ctx.fillText(
        currentNumber,
        centerX,
        centerY + (1 - transitionProgress) * fontSize
      );
    } else if (
      counterStyle === "roll" &&
      previousNumber &&
      currentNumber !== previousNumber
    ) {
      const rollPhase = (animationPhase.current % 30) / 30;

      if (rollPhase < 0.5) {
        const scaleY = 1 - rollPhase * 2;
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.scale(1, scaleY);
        ctx.fillText(previousNumber, 0, 0);
        ctx.restore();
      } else {
        const scaleY = (rollPhase - 0.5) * 2;
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.scale(1, scaleY);
        ctx.fillText(currentNumber, 0, 0);
        ctx.restore();
      }
    } else if (counterStyle === "fold") {
      const scale =
        0.8 + Math.abs(Math.sin(animationPhase.current * 0.05)) * 0.4;
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.scale(scale, 1);
      ctx.fillText(currentNumber, 0, 0);
      ctx.restore();

      // Add glow effect
      ctx.save();
      ctx.shadowColor = background === "white" ? "#000000" : "#ffffff";
      ctx.shadowBlur = 20;
      ctx.globalAlpha = 0.3;
      ctx.fillText(currentNumber, centerX, centerY);
      ctx.restore();
    } else if (counterStyle === "slide") {
      // Slide effect with clipping
      const slidePhase = (animationPhase.current % 60) / 60;
      const clipHeight = Math.sin(slidePhase * Math.PI * 2) * 60 + 60;

      ctx.save();
      ctx.beginPath();
      ctx.rect(
        centerX - fontSize / 2,
        centerY - clipHeight / 2,
        fontSize,
        clipHeight
      );
      ctx.clip();
      ctx.fillText(currentNumber, centerX, centerY);
      ctx.restore();

      // Add glow effect
      ctx.save();
      ctx.shadowColor = background === "white" ? "#000000" : "#ffffff";
      ctx.shadowBlur = 15;
      ctx.globalAlpha = 0.2;
      ctx.fillText(currentNumber, centerX, centerY);
      ctx.restore();
    } else {
      // Default - draw normally
      ctx.fillText(currentNumber, centerX, centerY);
    }

    ctx.restore();
    animationPhase.current += 1;
  };

  const drawTimer = useCallback(
    (time) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      const width = canvas.width;
      const height = canvas.height;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Set background
      if (background === "black") {
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, width, height);
      } else if (background === "white") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);
      }

      // Set text color based on background
      if (background === "white") {
        ctx.fillStyle = "#000000";
      } else {
        ctx.fillStyle = "#ffffff";
      }

      if (counterType === "time") {
        // Time counter logic
        let displayTime;
        if (countMode === "countdown") {
          displayTime = Math.max(0, duration - time);
        } else {
          displayTime = Math.min(time, duration);
        }

        const currentTimeData = formatTime(displayTime);
        const previousTimeData =
          previousTime.current >= 0
            ? formatTime(
                countMode === "countdown"
                  ? Math.max(0, duration - previousTime.current)
                  : Math.min(previousTime.current, duration)
              )
            : null;

        const progress = time / duration;

        drawCounterWithStyle(
          ctx,
          currentTimeData,
          width,
          height,
          progress,
          previousTimeData
        );
      } else {
        // Number counter logic
        const totalNumbers = Math.abs(endNumber - startNumber) + 1;
        const progress = Math.min(time / duration, 1);

        let displayNumber;
        if (numberCountMode === "countup") {
          displayNumber = startNumber + Math.floor(progress * totalNumbers);
          displayNumber = Math.min(displayNumber, endNumber);
        } else {
          displayNumber = endNumber - Math.floor(progress * totalNumbers);
          displayNumber = Math.max(displayNumber, startNumber);
        }

        const currentNumberData = formatNumber(displayNumber);
        const previousNumberData =
          previousTime.current >= 0
            ? formatNumber(
                numberCountMode === "countup"
                  ? Math.min(
                      startNumber +
                        Math.floor(
                          (previousTime.current / duration) * totalNumbers
                        ),
                      endNumber
                    )
                  : Math.max(
                      endNumber -
                        Math.floor(
                          (previousTime.current / duration) * totalNumbers
                        ),
                      startNumber
                    )
              )
            : null;

        drawNumberCounter(
          ctx,
          currentNumberData,
          width,
          height,
          progress,
          previousNumberData
        );
      }

      previousTime.current = time;
    },
    [
      duration,
      countMode,
      background,
      counterStyle,
      counterType,
      startNumber,
      endNumber,
      numberCountMode,
    ]
  );

  const startRecording = async () => {
    try {
      const canvas = canvasRef.current;
      if (!canvas) {
        alert("Canvas not ready");
        return;
      }

      setCurrentTime(0);
      setIsComplete(false);
      setRecordedChunks([]);
      animationPhase.current = 0;
      previousTime.current = -1;

      const stream = canvas.captureStream(60);
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "video/webm",
      });

      mediaRecorderRef.current = mediaRecorder;

      const chunks = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        setRecordedChunks(chunks);
        setIsComplete(true);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setIsPaused(false);

      startTimer();
    } catch (error) {
      console.error("Error starting recording:", error);
      alert("Recording failed: " + error.message);
    }
  };

  const startTimer = () => {
    const startTime = Date.now();
    const currentSpeed = useCustomSpeed ? customSpeed : speed;

    intervalRef.current = setInterval(() => {
      if (isPaused) return;

      const elapsed = ((Date.now() - startTime) / 1000) * currentSpeed;
      setCurrentTime(elapsed);

      if (elapsed >= duration) {
        stopRecording();
      }
    }, 1000 / 60);
  };

  const pauseRecording = () => {
    setIsPaused(!isPaused);
  };

  const stopRecording = () => {
    setIsRecording(false);
    setIsPaused(false);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
  };

  const downloadVideo = () => {
    if (recordedChunks.length === 0) {
      alert("No video recorded yet!");
      return;
    }

    try {
      const blob = new Blob(recordedChunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      const finalSpeed = useCustomSpeed ? customSpeed : speed;
      const typeString =
        counterType === "number"
          ? `numbers-${startNumber}-to-${endNumber}`
          : `timer-${countMode}-${duration}s`;

      a.download = `${typeString}-${finalSpeed}x-${background}-${counterStyle}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (error) {
      console.error("Download error:", error);
      alert("Download failed: " + error.message);
    }
  };

  useEffect(() => {
    if (!isRecording) {
      drawTimer(0);
    }
  }, [
    duration,
    countMode,
    background,
    counterStyle,
    counterType,
    startNumber,
    endNumber,
    numberCountMode,
    drawTimer,
    isRecording,
  ]);

  useEffect(() => {
    if (isRecording && !isPaused) {
      drawTimer(currentTime);
    }
  }, [currentTime, isRecording, isPaused, drawTimer]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const themeClasses = {
    dark: {
      bg: "bg-gradient-to-br from-gray-900 via-slate-900 to-black",
      cardBg: "bg-gray-900/40 backdrop-blur-xl border-gray-700/30",
      text: "text-white",
      textSecondary: "text-gray-300",
      textMuted: "text-gray-400",
    },
    light: {
      bg: "bg-gradient-to-br from-white via-gray-50 to-gray-100",
      cardBg: "bg-white/40 backdrop-blur-xl border-gray-200/30",
      text: "text-gray-900",
      textSecondary: "text-gray-700",
      textMuted: "text-gray-500",
    },
  };

  const currentTheme = themeClasses[theme];
  // Replace the return statement and main container:

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black p-0 transition-colors duration-300">
      <div className="w-full h-screen flex">
        {/* Left Sidebar - Controls Panel */}
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
                <div className="space-y-4">
                  <div>
                    <label className="block text-white font-medium mb-2 text-sm">
                      Duration
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="5"
                        max="300"
                        value={duration}
                        onChange={(e) => setDuration(parseInt(e.target.value))}
                        className="flex-1 h-2 bg-gray-700/50 backdrop-blur-sm rounded-lg appearance-none cursor-pointer slider"
                      />
                      <span className="text-blue-400 font-bold text-sm min-w-[50px] bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20">
                        {duration}s
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2 text-sm">
                      Count Mode
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      <button
                        onClick={() => setCountMode("countdown")}
                        className={`p-2 rounded-lg font-medium transition-all text-sm backdrop-blur-sm ${
                          countMode === "countdown"
                            ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                            : "bg-gray-700/30 text-gray-300 hover:bg-gray-600/30 border border-gray-600/30"
                        }`}
                      >
                        Countdown
                      </button>
                      <button
                        onClick={() => setCountMode("countup")}
                        className={`p-2 rounded-lg font-medium transition-all text-sm backdrop-blur-sm ${
                          countMode === "countup"
                            ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                            : "bg-gray-700/30 text-gray-300 hover:bg-gray-600/30 border border-gray-600/30"
                        }`}
                      >
                        Count Up
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2 text-sm">
                      Counter Type
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      <button
                        onClick={() => setCounterType("time")}
                        className={`p-2 rounded-lg font-medium transition-all text-sm backdrop-blur-sm ${
                          counterType === "time"
                            ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                            : "bg-gray-700/30 text-gray-300 hover:bg-gray-600/30 border border-gray-600/30"
                        }`}
                      >
                        Time Counter
                      </button>
                      <button
                        onClick={() => setCounterType("number")}
                        className={`p-2 rounded-lg font-medium transition-all text-sm backdrop-blur-sm ${
                          counterType === "number"
                            ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                            : "bg-gray-700/30 text-gray-300 hover:bg-gray-600/30 border border-gray-600/30"
                        }`}
                      >
                        Number Counter
                      </button>
                    </div>
                  </div>
                  {counterType === "number" && (
                    <div className="space-y-4 p-3 bg-blue-500/5 rounded-lg border border-blue-500/20">
                      <div>
                        <label className="block text-white font-medium mb-2 text-sm">
                          Number Range
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-gray-400 text-xs mb-1">
                              From
                            </label>
                            <input
                              type="number"
                              value={startNumber}
                              onChange={(e) =>
                                setStartNumber(parseInt(e.target.value) || 0)
                              }
                              className="w-full p-2 bg-gray-700/30 backdrop-blur-sm text-white rounded-lg border border-gray-600/30 focus:border-blue-500/50 focus:outline-none text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-400 text-xs mb-1">
                              To
                            </label>
                            <input
                              type="number"
                              value={endNumber}
                              onChange={(e) =>
                                setEndNumber(parseInt(e.target.value) || 100)
                              }
                              className="w-full p-2 bg-gray-700/30 backdrop-blur-sm text-white rounded-lg border border-gray-600/30 focus:border-blue-500/50 focus:outline-none text-sm"
                            />
                          </div>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          Total: {Math.abs(endNumber - startNumber) + 1} numbers
                        </div>
                      </div>

                      <div>
                        <label className="block text-white font-medium mb-2 text-sm">
                          Number Count Mode
                        </label>
                        <div className="grid grid-cols-1 gap-2">
                          <button
                            onClick={() => setNumberCountMode("countup")}
                            className={`p-2 rounded-lg font-medium transition-all text-sm backdrop-blur-sm ${
                              numberCountMode === "countup"
                                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                : "bg-gray-700/30 text-gray-300 hover:bg-gray-600/30 border border-gray-600/30"
                            }`}
                          >
                            Count Up ({startNumber} → {endNumber})
                          </button>
                          <button
                            onClick={() => setNumberCountMode("countdown")}
                            className={`p-2 rounded-lg font-medium transition-all text-sm backdrop-blur-sm ${
                              numberCountMode === "countdown"
                                ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                                : "bg-gray-700/30 text-gray-300 hover:bg-gray-600/30 border border-gray-600/30"
                            }`}
                          >
                            Count Down ({endNumber} → {startNumber})
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="block text-white font-medium mb-2 text-sm">
                      Speed
                    </label>
                    <select
                      value={speed}
                      onChange={(e) => setSpeed(parseFloat(e.target.value))}
                      className="w-full p-2 bg-gray-700/30 backdrop-blur-sm text-white rounded-lg border border-gray-600/30 focus:border-blue-500/50 focus:outline-none text-sm"
                    >
                      <option value="0.5">0.5x (Slow)</option>
                      <option value="1">1x (Normal)</option>
                      <option value="1.5">1.5x (Fast)</option>
                      <option value="2">2x (Very Fast)</option>
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-white font-medium mb-2 text-sm">
                      <input
                        type="checkbox"
                        checked={useCustomSpeed}
                        onChange={(e) => setUseCustomSpeed(e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-700/50 border-gray-600/50 rounded focus:ring-blue-500"
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
                          className="w-full p-2 bg-gray-700/30 backdrop-blur-sm text-white rounded-lg border border-gray-600/30 focus:border-blue-500/50 focus:outline-none text-sm"
                        />
                        <div className="text-xs text-gray-400">
                          Current:{" "}
                          <span className="text-blue-400 font-medium">
                            {customSpeed}x
                          </span>
                          {customSpeed < 1 && " (Slow motion)"}
                          {customSpeed > 5 && " (Ultra fast)"}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Style Tab */}
              {activeTab === "style" && (
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
              )}

              {/* Effects Tab */}
              {activeTab === "effects" && (
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
              )}
            </div>
          </div>
        </div>

        {/* Right Side - Video Section */}
        <div className="flex-1 h-full flex flex-col">
          {/* Video Preview */}
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

          {/* Bottom Control Bar */}
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
        </div>
      </div>

      {/* Enhanced Glassmorphism Styles */}
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

export default TimeCounterVideoApp;
