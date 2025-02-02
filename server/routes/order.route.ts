import express from "express";
import { authorizeRoles, isAutheticated } from "../middleware/auth";
import { updateAccessToken } from "../controllers/user.controller";
import { createOrder, deleteOrder, getALlOrders, getSingleOrder, updateOrderStatus } from "../controllers/order.controller";

const orderRouter = express.Router();

// Create a new order
orderRouter.post("/create-order", isAutheticated, createOrder);

// Get all orders (for admin)
orderRouter.get(
  "/get-orders",
  updateAccessToken,
  isAutheticated,
  authorizeRoles("admin"),
  getALlOrders
);

// Get a single order by ID
orderRouter.get(
  "/get-order/:id",  // Dynamic order ID parameter
  isAutheticated,
  authorizeRoles("admin"), 
  getSingleOrder  // Call getSingleOrder function from the controller
);

// Delete an order by ID (for admin)
orderRouter.delete(
  "/delete-order/:id",  // Dynamic order ID parameter
  isAutheticated,  
  authorizeRoles("admin"),  // Only allow admin to delete orders
  deleteOrder  // Call deleteOrder function from the controller
);

// Update the order status
orderRouter.put(
  "/update-order-status/:id",  // Route to update order status
  isAutheticated, 
  authorizeRoles("admin"), // Only allow admin to update order status
  updateOrderStatus // Call updateOrderStatus function from the controller
);

export default orderRouter;
