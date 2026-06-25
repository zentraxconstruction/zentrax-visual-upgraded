const router = require("express").Router();
const upload = require("../middleware/upload");
const { requireAuth, requireRole } = require("../middleware/auth");
const ctrl = require("../controllers/managerController");

// All manager routes require auth and manager/admin role
router.use(requireAuth, requireRole("manager", "admin"));
router.get("/projects",                 ctrl.getMyProjects);
// Accept multipart/form-data for creating projects (images optional)
router.post("/projects",                upload.array('images'), ctrl.addProject);
router.put("/projects/:id/progress",    ctrl.updateProgress);
router.delete("/projects/:id",         ctrl.deleteProject);
router.get("/clients",                 ctrl.getClients);
router.post("/clients",                ctrl.addClient);
router.delete("/clients/:id",          ctrl.removeClient);
router.get("/projects/:id/milestones",  ctrl.getMilestones);
router.post("/projects/:id/milestones", ctrl.addMilestone);
router.put("/milestones/:id/toggle",    ctrl.toggleMilestone);
router.get("/projects/:id/uploads",     ctrl.getUploads);
router.post("/uploads",                 ctrl.addUpload);
router.get("/projects/:id/specs",       ctrl.getSpecs);
router.post("/projects/:id/specs",      ctrl.addSpec);

module.exports = router;
