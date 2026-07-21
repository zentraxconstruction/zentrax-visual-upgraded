const router = require("express").Router();
const { requireAdminAuth } = require("../middleware/adminAuth");
const upload = require("../middleware/upload");
const ctrl = require("../controllers/adminController");

router.use(requireAdminAuth);
router.get("/stats", ctrl.getStats);
router.get("/managers", ctrl.getManagers);
router.post("/managers", ctrl.addManager);
router.put("/managers/:id", ctrl.updateManager);
router.put("/managers/:id/toggle", ctrl.toggleManager);
router.delete("/managers/:id", ctrl.removeManager);
router.get("/projects", ctrl.getProjects);
router.post("/projects", ctrl.addProject);
router.put("/projects/:id/assign", ctrl.assignProject);
router.delete("/projects/:id", ctrl.deleteProject);
router.get("/clients", ctrl.getClients);
router.post("/clients", ctrl.addClient);
router.put("/clients/:id", ctrl.updateClient);
router.put("/clients/:id/toggle", ctrl.toggleClient);
router.delete("/clients/:id", ctrl.removeClient);
router.get("/feedback", ctrl.getFeedback);
router.get("/uploads", ctrl.getUploads);
router.get("/properties", ctrl.getProperties);
const propertyImageUpload = upload.fields([
  { name: "images", maxCount: 10 },
  { name: "replacementImages", maxCount: 10 },
]);
router.post("/properties", propertyImageUpload, ctrl.addProperty);
router.put("/properties/:id", propertyImageUpload, ctrl.updateProperty);
router.delete("/properties/:id", ctrl.deleteProperty);
router.patch("/properties/:id/hide", ctrl.hideProperty);
router.patch("/properties/:id/show", ctrl.showProperty);
router.patch("/properties/:id/feature", ctrl.toggleFeaturedProperty);
router.post("/properties/upload-images", upload.array("images", 10), ctrl.uploadPropertyImages);

module.exports = router;
