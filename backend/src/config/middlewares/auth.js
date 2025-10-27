const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({
      authenticated: false,
      message: "Cabeçalho de autorização ausente.",
    });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      authenticated: false,
      message: "Token ausente no cabeçalho de autorização.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res
      .status(401).json({ authenticated: false, message: "Token inválido ou expirado." });
  }
};

module.exports = verifyToken;