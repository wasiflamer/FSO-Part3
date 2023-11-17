// part 3.12

// adding library functionality
const mongoose = require("mongoose");
// password
const password = process.argv[2];
// get name
const name = process.argv[3];
// get number
const number = process.argv[4];

// mongodb atlas uri
const url = `mongodb+srv://zenlooper1:${password}@cluster0.1sev2ah.mongodb.net/PhonebookApp?retryWrites=true&w=majority`;

// mongoose settings
mongoose.set("strictQuery", false);
mongoose.connect(url);

// schema ( basically what will be inside of model )
const entrySchema = new mongoose.Schema({
  name: String,
  number: String,
});

// creating model
const Entry = mongoose.model("Entry", entrySchema);

// creating new object from model
const entry = new Entry({
  name: name,
  number: number,
});

// fetch all the phone_numbers and names here here
// Find all users

if (process.argv.length == 3) {
  Entry.find({}).then((result) => {
    console.log(`phonebook:`);
    result.forEach((entry) => {
      console.log(`${entry.name} ${entry.number}`);
    });
    mongoose.connection.close();
  });
}

if (process.argv.length == 5) {
  // saving new object and closing connection
  entry.save().then((result) => {
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
}
