module.exports = (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.trim().length >= 4 && req.headers.authorization !== 'undefined') {
    req.username = req.headers.authorization
    next()
  } else {
    res.status(401).json({error: 'You are not authenticated!'})
  }
}
