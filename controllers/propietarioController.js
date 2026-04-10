const Propietario = require('../models/Propietario');
const Vehiculo = require('../models/Vehiculo');
const Cita = require('../models/Cita');

const listarPropietarios = async (req, res) => {
  try {
    const propietarios = await Propietario.find({ activo: true }).sort({ fecha_registro: -1 });
    res.render('propietarios/listar', { propietarios });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error al listar propietarios');
    res.redirect('/');
  }
};

const nuevoPropietario = (req, res) => {
  res.render('propietarios/registrar', { propietario: null });
};

const crearPropietario = async (req, res) => {
  try {
    const { ci, nombres, apellidos, email, telefono_movil, telefono_convencional } = req.body;
    
    const nuevoPropietario = new Propietario({
      ci,
      nombres,
      apellidos,
      email,
      telefono_movil,
      telefono_convencional
    });
    
    await nuevoPropietario.save();
    
    req.flash('success_msg', 'Propietario registrado correctamente');
    res.redirect('/propietarios');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', err.message || 'Error al registrar propietario');
    res.redirect('/propietarios/nuevo');
  }
};

const detallePropietario = async (req, res) => {
  try {
    const propietario = await Propietario.findOne({ ci: req.params.ci });
    if (!propietario) {
      req.flash('error_msg', 'Propietario no encontrado');
      return res.redirect('/propietarios');
    }
    
    const vehiculos = await Vehiculo.find({ ci_propietario: req.params.ci });
    
    res.render('propietarios/detalle', { propietario, vehiculos });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error al obtener propietario');
    res.redirect('/propietarios');
  }
};

const editarPropietario = async (req, res) => {
  try {
    const propietario = await Propietario.findOne({ ci: req.params.ci });
    if (!propietario) {
      req.flash('error_msg', 'Propietario no encontrado');
      return res.redirect('/propietarios');
    }
    
    res.render('propietarios/registrar', { propietario });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error al cargar propietario');
    res.redirect('/propietarios');
  }
};

const actualizarPropietario = async (req, res) => {
  try {
    const { nombres, apellidos, email, telefono_movil, telefono_convencional, activo } = req.body;
    
    const propietario = await Propietario.findOneAndUpdate(
      { ci: req.params.ci },
      {
        nombres,
        apellidos,
        email,
        telefono_movil,
        telefono_convencional,
        activo: activo === 'on'
      },
      { new: true, runValidators: true }
    );
    
    if (!propietario) {
      req.flash('error_msg', 'Propietario no encontrado');
      return res.redirect('/propietarios');
    }
    
    req.flash('success_msg', 'Propietario actualizado correctamente');
    res.redirect('/propietarios/' + req.params.ci);
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error al actualizar propietario');
    res.redirect('/propietarios');
  }
};

const eliminarPropietario = async (req, res) => {
  try {
    const vehiculos = await Vehiculo.countDocuments({ ci_propietario: req.params.ci });
    
    if (vehiculos > 0) {
      await Propietario.findOneAndUpdate(
        { ci: req.params.ci },
        { activo: false }
      );
      req.flash('success_msg', 'Propietario desactivado (tiene vehículos asociados)');
    } else {
      await Propietario.findOneAndDelete({ ci: req.params.ci });
      req.flash('success_msg', 'Propietario eliminado correctamente');
    }
    
    res.redirect('/propietarios');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error al eliminar propietario');
    res.redirect('/propietarios');
  }
};

module.exports = {
  listarPropietarios,
  nuevoPropietario,
  crearPropietario,
  detallePropietario,
  editarPropietario,
  actualizarPropietario,
  eliminarPropietario
};