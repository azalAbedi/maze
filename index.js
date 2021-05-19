const { Engine, Render, Runner, World, Bodies } = Matter;
    // Grabbing all the Objects that we'll use from the Matter.js library
        // WORLD is the space where all our objects live
        // ENGINE works with the state of our World
        // RENDER is used to draw stuff onto the screen
        // RUNNER will coordinate updates between the Engine and the World
        // BODIES are a collection of all the shapes we can create

const body = document.body;

const engine = Engine.create();
const { world } = engine;
const render = Render.create({
    element: body, 
        // adding a place for the render object to place our world
    engine, // specify which engine to use
    options: { // specify the size of our world
        width: 800,
        height: 600
    }
});
Render.run(render); // tell the Render object what to render, in this case, our created "render"
Runner.run(Runner.create(), engine); // set up the coordination of our world state

const shape = Bodies.rectangle(200, 200, 50, 50, { // 200s are where the center point is x/y-axis in the world, the 50s are the width and height, respectively
    isStatic: true // keeps the shape where it is because gravity is turned on by default
});
World.add(world, shape); // adding the newly created shape above to the world
