import React, { useState, useRef, useEffect, useCallback } from "react";
import { Film } from "lucide-react"; // Only Film is potentially used if any top-level logic needs it. Others are in child components.
import ControlsPanel from '../components/ControlsPanel';
import VideoPreview from '../components/VideoPreview';
import ActionButtons from '../components/ActionButtons';

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
      // For no transition, current text is immediately visible
      return { current: { text: currentDigit, offset: 0, alpha: 1 }, previous: null };
    }

    return {
      current: { text: currentDigit, offset: progress * 60, alpha: progress },
      previous: {
        text: previousDigit,
        offset: (progress - 1) * 60,
        alpha: 1 - progress,
      },
    };
  };

  const getSlideTransition = (currentText, previousText, progress, fontSize) => {
    if (previousText === null || currentText === previousText) {
      return { current: { text: currentText, offset: 0, alpha: 1 }, previous: null };
    }
    return {
      current: {
        text: currentText,
        offset: (1 - progress) * -fontSize, // Starts from -fontSize (top) and moves to 0
        alpha: 1
      },
      previous: {
        text: previousText,
        offset: progress * fontSize, // Starts at 0 and moves to fontSize (bottom)
        alpha: 1
      }
    };
  };

  const getSlideAndFadeInTransition = (currentText, previousText, progress, fontSize) => {
    if (previousText === null || currentText === previousText) {
      // No transition needed or first draw
      return {
        current: { text: currentText, offset: 0, alpha: 1 },
        previous: null
      };
    }
    return {
      current: { // Incoming digit
        text: currentText,
        offset: (1 - progress) * (fontSize / 2), // Slides from bottom offset by half font size
        alpha: progress // Fades in
      },
      previous: { // Outgoing digit
        text: previousText,
        offset: progress * (-fontSize / 2), // Slides to top offset by half font size
        alpha: 1 - progress // Fades out
      }
    };
  };

  const drawTextWithTransition = (
    ctx,
    textValue,
    x,
    y,
    fontSize, // Ensure fontSize is passed if needed by transitions, though not directly used by drawText itself if textValue is final.
    transition = null
  ) => {
    // Note: fontSize is not directly used in fillText here, but passed for transition calculations.
    // The actual font size is set on ctx.font before calling this function.
    if (transition && transition.previous) {
      ctx.save();
      ctx.globalAlpha = transition.previous.alpha;
      ctx.fillText(transition.previous.text, x, y + transition.previous.offset);
      ctx.restore();
    }

    if (transition && transition.current) {
      ctx.save();
      ctx.globalAlpha = transition.current.alpha;
      ctx.fillText(transition.current.text, x, y + transition.current.offset);
      ctx.restore();
    } else if (!transition) {
      // No transition object, draw textValue directly.
      // Assumes ctx.globalAlpha has been set appropriately by the calling effect (e.g., fade).
      ctx.fillText(textValue, x, y);
    }
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
      drawTextWithTransition(ctx, secTens, secTensX, centerY, fontSize, null);
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
      drawTextWithTransition(ctx, secOnes, secOnesX, centerY, fontSize, null);
      ctx.restore();

      // Draw minutes normally
      drawTextWithTransition(ctx, minTens, minTensX, centerY, fontSize, null);
      drawTextWithTransition(ctx, minOnes, minOnesX, centerY, fontSize, null);
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
      drawTextWithTransition(ctx, minTens, minTensX, centerY, fontSize, transition);
    } else if (counterStyle !== "slide") { // For slide, handled below
      drawTextWithTransition(ctx, minTens, minTensX, centerY, fontSize, null);
    }

    if (counterStyle === "scroll" && prevMinOnes && minOnes !== prevMinOnes) {
      const transition = getDigitTransition(
        minOnes,
        prevMinOnes,
        transitionProgress
      );
      drawTextWithTransition(ctx, minOnes, minOnesX, centerY, fontSize, transition);
    } else if (counterStyle !== "slide") { // For slide, handled below
      drawTextWithTransition(ctx, minOnes, minOnesX, centerY, fontSize, null);
    }

    if (counterStyle !== "slide") { // Colon for non-slide effects
        ctx.fillText(":", colonX, centerY);
    }


    // Draw seconds with individual digit animation
    if (counterStyle === "scroll") {
      // Animate tens digit of seconds
      if (prevSecTens && secTens !== prevSecTens) {
        const transition = getDigitTransition(
          secTens,
          prevSecTens,
          transitionProgress
        );
        drawTextWithTransition(ctx, secTens, secTensX, centerY, fontSize, transition);
      } else {
        drawTextWithTransition(ctx, secTens, secTensX, centerY, fontSize, null);
      }

      // Animate ones digit of seconds (this changes most frequently)
      if (prevSecOnes && secOnes !== prevSecOnes) {
        const transition = getDigitTransition(
          secOnes,
          prevSecOnes,
          transitionProgress
        );
        drawTextWithTransition(ctx, secOnes, secOnesX, centerY, fontSize, transition);
      } else {
        drawTextWithTransition(ctx, secOnes, secOnesX, centerY, fontSize, null);
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
        drawTextWithTransition(ctx, secTens, secTensX, centerY, fontSize, null);
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
        drawTextWithTransition(ctx, secOnes, secOnesX, centerY, fontSize, null);
      }
    } else if (counterStyle === "fold") {
      // Folding effect for individual digits
      const scale =
        0.8 + Math.abs(Math.sin(animationPhase.current * 0.05)) * 0.4;

      ctx.save();
      ctx.translate(secTensX, centerY);
      ctx.scale(scale, 1);
      drawTextWithTransition(ctx, secTens, 0, 0, fontSize, null); // Draw at (0,0) due to translate
      ctx.restore();

      ctx.save();
      ctx.translate(secOnesX, centerY);
      ctx.scale(scale, 1);
      drawTextWithTransition(ctx, secOnes, 0, 0, fontSize, null); // Draw at (0,0) due to translate
      ctx.restore();
    } else if (counterStyle === "slide") {
      const slideProgress = (animationPhase.current % 15) / 15;

      const minTensTransition = getSlideTransition(minTens, prevMinTens, slideProgress, fontSize);
      drawTextWithTransition(ctx, minTens, minTensX, centerY, fontSize, minTensTransition);

      const minOnesTransition = getSlideTransition(minOnes, prevMinOnes, slideProgress, fontSize);
      drawTextWithTransition(ctx, minOnes, minOnesX, centerY, fontSize, minOnesTransition);

      // For slide, colon might also slide or just appear. Simple fillText for now.
      // To make it slide with digits, it would need its own transition.
      ctx.fillText(":", colonX, centerY);


      const secTensTransition = getSlideTransition(secTens, prevSecTens, slideProgress, fontSize);
      drawTextWithTransition(ctx, secTens, secTensX, centerY, fontSize, secTensTransition);

      const secOnesTransition = getSlideTransition(secOnes, prevSecOnes, slideProgress, fontSize);
      drawTextWithTransition(ctx, secOnes, secOnesX, centerY, fontSize, secOnesTransition);

    } else if (counterStyle === "swap") {
      // Draw minutes statically
      drawTextWithTransition(ctx, minTens, minTensX, centerY, fontSize, null);
      drawTextWithTransition(ctx, minOnes, minOnesX, centerY, fontSize, null);
      ctx.fillText(":", colonX, centerY);

      // Animate seconds with roll transition
      const rollPhase = (animationPhase.current % 30) / 30;

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
        drawTextWithTransition(ctx, secTens, secTensX, centerY, fontSize, null);
      }

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
        drawTextWithTransition(ctx, secOnes, secOnesX, centerY, fontSize, null);
      }

    } else { // Includes "fade" (handled by globalAlpha at start) and "none"
      drawTextWithTransition(ctx, minTens, minTensX, centerY, fontSize, null);
      drawTextWithTransition(ctx, minOnes, minOnesX, centerY, fontSize, null);
      ctx.fillText(":", colonX, centerY);
      drawTextWithTransition(ctx, secTens, secTensX, centerY, fontSize, null);
      drawTextWithTransition(ctx, secOnes, secOnesX, centerY, fontSize, null);
    }

    if (counterStyle === "fade") { // Reset alpha if set by fade
        ctx.globalAlpha = 1.0;
    }
    ctx.restore(); // This is the main restore for drawCounterWithStyle
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
      drawTextWithTransition(ctx, currentNumber, centerX, centerY, fontSize, null);
      ctx.globalAlpha = 1.0; // Reset alpha
    } else if (
      counterStyle === "scroll" &&
      previousNumber &&
      currentNumber !== previousNumber
    ) {
      const transitionProgress = (animationPhase.current % 30) / 30; // scroll uses 30 frames
      const transition = getDigitTransition(currentNumber, previousNumber, transitionProgress);
      drawTextWithTransition(ctx, currentNumber, centerX, centerY, fontSize, transition);
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
        drawTextWithTransition(ctx, previousNumber, 0, 0, fontSize, null);
        ctx.restore();
      } else {
        const scaleY = (rollPhase - 0.5) * 2;
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.scale(1, scaleY);
        drawTextWithTransition(ctx, currentNumber, 0, 0, fontSize, null);
        ctx.restore();
      }
    } else if (counterStyle === "fold") {
      const scale =
        0.8 + Math.abs(Math.sin(animationPhase.current * 0.05)) * 0.4;
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.scale(scale, 1);
      drawTextWithTransition(ctx, currentNumber, 0, 0, fontSize, null);
      ctx.restore();

      // Add glow effect
      ctx.save();
      ctx.shadowColor = background === "white" ? "#000000" : "#ffffff";
      ctx.shadowBlur = 20;
      ctx.globalAlpha = 0.3;
      drawTextWithTransition(ctx, currentNumber, centerX, centerY, fontSize, null); // Draw with glow
      ctx.restore();
    } else if (counterStyle === "slide") {
      const slideProgress = (animationPhase.current % 15) / 15; // slide uses 15 frames
      const transition = getSlideTransition(currentNumber, previousNumber, slideProgress, fontSize);
      drawTextWithTransition(ctx, currentNumber, centerX, centerY, fontSize, transition);
    } else {
      // Default - draw normally (includes "none")
      drawTextWithTransition(ctx, currentNumber, centerX, centerY, fontSize, null);
    }

    ctx.restore(); // This is the main restore for drawNumberCounter
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
        <ControlsPanel
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          duration={duration}
          setDuration={setDuration}
          countMode={countMode}
          setCountMode={setCountMode}
          speed={speed}
          setSpeed={setSpeed}
          customSpeed={customSpeed}
          setCustomSpeed={setCustomSpeed}
          useCustomSpeed={useCustomSpeed}
          setUseCustomSpeed={setUseCustomSpeed}
          background={background}
          setBackground={setBackground}
          counterStyle={counterStyle}
          setCounterStyle={setCounterStyle}
          counterType={counterType}
          setCounterType={setCounterType}
          startNumber={startNumber}
          setStartNumber={setStartNumber}
          endNumber={endNumber}
          setEndNumber={setEndNumber}
          numberCountMode={numberCountMode}
          setNumberCountMode={setNumberCountMode}
        />

        {/* Right Side - Video Section */}
        <div className="flex-1 h-full flex flex-col">
          <VideoPreview
            canvasRef={canvasRef}
            isRecording={isRecording}
            isPaused={isPaused}
            currentTime={currentTime}
            duration={duration}
          />

          <ActionButtons
            isRecording={isRecording}
            isPaused={isPaused}
            isComplete={isComplete}
            startRecording={startRecording}
            pauseRecording={pauseRecording}
            stopRecording={stopRecording}
            downloadVideo={downloadVideo}
          />
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
