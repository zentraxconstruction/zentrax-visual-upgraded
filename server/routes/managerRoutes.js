const router = require("express").Router();
const { requireAuth, requireRole } = require("../middleware/auth");
const ctrl = require("../controllers/managerController");

router.use(requireAuth, requireRole("manager", "admin"));
router.get("/projects",                 ctrl.getMyProjects);
router.put("/projects/:id/progress",    ctrl.updateProgress);
router.get("/projects/:id/milestones",  ctrl.getMilestones);
router.post("/projects/:id/milestones", ctrl.addMilestone);
router.put("/milestones/:id/toggle",    ctrl.toggleMilestone);
router.get("/projects/:id/uploads",     ctrl.getUploads);
router.post("/uploads",                 ctrl.addUpload);
router.get("/projects/:id/specs",       ctrl.getSpecs);
router.post("/projects/:id/specs",      ctrl.addSpec);

module.exports = router;
