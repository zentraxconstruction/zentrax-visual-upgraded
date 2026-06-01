const router = require("express").Router();
const { requireAuth, requireRole } = require("../middleware/auth");
const ctrl = require("../controllers/adminController");

router.use(requireAuth, requireRole("admin"));
router.get("/stats",               ctrl.getStats);
router.get("/managers",            ctrl.getManagers);
router.post("/managers",           ctrl.addManager);
router.delete("/managers/:id",     ctrl.removeManager);
router.get("/projects",            ctrl.getProjects);
router.post("/projects",           ctrl.addProject);
router.put("/projects/:id/assign", ctrl.assignProject);
router.delete("/projects/:id",     ctrl.deleteProject);
router.get("/clients",             ctrl.getClients);
router.post("/clients",            ctrl.addClient);
router.get("/feedback",            ctrl.getFeedback);
router.get("/uploads",             ctrl.getUploads);

module.exports = router;
