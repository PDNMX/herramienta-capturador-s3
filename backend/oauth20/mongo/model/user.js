var mongoose = require('mongoose'),
	modelName = 'user',
	schemaDefinition = require('../schema/' + modelName),
	schemaInstance = mongoose.Schema(schemaDefinition),
	modelInstance = mongoose.model('Usuarios', schemaInstance, 'usuarios');

module.exports = modelInstance;
