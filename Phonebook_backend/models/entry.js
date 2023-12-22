// mongodb setup
const mongoose = require('mongoose')
require('dotenv').config()

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

// mongodb atlas uri
// const url = `mongodb+srv://zenlooper1:${password}@cluster0.1sev2ah.mongodb.net/PhonebookApp?retryWrites=true&w=majority`;

function validateNumber(number) {
  // Regular expression to match the desired formats: XX-XXXXXX or XXX-XXXXXX (X represents numbers)
  const regex = /^\d{2,3}-\d{6,}$|^\d{3}-\d{6,}$/

  // Check if the number matches the regex pattern and has a length of 8 or more
  return regex.test(number) && number.length >= 8
}

console.log('connecting to', url)

mongoose
  .connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

// schema
const entrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3, // Minimum length of 3 characters for the name
  },
  number: {
    type: String,
    required: true,
    validate: {
      validator: validateNumber,
      message:
        'Please enter a valid number in the format XX-XXXXXX or xxx-xxxxxx',
    },
  },
})

// formatting the scheme
entrySchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

// creating model and exporting
module.exports = mongoose.model('Entry', entrySchema)
