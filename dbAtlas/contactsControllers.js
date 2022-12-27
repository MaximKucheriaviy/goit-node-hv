const {contactModel} = require("./contactsDBmodel");
const User = require('./usersDBmodel');

const getAllContacts = async (params) => {
    const {owner, page, limit} = params;
    try{
        const result = await contactModel.find({owner}).populate('owner', 'email').skip((page - 1) * limit).limit(Number(limit));
        return result;
    }
    catch(err){
        console.log(err);
    }
    
}

const getContactById = async (contactId, owner) => {
    try{
        const result = await contactModel.find({_id: contactId, owner});
        return result;
    }
    catch(err){
        console.log(err);
    }
}

const createContact = async(newContact, owner) => {
    try{
        const allList = await contactModel.find();
        if(allList.some(item => item.name === newContact.name)){
            return null;
        }
        if(!newContact.hasOwnProperty("favorite")){
            newContact.favorite = false;
        }
        newContact.owner = owner;
        const result = await contactModel.create(newContact);
        return result;
    }
    catch(err){
        console.log(err);
    }
}

const removeContact = async (id) => {
    try{
        const result = await contactModel.findByIdAndRemove(id);
        return result;
    }
    catch(err){
        console.log(err);
    }
}


const updateContact = async (id, body) => {
    try{
        const result = await contactModel.findByIdAndUpdate(id, body);
        return result;
    }
    catch(err){
        console.log(err);
    }
}


module.exports = {
    getAllContacts,
    getContactById,
    createContact,
    removeContact,
    updateContact
}