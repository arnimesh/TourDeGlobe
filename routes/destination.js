const express=require('express');
const router=express.Router();

const catchAsync=require('../utils/catchAsync');
const expressError=require('../utils/expressError');
const Destination=require('../models/destination');
const destinations=require('../controllers/destinations');
const { isLoggedIn , isAuthor, validateDestination, googleLoggedIn} = require('../middleware');
const destination = require('../models/destination');
const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require("../config/keys");
const User = require('../models/user');

const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

// router.get("/destination1",catchAsync(destinations.index));
router.get('/',catchAsync(destinations.index));

router.get('/new',isLoggedIn, catchAsync(destinations.renderNewForm));

router.post('/',isLoggedIn ,upload.array('image'),validateDestination,  catchAsync(destinations.createDestination));


router.get('/:id',catchAsync(destinations.showDestination));

router.get('/:id/edit',isLoggedIn,isAuthor, catchAsync(destinations.editDestination));



router.put('/:id',isLoggedIn, isAuthor,upload.array('image'), validateDestination, catchAsync(destinations.updateDestination))

router.delete('/:id',isLoggedIn,isAuthor, catchAsync(destinations.deleteDestination));


module.exports=router;