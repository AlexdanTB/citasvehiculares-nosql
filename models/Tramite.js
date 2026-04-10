const mongoose = require('mongoose');

const tramiteSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  duracion_estimada_min: Number,
  costo: Number,
  requisitos: [String]
});

module.exports = mongoose.model('Tramite', tramiteSchema);