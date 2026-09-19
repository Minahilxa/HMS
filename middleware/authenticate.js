import jwt from "jsonwebtoken";

const getSecret = () =>
  process.env.JWT_SECRET || "healsync_enterprise_secure_key_2024";

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer "))
    return res.status(401).json({ message: "Auth required" });
  try {
    req.user = jwt.verify(authHeader.split(" ")[1], getSecret());
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid session" });
  }
};
