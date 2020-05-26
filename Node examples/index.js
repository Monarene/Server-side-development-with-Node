var rect = require("./rectangle");

function solveRec(l, b) {
  console.log(`Solving for rectangle with l = ${l} and b =${b}`);

  rect(l, b, (err, rectangle) => {
    if (err) {
      console.log("ERROR: ", err.message);
    } else {
      console.log(
        `The area of the rectangle is ${rectangle.area()} and the perimeter of the rectangle is ${rectangle.perimeter()}`
      );
    }
  });
  console.log("This is a statement after our callback");
}

solveRec(2, 4);
solveRec(-3 - 4);
