const { Engine, Render, Runner, World, Bodies, MouseConstraint, Mouse } = Matter;
    // Grabbing all the Objects that we'll use from the Matter.js library
        // WORLD is the space where all our objects live
        // ENGINE works with the state of our World
        // RENDER is used to draw stuff onto the screen
        // RUNNER will coordinate updates between the Engine and the World
        // BODIES are a collection of all the shapes we can create
        // MouseConstraint AND MOUSE are used to respond to mouse input

const body = document.body;

const width = 800;
const height = 600;

const engine = Engine.create();
const { world } = engine;
const render = Render.create({
    element: body, 
        // adding a place for the render object to place our world
    engine, // specify which engine to use
    options: { // specify the size of our world
        wireframes: false,
        width,
        height
    }
});
Render.run(render); // tell the Render object what to render, in this case, our created "render"
Runner.run(Runner.create(), engine); // set up the coordination of our world state

World.add(world, MouseConstraint.create(engine, {
    mouse: Mouse.create(render.canvas)
})); // enables mouse input to be felt in the world

// const shape = Bodies.rectangle(200, 200, 50, 50, { // 200s are where the center point is x/y-axis in the world, the 50s are the width and height, respectively
//     isStatic: true // keeps the shape where it is because gravity is turned on by default
// });
// World.add(world, shape); // adding the newly created shape above to the world

// Walls
const walls = [
    Bodies.rectangle(400, 0, 800, 40, { isStatic: true }),
    Bodies.rectangle(400, 600, 800, 40, { isStatic: true }),
    Bodies.rectangle(0, 300, 40, 600, { isStatic: true }),
    Bodies.rectangle(800, 300, 40, 600, { isStatic: true })
];
World.add(world, walls); // You can add a whole array of items at once!

// Random Shapes
for (let i = 0; i < 50; i++) {
    if (Math.random() > 0.5) {
        World.add(
            world, 
            Bodies.rectangle(Math.random() * width, Math.random() * height, 50, 50)
        );
    } else {
        World.add(
            world, 
            Bodies.circle(Math.random() * width, Math.random() * height, 35, {
                render: {
                    fillStyle: 'green' // makes the all circles green
                }
            })
        );
    }
}