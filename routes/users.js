const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUserRole,
  updateUserStatus,
} = require("../controllers/userController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/roleCheck");
const {
  validateUserRole,
  validateUserStatus,
} = require("../middleware/validate");

router.use(protect);

router.get("/", authorize("admin"), getAllUsers);
router.get("/:id", authorize("admin"), getUserById);
router.patch("/:id/role", authorize("admin"), validateUserRole, updateUserRole);
router.patch(
  "/:id/status",
  authorize("admin"),
  validateUserStatus,
  updateUserStatus,
);

module.exports = router;
