import './DrawDesk.scss';

import React, { useEffect, useRef } from 'react';
import { colorList, palmMinContactArea, palmMinContactLength } from '../constants.js'
import { getMouseCoordinates } from '../utils/general.js';
import {
  drawPen,
  drawRainbowPen,
  drawHighlighter,
  drawRainbowHighlighter,
  drawLine,
  drawLineActive,
  drawArrow,
  drawArrowActive,
  drawFlatArrow,
  drawFlatArrowActive,
  drawOval,
  drawOvalActive,
  drawRectangle,
  drawRectangleActive,
  drawLaser,
  drawEraserTail,
  drawText,
} from './drawer/figures.js';

const DrawDesk = ({
  allFigures,
  allFadeFigures,
  allLaserFigures,
  allEraserFigures,
  fadeOpacity,
  activeFigureInfo,
  isDrawing,
  cursorType,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  handleDoubleClick,
  updateRainbowColorDeg,
  activeTool,
  handleChangeTool,
}) => {

  const staticCanvasRef = useRef(null);
  const activeCanvasRef = useRef(null);
  const offscreenCanvasRef = useRef(null);

  const prevToolRef = useRef(null);
  const simulateKeyDown = useRef(false);

  const dpr = window.devicePixelRatio || 1;
  // Active layer hosts only the in-progress stroke + transients; on mouseUp
  // the stroke commits to the static (full-DPR) layer. Rendering it at 1x
  // cuts pixel work ~4x on retina with only a slight blur during drag.
  const activeDpr = 1;

  useEffect(() => {
    const setupCanvas = (canvas, scale) => {
      const ctx = canvas.getContext('2d');
      canvas.width = Math.floor(window.innerWidth * scale);
      canvas.height = Math.floor(window.innerHeight * scale);
      ctx.scale(scale, scale);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };

    setupCanvas(staticCanvasRef.current, dpr);
    setupCanvas(activeCanvasRef.current, activeDpr);

    if (!offscreenCanvasRef.current) {
      offscreenCanvasRef.current = document.createElement('canvas');
    }
    const offscreenCanvas = offscreenCanvasRef.current;
    const offCtx = offscreenCanvas.getContext('2d');
    offscreenCanvas.width = staticCanvasRef.current.width;
    offscreenCanvas.height = staticCanvasRef.current.height;
    offCtx.scale(dpr, dpr);
  }, []);

  const renderPersistentFigure = (ctx, figure, offscreenCanvas) => {
    if (figure.type === 'pen') {
      if (colorList[figure.colorIndex].name === 'color_rainbow') {
        drawRainbowPen(ctx, offscreenCanvas, figure, updateRainbowColorDeg)
      } else {
        drawPen(ctx, figure)
      }
    }

    if (figure.type === 'highlighter') {
      if (colorList[figure.colorIndex].name === 'color_rainbow') {
        drawRainbowHighlighter(ctx, offscreenCanvas, figure, updateRainbowColorDeg)
      } else {
        drawHighlighter(ctx, figure)
      }
    }

    if (figure.type === 'arrow') {
      drawArrow(ctx, figure, updateRainbowColorDeg)
      if (activeFigureInfo && figure.id === activeFigureInfo.id) {
        drawArrowActive(ctx, figure, activeFigureInfo.hoveredDotName)
      }
    }

    if (figure.type === 'flat_arrow') {
      drawFlatArrow(ctx, figure, updateRainbowColorDeg)
      if (activeFigureInfo && figure.id === activeFigureInfo.id) {
        drawFlatArrowActive(ctx, figure, activeFigureInfo.hoveredDotName)
      }
    }

    if (figure.type === 'line') {
      drawLine(ctx, figure, updateRainbowColorDeg)
      if (activeFigureInfo && figure.id === activeFigureInfo.id) {
        drawLineActive(ctx, figure, activeFigureInfo.hoveredDotName)
      }
    }

    if (figure.type === 'rectangle') {
      drawRectangle(ctx, figure, updateRainbowColorDeg)
      if (activeFigureInfo && figure.id === activeFigureInfo.id) {
        drawRectangleActive(ctx, figure, activeFigureInfo.hoveredDotName)
      }
    }

    if (figure.type === 'oval') {
      drawOval(ctx, figure, updateRainbowColorDeg)
      if (activeFigureInfo && figure.id === activeFigureInfo.id) {
        drawOvalActive(ctx, figure, activeFigureInfo.hoveredDotName)
      }
    }

    if (figure.type === 'text') {
      let isActive = false;
      let dotName = null;
      if (activeFigureInfo && figure.id === activeFigureInfo.id) {
        isActive = true;
        dotName = activeFigureInfo.hoveredDotName;
      }
      drawText(ctx, figure, updateRainbowColorDeg, isActive, dotName)
    }
  };

  // Static layer: persistent figures (pen/shapes/text). Skipped while
  // isDrawing=true so the in-progress stroke does not repaint N completed
  // figures every pointermove.
  useEffect(() => {
    if (isDrawing) return;
    const canvas = staticCanvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const offscreenCanvas = offscreenCanvasRef.current;
    allFigures.forEach((figure) => renderPersistentFigure(ctx, figure, offscreenCanvas));
  }, [allFigures, isDrawing, activeFigureInfo]);

  // Active layer: in-progress figure + transients (fade/laser/eraser).
  // Repaints every coalesced flush during drawing.
  useEffect(() => {
    const canvas = activeCanvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const offscreenCanvas = offscreenCanvasRef.current;

    if (isDrawing && allFigures.length > 0) {
      const last = allFigures[allFigures.length - 1];
      renderPersistentFigure(ctx, last, offscreenCanvas);
    }

    allFadeFigures.forEach((figure) => {
      if (figure.type === 'fadepen') {
        if (colorList[figure.colorIndex].name === 'color_rainbow') {
          drawRainbowPen(ctx, offscreenCanvas, figure, updateRainbowColorDeg, fadeOpacity)
        } else {
          drawPen(ctx, figure, fadeOpacity)
        }
      }
    })

    allLaserFigures.forEach((figure) => drawLaser(ctx, figure))
    allEraserFigures.forEach((figure) => drawEraserTail(ctx, figure))
  }, [allFigures, allFadeFigures, allLaserFigures, allEraserFigures, isDrawing, fadeOpacity, activeFigureInfo]);

  const isTemporaryEraser = (event) => {
    const contactLength = Math.max(event.width, event.height);
    const contactArea = event.width * event.height;
    const isPalm = contactLength >= palmMinContactLength && contactArea >= palmMinContactArea;

    return (event.pointerType === 'pen' && event.button === 5) ||
           (event.pointerType === 'mouse' && event.button === 1) ||
           (event.pointerType === 'touch' && isPalm);
  }

  const onPointerDown = (event) => {
    event.preventDefault();

    if(event.pointerType === 'mouse' && event.button === 2) return;

    if (isTemporaryEraser(event) && activeTool !== 'eraser') {
      prevToolRef.current = activeTool;
      simulateKeyDown.current = true;

      handleChangeTool('eraser');
      return
    }

    event.currentTarget.setPointerCapture(event.pointerId);

    const coordinates = getMouseCoordinates(event)
    handleMouseDown(coordinates);
  }

  const onPointerMove = (event) => {
    if (simulateKeyDown.current && activeTool === 'eraser') {
      simulateKeyDown.current = false;

      event.currentTarget.setPointerCapture(event.pointerId);

      const coordinates = getMouseCoordinates(event)
      handleMouseDown(coordinates);

      return;
    }

    const coordinates = getMouseCoordinates(event)

    handleMouseMove(coordinates);
  }

  const onPointerUp = (event) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    const coordinates = getMouseCoordinates(event)
    handleMouseUp(coordinates);

    if (prevToolRef.current) {
      handleChangeTool(prevToolRef.current);

      prevToolRef.current = null;
      simulateKeyDown.current = false;
    }
  }

  const onDoubleClick = (event) => {
    const coordinates = getMouseCoordinates(event);

    handleDoubleClick(coordinates);
  }

  return (
    <>
      <canvas
        id="canvas-static"
        ref={staticCanvasRef}
      />
      <canvas
        id="canvas-active"
        ref={activeCanvasRef}
        style={{ cursor: cursorType }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onDoubleClick={onDoubleClick}
      />
    </>
  );
};

export default DrawDesk;
