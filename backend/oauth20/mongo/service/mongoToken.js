var userModel = require('../model/token');

async  function getTokenByRefresh (refresh_token){
    return  await userModel.findOne({
        refresh_token: refresh_token
    }).exec();
}

async function removeTokenByRefresh (refresh_token){
    return  await userModel.deleteOne({
        refresh_token: refresh_token
    }).exec();
}

module.exports = {
    getTokenByRefresh,
    removeTokenByRefresh
};
