import "./App.css";

const CUBE_SIZE = 50;

// A simple 3D world represented as a Z → Y → X structure
const world = [
  // Z = 0
  [
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
  ],
  // Z = 1
  [
    [0, 0, 0, 0],
    [0, 1, 1, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0],
  ],
  // Z = 2
  [
    [0, 0, 0, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  // Z = 3
  [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  // Z = 4
  [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  // Z = 5
  [
    [0, 0, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
];

function Cube(props) {
  return (
    <div className="cube" {...props}>
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
            cell === 1 && (
              <Cube
                key={`${z}-${y}-${x}`}
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
