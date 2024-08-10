const { populate } = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const mongodb = require("mongodb");

const restaurantSchema = new mongoose.Schema({
  name: { type: String },
  location: {
    type: { type: String, enum: ["Point"], required: true },
    coordinates: { type: [Number], required: true },
  },
  createdAt: { type: Date, default: Date.now },
});

// Set up 2dsphere index for location field
restaurantSchema.index({ location: "2dsphere" });

const restaurant = mongoose.model("restaurant", restaurantSchema);

module.exports = restaurant;
