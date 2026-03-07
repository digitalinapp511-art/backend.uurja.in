import jwt from "jsonwebtoken";

export const protectAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Admin access only",
      });
    }

    req.admin = decoded;
    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};