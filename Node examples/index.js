var rect = require("./rectangle");

function solveRec(l, b) {
  console.log(`Solving for rectangle with l = ${l} and b =${b}`);

  if (l <= 0 || b <= 0) {
    throw new Error("Rectange dimensions should be greater than zero");
  } else {
    console.log(
      `The area of the rectangle is ${rect.area(
        l,
        b
      )} amd the perimeter of the rectange is ${rect.perimeter(l, b)}`
    );
  }
}

solveRec(2, 4);
solveRec(-3 - 4);
