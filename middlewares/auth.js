const jwt = require('jsonwebtoken');
const { AutorizationError } = require('../errors/AutorizationError');

const auth = async (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = await jwt.verify(token, 'SECRET');
  } catch (err) {
    return next(new AutorizationError('Необходима авторазация'));
  }

  req.user = payload;
  return next();
};

module.exports = {
  auth,
};
