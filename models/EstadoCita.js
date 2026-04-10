const mongoose = require('mongoose');

const estadoCitaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    enum: ['Pendiente', 'Confirmada', 'Atendida', 'Cancelada']
  },
  descripcion: String,
  color: String
});

module.exports = mongoose.model('EstadoCita', estadoCitaSchema);