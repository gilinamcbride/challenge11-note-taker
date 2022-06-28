const router = require("express").Router();
const notesRoutes = require("../apiRoutes/api");

router.use(notesRoutes);
module.exports = router;
