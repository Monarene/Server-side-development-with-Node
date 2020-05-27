const express = require("express");
const bodyParser = require("body-parser");

const promotionRouter = express.Router();

promotionRouter.use(bodyParser.json());

promotionRouter
  .route("/")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
  })
  .get((req, res, next) => {
    res.end("Will send the promotion al the promotions to you");
  })
  .post((req, res, next) => {
    res.end(
      "Will end the promotion: " +
        req.body.name +
        "with detail: " +
        req.body.description
    );
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on promotions");
  })
  .delete((req, res, next) => {
    res.end("deleting all promotions");
  });

promotionRouter
  .route("/:promotionId")
  .get((req, res, next) => {
    res.end("Will end the promotion " + req.params.promotionId + " to you!");
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end(
      "POST operation not supported on /promotions/" + req.params.promotionId
    );
  })
  .put((req, res, next) => {
    res.write("Updating the promotion " + req.params.promotionId + "\n");
    res.end(
      "Will update the promotion: " +
        req.body.name +
        "with details: " +
        req.body.description
    );
  })
  .delete((req, res, next) => {
    res.end("deleting all promotions" + +req.params.promotionId);
  });

module.exports = promotionRouter;
