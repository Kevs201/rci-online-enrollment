"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const user_controller_1 = require("../controllers/user.controller");
const order_controller_1 = require("../controllers/order.controller");
const orderRouter = express_1.default.Router();
// Create a new order
orderRouter.post("/create-order", auth_1.isAutheticated, order_controller_1.createOrder);
// Get all orders (for admin)
orderRouter.get("/get-orders", user_controller_1.updateAccessToken, auth_1.isAutheticated, (0, auth_1.authorizeRoles)("admin"), order_controller_1.getALlOrders);
// Get a single order by ID
orderRouter.get("/get-order/:id", // Dynamic order ID parameter
auth_1.isAutheticated, (0, auth_1.authorizeRoles)("admin"), order_controller_1.getSingleOrder // Call getSingleOrder function from the controller
);
// Delete an order by ID (for admin)
orderRouter.delete("/delete-order/:id", // Dynamic order ID parameter
auth_1.isAutheticated, (0, auth_1.authorizeRoles)("admin"), // Only allow admin to delete orders
order_controller_1.deleteOrder // Call deleteOrder function from the controller
);
// Update the order status
orderRouter.put("/update-order-status/:id", // Route to update order status
auth_1.isAutheticated, (0, auth_1.authorizeRoles)("admin"), // Only allow admin to update order status
order_controller_1.updateOrderStatus // Call updateOrderStatus function from the controller
);
exports.default = orderRouter;
