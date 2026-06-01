const router = require("express").Router();
const { requireAuth, requireRole } = require("../middleware/auth");
const ctrl = require("../controllers/clientController");

router.use(requireAuth, requireRole("client", "admin"));
router.get("/project",                 ctrl.getMyProject);
router.get("/projects/:id/photos",     ctrl.getPhotos);
router.get("/projects/:id/milestones", ctrl.getMilestones);
router.get("/projects/:id/specs",      ctrl.getSpecs);
router.post("/feedback",               ctrl.submitFeedback);
router.get("/feedback",                ctrl.getMyFeedback);
router.post("/favorites/toggle",       ctrl.toggleFavorite);
router.get("/favorites",               ctrl.getFavorites);

module.exports = router;
