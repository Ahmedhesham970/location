const { populate } = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const mongodb = require("mongodb");

const locationsSchema = new mongoose.Schema({
  name: { type: String },
  location: {
    type: { type: String, enum: ["Point","point"],default: "Point" },
    coordinates: { type: [Number], required: true },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

// Set up 2dsphere index for location field
locationsSchema.index({ location: "2dsphere" });

const Location = mongoose.model("Location", locationsSchema);

module.exports = Location;


