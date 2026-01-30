const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderLust";

main()
  .then(() => console.log("Database connected"))
  .catch((err) => console.log(err));

async function main() {
    await mongoose.connect(MONGO_URL);
};

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
      ...obj,
      owner: "694d292e44f869608bd667a9"
    }));
    await Listing.insertMany(initData.data);
    console.log("Database initialized with data");
}

initDB();