// mongodb setup
const mongoose = require("mongoose");
require("dotenv").config();

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

// mongodb atlas uri
// const url = `mongodb+srv://zenlooper1:${password}@cluster0.1sev2ah.mongodb.net/PhonebookApp?retryWrites=true&w=majority`;

console.log("connecting to", url);

mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

// schema
const entrySchema = new mongoose.Schema({
  name: String,
  number: String,
});

// formatting the scheme
entrySchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

// creating model and exporting
module.exports = mongoose.model("Entry", entrySchema);
