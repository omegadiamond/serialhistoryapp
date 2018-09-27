module.exports = (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.trim().length >= 4) {
    req.author = req.headers.authorization
    next()
  } else {
    res.status(401).json({message: 'You are not authenticated!'})
  }
}
