'use strict'
const express = require("express")
const router = express.Router()

// Controllers requires
const controllers = require("../controllers/routeController")

// Using controllers in specific routes
router.get("/about", controllers.about);
router.get("/root", controllers.root)
router.post("/root", controllers.rootPost);

//Exporting routes
module.exports = router;
