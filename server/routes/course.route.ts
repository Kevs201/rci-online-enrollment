import express from "express";
import {
  addAnswer,
  addQuestion,
  addReplyToReview,
  addReview,
  deleteCourse,
  editCourse,
  getAdminAllCourses,
  getAllCourses,
  getCourseByUser,
  getSingleCourse,
  uploadCourse,
} from "../controllers/course.controller";
import { authorizeRoles, isAutheticated } from "../middleware/auth";
import { updateAccessToken } from "../controllers/user.controller";
const courseRouter = express.Router();

courseRouter.post(
  "/create-course",
  updateAccessToken,
  isAutheticated,
  authorizeRoles("admin"),
  uploadCourse
);

courseRouter.put(
  "/edit-course/:id",
  updateAccessToken,
  isAutheticated,
  authorizeRoles("admin"),
  editCourse
);

courseRouter.get("/get-courses/:id", getSingleCourse);

courseRouter.get("/get-courses", getAllCourses);

courseRouter.get("/getAdminAllCourses",isAutheticated,authorizeRoles("admin"),getAdminAllCourses)

courseRouter.get(
  "/get-course-content/:id",
  updateAccessToken,
  isAutheticated,
  getCourseByUser
);

courseRouter.put(
  "/add-question",
  updateAccessToken,
  isAutheticated,
  addQuestion
);

courseRouter.put("/add-answer", updateAccessToken, isAutheticated, addAnswer);

courseRouter.put(
  "/add-review/:id",
  isAutheticated,
  addReview
);

courseRouter.put(
  "/add-repy",
  isAutheticated,
  authorizeRoles("admin"),
  addReplyToReview
);

courseRouter.get(
  "/get-courses",
  isAutheticated,
  getAllCourses
);

courseRouter.delete(
  "/delete-course/:id",
  updateAccessToken,
  isAutheticated,
  authorizeRoles("admin"),
  deleteCourse
);

export default courseRouter;
