const express = require("express");
const router = express.Router();
const {
  createRecord,
  getRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
} = require("../controllers/recordController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/roleCheck");
const {
  validateRecord,
  validateUpdateRecord,
} = require("../middleware/validate");

router.use(protect);

router.get("/", authorize("viewer", "analyst", "admin"), getRecords);
router.get("/:id", authorize("viewer", "analyst", "admin"), getRecordById);
router.post("/", authorize("admin"), validateRecord, createRecord);
router.put("/:id", authorize("admin"), validateUpdateRecord, updateRecord);
router.delete("/:id", authorize("admin"), deleteRecord);

module.exports = router;
