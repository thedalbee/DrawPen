import React, { forwardRef, memo } from "react";
import "./CuteCursor.scss";
import { colorList, widthList } from "../constants.js"

// Position is updated via ref (transform on the DOM node) so React does NOT re-render
// this component on every pointermove. Only re-renders when tool / color / width change.
const CuteCursor = memo(forwardRef(function CuteCursor({
  activeColorIndex,
  activeWidthIndex,
  activeTool,
  Icons,
}, ref) {
  const renderIconByToolName = (toolName) => {
    const iconColor = colorList[activeColorIndex].color;
    const iconSize = widthList[activeWidthIndex].icon_size;

    let iconProps = {
      size: iconSize,
      fill: iconColor,
      stroke: '#FFF',
      strokeWidth: "20"
    };

    if (colorList[activeColorIndex].name === "color_white") {
      iconProps.stroke = '#777';
    }

    if (colorList[activeColorIndex].name === "color_rainbow") {
      iconProps = {
        size: iconSize,
        fill: "url(#svg-gradient)",
        stroke: '#777',
        strokeWidth: "10"
      };
    }

    const monochromeIconProps = {
      size: iconSize,
      fill: '#333',
      stroke: "#DDD",
      strokeWidth: "10",
    }

    switch (toolName) {
      case "eraser":      return <Icons.Eraser {...monochromeIconProps} />
      case "laser":       return <Icons.Laser {...monochromeIconProps} />
      case "pen":         return <Icons.Brush {...iconProps} />
      case "fadepen":     return <Icons.MagicBrush {...iconProps} />
      case "arrow":       return <Icons.Arrow {...iconProps} />
      case "flat_arrow":  return <Icons.FlatArrow {...iconProps} />
      case "rectangle":   return <Icons.Rectangle {...iconProps} />;
      case "oval":        return <Icons.Oval {...iconProps} />;
      case "line":        return <Icons.Line {...iconProps} />;
      case "text":        return <Icons.Text {...iconProps} />;
      case "highlighter": return <Icons.Highlighter {...iconProps} />
      default:            return null
    }
  };

  return (
    <div
      id="cute_cursor"
      ref={ref}
      style={{ transform: `translate3d(0px, 0px, 0)`, willChange: 'transform' }}
    >
      <svg width="0" height="0">
        <linearGradient id="svg-gradient" gradientTransform="rotate(350)">
          <stop stopColor="red"    offset="0%" />
          <stop stopColor="orange" offset="20%" />
          <stop stopColor="yellow" offset="40%" />
          <stop stopColor="lime"   offset="60%" />
          <stop stopColor="aqua"   offset="70%" />
          <stop stopColor="blue"   offset="90%" />
        </linearGradient>
      </svg>
      {renderIconByToolName(activeTool)}
    </div>
  );
}));

export default CuteCursor;
