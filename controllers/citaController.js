const Cita = require('../models/Cita');
const Propietario = require('../models/Propietario');
const Vehiculo = require('../models/Vehiculo');
const Tramite = require('../models/Tramite');
const Centro = require('../models/Centro');
const EstadoCita = require('../models/EstadoCita');

const listarCitas = async (req, res) => {
  try {
    const { fecha, estado } = req.query;
    let query = {};
    
    if (fecha) {
      const fechaObj = new Date(fecha);
      fechaObj.setHours(0, 0, 0, 0);
      const fechaFin = new Date(fecha);
      fechaFin.setHours(23, 59, 59, 999);
      query.fecha = { $gte: fechaObj, $lte: fechaFin };
    }
    
    if (estado) {
      query['estado.nombre'] = estado;
    }
    
    const citas = await Cita.find(query).sort({ fecha: -1 });
    res.render('citas/listar', { citas, fecha, estado });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error al listar citas');
    res.redirect('/citas');
  }
};

const nuevaCita = async (req, res) => {
  try {
    const tramites = await Tramite.find();
    const centros = await Centro.find();
    const propietarios = await Propietario.find({ activo: true });
    res.render('citas/agendar', { tramites, centros, propietarios, vehiculo: null, cita: null });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error al cargar formulario');
    res.redirect('/citas');
  }
};

const crearCita = async (req, res) => {
  try {
    const { fecha, hora, placa, ci_propietario, tramite_id, centro_id } = req.body;
    
    const propietario = await Propietario.findOne({ ci: ci_propietario });
    if (!propietario) {
      req.flash('error_msg', 'Propietario no encontrado');
      return res.redirect('/citas/nueva');
    }
    
    const vehiculo = await Vehiculo.findOne({ placa, ci_propietario });
    if (!vehiculo) {
      req.flash('error_msg', 'Vehículo no encontrado o no pertenece al propietario');
      return res.redirect('/citas/nueva');
    }
    
    const tramite = await Tramite.findById(tramite_id);
    const centro = await Centro.findById(centro_id);
    
    const nuevaCita = new Cita({
      fecha: new Date(fecha),
      hora: hora + ':00',
      vehiculo: {
        placa: vehiculo.placa,
        modelo: vehiculo.modelo,
        año: vehiculo.año,
        clase: vehiculo.clase,
        propietario: {
          ci: propietario.ci,
          nombres: propietario.nombres,
          apellidos: propietario.apellidos,
          telefono_movil: propietario.telefono_movil,
          email: propietario.email
        }
      },
      tramite: {
        id: tramite._id,
        nombre: tramite.nombre,
        costo: tramite.costo
      },
      centro: {
        id: centro._id,
        nombre: centro.nombre,
        direccion: centro.direccion
      },
      estado: {
        nombre: 'Pendiente'
      },
      historial_estados: [{
        estado: 'Pendiente',
        fecha: new Date(),
        observacion: 'Cita creada'
      }]
    });
    
    await nuevaCita.save();
    
    req.flash('success_msg', 'Cita agendada correctamente');
    res.redirect('/citas');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', err.message || 'Error al crear cita');
    res.redirect('/citas/nueva');
  }
};

const detalleCita = async (req, res) => {
  try {
    const cita = await Cita.findById(req.params.id);
    if (!cita) {
      req.flash('error_msg', 'Cita no encontrada');
      return res.redirect('/citas');
    }
    res.render('citas/detalle', { cita });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error al obtener cita');
    res.redirect('/citas');
  }
};

const cancelarCita = async (req, res) => {
  try {
    const cita = await Cita.findById(req.params.id);
    if (!cita) {
      req.flash('error_msg', 'Cita no encontrada');
      return res.redirect('/citas');
    }
    
    cita.estado.nombre = 'Cancelada';
    cita.historial_estados.push({
      estado: 'Cancelada',
      fecha: new Date(),
      observacion: req.body.observacion || 'Cita cancelada por el usuario'
    });
    
    await cita.save();
    
    req.flash('success_msg', 'Cita cancelada correctamente');
    res.redirect('/citas');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error al cancelar cita');
    res.redirect('/citas');
  }
};

const citasHoy = async (req, res) => {
  try {
    const inicioHoy = new Date();
    inicioHoy.setHours(0, 0, 0, 0);
    const finHoy = new Date();
    finHoy.setHours(23, 59, 59, 999);
    
    const citas = await Cita.find({
      fecha: { $gte: inicioHoy, $lte: finHoy }
    }).sort({ hora: 1 });
    
    res.render('citas/listar', { citas, fecha: new Date().toISOString().split('T')[0], estado: '' });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error al listar citas');
    res.redirect('/citas');
  }
};

const citasByPropietario = async (req, res) => {
  try {
    const citas = await Cita.find({ 'vehiculo.propietario.ci': req.params.ci })
      .sort({ fecha: -1 });
    
    res.render('citas/listar', { citas, fecha: '', estado: '' });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error al buscar citas');
    res.redirect('/citas');
  }
};

module.exports = {
  listarCitas,
  nuevaCita,
  crearCita,
  detalleCita,
  cancelarCita,
  citasHoy,
  citasByPropietario
};