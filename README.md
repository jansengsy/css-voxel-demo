# CSS Voxel Demo

This project uses transforms, perspective, and stacking grids to create a 3D space with pure CSS.

Inspiration: https://tympanus.net/codrops/2025/03/03/css-meets-voxel-art-building-a-rendering-engine-with-stacked-grids/

# How it works:

## Setting up the 3D scene space

First, we establish a `scene` div, which controls perspective and applies `preserve-3d` to that scene and all the scene children.

```
.scene {
  perspective: 8000px;
  width: 1000px;
  height: 1000px;
}

.scene * {
  transform-style: preserve-3d;
}
```

We then create a `world` element to which we apply a transform, creating an isometric view of the scene. This element's size are calculated using the `grid size * cell size`. For example, a 16x16 grid with cells of 30px cubes:

```
.world {
  transform: rotateX(65deg) rotate(45deg);
  width: calc(16 * 30px);
  height: calc(16 * 30px);
}
```

These two elements create our 3D space. The `scene` element defines the total scene size, and the `world` creates a 'floor' for the world. The dimensions are defined by the grid and cell size, setting the overall constraints to the scene and acts as an anchor/base from which all grid layers are stacked on top of (along the Z axis)

## Cubes

Having created the base scene and world (our 3D space), we can start adding cubes to that space. Each cube has a position on a tridimensional grid along the X, Y, and Z axes.

A cube is defined like this:

```
<div class="cube">
  <div class="face top"></div>
  <div class="face frontRight"></div>
  <div class="face frontLeft"></div>
  <div class="face backLeft"></div>
  <div class="face backRight"></div>
  <div class="face bottom"></div>
</div>
```

with the following css:

```
.cube {
  position: relative;
  width: 30px;
  height: 30px;
  transform-style: preserve-3d;
  transform: translateZ(15px);
}

.face {
  position: absolute;
  inset: 0;
  background: var(--cube-color, #34dcf6);
  border: 1px solid
    color-mix(in srgb, var(--cube-color, #34dcf6) 80%, black 20%);
}

.face.top {
  transform: translateZ(15px);
}

.face.right {
  transform: rotateY(90deg) translateZ(15px);
}

.face.left {
  transform: rotateX(90deg) translateZ(15px);
}

.face.bottom {
  transform: rotateX(-90deg) translateZ(15px);
}

.face.front {
  transform: translateZ(15px);
}

.face.back {
  transform: rotateY(-90deg) translateZ(15px);
}
```

Firstly, we translate the cube up the Z axis by 15px (half the size of a cube). This logically places the cube at the center of its cell. We then translate each face of the cube along the X, Y, and Z axes. For example, the top face is translated a further 15px up the Z, positioning it at the top of the cubes area within its cell on the grid.

## Defining a world

Now, we need to define a world. This world object consists of Z layers represented as a 2d array for each layer along the Z axis of our grid. For example:

```
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
];
```

This defined a 4x4 world grid with 2 Z layers.

## Layer and Cube render functions

Now, let's create the functions for rendering the layers and cubes using this world object:

```
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
```

The `Layer` function will, for each layer within the world object, create a cube for each array index with a value of 1.

## Rendering our defined world within the scene

Finally, we can render each layer within our scene as children of our world div:

```
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
    </>
  );
}
```

and that's it! We're now rendering 16 cubes. 12 on the bottom layer, and 4 on the top layer.
