const Vehiculo = require('../models/Vehiculo');
const Propietario = require('../models/Propietario');
const Cita = require('../models/Cita');

const listarVehiculos = async (req, res) => {
  try {
    const vehiculos = await Vehiculo.find().sort({ fecha_registro: -1 });
    res.render('vehiculos/listar', { vehiculos });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error al listar vehículos');
    res.redirect('/');
  }
};

const nuevoVehiculo = async (req, res) => {
  try {
    const propietarios = await Propietario.find({ activo: true });
    res.render('vehiculos/registrar', { propietarios, vehiculo: null });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error al cargar formulario');
    res.redirect('/vehiculos');
  }
};

const crearVehiculo = async (req, res) => {
  try {
    const { placa, año, modelo, clase, ci_propietario, tipo, marca } = req.body;
    
    const propietario = await Propietario.findOne({ ci: ci_propietario });
    if (!propietario) {
      req.flash('error_msg', 'Propietario no encontrado');
      return res.redirect('/vehiculos/nuevo');
    }
    
    const nuevoVehiculo = new Vehiculo({
      placa: placa.toUpperCase(),
      año: parseInt(año),
      modelo,
      clase: clase || 'Particular',
      ci_propietario,
      tipo: tipo ? { nombre: tipo } : undefined,
      marca: marca ? { nombre: marca } : undefined
    });
    
    await nuevoVehiculo.save();
    
    req.flash('success_msg', 'Vehículo registrado correctamente');
    res.redirect('/vehiculos');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', err.message || 'Error al registrar vehículo');
    res.redirect('/vehiculos/nuevo');
  }
};

const detalleVehiculo = async (req, res) => {
  try {
    const vehiculo = await Vehiculo.findOne({ placa: req.params.placa });
    if (!vehiculo) {
      req.flash('error_msg', 'Vehículo no encontrado');
      return res.redirect('/vehiculos');
    }
    
    const propietario = await Propietario.findOne({ ci: vehiculo.ci_propietario });
    
    const citas = await Cita.find({
      'vehiculo.placa': vehiculo.placa,
      fecha: { $gte: new Date() },
      'estado.nombre': { $ne: 'Cancelada' }
    }).sort({ fecha: 1 });
    
    res.render('vehiculos/detalle', { vehiculo, propietario, citas });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error al obtener vehículo');
    res.redirect('/vehiculos');
  }
};

const editarVehiculo = async (req, res) => {
  try {
    const vehiculo = await Vehiculo.findOne({ placa: req.params.placa });
    if (!vehiculo) {
      req.flash('error_msg', 'Vehículo no encontrado');
      return res.redirect('/vehiculos');
    }
    
    const propietarios = await Propietario.find({ activo: true });
    res.render('vehiculos/registrar', { propietarios, vehiculo });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error al cargar vehículo');
    res.redirect('/vehiculos');
  }
};

const actualizarVehiculo = async (req, res) => {
  try {
    const { año, modelo, clase, ci_propietario, tipo, marca } = req.body;
    
    const vehiculo = await Vehiculo.findOneAndUpdate(
      { placa: req.params.placa },
      {
        año: parseInt(año),
        modelo,
        clase: clase || 'Particular',
        ci_propietario,
        tipo: tipo ? { nombre: tipo } : undefined,
        marca: marca ? { nombre: marca } : undefined
      },
      { new: true }
    );
    
    if (!vehiculo) {
      req.flash('error_msg', 'Vehículo no encontrado');
      return res.redirect('/vehiculos');
    }
    
    req.flash('success_msg', 'Vehículo actualizado correctamente');
    res.redirect('/vehiculos/' + req.params.placa);
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error al actualizar vehículo');
    res.redirect('/vehiculos');
  }
};

const eliminarVehiculo = async (req, res) => {
  try {
    const citasPendientes = await Cita.countDocuments({
      'vehiculo.placa': req.params.placa,
      'estado.nombre': 'Pendiente',
      fecha: { $gte: new Date() }
    });
    
    if (citasPendientes > 0) {
      req.flash('error_msg', 'No se puede eliminar: el vehículo tiene citas pendientes');
      return res.redirect('/vehiculos/' + req.params.placa);
    }
    
    await Vehiculo.findOneAndDelete({ placa: req.params.placa });
    
    req.flash('success_msg', 'Vehículo eliminado correctamente');
    res.redirect('/vehiculos');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error al eliminar vehículo');
    res.redirect('/vehiculos');
  }
};

module.exports = {
  listarVehiculos,
  nuevoVehiculo,
  crearVehiculo,
  detalleVehiculo,
  editarVehiculo,
  actualizarVehiculo,
  eliminarVehiculo
};