const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = await jwt.verify(token, 'SECRET');
  } catch (err) {
    return res.status(401).send({});
  }

  req.user = payload;
  return next();
};

module.exports = {
  auth,
};
