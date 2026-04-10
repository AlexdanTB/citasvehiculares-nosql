const mongoose = require('mongoose');

const vehiculoSchema = new mongoose.Schema({
  placa: {
    type: String,
    required: true,
    unique: true
  },
  año: {
    type: Number,
    required: true,
    min: 1900,
    max: 2030
  },
  modelo: {
    type: String,
    required: true
  },
  clase: {
    type: String,
    enum: ['Particular', 'Comercial'],
    default: 'Particular'
  },
  ci_propietario: {
    type: String,
    required: true,
    ref: 'Propietario'
  },
  tipo: {
    id: mongoose.Schema.Types.ObjectId,
    nombre: String
  },
  marca: {
    id: mongoose.Schema.Types.ObjectId,
    nombre: String
  },
  fecha_registro: {
    type: Date,
    default: Date.now
  }
});

vehiculoSchema.index({ ci_propietario: 1 });
vehiculoSchema.index({ 'tipo.nombre': 1 });
vehiculoSchema.index({ 'marca.nombre': 1 });

module.exports = mongoose.model('Vehiculo', vehiculoSchema);