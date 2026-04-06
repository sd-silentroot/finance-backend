const dashboardService = require("../services/dashboardService");

const getSummary = async (req, res, next) => {
  try {
    const summary = await dashboardService.getSummary();
    res.status(200).json({ success: true, data: summary });
  } catch (error) {
    next(error);
  }
};

const getCategoryTotals = async (req, res, next) => {
  try {
    const data = await dashboardService.getCategoryTotals();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

const getMonthlyTrends = async (req, res, next) => {
  try {
    const data = await dashboardService.getMonthlyTrends();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

const getRecentActivity = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const data = await dashboardService.getRecentActivity(limit);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSummary,
  getCategoryTotals,
  getMonthlyTrends,
  getRecentActivity,
};
