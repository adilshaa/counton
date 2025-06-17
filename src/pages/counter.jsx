import React, { useState, useRef, useEffect, useCallback } from "react";
import GIF from 'gif.js'; // Import GIF library
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

  // Font Management State
  const defaultFontFamily = "Inter, system-ui, sans-serif";
  const [selectedFontFamily, setSelectedFontFamily] = useState(defaultFontFamily);
  const [customFontInput, setCustomFontInput] = useState('');
  const [loadedCustomFonts, setLoadedCustomFonts] = useState([]);

  // GIF Recording State and Refs
  const [isRecordingGif, setIsRecordingGif] = useState(false);
  const [isRenderingGif, setIsRenderingGif] = useState(false); // New state for GIF rendering
  const gifInstanceRef = useRef(null);
  const timeSinceLastGifFrameRef = useRef(0);
  const isRecordingGifRef = useRef(isRecordingGif);
  useEffect(() => { isRecordingGifRef.current = isRecordingGif; }, [isRecordingGif]);

  // GIF Frame Constants
  const GIF_FRAME_RATE = 10; // FPS
  const GIF_FRAME_DELAY_MS = 1000 / GIF_FRAME_RATE;

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
  const animationFrameRef = useRef(null);
  const lastFrameTimeRef = useRef(performance.now());
  const streamRef = useRef(null);
  const animationPhase = useRef(0);
  const previousTime = useRef(-1);

  // Refs for state values to be used in animationLoop
  const isRecordingRef = useRef(isRecording);
  const isPausedRef = useRef(isPaused);
  const durationRef = useRef(duration);
  const effectiveSpeedRef = useRef(useCustomSpeed ? customSpeed : speed);
  const loopCurrentTimeRef = useRef(currentTime);

  // useEffects to keep refs in sync with state
  useEffect(() => { isRecordingRef.current = isRecording; }, [isRecording]);
  useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);
  useEffect(() => { durationRef.current = duration; }, [duration]);
  useEffect(() => { effectiveSpeedRef.current = useCustomSpeed ? customSpeed : speed; }, [useCustomSpeed, customSpeed, speed]);
  useEffect(() => { loopCurrentTimeRef.current = currentTime; }, [currentTime]);

  const defaultFonts = [
    { name: "Sans Serif (Default)", family: defaultFontFamily, type: 'default' },
    { name: "Serif", family: "Georgia, serif", type: 'default' },
    { name: "Monospace", family: "monospace", type: 'default' }
  ];

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
        const previousTimeValueForTime = previousTime.current; // Capture for time counter
        const previousTimeData =
          previousTimeValueForTime >= 0
            ? formatTime(
                countMode === "countdown"
                  ? Math.max(0, duration - previousTimeValueForTime)
                  : Math.min(previousTimeValueForTime, duration)
              )
            : null;
        // Robust progress calculation for time type (though less critical here if duration > 0 is guaranteed for active timer)
        const progress = duration > 0 ? Math.min(time / duration, 1) : (time > 0 ? 1 : 0);
        drawCounterWithStyle(ctx, currentTimeData, displayWidth, displayHeight, progress, previousTimeData, timerFontSize);
      } else { // counterType === "number"
        const sNum = parseFloat(startNumber) || 0;
        const eNum = parseFloat(endNumber) || 0;

        const actualStart = Math.min(sNum, eNum);
        const actualEnd = Math.max(sNum, eNum);
        const range = actualEnd - actualStart;

        // Robust progress calculation
        const progress = duration > 0 ? Math.min(time / duration, 1) : (time > 0 ? 1 : 0);
        let displayNumber;

        if (numberCountMode === "countup") {
          // Ensure that for progress = 1, displayNumber reaches actualEnd
          if (progress === 1) {
            displayNumber = actualEnd;
          } else {
            displayNumber = actualStart + Math.floor(progress * range);
          }
          displayNumber = Math.min(displayNumber, actualEnd);
        } else { // "countdown"
          // Ensure that for progress = 1, displayNumber reaches actualStart
           if (progress === 1) {
            displayNumber = actualStart;
          } else {
            displayNumber = actualEnd - Math.floor(progress * range);
          }
          displayNumber = Math.max(displayNumber, actualStart);
        }

        const currentNumberData = formatNumber(displayNumber);

        const previousTimeValue = previousTime.current;

        let prevDisplayNumberCalculation;
        if (previousTimeValue >= 0) {
            const prevProgress = duration > 0 ? Math.min(previousTimeValue / duration, 1) : (previousTimeValue > 0 ? 1 : 0);
            if (numberCountMode === "countup") {
                if (prevProgress === 1) {
                    prevDisplayNumberCalculation = actualEnd;
                } else {
                    prevDisplayNumberCalculation = actualStart + Math.floor(prevProgress * range);
                }
                prevDisplayNumberCalculation = Math.min(prevDisplayNumberCalculation, actualEnd);
            } else { // "countdown"
                if (prevProgress === 1) {
                    prevDisplayNumberCalculation = actualStart;
                } else {
                    prevDisplayNumberCalculation = actualEnd - Math.floor(prevProgress * range);
                }
                prevDisplayNumberCalculation = Math.max(prevDisplayNumberCalculation, actualStart);
            }
        }
        const previousNumberData = previousTimeValue >= 0 ? formatNumber(prevDisplayNumberCalculation) : null;

        drawNumberCounter(ctx, currentNumberData, displayWidth, displayHeight, progress, previousNumberData, timerFontSize);
      }
      previousTime.current = time;
    },
    [ duration, countMode, background, counterStyle, counterType, startNumber, endNumber, numberCountMode, appTheme, timerFontSize, selectedFontFamily ] // Added selectedFontFamily
  );

  // Extracted actual drawing logic to these functions for clarity
  const drawCounterWithStyle = (ctx, timeData, width, height, progress, previousTimeData, dynamicFontSize) => {
    const fontSize = dynamicFontSize;
    ctx.font = `bold ${fontSize}px ${selectedFontFamily}`; // Use selectedFontFamily
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
    ctx.font = `bold ${fontSize}px ${selectedFontFamily}`; // Use selectedFontFamily
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
    if (!isRecording) {
      drawTimer(0);
    }
  }, [appTheme, isRecording, drawTimer]);

  // Main cleanup useEffect
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const animationLoop = useCallback((timestamp) => {
    if (!isRecordingRef.current || isPausedRef.current) {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      return;
    }

    const deltaTime = timestamp - lastFrameTimeRef.current;
    lastFrameTimeRef.current = timestamp;

    loopCurrentTimeRef.current += (deltaTime / 1000) * effectiveSpeedRef.current;

    // GIF Frame Capture Logic
    if (isRecordingGifRef.current && gifInstanceRef.current && canvasRef.current) {
      timeSinceLastGifFrameRef.current += deltaTime;
      if (timeSinceLastGifFrameRef.current >= GIF_FRAME_DELAY_MS) {
        gifInstanceRef.current.addFrame(canvasRef.current, { copy: true, delay: GIF_FRAME_DELAY_MS });
        // Adjust timeSinceLastGifFrameRef, carrying over any excess time
        timeSinceLastGifFrameRef.current = timeSinceLastGifFrameRef.current % GIF_FRAME_DELAY_MS;
      }
    }

    let newTimeForState = loopCurrentTimeRef.current;

    if (loopCurrentTimeRef.current >= durationRef.current) {
      newTimeForState = durationRef.current;
      loopCurrentTimeRef.current = durationRef.current; // Cap it

      drawTimer(newTimeForState); // Draw final frame
      setCurrentTime(newTimeForState); // Update React state

      if (isRecordingGifRef.current && gifInstanceRef.current) {
        finalizeAndDownloadGif(); // Call finalize for GIF
        // States like setIsRecording(false), setIsComplete(true) etc. will be handled by finalize or stopRecording
      } else if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop(); // This will trigger onstop for video
      } else {
        // If neither GIF nor video recorder was active/correctly configured but timer ran out
        setIsComplete(true);
        setIsRecording(false);
        setIsPaused(false);
      }
    } else {
      drawTimer(newTimeForState);
      setCurrentTime(newTimeForState);
      if (isRecordingRef.current && !isPausedRef.current) {
         animationFrameRef.current = requestAnimationFrame(animationLoop);
      }
    }
  }, [drawTimer]); // Dependencies: only drawTimer. Others are accessed via refs.

  const finalizeAndDownloadGif = () => {
    if (!gifInstanceRef.current) {
      console.warn("finalizeAndDownloadGif called but gifInstanceRef is null");
      setIsRecordingGif(false); // Ensure mode is reset
      setIsRecording(false);    // Ensure main recording state is reset
      setIsPaused(false);
      return;
    }

    setIsRenderingGif(true);
    console.log("GIF: Starting rendering process...");

    gifInstanceRef.current.on('finished', (blob) => {
      console.log("GIF: 'finished' event triggered.");
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.style.display = 'none';
      a.href = url;
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      a.download = `timer_animation_${timestamp}.gif`;
      a.click();
      URL.revokeObjectURL(url);
      if (a.parentNode) {
        a.parentNode.removeChild(a);
      }

      setIsRenderingGif(false);
      gifInstanceRef.current = null;
      setIsComplete(true); // Mark complete after download
      // setIsRecording(false) and setIsRecordingGif(false) should have been set already
      // or will be set by stopRecording which calls this.
    });

    gifInstanceRef.current.on('abort', () => {
      console.error("GIF: Rendering aborted.");
      setIsRenderingGif(false);
      gifInstanceRef.current = null;
      setIsRecording(false); // Ensure all recording states are reset
      setIsRecordingGif(false);
      setIsComplete(true); // Mark as complete even on abort to signify process end
    });

    try {
      gifInstanceRef.current.render();
    } catch (e) {
      console.error("GIF: Error during render call:", e);
      setIsRenderingGif(false);
      gifInstanceRef.current = null;
      setIsRecording(false);
      setIsRecordingGif(false);
      setIsComplete(true);
      alert("Failed to render GIF. See console for details.");
    }
  };

  const startRecording = async () => {
    // Common setup
    setCurrentTime(0);
    loopCurrentTimeRef.current = 0;
    setIsRecording(true);
    setIsPaused(false);
    setIsComplete(false);
    previousTime.current = -1;
    animationPhase.current = 0;

    drawTimer(0); // Draw initial frame for both types

    const canvas = canvasRef.current;
    if (!canvas) {
      console.error("Canvas not available for recording.");
      setIsRecording(false);
      return;
    }

    if (isRecordingGif) { // Check state directly, as this is the user's intent for this new recording session
      console.log("Starting GIF recording...");
      gifInstanceRef.current = new GIF({
        workers: 2,
        quality: 10, // Lower for faster processing, higher for better quality
        workerScript: '/gif.worker.js', // Ensure this path is correct
        width: canvas.width / (window.devicePixelRatio || 1), // Use logical canvas size
        height: canvas.height / (window.devicePixelRatio || 1),
      });
      timeSinceLastGifFrameRef.current = 0;
      mediaRecorderRef.current = null; // Ensure video recorder is not used
      setRecordedChunks([]); // Clear any video chunks
    } else {
      console.log("Starting video recording...");
      gifInstanceRef.current = null; // Ensure GIF recorder is not used
      setRecordedChunks([]); // Clear video chunks for new recording
      // Existing MediaRecorder setup
      // Ensure canvas is prepared with DPR scaling and initial frame drawn (drawTimer(0) above does this)
      try {
        if (!canvas.captureStream) {
          console.error("HTMLCanvasElement.captureStream() is not supported by this browser.");
          alert("Video recording is not supported by your browser.");
          setIsRecording(false); return;
        }
        streamRef.current = canvas.captureStream(25); // FPS for video
        if (!streamRef.current) {
          console.error("Failed to capture stream from canvas.");
          setIsRecording(false); return;
        }
        const options = { mimeType: "video/webm; codecs=vp9" };
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          console.warn(`${options.mimeType} is not supported, trying default.`);
          try { mediaRecorderRef.current = new MediaRecorder(streamRef.current); }
          catch (e) { console.error("MediaRecorder setup failed (default):", e); setIsRecording(false); return; }
        } else {
          mediaRecorderRef.current = new MediaRecorder(streamRef.current, options);
        }
        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) setRecordedChunks((prev) => [...prev, event.data]);
        };
        mediaRecorderRef.current.onstop = () => {
          setIsComplete(true); setIsRecording(false); setIsPaused(false);
          if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
        };
        mediaRecorderRef.current.onerror = (event) => {
          console.error("MediaRecorder error:", event.error);
          if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
          if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
          setIsRecording(false); setIsPaused(false); setIsComplete(true); setRecordedChunks([]);
        };
        mediaRecorderRef.current.start();
      } catch (error) {
        console.error("Error starting video recording:", error);
        alert(`Could not start video recording: ${error.message}`);
        setIsRecording(false);
        if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
        return; // Important to return if video setup fails
      }
    }

    // Common for both GIF and Video
    lastFrameTimeRef.current = performance.now();
    animationFrameRef.current = requestAnimationFrame(animationLoop);
  };

  const pauseRecording = () => {
    const newPausedState = !isPausedRef.current; // Read from ref, then update state
    setIsPaused(newPausedState); // This will trigger isPausedRef update via useEffect

    if (newPausedState) { // Pausing
      // animationFrameRef.current is cancelled by animationLoop itself when isPausedRef.current becomes true
      if (isRecordingRef.current && mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        try {
          mediaRecorderRef.current.pause();
        } catch (e) { console.error("Error pausing MediaRecorder:", e); }
      }
    } else { // Resuming
      if (isRecordingRef.current) { // Only resume loop if actually recording
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "paused") {
          try {
            mediaRecorderRef.current.resume();
          } catch (e) { console.error("Error resuming MediaRecorder:", e); }
        }
        lastFrameTimeRef.current = performance.now();
        animationFrameRef.current = requestAnimationFrame(animationLoop);
      }
    }
  };

  const stopRecording = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (isRecordingGifRef.current && gifInstanceRef.current) {
      console.log("GIF: Stop recording called. Initiating finalize and download.");
      finalizeAndDownloadGif();
      // Note: setIsRecording(false), setIsPaused(false) are called below.
      // setIsRecordingGif(false) is also called below.
      // setIsComplete is handled by finalizeAndDownloadGif or its callbacks.
    } else if (mediaRecorderRef.current &&
        (mediaRecorderRef.current.state === "recording" || mediaRecorderRef.current.state === "paused")) {
      mediaRecorderRef.current.stop(); // This will trigger the onstop event for video
    } else if (!isRecordingGifRef.current && streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setIsComplete(true);
    } else if (!isRecordingGifRef.current && !mediaRecorderRef.current && isRecordingRef.current) {
      // If recording was started but neither recorder was initialized (e.g. canvas error)
      // and stop is called.
      setIsComplete(true);
    }

    setIsRecording(false);
    setIsPaused(false);
    if (isRecordingGifRef.current) { // Check ref before state updates fully propagate
      setIsRecordingGif(false);
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
          isRecordingGif={isRecordingGif}
          setIsRecordingGif={setIsRecordingGif}
          selectedFontFamily={selectedFontFamily}     // Font props
          setSelectedFontFamily={setSelectedFontFamily}
          customFontInput={customFontInput}
          setCustomFontInput={setCustomFontInput}
          defaultFonts={defaultFonts}
          loadedCustomFonts={loadedCustomFonts}
          setLoadedCustomFonts={setLoadedCustomFonts}
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
            isRecordingGif={isRecordingGif} // Pass GIF state for download button logic potentially
            isRenderingGif={isRenderingGif} // Pass GIF rendering state
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
