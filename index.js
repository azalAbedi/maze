const { Engine, Render, Runner, World, Bodies } = Matter;

const body = document.body;

const cells = 5;
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

