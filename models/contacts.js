const fs = require('fs/promises')
const path = require("path");


const contactsPath = path.resolve(__dirname + "/contacts.json");

const listContacts = async () => {
  try{
    const result = await fs.readFile(contactsPath, "utf-8");
    return JSON.parse(result);
  }
  catch(err){
    console.log(err);
  }
}

const getContactById = async (contactId) => {
  try{
    const result = await listContacts();
    return result.find(item => item.id === contactId);
  }
  catch(err){
    console.log(err);
  }
}

const removeContact = async (contactId) => {}

const addContact = async (body) => {}

const updateContact = async (contactId, body) => {}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
