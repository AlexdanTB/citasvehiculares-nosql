const mongoose = require('mongoose');

const citaSchema = new mongoose.Schema({
  fecha: { 
    type: Date, 
    required: true 
  },
  hora: { 
    type: String, 
    required: true,
    match: /^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/ 
  },
  vehiculo: {
    placa: String,
    modelo: String,
    año: Number,
    clase: String,
    propietario: {
      ci: String,
      nombres: String,
      apellidos: String,
      telefono_movil: String,
      email: String
    }
  },
  tramite: {
    id: mongoose.Schema.Types.ObjectId,
    nombre: String,
    costo: Number
  },
  centro: {
    id: mongoose.Schema.Types.ObjectId,
    nombre: String,
    direccion: String
  },
  estado: {
    id: mongoose.Schema.Types.ObjectId,
    nombre: String
  },
  fecha_creacion: { 
    type: Date, 
    default: Date.now 
  },
  fecha_actualizacion: Date,
  historial_estados: [{
    estado: String,
    fecha: Date,
    usuario: String,
    observacion: String
  }],
  observaciones: String
}, { 
  timestamps: { createdAt: 'fecha_creacion', updatedAt: 'fecha_actualizacion' } 
});

citaSchema.pre('save', async function(next) {
  const Cita = mongoose.model('Cita');
  
  const existe = await Cita.findOne({
    'centro.id': this.centro.id,
    fecha: this.fecha,
    hora: this.hora,
    'estado.nombre': { $ne: 'Cancelada' },
    _id: { $ne: this._id }
  });
  
  if (existe) {
    const error = new Error('El horario seleccionado no está disponible');
    return next(error);
  }
  
  const citaVehiculo = await Cita.findOne({
    'vehiculo.placa': this.vehiculo.placa,
    fecha: this.fecha,
    'estado.nombre': { $ne: 'Cancelada' },
    _id: { $ne: this._id }
  });
  
  if (citaVehiculo) {
    const error = new Error('El vehículo ya tiene una cita para esta fecha');
    return next(error);
  }
  
  next();
});

citaSchema.index({ fecha: 1, hora: 1, 'centro.id': 1 });
citaSchema.index({ 'vehiculo.placa': 1, fecha: 1 });
citaSchema.index({ 'vehiculo.propietario.ci': 1 });

module.exports = mongoose.model('Cita', citaSchema);