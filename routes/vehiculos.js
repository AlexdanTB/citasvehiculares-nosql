const express = require('express');
const router = express.Router();
const vehiculoController = require('../controllers/vehiculoController');

router.get('/', vehiculoController.listarVehiculos);
router.get('/nuevo', vehiculoController.nuevoVehiculo);
router.post('/', vehiculoController.crearVehiculo);
router.get('/:placa', vehiculoController.detalleVehiculo);
router.get('/:placa/editar', vehiculoController.editarVehiculo);
router.put('/:placa', vehiculoController.actualizarVehiculo);
router.delete('/:placa', vehiculoController.eliminarVehiculo);

module.exports = router;