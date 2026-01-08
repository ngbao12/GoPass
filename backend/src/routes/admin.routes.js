const express = require("express");
const router = express.Router();
const AdminController = require("../controllers/AdminController");
const VnSocialController = require("../controllers/VnSocialController");
const { authenticate, authorize } = require("../middleware");

// All routes require authentication and admin role
router.use(authenticate);
router.use(authorize("admin"));

router.get("/users", AdminController.listUsers);
router.get("/metrics", AdminController.getSystemMetrics);

// Specific routes MUST come before general :userId route
router.put("/users/:userId/status", AdminController.updateUserStatus);
router.post("/users/:userId/reset-password", AdminController.resetUserPassword);

// General routes (MUST be last)
router.get("/users/:userId", AdminController.getUserDetail);
router.put("/users/:userId", AdminController.updateUserInfo);
router.get("/exam-stats", AdminController.getExamStats);

// Admin-only route for generating social debate topics
router.post("/social-debates", VnSocialController.getSocialDebateTopics);

module.exports = router;
