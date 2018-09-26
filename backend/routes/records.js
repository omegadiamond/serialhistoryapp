const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.json({test: 'this is RECORD test'})
});

module.exports = router;
