const mongoose = require("mongoose");

const card = new mongoose.Schema({
     number: { type: Number, unique: true, required: true },
     validaty: { type: Date },
});

const student = new mongoose.Schema(
     {
          number: { type: String, unique: true, required: true },
          name: { type: String, required: true },
          card: { type: card },
     },
     { collection: "students", autoCreate: true }
);

module.exports = mongoose.model("Student", student);
