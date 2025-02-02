import express from "express";
import { authorizeRoles, isAutheticated } from "../middleware/auth";
import {
  getCoursesAnalytics,
  getOrderAnalytics,
  getUserAnalytics,
} from "../controllers/analytics.controller";

const analyticsRouter = express.Router();

analyticsRouter.get(
  "/get-users-analytics",
  isAutheticated,
  authorizeRoles("admin"),
  getUserAnalytics
);

analyticsRouter.get(
  "/get-order-analytics",
  isAutheticated,
  authorizeRoles("admin"),
  getOrderAnalytics
);

analyticsRouter.get(
  "/get-course-analytics",
  isAutheticated,
  authorizeRoles("admin"),
  getCoursesAnalytics
);

export default analyticsRouter;
