//Create roues to serve the user 
//CRUD Operations

//GET -> Get all users
//GET -> Get user by id
//PUT -> update user
//DELETE -> delete user

const router = require('express').Router();

//Require User model
const User = require('../models/User.model');

//Require middleware
const isLoggedIn = require('../middleware/isLoggedIn');

//GET -> Get all users

router.get('/', isLoggedIn, (req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => res.json(err))
})

//GET -> Get user by id

router.get('/:id', isLoggedIn, (req, res) => {
    const { id } = req.params;
    User.findById(id)
        .then(user => res.json(user))
        .catch(err => res.json(err))
})

//PUT -> update user
router.put('/:id', isLoggedIn, (req, res) => {
    const { id } = req.params.id;
    const { name, email, phone, address, emergencyContact, profilePic } = req.body;
    User.findByIdAndUpdate(req.params.id).
        then((user) => {
            user.name = name;
            user.email = email;
            user.phone = phone;
            user.address = address;
            user.emergencyContact = emergencyContact;
            user.profilePic = profilePic;
            return user.save();
        })
        .then(user => res.json(user))
        .catch(err => res.json(err))
})

//DELETE -> delete user

router.delete('/:id', isLoggedIn, (req, res) => {
    const { id } = req.params;
    User.findByIdAndDelete(id)
        .then(user => res.json({message: "User deleted"}))
        .catch(err => res.json(err))
})

module.exports = router;