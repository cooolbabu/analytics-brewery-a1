// app.mjs
// Define the function as a string
const sayHelloString = `
globalThis.sayHello = function() {
    console.log("Hello!");
};`;

// Use eval to execute the string as code, which defines the function in the global scope
eval(sayHelloString);

// Now the function sayHello can be called
sayHello(); // This will print "Hello!"
