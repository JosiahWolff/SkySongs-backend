const song = require("../models/song");
const BadRequestError = require("../utils/BadRequestError");
const NotFoundError = require("../utils/NotFoundError");
const ForbiddenError = require("../utils/ForbiddenError");

const getItems = (req, res, next) => {
  song
    .find({})
    .then((items) => res.status(200).send(items))
    .catch((e) => {
      console.error(e);
      next(e);
    });
};

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  song
    .create({ name, weather, imageUrl, owner })
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((e) => {
      console.error(e);

      if (e.name === "ValidationError") {
        next(new BadRequestError("Invalid data"));
      } else if (e.name === "CastError") {
        next(new BadRequestError("Invalid data"));
      } else {
        next(e);
      }
    });
};

const saveItem = (req, res, next) => {
  song
    .findByIdAndUpdate(
      req.params.id,
      { $addToSet: { saves: req.user._id } },
      { new: true }
    )
    .orFail()
    .then((item) => {
      res.status(200).send(item);
    })
    .catch((e) => {
      console.error(e);

      if (e.name === "ValidationError") {
        next(new BadRequestError("Invalid data"));
      } else if (e.name === "CastError") {
        next(new BadRequestError("Invalid data"));
      } else if (e.name === "DocumentNotFoundError") {
        next(new NotFoundError("Requested resource not found"));
      } else {
        next(e);
      }
    });
};

const unSaveItem = (req, res, next) => {
  song
    .findByIdAndUpdate(
      req.params.id,
      { $pull: { saves: req.user._id } },
      { new: true }
    )
    .orFail()
    .then((item) => {
      res.status(200).send(item);
    })
    .catch((e) => {
      console.error(e);

      if (e.name === "ValidationError") {
        next(new BadRequestError("Invalid data"));
      } else if (e.name === "CastError") {
        next(new BadRequestError("Invalid data"));
      } else if (e.name === "DocumentNotFoundError") {
        next(new NotFoundError("Requested resource not found"));
      } else {
        next(e);
      }
    });
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;

  console.log(itemId);
  song
    .findById(itemId)
    .orFail()
    .then((item) => {
      if (!item.owner.equals(req.user._id)) {
        return next(
          new ForbiddenError("You are not authorized to delete this item")
        );
      }
      return item.deleteOne().then(() => {
        res.status(200).send({ data: item, message: "Item deleted" });
      });
    })
    .catch((e) => {
      console.error(e);

      if (e.name === "ValidationError") {
        next(new BadRequestError("Invalid data"));
      } else if (e.name === "CastError") {
        next(new BadRequestError("Invalid data"));
      } else if (e.name === "DocumentNotFoundError") {
        next(new NotFoundError("Requested resource not found"));
      } else {
        next(e);
      }
    });
};

module.exports = {
  createItem,
  getItems,
  saveItem,
  unSaveItem,
  deleteItem,
};
