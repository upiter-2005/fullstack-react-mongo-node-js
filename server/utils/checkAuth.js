import jwt from 'jsonwebtoken';

export default (req, res, next) => {
  const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

  if (token) {
    try {
      const decoded = jwt.verify(token, 'secret77');
      req.userId = decoded._id;
      next();
    } catch (error) {
      return res.status(403).json({
        message: 'No access to token',
      });
    }
  } else {
    return res.status(400).json({
      message: 'No access',
    });
  }
  //res.send(token);
};
