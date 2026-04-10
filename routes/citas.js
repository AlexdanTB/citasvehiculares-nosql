const express = require('express');
const router = express.Router();
const citaController = require('../controllers/citaController');

router.get('/', citaController.listarCitas);
router.get('/nueva', citaController.nuevaCita);
router.post('/', citaController.crearCita);
router.get('/:id', citaController.detalleCita);
router.delete('/:id', citaController.cancelarCita);
router.get('/hoy', citaController.citasHoy);
router.get('/propietario/:ci', citaController.citasByPropietario);

module.exports = router;