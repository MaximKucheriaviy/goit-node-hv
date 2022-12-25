const {contactModel} = require("./contactsDBmodel");

//renae

const getAllContacts = async () => {
    try{
        const result = await contactModel.find();
        return result;
    }
    catch(err){
        console.log(err);
    }
    
}

const getContactById = async (contactId) => {
    try{
        const result = await contactModel.find({_id: contactId});
        return result;
    }
    catch(err){
        console.log(err);
    }
}

const createContact = async(newContact) => {
    try{
        const allList = await contactModel.find();
        if(allList.some(item => item.name === newContact.name)){
            return null;
        }
        if(!newContact.hasOwnProperty("favorite")){
            newContact.favorite = false;
        }
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