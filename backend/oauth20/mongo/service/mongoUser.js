
var userModel = require('../model/user');

async  function getUser (username, password){
   return  await userModel.findOne({
       usuario: username,
       constrasena : password
    }).exec();
}

async  function getUserByUsername (username){
    return  await userModel.findOne({
        usuario: username
    }).exec();
}

module.exports = {
    getUser,
    getUserByUsername
};
