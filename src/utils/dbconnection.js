const mongoose = require("mongoose");

const mongodb = {
     pathLocalhost: "mongodb://127.0.0.1/presences",
     pathAtlas: "mongodb+srv://...",
};

const urlBaseDados = mongodb.pathLocalhost;

mongoose.connect(urlBaseDados, {
     useNewUrlParser: true,
     useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
     console.log(`Mongoose connected to ${urlBaseDados}`);
});
mongoose.connection.on("error", (err) => {
     console.log("Occorred an error while connecting to database: ", err);
});
mongoose.connection.on("disconnected", () => {
     console.log("Mongoose disconnected. ");
});
