const SchemaAjvServidoresFaltasGraves = {
    type: 'object',
    properties: {
        expediente: { type: 'string', required:true },
        grave:{ type: Object, required:true },
    },
    required: [],
    additionalProperties: true,
};
//expediente: { type: 'string', required:true },

module.exports = { SchemaAjvServidoresFaltasGraves };