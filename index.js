const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;

const body = document.body;

const cellsHorizontal = 4;
const cellsVertical = 3;
const width = window.innerWidth;
const height = window.innerHeight;

const unitLengthX = width / cellsHorizontal;
const unitLengthY = height / cellsVertical;

const engine = Engine.create();
engine.world.gravity.y = 0; // disables gravity of the world
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
    Bodies.rectangle(width / 2, 0, width, 2, { isStatic: true }),
    Bodies.rectangle(width / 2, height, width, 2, { isStatic: true }), 
    Bodies.rectangle(0, height / 2, 2, height, { isStatic: true }),
    Bodies.rectangle(width, height / 2, 2, height, { isStatic: true })
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

const grid = Array(cellsVertical).fill(null).map(() => Array(cellsHorizontal).fill(false));
    // NOTES...
        // making a basic array with 'cells' (vertical or horizontal) # of slots 
        // filling each spot with 'null' as a placeholder 
        // map through it, replacing 'null' with 'false'
        // this approach beats the nested FOR loop (i and j) approach
        // additionally, this method makes it easy to change the rows (first 'cells') 
        // ...and columns (second 'cells')  

const verticals = Array(cellsVertical).fill(null).map(() => Array(cellsHorizontal - 1).fill(false));
const horizontals = Array(cellsVertical - 1).fill(null).map(() => Array(cellsHorizontal).fill(false));
    // These represents the vertical and horizontal walls of any grid

    // Generate a starting point in the grid
const startRow = Math.floor(Math.random() * cellsVertical);
const startColumn = Math.floor(Math.random() * cellsHorizontal);

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
        if (nextRow < 0 || nextRow >= cellsVertical || nextColumn < 0 || nextColumn >= cellsHorizontal) {
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

// Iterating over the walls, seeing which are 'false' to make the walls after the grid is randomly craeted
horizontals.forEach((row, rowIndex) => {
    row.forEach((open, columnIndex) => {
        if (open === true) {
            return;
        }

        const wall = Bodies.rectangle(
            columnIndex * unitLengthX + unitLengthX / 2,
            rowIndex * unitLengthY + unitLengthY,
            unitLengthX,
            5,
            {
                label: 'wall',
                isStatic: true
            }
        );
        World.add(world, wall);
    });
});

verticals.forEach((row, rowIndex) => {
    row.forEach((open, columnIndex) => {
        if (open === true) {
            return;
        }

        const wall = Bodies.rectangle(
            columnIndex * unitLengthX + unitLengthX,
            rowIndex * unitLengthY + unitLengthY / 2,
            5,
            unitLengthY,
            {
                label: 'wall',
                isStatic: true
            }
        );
        World.add(world, wall);
    });
});

// Drawing the success GOAL on the bottom right of the maze, dynamically in size relative to the cell units
const goal = Bodies.rectangle(
    width - unitLengthX / 2,
    height - unitLengthY / 2,
    unitLengthX * 0.7,
    unitLengthY * 0.7,
    {
        label: 'goal',
        isStatic: true
    }
);
World.add(world, goal);

// Drawing the starting BALL that begins on the top left of the maze, dynamically in size relative to the cell units
const ballRadius = Math.min(unitLengthX, unitLengthY) / 4;
const ball = Bodies.circle(unitLengthX / 2, unitLengthY / 2, ballRadius, {
    label: 'ball'
});
World.add(world, ball);

// Listen for user's keypresses to move the ball
document.addEventListener('keydown', event => {
    const { x, y } = ball.velocity;
    
    if (event.key === 'w') { // UP
        Body.setVelocity(ball, { x, y: y - 5 });
    }

    if (event.key === 'd') { // RIGHT
        Body.setVelocity(ball, { x: x + 5, y });
    }

    if (event.key === 's') { // DOWN
        Body.setVelocity(ball, { x, y: y + 5 });
    }

    if (event.key === 'a') { // LEFT
        Body.setVelocity(ball, { x: x - 5, y });
    }
});

// Win Condition
Events.on(engine, 'collisionStart', event => {
    event.pairs.forEach((collision) => {
        const labels = ['ball', 'goal'];

        if (labels.includes(collision.bodyA.label) && labels.includes(collision.bodyB.label)) {
            world.gravity.y = 1;
            world.bodies.forEach((body) => {
                if (body.label === 'wall') {
                    Body.setStatic(body, false);
                }
            })
        }
    });
});