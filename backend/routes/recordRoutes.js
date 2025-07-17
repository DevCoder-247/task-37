const express = require('express');
const router = express.Router();
const Record = require('../models/Records');

router.post('/data', async (req, res) => {
    try {
        const newRecord = new Record(req.body);
        await newRecord.save();
        res.status(201).json({message: "DATA SAVED SUCCESSFULLY"});
    } catch(err) {
        res.status(400).json({ error: err.message});
    }
});

router.get('/aggregate', async (req, res) => {
  try {
    const groupByCategory = await Record.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);

    const averageValue = await Record.aggregate([
      { $group: { _id: null, avgValue: { $avg: "$value" } } }
    ]);

    const sortedByValue = await Record.aggregate([
      { $sort: { value: -1 } }
    ]);

    res.json({
      groupByCategory,
      averageValue: averageValue[0]?.avgValue || 0,
      sortedByValue
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;