const axios = require("axios");
const Destination = require("../models/destination");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const { cloudinary } = require("../cloudinary");
const TripPlan = require("../models/tripPlan");
const user = require("../models/user");

module.exports.createDestination = async (req,res,next) =>{
    try {

        const geoData = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${req.body.name}.json?proximity=ip&access_token=${mapBoxToken}`)
        const destination = new Destination(req.body);
        destination.geometry = geoData.data.features[0].geometry;
        
        if(req.files){
            destination.photos = req.files.map(f => ({ url: f.path, filename: f.filename }));
        }
        await destination.save();
        res.send(destination);
    } catch (error) {
        next(error);
    }
}

module.exports.getAllDestination = async (req,res,next) =>{
    try {
        const destinations = await Destination.find({});
        res.status(200).send(destinations);
    } catch (error) {
        next(error);
    }
}


module.exports.getDestinationById = async (req,res,next) =>{
    try {
        const destination = await Destination.findById(req.params.id);
        res.status(200).send(destination);
    } catch (error) {
        next(error);
    }
}

module.exports.updateDestination = async (req,res,next) =>{
    try {
       
        const destination = await Destination.findByIdAndUpdate(req.params.id,{...req.body});
        if(req.files){
            const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
            destination.photos.push(...imgs);
        }        
        
        await destination.save();
        if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
         await destination.updateOne({ $pull: { photos: { filename: { $in: req.body.deleteImages } } } })
        }
        res.status(200).send("Destination Updated Successfully");
        
    } catch (error) {
        next(error);
    }

}

module.exports.deleteDestination = async (req,res,next) =>{
    try {
        await Destination.findByIdAndDelete(req.params.id)
        res.status(200).send("Destination Deleted Successfully")
    } catch (error) {
        next(error);
    }
}

module.exports.createTripPlan = async (req,res,next) =>{
    try {
        const tourists = [];
        tourists.push(req.body.userId)
        const tripPlan = new TripPlan({name:req.body.name,destinations:[],totalExpense:0,totalTime:0,tourists:tourists})
        const author = await user.findById(req.body.userId);
        tripPlan.author = author;
        tripPlan.save();
        res.status(200).send(tripPlan);
    } catch (error) {
        next(error);
    }
}

module.exports.getMyTripPlans = async (req,res,next) =>{
    try {
        const tripPlans = await TripPlan.find({author : req.body.userId});
        res.status(200).send(tripPlans);
    } catch (error) {
        next(error);
    }
}

module.exports.getTripPlan = async (req,res,next) =>{
    try {
        const tripPlan = await TripPlan.findById(req.params.id);
        res.status(200).send(tripPlan);
    } catch (error) {
        next(error);
    }
}

module.exports.addDestinationToPlan = async(req,res,next) =>{
    try {
        const tripPlan = await TripPlan.findById(req.params.id);
        const destination = await Destination.findById(req.params.desId);
        tripPlan.destinations.push(destination);
        tripPlan.totalExpense += destination.expense;
        tripPlan.totalTime += destination.timeToExplore;
        await tripPlan.save();
        res.status(200).send("Destination added Successfully")
    } catch (error) {
        next(error);
    }
}

module.exports.removeDestinationFromPlan = async(req,res,next) =>{
    try {
        const tripPlan = await TripPlan.findById(req.params.id);
        const destination = await Destination.findById(req.params.desId);
        await TripPlan.findByIdAndUpdate(req.params.id, { $pull: { destinations: req.params.desId } });
        tripPlan.totalExpense -= destination.expense;
        tripPlan.totalTime -= destination.timeToExplore;
        await tripPlan.save();
        
        res.status(200).send(tripPlan)
    } catch (error) {
        next(error);
    }
}

module.exports.addTourist = async(req,res,next) => {
    try {
        const tripPlan = await TripPlan.findById(req.params.id);
        const tourist = await user.findById(req.params.id);
        if(tourist) tripPlan.tourists.push(tourist);
        else res.status(404).send("Destination removed successfully");
        await tripPlan.save();
        res.status(200).send(tripPlan);
    } catch (error) {
        next(error);
    }
}

module.exports.deleteTripPlan = async(req,res,next) =>{
    try {
        await TripPlan.findByIdAndDelete(req.params.id);
        res.status(200).send("Trip plan deleted successfully");
    } catch (error) {
        next(error)
    }
}