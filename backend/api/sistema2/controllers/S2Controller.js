const S2Model = require("../models/S2");

module.exports = {
  createS2: (req, res) => {
    const { body } = req;

    S2Model.createS2(body)
      .then((s2) => {
        return res.status(200).json({
          status: true,
          data: s2.toJSON(),
          message : "S2 creado correctamente desde proyecto con nombre api desde insomnia"
        });
      })
      .catch((err) => {
        return res.status(500).json({
          status: false,
          error: err,
        });
      });
  },
  insertS2: (req, res) => {
    const { body } = req;

    S2Model.insertS2(body)
      .then((s2) => {
        return res.status(200).json({
          status: true,
          data: s2.toJSON(),
          message : "S2 insertado desde proyecto con nombre api!"
        });
      })
      .catch((err) => {
        return res.status(500).json({
          status: false,
          error: err,
        });
      });
  },
};

///////////////////////////////////////////////////////////////////////////// Inicia S2 //////////////////////////////////////////////////////////////////////////////

/*  Endpoint para insertar S2 spic */


//////////////////////////////////////////////////////////////////////////// Termina S2 ///////////////////////////////////////////////////////////////////////////////