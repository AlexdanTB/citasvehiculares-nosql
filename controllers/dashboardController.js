const Cita = require('../models/Cita');
const Propietario = require('../models/Propietario');
const Vehiculo = require('../models/Vehiculo');

const dashboard = async (req, res) => {
  try {
    const totalCitas = await Cita.countDocuments();
    
    const inicioHoy = new Date();
    inicioHoy.setHours(0, 0, 0, 0);
    const finHoy = new Date();
    finHoy.setHours(23, 59, 59, 999);
    
    const citasHoy = await Cita.countDocuments({
      fecha: { $gte: inicioHoy, $lte: finHoy }
    });
    
    const citasPendientes = await Cita.countDocuments({
      'estado.nombre': 'Pendiente'
    });
    
    const totalPropietarios = await Propietario.countDocuments({ activo: true });
    const totalVehiculos = await Vehiculo.countDocuments();
    
    const ultimasCitas = await Cita.find()
      .sort({ fecha_creacion: -1 })
      .limit(5);
    
    res.render('index', {
      totalCitas,
      citasHoy,
      citasPendientes,
      totalPropietarios,
      totalVehiculos,
      ultimasCitas
    });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error al cargar el dashboard');
    res.redirect('/');
  }
};

const health = (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
};

module.exports = {
  dashboard,
  health
};