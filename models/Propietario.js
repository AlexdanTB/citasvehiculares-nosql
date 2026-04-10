const mongoose = require('mongoose');

const propietarioSchema = new mongoose.Schema({
  ci: {
    type: String,
    required: true,
    unique: true
  },
  nombres: {
    type: String,
    required: true
  },
  apellidos: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  telefono_movil: {
    type: String,
    required: true,
    unique: true
  },
  telefono_convencional: String,
  fecha_registro: {
    type: Date,
    default: Date.now
  },
  activo: {
    type: Boolean,
    default: true
  }
});

propietarioSchema.index({ apellidos: 1, nombres: 1 });

module.exports = mongoose.model('Propietario', propietarioSchema);