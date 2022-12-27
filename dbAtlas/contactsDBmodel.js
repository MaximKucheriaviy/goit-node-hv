const {Schema, model, SchemaType} = require("mongoose");


const contactsShema = new Schema({
    name: {
      type: String,
      required: [true, 'Set name for contact'],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    }
})

const contactModel = model("contacts", contactsShema);

module.exports = {
  contactModel
}