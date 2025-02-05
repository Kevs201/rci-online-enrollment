"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
require("dotenv").config();
const express_1 = __importDefault(require("express"));
exports.app = (0, express_1.default)();
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const error_1 = require("./middleware/error");
const user_route_1 = __importDefault(require("./routes/user.route"));
const course_route_1 = __importDefault(require("./routes/course.route"));
const order_route_1 = __importDefault(require("./routes/order.route"));
const notification_route_1 = __importDefault(require("./routes/notification.route"));
const analytics_route_1 = __importDefault(require("./routes/analytics.route"));
const layout_route_1 = __importDefault(require("./routes/layout.route"));
const express_rate_limit_1 = require("express-rate-limit");
// body parser
exports.app.use(express_1.default.json({ limit: "50mb" }));
// cookie parser
exports.app.use((0, cookie_parser_1.default)());
// cors => cross-origin resource sharing
exports.app.use((0, cors_1.default)({
    origin: "https://rci-online-enrollment-client.vercel.app",
    credentials: true, // Ensure cookies are sent with the request
}));
// api request limit
const limiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-8",
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
exports.app.use(limiter); // Apply rate limiter before routes to control the flow
// testing api (this is working fine)
exports.app.get("/test", (req, res, next) => {
    res.status(200).json({
        success: true,
        message: "API is working",
    });
});
// routes
exports.app.use("/api/v1", user_route_1.default, // Ensure that this is correctly imported
order_route_1.default, course_route_1.default, notification_route_1.default, analytics_route_1.default, layout_route_1.default);
// unknown route handler (for unrecognized routes)
exports.app.all("*", (req, res, next) => {
    const err = new Error(`Route ${req.originalUrl} not found`);
    err.statusCode = 404;
    next(err);
});
// error handling middleware
exports.app.use(error_1.ErrorMiddleware);
exports.default = exports.app;
