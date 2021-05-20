const { Engine, Render, Runner, World, Bodies } = Matter;

const body = document.body;

const cells = 3;
const width = 600;
const height = 600;

const engine = Engine.create();
const { world } = engine;
const render = Render.create({
    element: body, 
        // adding a place for the render object to place our world
    engine, // specify which engine to use
    options: { // specify the size of our world
        wireframes: true,
        width,
        height
    }
});
Render.run(render); // tell the Render object what to render, in this case, our created "render"
Runner.run(Runner.create(), engine); // set up the coordination of our world state

// Walls
const walls = [
    Bodies.rectangle(width / 2, 0, width, 40, { isStatic: true }),
    Bodies.rectangle(width / 2, height, width, 40, { isStatic: true }), 
    Bodies.rectangle(0, height / 2, 40, height, { isStatic: true }),
    Bodies.rectangle(width, height / 2, 40, height, { isStatic: true })
];
World.add(world, walls); // You can add a whole array of items at once!

// Maze Generation

const shuffle = (arr) => {
    let counter = arr.length;
    while (counter > 0) {
        const index = Math.floor(Math.random() * counter);
        counter--;
        const temp = arr[counter];
        arr[counter] = arr[index];
        arr[index] = temp;
    }
    return arr;
};

const grid = Array(cells).fill(null).map(() => Array(cells).fill(false));
    // NOTES...
        // making a basic array with 'cells' # of slots 
        // filling each spot with 'null' as a placeholder 
        // map through it, replacing 'null' with 'false'
        // this approach beats the nested FOR loop (i and j) approach
        // additionally, this method makes it easy to change the rows (first 'cells') 
        // ...and columns (second 'cells')  

const verticals = Array(cells).fill(null).map(() => Array(cells - 1).fill(false));
const horizontals = Array(cells - 1).fill(null).map(() => Array(cells).fill(false));
    // These represents the vertical and horizontal walls of any grid

    // Generate a starting point in the grid
const startRow = Math.floor(Math.random() * cells);
const startColumn = Math.floor(Math.random() * cells);

    // Algorithm to create a maze
const stepThroughCell = (row, column) => {
    // If I have visited the cell at (row, column), then return
    if (grid[row][column] === true) {
        return;
    }
    
    // Mark this cell as being visited by changing that point in the grid from 'false' to 'true'
    grid[row][column] = true;
    
    // Assemble randomly-ordered list of neighbours
    const neighbors = shuffle([
        [row - 1, column, 'up'], // above neighbour
        [row, column + 1, 'right'], // right neighbour
        [row + 1, column, 'down'], // below neighbour
        [row, column - 1, 'left'] // left neighbour
    ]);

    // For each neighbour...
    for (let neighbor of neighbors) {
        const [nextRow, nextColumn, direction] = neighbor;

        // See if that neighbour is out of bounds
        if (nextRow < 0 || nextRow >= cells || nextColumn < 0 || nextColumn >= cells) {
            continue; // ensures we don't leave the FOR loop just skip this iteration because we are out of bounds
        } 

        // If we have visited that neighbour, continue to the next neighbour
        if (grid[nextRow][nextColumn] === true) {
            continue; // we already visited this neighbour so move on
        }

        // Remove a wall either from the horizontals or verticals array
        if (direction === 'left') {
            verticals[row][column - 1] = true;
        } else if (direction === 'right') {
            verticals[row][column] = true;
        } else if(direction === 'up') {
            horizontals[row - 1][column] = true;
        } else if (direction === 'down') {
            horizontals[row][column] = true;
        }

        // Visit the next cell, calling this function again [recursion]
        stepThroughCell(nextRow, nextColumn);
    }
};

stepThroughCell(startRow, startColumn);