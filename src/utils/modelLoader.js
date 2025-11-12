/**
 * Load a model and optionally transform it
 */
export function loadModel(model, options = {}) {
  const { offset = { x: 0, y: 0, z: 0 }, scale = 1 } = options;

  // If no transformation needed, return as is
  if (offset.x === 0 && offset.y === 0 && offset.z === 0 && scale === 1) {
    return model.data;
  }

  // TODO: Implement offset and scale transformations
  return model.data;
}

/**
 * Combine multiple models into a single world
 * @param {Array} models - Array of model objects or objects with { model, position }
 * @param {number} gridSize - Size of the world grid
 */
export function combineModels(models, gridSize = 16) {
  const world = Array(gridSize)
    .fill(null)
    .map(() =>
      Array(gridSize)
        .fill(null)
        .map(() => Array(gridSize).fill(0))
    );

  models.forEach((item) => {
    // Handle both formats: direct model or { model, position }
    const model = item.data ? item : item.model;
    const position = item.position || { x: 0, y: 0, z: 0 };

    if (!model || !model.data) {
      console.error("Invalid model:", item);
      return;
    }

    model.data.forEach((layer, z) => {
      layer.forEach((row, y) => {
        row.forEach((cell, x) => {
          const newZ = z + position.z;
          const newY = y + position.y;
          const newX = x + position.x;

          // Only place if within bounds and not empty
          if (
            newZ >= 0 &&
            newZ < gridSize &&
            newY >= 0 &&
            newY < gridSize &&
            newX >= 0 &&
            newX < gridSize &&
            cell !== 0
          ) {
            // Overwrite existing voxel (last model wins)
            world[newZ][newY][newX] = cell;
          }
        });
      });
    });
  });

  return world;
}

/**
 * Create an empty world grid
 */
export function createEmptyWorld(size = 16) {
  return Array(size)
    .fill(null)
    .map(() =>
      Array(size)
        .fill(null)
        .map(() => Array(size).fill(0))
    );
}

/**
 * Get model metadata
 */
export function getModelInfo(model) {
  return {
    name: model.name,
    size: model.size,
    materials: model.materials,
    voxelCount: countVoxels(model.data),
  };
}

/**
 * Count non-empty voxels in model data
 */
function countVoxels(data) {
  let count = 0;
  data.forEach((layer) => {
    layer.forEach((row) => {
      row.forEach((cell) => {
        if (cell !== 0) count++;
      });
    });
  });
  return count;
}
