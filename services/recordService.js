const Record = require("../models/Record");

const createRecord = async (data, userId) => {
  return await Record.create({ ...data, createdBy: userId });
};

const getRecords = async (filters) => {
  const {
    type,
    category,
    startDate,
    endDate,
    search,
    page = 1,
    limit = 10,
  } = filters;

  const query = { isDeleted: false };

  if (type) query.type = type;
  if (category) query.category = { $regex: category, $options: "i" };
  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }

  // Search category and notes
  if (search) {
    query.$or = [
      { category: { $regex: search, $options: "i" } },
      { notes: { $regex: search, $options: "i" } },
    ];
  }

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const total = await Record.countDocuments(query);
  const records = await Record.find(query)
    .populate("createdBy", "name email role")
    .sort({ date: -1 })
    .skip(skip)
    .limit(limitNum);

  return {
    records,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    },
  };
};

const getRecordById = async (id) => {
  const record = await Record.findOne({ _id: id, isDeleted: false }).populate(
    "createdBy",
    "name email role",
  );

  if (!record) {
    const error = new Error("Record not found");
    error.statusCode = 404;
    throw error;
  }

  return record;
};

const updateRecord = async (id, data) => {
  const record = await Record.findOne({ _id: id, isDeleted: false });

  if (!record) {
    const error = new Error("Record not found");
    error.statusCode = 404;
    throw error;
  }

  return await Record.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

// Soft delete
const deleteRecord = async (id) => {
  const record = await Record.findOne({ _id: id, isDeleted: false });

  if (!record) {
    const error = new Error("Record not found");
    error.statusCode = 404;
    throw error;
  }

  record.isDeleted = true;
  record.deletedAt = new Date();
  await record.save();
};

module.exports = {
  createRecord,
  getRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
};
