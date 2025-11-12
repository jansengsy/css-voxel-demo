// Simple house model
// Materials: 0 = empty, 1 = stone, 2 = wood, 3 = leaves, 4 = glass

// Helper function to create an empty 16x16x16 grid
const createEmptyGrid = () =>
  Array(16)
    .fill(null)
    .map(() =>
      Array(16)
        .fill(null)
        .map(() => Array(16).fill(0))
    );

// Build the house programmatically
const buildHouse = () => {
  const grid = createEmptyGrid();

  // Floor (Z = 0) - stone
  for (let y = 4; y <= 11; y++) {
    for (let x = 4; x <= 11; x++) {
      grid[0][y][x] = 1;
    }
  }

  // Walls (Z = 1-4) - wood with glass windows
  for (let z = 1; z <= 4; z++) {
    // Front wall
    for (let x = 4; x <= 11; x++) {
      grid[z][4][x] = x >= 6 && x <= 9 && z >= 2 && z <= 3 ? 4 : 2; // glass window
    }
    // Back wall
    for (let x = 4; x <= 11; x++) {
      grid[z][11][x] = 2;
    }
    // Left wall
    for (let y = 5; y <= 10; y++) {
      grid[z][y][4] = y >= 7 && y <= 8 && z >= 2 && z <= 3 ? 4 : 2; // glass window
    }
    // Right wall
    for (let y = 5; y <= 10; y++) {
      grid[z][y][11] = 2;
    }
  }

  // Roof (Z = 5-7) - wood in pyramid shape
  // Z = 5
  for (let y = 4; y <= 11; y++) {
    for (let x = 4; x <= 11; x++) {
      grid[5][y][x] = 2;
    }
  }
  // Z = 6
  for (let y = 5; y <= 10; y++) {
    for (let x = 5; x <= 10; x++) {
      grid[6][y][x] = 2;
    }
  }
  // Z = 7
  for (let y = 6; y <= 9; y++) {
    for (let x = 6; x <= 9; x++) {
      grid[7][y][x] = 2;
    }
  }
  // Z = 8 (top)
  for (let y = 7; y <= 8; y++) {
    for (let x = 7; x <= 8; x++) {
      grid[8][y][x] = 2;
    }
  }

  return grid;
};

export const house = {
  name: "Simple House",
  size: { x: 16, y: 16, z: 16 },
  materials: {
    0: "empty",
    1: "stone (floor)",
    2: "wood (walls/roof)",
    4: "glass (windows)",
  },
  data: buildHouse(),
};
