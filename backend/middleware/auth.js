const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const authHeader = req.header("Authorization");
  if (!authHeader) return res.status(401).json({ message: "No token, authorization denied" });

  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
  if (!token) return res.status(401).json({ message: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecret");
    const id = decoded?.user?.id || decoded?.id || decoded?._id || decoded?.sub;
    req.user = { id, ...(decoded.user || {}) };
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};
