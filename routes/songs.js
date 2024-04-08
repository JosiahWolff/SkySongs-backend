const router = require("express").Router();
const {
  createItem,
  deleteItem,
  saveItem,
  unSaveItem,
} = require("../controllers/songs");
// Import Validators
const { validateNewItem, validateId } = require("../middlewares/validation");

// Create
router.post("/", validateNewItem, createItem);

// Delete
router.delete("/:itemId", validateId, deleteItem);

// save
router.put("/:id/saves", validateId, saveItem);

// unSave
router.delete("/:id/saves", validateId, unSaveItem);

module.exports = router;
