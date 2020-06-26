const express = require("express");
const bodyParser = require("body-parser");
const Favorites = require("../models/favorites");
const favoriteRouter = express.Router();
const verifyUser = require("../authentiate").verifyUser;
const cors = require("./cors");
const { verify } = require("jsonwebtoken");
const { facebook } = require("../config");

favoriteRouter.use(bodyParser.json());
favoriteRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, verifyUser, (req, res, next) => {
    console.log(req);
    Favorites.find({ user: req.user._id })
      .populate("dishes")
      .populate("user")
      .then((favorites) => {
        res.json(favorites);
      })
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, verifyUser, (req, res, user) => {
    const newDishes = req.body.map((elem) => elem._id);

    Favorites.findOne({ user: req.user._id }).then((favorite) => {
      if (!favorite) {
        Favorites.create({ user: req.user._id })
          .then((favorite) => {
            console.log("New favorite created");
            const oldDishes = [];
            let dishes = concatDishes(newDishes, oldDishes);
            favorite.dishes = dishes;
            favorite
              .save()
              .then(
                Favorites.findById(favorite._id)
                  .populate("user")
                  .populate("dishes")
                  .then((favorite) => {
                    res.json(favorite);
                  })
              )
              .catch((err) => next(err));
          })
          .catch((err) => next(err));
      } else {
        let oldDishes = favorite.dishes.map((elem) => elem.toString());
        let dishes = concatDishes(newDishes, oldDishes);
        favorite.dishes = dishes;
        favorite
          .save()
          .then((favorite) => {
            Favorites.findById(favorite._id)
              .populate("user")
              .populate("dishes")
              .then((favorite) => {
                res.json(favorite);
              })
              .catch((err) => next(err));
          })
          .catch((err) => next(err));
      }
    });
  })
  .put(cors.corsWithOptions, verifyUser, (req, res, next) => {
    res.status(403).end("PUT operations not supported on /favorites");
  })
  .delete(cors.corsWithOptions, verifyUser, (req, res, user) => {
    Favorites.deleteOne({ user: req.user._id })
      .then(
        (resp) => {
          res.json(resp);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

const concatDishes = () => {
  let dishes = newDishes.concat(oldDishes);
  dishes = new Set(dishes);
  dishes = [...dishes];
  return dishes;
};

favoriteRouter
  .route("/:dishId")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id })
      .then(
        (favorite) => {
          if (!favorite) {
            res.json({ exists: false, favorite: favorite });
          } else {
            if (favorite.dishes.indexOf(req.params.dishId) < 0) {
              return res.json({ exists: false, favorite: favorite });
            } else {
              return res.json({ exists: true, favorite: favorite });
            }
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id })
      .then(
        (favorite) => {
          if (!favorite) {
            Favorites.create({ user: req.user._id })
              .then((favorite) => {
                console.log("New favorite created");
                favorite.dishes.push(req.params.dishId);
                favorite
                  .save()
                  .then((favorite) => {
                    Favorites.findById(favorite._id)
                      .populate("user")
                      .populate("dishes")
                      .then((favorite) => {
                        res.json(favorite);
                      });
                  })
                  .catch((err) => next(err));
              })
              .catch((err) => next(err));
          } else {
            let oldDishes = favorite.dishes.map((elem) => elem.toString());
            let dishes = concatDishes(newDishes, oldDishes);
            favorite.dishes = dishes;
            favorite
              .save()
              .then(
                Favorites.findById(favorite._id)
                  .populate("user")
                  .populate("dishes")
                  .then((favorite) => {
                    res.json(favorite);
                  })
              )
              .catch((err) => next(err));
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(er));
  })
  .put(cors.corsWithOptions, verifyUser, (req, res, next) => {
    res.status(403).end("PUT operations not supported on /favorites/dishId");
  })
  .delete(cors.corsWithOptions, verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id })
      .then(
        (favorite) => {
          if (favorite) {
            let oldDishes = favorite.dishes.map((elem) => elem.toString());
            let dishes = new Set(oldDishes);
            let dishId = req.params.dishId;
            if (!dishes.has(dishId)) {
              err = new Error(`Dish ${dishId} not found in favorites`);
              err.status = 404;
              return next(err);
            } else {
              dishes.delete(dishId);
              dishes = [...dishes];
              favorite.dishes = dishes;
              favorite
                .save()
                .then((favorite) => {
                  Favorites.findById(favorite._id)
                    .populate("users")
                    .populate("dishes")
                    .then((favorite) => {
                      res.json(favorite);
                    });
                })
                .catch((err) => next(err));
            }
          } else {
            err = new Error(`Favorites for user ${req.user._id} doesn't exist`);
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

module.exports = favoriteRouter;
