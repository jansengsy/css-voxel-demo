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

function Compass() {
  return (
    <div className="compass-container">
      <div className="compass">
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
  return (
    <>
      <div className="scene">
        <div className="world">
          {world.map((layer, z) => (
            <Layer key={z} z={z} grid={layer} />
          ))}
        </div>
      </div>
      <Compass />
    </>
  );
}
