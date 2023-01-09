const multer = require('multer');
const path = require('path');
const {v4} = require('uuid');


const tmp = path.resolve(__dirname, '../tmp');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, tmp);
    },
    filename: (req, file, cb) => {
        cb(null, v4() + file.originalname)
    },
    limits: {
        fileSize: 1048576,
    },
});


const upload = multer({
    storage: storage
})

module.exports = upload;