const fs = require('fs/promises')
const path = require("path");
const {v4} = require("uuid");


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

const removeContact = async (contactId) => {
  try{
    const data = await listContacts();
    const index = data.findIndex(item => item.id === contactId);
    if(index === -1){
      return null;
    }
    const item = data.splice(index, 1);
    await fs.writeFile(contactsPath, JSON.stringify(data));
    return item;
  }
  catch(err){
    console.log(err);
  }
}

const addContact = async (body) => {
  try{
    const data = await listContacts();
    body.id = v4();
    if(data.some(item => item.name === body.name)){
      return null;
    }
    data.push(body);
    await fs.writeFile(contactsPath, JSON.stringify(data));
    return body;
  }
  catch(err){
    console.log(err);
  }
}

const updateContact = async (contactId, body) => {
  try{
    const data = await listContacts();
    const index = data.findIndex(item => item.id === contactId);
    if(index === -1){
      return null;
    }
    data[index].name = body.name;
    data[index].email = body.email;
    data[index].phone = body.phone;
    await fs.writeFile(contactsPath, JSON.stringify(data));
    return data[index];
  }
  catch(err){
    console.log(err);
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
