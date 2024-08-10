const express = require("express");
const app = express();
const mongoose = require("mongoose");
const car = require("./locationModel");
const restaurant = require("./locationModel");
const geolib = require("geolib");
const locations = require("./locationsModel");
const { object } = require("@google/maps/lib/internal/validate");
const e = require("express");
exports.newCar = async (req, res) => {
  try {
    const { name, year, location } = req.body;
    const newLocation = new locations({
      name,
      year,
      location,
    });
    await newLocation.save();
    return res.status(200).json({ newLocation });
  } catch (error) {
    res.send("error: " + error.message);
    console.error(error.message);
  }
};

exports.findCar = async (req, res) => {
  try {
    const ceramic = [30.6123694, 32.296733];

    const { longitude, latitude } = req.body;
    const latLong = {
      latitude: latitude,
      longitude: longitude,
    };
    const coordinates = [longitude, latitude];
    //  const calculateDistance = geolib.getPreciseDistance(ceramic, me);
    // console.log(`\n distance is: ${calculateDistance} m \n`);
    const nearest = await locations.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: coordinates,
          },
          distanceField: "distance",
          maxDistance: 900,
          spherical: true,
          key: "location",
        },
      },
    ]);

    // const nearest = await locations
    //   .find({
    //     location: {
    //       $near: {
    //         $geometry: {
    //           type: "Point",
    //           coordinates: coordinates,
    //         },
    //         $maxDistance: 900,

    //       },
    //     },
    //   })

    // let result = nearest.length;

    //     let stationNames = []
    //     let stationsLocation = []
    //     nearest.forEach((stationName,stationLocation)=>{
    //       stationNames.push(stationName.name);
    //       stationsLocation.push(stationName.location.coordinates);
    //     })

    //     let newArr = [];
    //     let stationDistanceFromUser = [];

    //     let reversedObject;
    //     nearest.forEach((station) => {
    //       newArr.push(station.location.coordinates.reverse());
    //     });
    //     // console.log({ newArr });
    //     const objects = newArr.map((pair) => ({
    //       latitude: pair[0],
    //       longitude: pair[1],
    //     }));
    //     let finalObjects = Object.assign({}, objects);

    //      Object.values(finalObjects).forEach((element) => {

    //        let distance = geolib.getDistance(latLong, element);
    //        stationDistanceFromUser.push(distance);
    //        stationDistanceFromUser.sort((a, b) => a - b)
    //        console.log(`Distance from you and ${element.latitude},${element.longitude} : ${distance} meters`);
    //      });
    // console.log({stationDistanceFromUser});

    //     const response = {
    //       result,
    //       "nearest stations'name": stationNames,
    //       "nearby stations distance": stationsLocation,
    //       "distance": stationDistanceFromUser
    //     };
    const result = nearest.map((item) => {
      return {
        name: item.name,
        location: item.location,
        distance: item.distance.toPrecision(3) + " meters",
      };
    });
    
    res.json(result);
  } catch (error) {
    console.error("Error finding nearest station:", error);
    return res.status(500).json({ error: "Failed to find anything!", error });
  }
};
