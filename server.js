const express = require("express");
require("dotenv").config();
const mongoose =require("mongoose");
const db=require('./dataBase')
const locationModel=require('./locationModel')
const NodeGeocoder = require("node-geocoder");
const bodyParser = require("body-parser");
const googleMapsClient = require("@google/maps");

const axios = require("axios");
const car=require("./locationController");
const app = express();
app.use(bodyParser.json());

const key = process.env.GOOGLE_API_KEY;
const options = {
  provider: "google",
  apiKey: key,
};
const geocoder = NodeGeocoder(options);
googleMapsClient.createClient({
  key: key,
});

app.get("/api/address", (req, res) => {
  googleMapsClient.geocoder(
    {
      address: "التل الكبير",
    },
    (err, response) => {
      if (err) {
        console.error("Error:", err);
        res.status(500).send("Error occurred");
      } else {
        console.log(response.json.results);
        res.send(response.json.results);
      }
    }
  );
});

app.post("/restaurants", async (req, res) => {
  const newRestraunts =new restraunt(req,body);

  newRestraunts.save()
  .then(restraunt => res.json({
    message:"done",
    restraunt
  }))
  .catch(err =>res.status(400).json({error:err.message}));

  app.listen(PORT,()=>{
    console.log('server is not running')
  });
 
});

app.get("/api/gym", async (req, res) => {
  const city = "ismailia";
  const neerTo = "ismailia";
  const category = "gym" ;
  const key = "AIzaSyBwj3AABMp5Sw9qpkfR1ByoBdrF1djZzFQ";
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${neerTo}+${category}+${city}&type=schools&key=${key}`;

  const { data } = await axios.get(url);
  console.log(data.name);
  res.json(data);
});

app.get("/api/location", async (req, res) => {
  try {
    const key = "AIzaSyBwj3AABMp5Sw9qpkfR1ByoBdrF1djZzFQ";
    const query = encodeURIComponent("مطعم شطا");
    const city = "ismailia";
    const category = "restaurant";
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}+${city}+${category}&key=${key}`;

    const response = await axios.get(url);

    if (response.data.status === "OK") {
      const { lat, lng } = response.data.results[0].geometry.location;
      res.json(response.data.results[0]);
    } else {
      console.error("Places API error:", response.data.error_message);
      res.status(500).json({
        error: "Places API error",
        reason: response.data.error_message
      });
    }
  } catch (error) {
    console.error("Error fetching location:", error.message);
    res.status(500).json({ error: "Failed to fetch location", message: error.message });
  }
});


app.post('/api/new',car.newCar);
app.get('/api/find',car.findCar);

app.get("/", (req, res) => {
  res.status(200).send("Welcome to the server");
});
app.get('/api', (req, res) => {
  res.send('hello from api !!')
})

app.listen(process.env.PORT || 1000, () => {
  console.log("listening on port " + process.env.PORT);
});
