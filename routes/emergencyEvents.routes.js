//Create routes to server the emergency events 
//CRUD operations
//POST -> Create Event
//GET -> Get all events
//GET -> Get event by id
//PUT -> Update event
//DELETE -> Delete event


const router = require("express").Router();

//Require User model, Reaction model, EmergencyEvent model and middleware

const User = require("../models/User.model");
const EmergencyEvent = require("../models/EmergencyEvent.model");
const Session = require("../models/Session.model");
const Reaction = require("../models/Reaction.model");
const isLoggedIn = require("../middleware/isLoggedIn");

//POST -> Create Event

router.post("/", isLoggedIn, (req, res) => {

    const emergencyEvent = req.body;
    //Find Session
    Session.findById(req.headers.authorization)
        //Create new EmergencyEvent
        .then((session) => {
            const user = session.user;
            const { typeOfEmergency,
                location,
                geolocation_lat,
                geolocation_lng,
                description,
                imageUrl,
                status } = emergencyEvent;

            EmergencyEvent.create({
                typeOfEmergency,
                location,
                geolocation_lat,
                geolocation_lng,
                description,
                imageUrl,
                status,
                user,
            })
                //Upadate user with new emergency event
                .then(event => {

                    console.log(event);
                    eventID = event._id;
                    return User.findByIdAndUpdate(user, { $push: { emergencyEvent: event._id } })
                })
                //Send find event by id
                .then(() => {
                    return EmergencyEvent.findById(eventID).populate("user", "-password")
                })
                //Send Response to new Event
                .then((eventDetails) => {
                    console.log(eventDetails);
                    return res.status(201).json(eventDetails);
                })

        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json({ errorMessage: "Something went wrong" });
        });

});

//GET -> Get all events
router.get("/", isLoggedIn, (req, res) => {
    //Find Event
    EmergencyEvent.find()
        //Add User to Event
        .populate("user", "-password")
        //Send Response
        .then((events) => {
            return res.status(200).json(events);
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json({ errorMessage: "Something went wrong" });
        });
});


//GET -> Get event by id
router.get("/:id", isLoggedIn, (req, res) => {
    //Find Event
    EmergencyEvent.findById(req.params.id)
        //Add User to Event
        .populate("user", "-password")
        //Send Response
        .then((event) => {
            return res.status(200).json(event);
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json({ errorMessage: "Something went wrong" });
        });
});

//PUT -> Update event
router.put("/:id", isLoggedIn, (req, res) => {
    //Find Event
    EmergencyEvent.findById(req.params.id)
        //Update Event
        .then((event) => {
            const { typeOfEmergency,
                location,
                geolocation_lat,
                geolocation_lng,
                description,
                imageUrl,
                status } = req.body;

            event.typeOfEmergency = typeOfEmergency;
            event.location = location;
            event.geolocation_lat = geolocation_lat;
            event.geolocation_lng = geolocation_lng;
            event.description = description;
            event.imageUrl = imageUrl;
            event.status = status;

            return event.save();
        })
        //Send Response
        .then((event) => {
            return res.status(200).json(event);
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json({ errorMessage: "Something went wrong" });
        });
})

//DELETE -> Delete event
router.delete("/:id", isLoggedIn, (req, res) => {
    //Find Event
    const eventID = req.params.id;
    EmergencyEvent.findById(eventID)
        .then((event) => {
            user_id = event.user[0];
            // console.log(user_id);
            return User.findByIdAndUpdate(user_id, { $pull: { emergencyEvent: event._id } })
        })
        .then(() => {
            return EmergencyEvent.findByIdAndDelete(eventID)
        })
        .then(() => {
            return res.status(200).json({ message: "Event deleted" });
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json({ errorMessage: "Something went wrong" });
        });
});



//Reaction Routes 

router.post("/:id/reactions", isLoggedIn, (req, res) => {

    const emergencyEventID = req.params.id;
    const reaction = req.body;

    Session.findById(req.headers.authorization)
        .then((session) => {
            const user = session.user;
            const { content } = reaction;

            Reaction.create({
                content,
                user,
            })
                .then((reaction) => {
                    return EmergencyEvent.findByIdAndUpdate(emergencyEventID, { $push: { reaction: reaction._id } })
                })
                .then(() => {
                    return EmergencyEvent.findById(emergencyEventID).populate("user", "-password").populate("reaction")
                })
                .then((event) => {
                    return res.status(201).json(event);
                })
                .catch((err) => {
                    console.log(err);
                    return res.status(500).json({ errorMessage: "Something went wrong" });
                });
        })

});

//GET -> Get all reactions

router.get("/:id/reactions", isLoggedIn, (req, res) => {
    const emergencyEventID = req.params.id;
    EmergencyEvent.findById(emergencyEventID)
        .populate("reaction")
        .then((event) => {
            return res.status(200).json(event.reaction);
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json({ errorMessage: "Something went wrong" });
        });
});


//GET -> Get reaction by id

router.get("/:id/reactions/:reactionID", isLoggedIn, (req, res) => {
    const emergencyEventID = req.params.id;
    const reactionID = req.params.reactionID;
    EmergencyEvent.findById(emergencyEventID)
        .populate("reaction")
        .then((event) => {
            const reaction = event.reaction.find((reaction) => reaction._id == reactionID);
            return res.status(200).json(reaction);
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json({ errorMessage: "Something went wrong" });
        });
});

//PUT -> Update reaction

router.put("/:id/reactions/:reactionID", isLoggedIn, (req, res) => {
    const emergencyEventID = req.params.id;
    const reactionID = req.params.reactionID;
    const {content} = req.body;
    

    Reaction.findByIdAndUpdate(reactionID).
        then((reaction) => {
            reaction.content = content;
            return reaction.save();
        })
        .then((reaction) => {
            return EmergencyEvent.findById(emergencyEventID).populate("user", "-password").populate("reaction")
        }).
        then((event) => {
            return res.status(200).json(event);
        })
});

//DELETE -> Delete reaction

router.delete("/:id/reactions/:reactionID", isLoggedIn, (req, res) => {
    const emergencyEventID = req.params.id;
    const reactionID = req.params.reactionID;
    EmergencyEvent.findByIdAndUpdate(emergencyEventID, { $pull: { reactions: reactionID } })
        .then(() => {
            return Reaction.findByIdAndDelete(reactionID);
        })
        .then(() => {
            return EmergencyEvent.findById(emergencyEventID).populate("user", "-password").populate("reaction")
        })
        .then((event) => {
            return res.status(200).json(event);
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json({ errorMessage: "Something went wrong" });
        });
});


module.exports = router;