const Destination=require('../models/destination');
const { cloudinary } = require("../cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const User = require('../models/user');

var Fuse = require("fuse.js");

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports.index =async(req,res)=>{
  let count=0;

    if(req.query.search) {

        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        // Get all campgrounds from DB
       // Campground.find({$or: [{name: regex}, {location: regex}]}, function(err, alldestinations)
        Destination.find({$or: [{title: regex}, {location: regex}]}, function(err, alldestinations){
           if(err){
               console.log(err);
           } else {
              if(alldestinations.length < 1) {
                req.flash('error','No match , Please try again')
                res.redirect(`/destination`)
                 // noMatch = "No campgrounds match that query, please try again.";
              }
            //  console.log(alldestinations);
               count= alldestinations.length;
               // req.flash('success',count +" destinations found");
              res.render("destinations/index",{place:alldestinations,count:count});

           }
        });
    } 
    else{
    const place=await Destination.find({});
    res.render('destinations/index',{place:place,count:count});
    }

}
module.exports.renderNewForm=async(req,res)=>{
    res.render('destinations/new');
    
}

module.exports.createDestination=async(req,res)=>{
    const geoData = await geocoder.forwardGeocode({
        query: req.body.destination.location,
        limit: 1
    }).send()
  
    
    const place=new Destination(req.body.destination);
    place.geometry = geoData.body.features[0].geometry;

    place.images = req.files.map(f => ({ url: f.path, filename: f.filename }));

    place.author = req.user._id;
    await place.save();
    console.log(place);
    req.flash('success','successfully created a new destination')
    res.redirect(`/destination/${place._id}`)
}

module.exports.showDestination=async(req,res)=>{
    const place=await Destination.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
        }).populate('author');
    console.log(place);
    console.log(place.author._id);
     if(!place)
     {
        req.flash('error','cannot find destination')
          res.redirect('/destination')
     }
     else
    res.render('destinations/show',{place});
}

module.exports.editDestination=async(req,res)=>{
    const {id}=req.params;
    const place=await Destination.findById(req.params.id);
    if(!place)
     {
        req.flash('error','cannot find destination')
          res.redirect('/destination')
     }
     else
    res.render('destinations/edit',{place});
}
module.exports.updateDestination=async(req,res)=>{
    const {id}=req.params;
    const place=await Destination.findByIdAndUpdate(id,{ ...req.body.destination});
    const imgs=req.files.map(f => ({ url: f.path, filename: f.filename }));
    place.images.push(...imgs);
    await place.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await place.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success','successfully updated destination')
  
   res.redirect(`/destination/${place._id}`);
  }
//   module.exports.updateCampground = async (req, res) => {
//     const { id } = req.params;
//     console.log(req.body);
//     const campground = await Destination.findByIdAndUpdate(id, { ...req.body.campground });
//     const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
//     campground.images.push(...imgs);
//     await campground.save();
//     if (req.body.deleteImages) {
//         for (let filename of req.body.deleteImages) {
//             await cloudinary.uploader.destroy(filename);
//         }
//         await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
//     }
//     req.flash('success', 'Successfully updated campground!');
//     res.redirect(`/campgrounds/${campground._id}`)
// }

  module.exports.deleteDestination=async(req,res)=>{
    const {id}=req.params;
    await Destination.findByIdAndDelete(id);
    req.flash('success','successfully deleted desti')

   res.redirect("/destination");
  }
