const express = require("express");
const router = express.Router();
const expressError = require("../expressError");
const items = require("../fakeDb");

router.get("/", function (req, res) {
  res.json({ items });
});

router.get("/:name", function (req, res, next) {
  try {
    const foundItem = items.find((item) => item.name == req.params.name);
    if (foundItem) {
      return res.status(200).json(foundItem);
    } else {
      throw new expressError("Item not found", 404);
    }
  } catch (e) {
    next(e);
  }
});

router.post("/", (req, res, next) => {
  try {
    let name = req.body["name"];
    let price = parseFloat(req.body["price"]).toFixed(2);
    let newItem;
    const foundItem = items.find((item) => item.name == name);
    if (!isNaN(price) && name && !foundItem) {
      newItem = { name: name, price: price };
      items.push(newItem);
      return res.status(201).json({ item: newItem });
    } else if (!name) {
      throw new expressError("Name not entered correctly", 400);
    } else if (isNaN(price)) {
      throw new expressError("Price not entered correctly", 400);
    } else if (foundItem) {
      throw new expressError("Item already exist", 409);
    }
  } catch (e) {
    return next(e);
  }
});

router.patch("/:name", function (req, res, next) {
  try {
    let name = req.params["name"];
    let price = parseFloat(req.body["price"]).toFixed(2);
    const foundItem = items.find((item) => item.name == name);
    if (foundItem) {
      if (name) foundItem.name = req.body.name;
      else {
        throw new expressError("Name not entered correctly", 400);
      }
      if (!isNaN(req.body["price"])) foundItem.price = price;
      else if (req.body["price"] != undefined) {
        if (isNaN(req.body["price"])) {
          throw new expressError("Price not entered correctly", 400);
        }
      }

      return res.status(200).json({ item: foundItem });
    } else {
      throw new expressError("Item not found", 404);
    }
  } catch (e) {
    next(e);
  }
});

router.delete("/:name", (req, res, next) => {
  let name = req.params["name"];
  const foundItem = items.find((item) => item.name == name);
  try {
    if (foundItem) {
      items.splice(foundItem, 1);
      return res.status(200).json({ item: `${foundItem.name} was deleted` });
    } else {
      throw new expressError("Item not found", 404);
    }
  } catch (e) {
    next(e);
  }
});

module.exports = router;
