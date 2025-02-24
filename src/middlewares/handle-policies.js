import { verifyToken } from "../utils/index.js";

const handlePolicies = (policies) => (req, res, next) => {
  if (policies[0] === "PUBLIC") return next();
  
  const authHeaders = req.headers.authorization;
  if (!authHeaders) {
    return res.status(401).json({
      status: "error",
      error: "Acceso denegado. Token no proporcionado o vencido",
    });
  }
  
  const token = authHeaders.split(" ")[1];
  const user = verifyToken(token);

  if (!policies.includes(user.role.toUpperCase())) {
    return res.status(403).json({
      status: "error",
      error: "Acceso prohibido. No tiene los permisos necesarios",
    });
  }
  
  req.user = user;
  next();
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin role required.' });
  }
};

export const isUser = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized. User must be logged in.' });
  }
};



export default handlePolicies;