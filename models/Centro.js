const mongoose = require('mongoose');

const centroSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  direccion: {
    type: String,
    required: true
  },
  telefono: String,
  horario_atencion: {
    apertura: String,
    cierre: String,
    dias_laborales: [String]
  },
  tramites_disponibles: [{
    id_tramite: mongoose.Schema.Types.ObjectId,
    nombre_tramite: String
  }]
});

module.exports = mongoose.model('Centro', centroSchema);