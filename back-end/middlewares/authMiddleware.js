const jwt = require("jsonwebtoken");

const protect = (roles = []) => {
    return (req, res, next) => {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Access denied. No token provided." });
        }

        try {
            // ✅ Verify Token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;

            // ✅ Role-Based Access Control
            if (roles.length && !roles.includes(decoded.role)) {
                return res.status(403).json({ message: "Forbidden: You do not have access." });
            }

            // ✅ CRUCIAL PART: Move to Next Middleware (Multer)
            next();
        } catch (error) {
            res.status(401).json({ message: "Invalid token" });
        }
    };
};

module.exports = protect;
