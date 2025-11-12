import { useState, useRef } from "react";
import "./App.css";
import { tree, house, MATERIALS } from "./models";
import { combineModels } from "./utils/modelLoader";

const GRID_SIZE = 26;
const CUBE_SIZE = 30;

// Load a model - you can use multiple models with different positions
// Option 1: Simple array of models (all placed at origin)
// const world = combineModels([tree]);

// Option 2: Models with custom positions
// const world = combineModels([tree, house]);

// Option 3: Models with custom positions and scale
const world = combineModels(
  [
    { model: tree, position: { x: 2, y: 2, z: 0 }, scale: 1 },
    { model: house, position: { x: 12, y: 2, z: 0 }, scale: 0.5 },
  ],
  GRID_SIZE
);

function Cube({ material, style, ...props }) {
  const color = MATERIALS[material] || "#34dcf6";
  return (
    <div
      className="cube"
      style={{ "--cube-color": color, ...style }}
      {...props}
      data-material={material}
      data-color={color}
    >
      <div className="face top"></div>
      <div className="face right"></div>
      <div className="face left"></div>
      <div className="face bottom"></div>
      <div className="face front"></div>
      <div className="face back"></div>
    </div>
  );
}

function Layer({ z, grid }) {
  return (
    <div className="layer" style={{ "--z": z }}>
      {grid.map((row, y) =>
        row.map(
          (cell, x) =>
            cell !== 0 && (
              <Cube
                key={`${z}-${y}-${x}`}
                material={cell}
                style={{ gridArea: `${y + 1} / ${x + 1}` }}
              />
            )
        )
      )}
    </div>
  );
}

function Compass({ rotateX, rotateZ, rotateY, zoom }) {
  return (
    <div className="compass-container">
      <div
        className="compass"
        style={{
          transform: `rotateX(${rotateX}deg) rotateZ(${rotateZ}deg) rotateY(${rotateY}deg) scale(${zoom})`,
        }}
      >
        <div className="axis x-axis">
          <div className="axis-line"></div>
          <div className="axis-label">X</div>
        </div>
        <div className="axis y-axis">
          <div className="axis-line"></div>
          <div className="axis-label">Y</div>
        </div>
        <div className="axis z-axis">
          <div className="axis-line"></div>
          <div className="axis-label">Z</div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  // Camera controls state
  const [rotateX, setRotateX] = useState(65);
  const [rotateY, setRotateY] = useState(0);
  const [rotateZ, setRotateZ] = useState(45);
  const [zoom, setZoom] = useState(1);

  // Mouse drag tracking
  const isDragging = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  // Handle mouse drag for rotation
  const handleMouseDown = (e) => {
    isDragging.current = true;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;

    const deltaX = e.clientX - lastMousePos.current.x;
    const deltaY = e.clientY - lastMousePos.current.y;

    setRotateZ((prev) => prev + -deltaX * 0.5);
    setRotateX((prev) => Math.max(-90, Math.min(90, prev - deltaY * 0.5)));

    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  // Handle mouse wheel for zoom
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY * -0.001;
    setZoom((prev) => Math.max(0.3, Math.min(3, prev + delta)));
  };

  // Handle keyboard controls
  const handleKeyDown = (e) => {
    const step = e.shiftKey ? 10 : 5;

    switch (e.key) {
      case "ArrowLeft":
        setRotateZ((prev) => prev - step);
        break;
      case "ArrowRight":
        setRotateZ((prev) => prev + step);
        break;
      case "ArrowUp":
        setRotateX((prev) => Math.max(-90, Math.min(90, prev + step)));
        break;
      case "ArrowDown":
        setRotateX((prev) => Math.max(-90, Math.min(90, prev - step)));
        break;
      case "+":
      case "=":
        setZoom((prev) => Math.min(3, prev + 0.1));
        break;
      case "-":
      case "_":
        setZoom((prev) => Math.max(0.3, prev - 0.1));
        break;
      case "r":
      case "R":
        // Reset to default view
        setRotateX(65);
        setRotateY(0);
        setRotateZ(45);
        setZoom(1);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <div
        className="scene"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        style={{
          outline: "none",
          cursor: isDragging.current ? "grabbing" : "grab",
        }}
      >
        <div
          className="world"
          style={{
            transform: `rotateX(${rotateX}deg) rotateZ(${rotateZ}deg) rotateY(${rotateY}deg) scale(${zoom})`,
          }}
        >
          {world.map((layer, z) => (
            <Layer key={z} z={z} grid={layer} />
          ))}
        </div>
      </div>
      <Compass
        rotateX={rotateX}
        rotateZ={rotateZ}
        rotateY={rotateY}
        zoom={zoom}
      />
      <div className="controls-info">
        <div>🖱️ Drag to rotate</div>
        <div>🖱️ Scroll to zoom</div>
        <div>⌨️ Arrow keys to rotate</div>
        <div>⌨️ +/- to zoom</div>
        <div>⌨️ R to reset view</div>
      </div>
    </>
  );
}
