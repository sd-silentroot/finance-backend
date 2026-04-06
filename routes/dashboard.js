const express = require("express");
const router = express.Router();
const {
  getSummary,
  getCategoryTotals,
  getMonthlyTrends,
  getRecentActivity,
} = require("../controllers/dashboardController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/roleCheck");

router.use(protect);

router.get("/summary", authorize("analyst", "admin"), getSummary);
router.get("/categories", authorize("analyst", "admin"), getCategoryTotals);
router.get("/trends", authorize("analyst", "admin"), getMonthlyTrends);
router.get(
  "/recent",
  authorize("viewer", "analyst", "admin"),
  getRecentActivity,
);

module.exports = router;
