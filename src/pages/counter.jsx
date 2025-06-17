import React, { useState, useRef, useEffect, useCallback } from "react";
import { Film } from "lucide-react";
import ControlsPanel from '../components/ControlsPanel';
import VideoPreview from '../components/VideoPreview';
import ActionButtons from '../components/ActionButtons';
import { UserButton } from '@clerk/clerk-react'; // New import
import { useTheme } from '../contexts/ThemeContext'; // Import useTheme

const TimeCounterVideoApp = () => {
  const { theme: appTheme } = useTheme(); // Get appTheme from context

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
  const [timerFontSize, setTimerFontSize] = useState(48); // Default to 48px (within 1-100px range)

  // Styling options for the canvas content itself
  const [background, setBackground] = useState("black");
  const [counterStyle, setCounterStyle] = useState("fade");

  // ControlsPanel state
  const [activeTab, setActiveTab] = useState("settings");

  const [counterType, setCounterType] = useState("time");
  const [startNumber, setStartNumber] = useState(1);
  const [endNumber, setEndNumber] = useState(100);
  const [numberCountMode, setNumberCountMode] = useState("countup");

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
        offset: (1 - progress) * -fontSize,
        alpha: 1
      },
      previous: {
        text: previousText,
        offset: progress * fontSize,
        alpha: 1
      }
    };
  };

  const getSlideAndFadeInTransition = (currentText, previousText, progress, fontSize) => {
    if (previousText === null || currentText === previousText) {
      return {
        current: { text: currentText, offset: 0, alpha: 1 },
        previous: null
      };
    }
    return {
      current: {
        text: currentText,
        offset: (1 - progress) * (fontSize / 2),
        alpha: progress
      },
      previous: {
        text: previousText,
        offset: progress * (-fontSize / 2),
        alpha: 1 - progress
      }
    };
  };

  const drawTextWithTransition = (
    ctx,
    textValue,
    x,
    y,
    fontSize,
    transition = null
  ) => {
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
      ctx.fillText(textValue, x, y);
    }
  };

  const drawTimer = useCallback((time) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");

      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;
      const dpr = window.devicePixelRatio || 1;

      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;

      ctx.scale(dpr, dpr);

      // Now all drawing operations use CSS pixel dimensions.
      // Clear rect should use displayWidth/Height because context is scaled.
      ctx.clearRect(0, 0, displayWidth, displayHeight);

      if (background === "black") {
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, displayWidth, displayHeight);
      } else if (background === "white") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, displayWidth, displayHeight);
      }
      // If background is transparent, we don't fill the canvas,
      // relying on the page background (controlled by ThemeContext) to show through.

      // Determine text color based on canvas background and app theme
      let textColor;
      if (background === 'black') {
        textColor = '#FFFFFF';
      } else if (background === 'white') {
        textColor = '#000000';
      } else { // Transparent canvas background
        if (appTheme === 'dark') {
          textColor = '#FFFFFF';
        } else {
          textColor = '#000000';
        }
      }
      ctx.fillStyle = textColor;

      if (counterType === "time") {
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
        drawCounterWithStyle(ctx, currentTimeData, displayWidth, displayHeight, progress, previousTimeData, timerFontSize);
      } else {
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
                  ? Math.min(startNumber + Math.floor((previousTime.current / duration) * totalNumbers), endNumber)
                  : Math.max(endNumber - Math.floor((previousTime.current / duration) * totalNumbers), startNumber)
              )
            : null;
        drawNumberCounter(ctx, currentNumberData, displayWidth, displayHeight, progress, previousNumberData, timerFontSize);
      }
      previousTime.current = time;
    },
    [ duration, countMode, background, counterStyle, counterType, startNumber, endNumber, numberCountMode, appTheme, timerFontSize ]
  );

  // Extracted actual drawing logic to these functions for clarity
  const drawCounterWithStyle = (ctx, timeData, width, height, progress, previousTimeData, dynamicFontSize) => {
    const fontSize = dynamicFontSize;
    ctx.font = `bold ${fontSize}px Inter, system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const centerX = width / 2;
    const centerY = height / 2;
    const minTens = timeData.minutes[0];
    const minOnes = timeData.minutes[1];
    const secTens = timeData.seconds[0];
    const secOnes = timeData.seconds[1];
    const prevMinTens = previousTimeData ? previousTimeData.minutes[0] : null;
    const prevMinOnes = previousTimeData ? previousTimeData.minutes[1] : null;
    const prevSecTens = previousTimeData ? previousTimeData.seconds[0] : null;
    const prevSecOnes = previousTimeData ? previousTimeData.seconds[1] : null;
    const digitWidth = ctx.measureText("0").width;
    const colonWidth = ctx.measureText(":").width;
    const totalWidth = digitWidth * 4 + colonWidth;
    const minTensX = centerX - totalWidth / 2 + digitWidth / 2;
    const minOnesX = minTensX + digitWidth;
    const colonX = minOnesX + digitWidth / 2 + colonWidth / 2;
    const secTensX = colonX + colonWidth / 2 + digitWidth / 2;
    const secOnesX = secTensX + digitWidth;
    const transitionProgress = (animationPhase.current % 30) / 30;

    ctx.save();
    if (counterStyle === "fade") {
      const alpha = 0.3 + (Math.sin(animationPhase.current * 0.1) + 1) * 0.35;
      ctx.globalAlpha = alpha;
    } else if (counterStyle === "curtain") {
      const curtainPhase = (animationPhase.current % 120) / 120;
      const revealHeight = Math.sin(curtainPhase * Math.PI) * fontSize + fontSize / 4;
      ctx.save();
      ctx.beginPath();
      ctx.rect(secTensX - digitWidth / 2, centerY - revealHeight / 2, digitWidth, revealHeight);
      ctx.clip();
      drawTextWithTransition(ctx, secTens, secTensX, centerY, fontSize, null);
      ctx.restore();
      ctx.save();
      ctx.beginPath();
      ctx.rect(secOnesX - digitWidth / 2, centerY - revealHeight / 2, digitWidth, revealHeight);
      ctx.clip();
      drawTextWithTransition(ctx, secOnes, secOnesX, centerY, fontSize, null);
      ctx.restore();
      drawTextWithTransition(ctx, minTens, minTensX, centerY, fontSize, null);
      drawTextWithTransition(ctx, minOnes, minOnesX, centerY, fontSize, null);
      ctx.fillText(":", colonX, centerY);
      ctx.restore();
      animationPhase.current += 1;
      return;
    }

    if (counterStyle === "scroll" && prevMinTens && minTens !== prevMinTens) {
      const transition = getDigitTransition(minTens, prevMinTens, transitionProgress);
      drawTextWithTransition(ctx, minTens, minTensX, centerY, fontSize, transition);
    } else if (counterStyle !== "slide" && counterStyle !== "swap") {
      drawTextWithTransition(ctx, minTens, minTensX, centerY, fontSize, null);
    }

    if (counterStyle === "scroll" && prevMinOnes && minOnes !== prevMinOnes) {
      const transition = getDigitTransition(minOnes, prevMinOnes, transitionProgress);
      drawTextWithTransition(ctx, minOnes, minOnesX, centerY, fontSize, transition);
    } else if (counterStyle !== "slide" && counterStyle !== "swap") {
      drawTextWithTransition(ctx, minOnes, minOnesX, centerY, fontSize, null);
    }

    if (counterStyle !== "slide" && counterStyle !== "swap") {
        ctx.fillText(":", colonX, centerY);
    }

    if (counterStyle === "scroll") {
      if (prevSecTens && secTens !== prevSecTens) {
        const transition = getDigitTransition(secTens, prevSecTens, transitionProgress);
        drawTextWithTransition(ctx, secTens, secTensX, centerY, fontSize, transition);
      } else {
        drawTextWithTransition(ctx, secTens, secTensX, centerY, fontSize, null);
      }
      if (prevSecOnes && secOnes !== prevSecOnes) {
        const transition = getDigitTransition(secOnes, prevSecOnes, transitionProgress);
        drawTextWithTransition(ctx, secOnes, secOnesX, centerY, fontSize, transition);
      } else {
        drawTextWithTransition(ctx, secOnes, secOnesX, centerY, fontSize, null);
      }
    } else if (counterStyle === "roll") {
      const rollPhase = (animationPhase.current % 30) / 30;
      if (prevSecTens && secTens !== prevSecTens && rollPhase < 0.5) {
        const scaleY = 1 - rollPhase * 2; ctx.save(); ctx.translate(secTensX, centerY); ctx.scale(1, scaleY); ctx.fillText(prevSecTens, 0, 0); ctx.restore();
      } else if (prevSecTens && secTens !== prevSecTens && rollPhase >= 0.5) {
        const scaleY = (rollPhase - 0.5) * 2; ctx.save(); ctx.translate(secTensX, centerY); ctx.scale(1, scaleY); ctx.fillText(secTens, 0, 0); ctx.restore();
      } else {
        drawTextWithTransition(ctx, secTens, secTensX, centerY, fontSize, null);
      }
      if (prevSecOnes && secOnes !== prevSecOnes && rollPhase < 0.5) {
        const scaleY = 1 - rollPhase * 2; ctx.save(); ctx.translate(secOnesX, centerY); ctx.scale(1, scaleY); ctx.fillText(prevSecOnes, 0, 0); ctx.restore();
      } else if (prevSecOnes && secOnes !== prevSecOnes && rollPhase >= 0.5) {
        const scaleY = (rollPhase - 0.5) * 2; ctx.save(); ctx.translate(secOnesX, centerY); ctx.scale(1, scaleY); ctx.fillText(secOnes, 0, 0); ctx.restore();
      } else {
        drawTextWithTransition(ctx, secOnes, secOnesX, centerY, fontSize, null);
      }
    } else if (counterStyle === "fold") {
      const scale = 0.8 + Math.abs(Math.sin(animationPhase.current * 0.05)) * 0.4;
      ctx.save(); ctx.translate(secTensX, centerY); ctx.scale(scale, 1); drawTextWithTransition(ctx, secTens, 0, 0, fontSize, null); ctx.restore();
      ctx.save(); ctx.translate(secOnesX, centerY); ctx.scale(scale, 1); drawTextWithTransition(ctx, secOnes, 0, 0, fontSize, null); ctx.restore();
      // For fold, minutes are drawn statically if not part of the effect
      if (counterStyle === "fold") { // This condition is redundant here, already in fold block
        drawTextWithTransition(ctx, minTens, minTensX, centerY, fontSize, null);
        drawTextWithTransition(ctx, minOnes, minOnesX, centerY, fontSize, null);
        ctx.fillText(":", colonX, centerY);
      }
    } else if (counterStyle === "slide") {
      const slideProgress = (animationPhase.current % 15) / 15;
      const minTensTransition = getSlideTransition(minTens, prevMinTens, slideProgress, fontSize);
      drawTextWithTransition(ctx, minTens, minTensX, centerY, fontSize, minTensTransition);
      const minOnesTransition = getSlideTransition(minOnes, prevMinOnes, slideProgress, fontSize);
      drawTextWithTransition(ctx, minOnes, minOnesX, centerY, fontSize, minOnesTransition);
      ctx.fillText(":", colonX, centerY); // Colon might need transition too if desired
      const secTensTransition = getSlideTransition(secTens, prevSecTens, slideProgress, fontSize);
      drawTextWithTransition(ctx, secTens, secTensX, centerY, fontSize, secTensTransition);
      const secOnesTransition = getSlideTransition(secOnes, prevSecOnes, slideProgress, fontSize);
      drawTextWithTransition(ctx, secOnes, secOnesX, centerY, fontSize, secOnesTransition);
    } else if (counterStyle === "swap") {
      drawTextWithTransition(ctx, minTens, minTensX, centerY, fontSize, null);
      drawTextWithTransition(ctx, minOnes, minOnesX, centerY, fontSize, null);
      ctx.fillText(":", colonX, centerY);
      const rollPhase = (animationPhase.current % 30) / 30;
      if (prevSecTens && secTens !== prevSecTens && rollPhase < 0.5) {
        const scaleY = 1 - rollPhase * 2; ctx.save(); ctx.translate(secTensX, centerY); ctx.scale(1, scaleY); ctx.fillText(prevSecTens, 0, 0); ctx.restore();
      } else if (prevSecTens && secTens !== prevSecTens && rollPhase >= 0.5) {
        const scaleY = (rollPhase - 0.5) * 2; ctx.save(); ctx.translate(secTensX, centerY); ctx.scale(1, scaleY); ctx.fillText(secTens, 0, 0); ctx.restore();
      } else {
        drawTextWithTransition(ctx, secTens, secTensX, centerY, fontSize, null);
      }
      if (prevSecOnes && secOnes !== prevSecOnes && rollPhase < 0.5) {
        const scaleY = 1 - rollPhase * 2; ctx.save(); ctx.translate(secOnesX, centerY); ctx.scale(1, scaleY); ctx.fillText(prevSecOnes, 0, 0); ctx.restore();
      } else if (prevSecOnes && secOnes !== prevSecOnes && rollPhase >= 0.5) {
        const scaleY = (rollPhase - 0.5) * 2; ctx.save(); ctx.translate(secOnesX, centerY); ctx.scale(1, scaleY); ctx.fillText(secOnes, 0, 0); ctx.restore();
      } else {
        drawTextWithTransition(ctx, secOnes, secOnesX, centerY, fontSize, null);
      }
    } else {
      drawTextWithTransition(ctx, minTens, minTensX, centerY, fontSize, null);
      drawTextWithTransition(ctx, minOnes, minOnesX, centerY, fontSize, null);
      ctx.fillText(":", colonX, centerY);
      drawTextWithTransition(ctx, secTens, secTensX, centerY, fontSize, null);
      drawTextWithTransition(ctx, secOnes, secOnesX, centerY, fontSize, null);
    }
    if (counterStyle === "fade") { ctx.globalAlpha = 1.0; }
    ctx.restore();
    animationPhase.current += 1;
  };

  const drawNumberCounter = (ctx, numberData, width, height, progress, previousNumberData, dynamicFontSize) => {
    const fontSize = dynamicFontSize;
    ctx.font = `bold ${fontSize}px Inter, system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const centerX = width / 2;
    const centerY = height / 2;
    const currentNumber = numberData.number.toString();
    const previousNumber = previousNumberData ? previousNumberData.number.toString() : null;
    ctx.save();
    if (counterStyle === "fade") {
      const alpha = 0.3 + (Math.sin(animationPhase.current * 0.1) + 1) * 0.35;
      ctx.globalAlpha = alpha;
      drawTextWithTransition(ctx, currentNumber, centerX, centerY, fontSize, null);
      ctx.globalAlpha = 1.0;
    } else if (counterStyle === "scroll" && previousNumber && currentNumber !== previousNumber) {
      const transitionProgress = (animationPhase.current % 30) / 30;
      const transition = getDigitTransition(currentNumber, previousNumber, transitionProgress);
      drawTextWithTransition(ctx, currentNumber, centerX, centerY, fontSize, transition);
    } else if (counterStyle === "roll" && previousNumber && currentNumber !== previousNumber) {
      const rollPhase = (animationPhase.current % 30) / 30;
      if (rollPhase < 0.5) {
        const scaleY = 1 - rollPhase * 2; ctx.save(); ctx.translate(centerX, centerY); ctx.scale(1, scaleY); drawTextWithTransition(ctx, previousNumber, 0, 0, fontSize, null); ctx.restore();
      } else {
        const scaleY = (rollPhase - 0.5) * 2; ctx.save(); ctx.translate(centerX, centerY); ctx.scale(1, scaleY); drawTextWithTransition(ctx, currentNumber, 0, 0, fontSize, null); ctx.restore();
      }
    } else if (counterStyle === "fold") {
      const scale = 0.8 + Math.abs(Math.sin(animationPhase.current * 0.05)) * 0.4;
      ctx.save(); ctx.translate(centerX, centerY); ctx.scale(scale, 1); drawTextWithTransition(ctx, currentNumber, 0, 0, fontSize, null); ctx.restore();
      ctx.save(); ctx.shadowColor = background === "white" ? "#000000" : "#ffffff"; ctx.shadowBlur = 20; ctx.globalAlpha = 0.3; drawTextWithTransition(ctx, currentNumber, centerX, centerY, fontSize, null); ctx.restore();
    } else if (counterStyle === "slide") {
      const slideProgress = (animationPhase.current % 15) / 15;
      const transition = getSlideTransition(currentNumber, previousNumber, slideProgress, fontSize);
      drawTextWithTransition(ctx, currentNumber, centerX, centerY, fontSize, transition);
    } else {
      drawTextWithTransition(ctx, currentNumber, centerX, centerY, fontSize, null);
    }
    ctx.restore();
    animationPhase.current += 1;
  };


  useEffect(() => {
    if (!isRecording) {
      drawTimer(0);
    }
  }, [isRecording, drawTimer]);

  useEffect(() => {
    if (isRecording && !isPaused) {
      drawTimer(currentTime);
    }
  }, [currentTime, isRecording, isPaused, drawTimer]);

  useEffect(() => {
    if (!isRecording) {
      drawTimer(0);
    }
  }, [appTheme, isRecording, drawTimer]);


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

  const startRecording = async () => {
    setIsRecording(true);
    setIsPaused(false);
    setIsComplete(false);
    setCurrentTime(0);
    setRecordedChunks([]);
    previousTime.current = -1; // Reset previous time for animations
    animationPhase.current = 0; // Reset animation phase

    const canvas = canvasRef.current;
    if (!canvas) {
      console.error("Canvas not available for recording.");
      setIsRecording(false); // Reset state if canvas is not there
      return;
    }

    // Ensure canvas is prepared with DPR scaling and initial frame drawn
    // Note: drawTimer now handles DPR setup internally.
    // We pass the initial time (0 for a new recording).
    drawTimer(0); // THIS IS THE KEY ADDITION/RE-ORDERING

    try {
      // It's good practice to check if captureStream is supported
      if (!canvas.captureStream) {
        console.error("HTMLCanvasElement.captureStream() is not supported by this browser.");
        alert("Video recording is not supported by your browser.");
        setIsRecording(false);
        return;
      }

      streamRef.current = canvas.captureStream(25); // 25 FPS, or make configurable

      if (!streamRef.current) {
          console.error("Failed to capture stream from canvas.");
          setIsRecording(false);
          return;
      }

      const options = { mimeType: "video/webm; codecs=vp9" }; // Or other supported types
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          console.warn(`${options.mimeType} is not supported, trying default.`);
          // Try with no specific mimeType or a fallback
          try {
              mediaRecorderRef.current = new MediaRecorder(streamRef.current);
          } catch (e) {
              console.error("MediaRecorder setup failed with default options:", e);
              alert("Failed to initialize video recorder with default settings.");
              setIsRecording(false);
              return;
          }
      } else {
          mediaRecorderRef.current = new MediaRecorder(streamRef.current, options);
      }

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks((prev) => [...prev, event.data]);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        setIsComplete(true);
        setIsRecording(false);
        setIsPaused(false);
        if (streamRef.current) { // Ensure streamRef.current exists
          streamRef.current.getTracks().forEach(track => track.stop());
        }
      };

      mediaRecorderRef.current.onerror = (event) => {
        console.error("MediaRecorder error:", event.error);
        alert(`MediaRecorder error: ${event.error.name} - ${event.error.message}`);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
        setIsRecording(false);
        setIsPaused(false);
        setIsComplete(true); // Indicate process ended, possibly with error
        setRecordedChunks([]); // Clear any potentially corrupted chunks
      };

      mediaRecorderRef.current.start();
      startTimerInternal(); // Renamed from startTimer to avoid conflict if startTimer becomes async or more complex

    } catch (error) {
      console.error("Error starting recording:", error);
      alert(`Could not start recording: ${error.message}`);
      setIsRecording(false); // Reset recording state
      if (streamRef.current) { // Cleanup stream if it was partially setup
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
      }
    }
  };

  const startTimerInternal = () => {
      if (intervalRef.current) {
          clearInterval(intervalRef.current);
      }
      const effectiveSpeed = useCustomSpeed ? customSpeed : speed;
      intervalRef.current = setInterval(() => {
          setCurrentTime((prevTime) => {
              const newTime = prevTime + (1 / (1000 / (1000 / effectiveSpeed))) / (1000 / 100); // Adjusted for 10ms interval
              if (newTime >= duration) {
                  clearInterval(intervalRef.current);
                  if (isRecording && mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
                      mediaRecorderRef.current.stop(); // This will trigger onstop
                  } else {
                      setIsComplete(true); // Set complete if not recording but timer finishes
                      setIsRecording(false);
                  }
                  return duration;
              }
              return newTime;
          });
      }, 10); // Update interval to 10ms for smoother animation in drawTimer
  };

  const pauseRecording = () => {
    if (!mediaRecorderRef.current || !isRecording) { // Ensure recording is active
      console.warn("Pause/Resume called inappropriately.");
      return;
    }

    setIsPaused(prevIsPaused => {
      const newPausedState = !prevIsPaused;
      if (newPausedState) {
        // Pausing
        if (mediaRecorderRef.current.state === "recording") {
          try {
            mediaRecorderRef.current.pause();
          } catch (e) { console.error("Error pausing MediaRecorder:", e); }
        }
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      } else {
        // Resuming
        if (mediaRecorderRef.current.state === "paused") {
          try {
            mediaRecorderRef.current.resume();
          } catch (e) { console.error("Error resuming MediaRecorder:", e); }
        }
        startTimerInternal(); // Restart the timer interval
      }
      return newPausedState;
    });
  };

  const stopRecording = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    // Check if mediaRecorder is available and in a state that can be stopped
    if (mediaRecorderRef.current &&
        (mediaRecorderRef.current.state === "recording" || mediaRecorderRef.current.state === "paused")) {
      mediaRecorderRef.current.stop(); // This will trigger the onstop event
    } else if (streamRef.current) {
      // If recorder wasn't active but stream was, clean up stream
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      // Manually set states if onstop isn't triggered because recorder wasn't recording
      setIsRecording(false);
      setIsPaused(false);
      setIsComplete(true); // Consider if this should be true or false if no recording happened
    } else {
      // If nothing was really active, just ensure states are reset
      setIsRecording(false);
      setIsPaused(false);
    }
  };

  const downloadVideo = () => {
    if (recordedChunks.length === 0) {
      console.warn("No video data recorded to download.");
      alert("No video has been recorded or data is empty.");
      return;
    }
    // Use the mimeType defined in startRecording, or a common default like "video/webm"
    const options = { mimeType: "video/webm; codecs=vp9" }; // Match startRecording options
    const blobMimeType = MediaRecorder.isTypeSupported(options.mimeType) ? options.mimeType : "video/webm";

    const blob = new Blob(recordedChunks, { type: blobMimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style.display = "none";
    a.href = url;

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    a.download = `timer_video_${timestamp}.webm`; // Dynamic filename

    a.click();

    // Cleanup: Revoke object URL and remove anchor after a short delay
    setTimeout(() => {
      URL.revokeObjectURL(url);
      if (a.parentNode) {
        a.parentNode.removeChild(a);
      }
    }, 100);

    // Optionally reset state for a new recording
    // setRecordedChunks([]); // Keep chunks if user wants to download multiple times? Or clear.
    // setIsComplete(false); // Allow re-recording or keep as complete?
  };

  // The actual implementations of pauseRecording, stopRecording, downloadVideo
  // are lengthy and assumed to be correct as per previous versions. For brevity, they are not repeated here.
  // Make sure they are present in the actual file.

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gradient-to-br dark:from-gray-900 dark:via-slate-900 dark:to-black p-0 transition-colors duration-300">
      <div className="w-full h-screen flex relative">
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
          timerFontSize={timerFontSize}
          setTimerFontSize={setTimerFontSize}
        />
        <div className="flex-1 h-full flex flex-col overflow-hidden">
          <div className="absolute top-4 right-4 z-50">
            {/* Replaced AuthDetails with UserButton */}
            <UserButton afterSignOutUrl="/login" />
          </div>
          <VideoPreview
            className="flex-grow min-h-0" // Added classes
            canvasRef={canvasRef}
            isRecording={isRecording}
            isPaused={isPaused}
            currentTime={currentTime}
            duration={duration}
          />
          <ActionButtons
            className="flex-shrink-0" // Added class
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
      <style jsx>{`
        /* styles are the same */
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
          background: rgba(55, 65, 81, 0.5); /* Dark mode track */
        }
        /* Consider adding light mode track if needed */
        html:not(.dark) .slider::-webkit-slider-track {
            background: rgba(209, 213, 219, 0.7); /* Light mode track e.g. gray-300/70 */
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
        .overflow-y-auto::-webkit-scrollbar { width: 4px; }
        .overflow-y-auto::-webkit-scrollbar-track { background: rgba(55, 65, 81, 0.2); border-radius: 2px; }
        .overflow-y-auto::-webkit-scrollbar-thumb { background: rgba(75, 85, 99, 0.5); border-radius: 2px; }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover { background: rgba(75, 85, 99, 0.7); }
      `}</style>
    </div>
  );
};

export default TimeCounterVideoApp;
