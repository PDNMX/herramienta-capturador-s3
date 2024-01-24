var express = require("express");
var bodyParser = require('body-parser');
var randomstring = require("randomstring");
//var cons = require('consolidate');
var __ = require('underscore');
__.string = require('underscore.string');
const mongoose = require('mongoose');
var randtoken = require('rand-token');
var jwt = require('jsonwebtoken');
/* const https = require('https')
const fs = require('fs'); */
var cors = require('cors');
const crypto = require("crypto");


require('dotenv').config({path: './.env'});
//require('dotenv').config({path: './config/configuration.env'});

var userService= require("./mongo/service/mongoUser");
var clientService = require("./mongo/service/mongoClient");
var tokenService = require("./mongo/service/mongoToken");
var tokenModel = require('./mongo/model/token');

// Encrypts the password using SHA256 Algorithm, for enhanced security of the password
const encryptPassword = (password) => {
    // We will hash the password using SHA256 Algorithm before storing in the DB
    // Creating SHA-256 hash object
    const hash = crypto.createHash("sha256");
    // Update the hash object with the string to be encrypted
    hash.update(password);
    // Get the encrypted value in hexadecimal format
    return hash.digest("hex");
  };

var app = express();
//parse the response
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // support form-encoded bodies (for the token endpoint)
app.use(cors());

//connection mongo db
const db = mongoose.connect('mongodb://'+process.env.USERMONGO+':'+process.env.PASSWORDMONGO+'@'+process.env.HOSTMONGO+'/'+process.env.DATABASE + '?authSource=admin', { useNewUrlParser: true,  useUnifiedTopology: true  })
    .then(() => console.log('Connect to MongoDB..'))
    .catch(err => console.error('Could not connect to MongoDB..', err))

app.post('/oauth/token',async  function(req, res) {
    let clientObject = decodeClientCredentials(req);
    let scopeBody = req.body.scope ?  req.body.scope.split(' ') : [];
    if(clientObject.id){
        let cliente = await clientService.getClient(clientObject.id);
                if(cliente){
                    let clientSecret='';
                    if(cliente.clientSecret){
                        clientSecret = cliente.clientSecret;
                    }
                    if(clientObject.secret === clientSecret){
                    if (req.body.grant_type == 'password'){
                        if (req.body.username && req.body.password) {
                            let username = req.body.username;
                            let password = encryptPassword(req.body.password);

                            let user = await userService.getUser(username, password);
                            let scopes= '';
                            if (user) {
                                user = user.toObject();
                                if(user.scope.length < scopeBody.length){
                                    return res.status(422).json({code: '422' ,message: 'Scope no válido'});
                                }else {
                                    let arrayUserScope= user.scope;
                                    if(scopeBody.length > 0){
                                        let errorScopeInvalid = false;
                                        scopeBody.forEach(function(entry){
                                            if(arrayUserScope.includes(entry)){
                                                scopes = scopes + entry + ' ';
                                            }else{
                                                errorScopeInvalid = true;
                                            }
                                        });
                                    if(errorScopeInvalid){
                                        return res.status(422).json({code: '422' ,message: 'Scope no válido'});
                                    }
                                    }else if(arrayUserScope.length > 0){
                                        return res.status(422).json({code: '422' ,message: 'Scope no proporcionado'});
                                    }
                                }

                                let tokenResponse = createToken(clientObject.id, user._id, scopes);
                                let tokenInstance = new tokenModel(tokenResponse);
                                tokenInstance.save(function (err) {
                                    if (err) return handleError(err);
                                    delete tokenResponse.client;
                                    delete tokenResponse.user;
                                    delete tokenResponse.refresh_token_expires_in_date;
                                    if(tokenResponse.scope == ''){
                                        delete tokenResponse.scope;
                                    }
                                    res.status(200).json(tokenResponse);
                                });
                            } else {
                                return res.status(401).json({code: '401' ,message: 'Error en las credenciales del usuario, verificar los datos '});
                            }
                        }else{
                            return res.status(422).json({code: '422' ,message: 'No se enviaron correctamente los parametros del usuario'});
                        }
                    } else if (req.body.grant_type === 'refresh_token') {
                        // refresh token logic
                        let refresh = req.body.refresh_token;
                        if (refresh) {
                            let token = await tokenService.getTokenByRefresh(refresh);
                            if (token) {
                                if (clientObject.id === token.client.clientId) {
                                    var now = Math.floor(Date.now() / 1000);
                                    if (token.refresh_token_expires_in_date >= now) {
                                        let user = await userService.getUserByUsername(token.user.username);
                                        let scopes= '';

                                        if(user.scope.length < scopeBody.length){
                                            return res.status(422).json({code: '422' ,message: 'Scope no válido'});
                                        }else {
                                            let arrayUserScope= user.scope;
                                            if(scopeBody.length > 0){
                                                let errorScopeInvalid = false;
                                                scopeBody.forEach(function(entry){
                                                    if(arrayUserScope.includes(entry)){
                                                        scopes = scopes + entry + ' ';
                                                    }else{
                                                        errorScopeInvalid = true;
                                                    }
                                                });
                                                if(errorScopeInvalid){
                                                    return res.status(422).json({code: '422' ,message: 'Scope no válido'});
                                                }
                                            }else if(arrayUserScope.length > 0){
                                                return res.status(422).json({code: '422' ,message: 'Scope no proporcionado'});
                                            }
                                        }

                                        let tokenResponse = createToken(clientObject.id, token.user.idUser, scopes);
                                        let tokenInstance = new tokenModel(tokenResponse);
                                        tokenInstance.save(async function (err) {
                                            if (err) return handleError(err);
                                            delete tokenResponse.client;
                                            delete tokenResponse.user;
                                            delete tokenResponse.refresh_token_expires_in_date;
                                            if(tokenResponse.scope == ''){
                                                delete tokenResponse.scope;
                                            }
                                            let valueDelete = await tokenService.removeTokenByRefresh(refresh);
                                            if (valueDelete.ok == 1 && valueDelete.deletedCount == 1) {
                                                await res.status(200).json(tokenResponse);
                                            }
                                        });
                                    } else {
                                        let valueDelete = await tokenService.removeTokenByRefresh(refresh);
                                        if (valueDelete.ok == 1 && valueDelete.deletedCount == 1) {
                                            console.log("token removed");
                                        }
                                        return res.status(401).json({code: '401' ,message: 'El refresh token ha expirado'});
                                    }
                                } else {
                                    return res.status(401).json({code: '401' , message: 'Clientid invalido, revise el campo '});
                                }
                            } else {
                                return res.status(401).json({code: '401' ,message: 'El refresh token es invalido, revisar sintaxis '});
                            }
                        } else {
                            return res.status(422).json({code: '422' ,message: 'El refresh token falta en la solicitud, verificar campo '});
                        }
                    } else {
                        return res.status(401).json({code: '401' , message: 'Grant type no soportado'});
                    }
                }else{
                        return res.status(401).json({code: '401' ,message: 'Error en la contraseña del cliente'});
                    }
                }else{
                    return res.status(401).json({code: '401',  message: 'Credenciales del cliente incorrectas' });
                }
    }else{
        return res.status(401).json({code: '401',  message: 'Parametros de cliente enviados incorrectamente ' });
    }
});

function createToken(clientId,id, scope){
    let expiresin = Number(process.env.EXT); //se obtienen los segundos de vida del token
    let access_token = jwt.sign({
        idUser: id,
        jti: randomstring.generate(8),
        scope : scope
    },process.env.SEED,{expiresIn : expiresin }); //se genera el JWT y se se agregan a su payload algunos atributos que consideramos se utilizaran en el API

    let tokenResponse = {
        access_token: access_token,
        token_type: 'Bearer',
        expires_in: expiresin, //value in seconds
        refresh_token: randtoken.uid(256),
        refresh_token_expires_in: Number(process.env.RTEXT) , //value in seconds
        refresh_token_expires_in_date: Math.floor(Date.now() / 1000) + Number(process.env.RTEXT) ,
        scope: scope,
        client: {clientId: clientId},
        user: {idUser : id}
    }
    return tokenResponse;
}

let decodeClientCredentials = function(req) {

    let clientId;
    let clientSecret ='';

    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        //check the body
        if(req.body.client_id){
            clientId = req.body.client_id;
            if(req.body.client_secret){
                clientSecret = req.body.client_secret;
            }
        }
    }else{
        const base64Credentials =  req.headers.authorization.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        [clientId, clientSecret] = credentials.split(':');
    }

    return { id: clientId, secret: clientSecret };
};

let port = process.env.PORT || 3005;
let server = app.listen(port, function () {
    let host = server.address().address;
    let port = server.address().port;
    console.log(' Authorization Server is listening at http://%s:%s', host, port);
});

/*// we will pass our 'app' to 'https' server
https.createServer({
    key: fs.readFileSync('./cert/key.pem'),
    cert: fs.readFileSync('./cert/cert.pem'),
    passphrase: '3BPDNS2S3TXM'
}, app)
    .listen(process.env.PORTSERVER);*/


