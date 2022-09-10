//Create routes to serve the reactions
//CRUD operations
//POST -> Create Reaction
//GET -> Get all reactions
//GET -> Get reaction by id
//PUT -> Update reaction
//DELETE -> Delete reaction

const router = require("express").Router();

const Reaction = require("../models/Reaction.model");
const EmergencyEvent = require("../models/EmergencyEvent.model");
const User = require("../models/User.model");
const Session = require("../models/Session.model");
const isLoggedIn = require("../middleware/isLoggedIn");

//POST -> Create Reaction

router.post("", isLoggedIn, (req, res) => {

});