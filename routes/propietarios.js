const express = require('express');
const router = express.Router();
const propietarioController = require('../controllers/propietarioController');

router.get('/', propietarioController.listarPropietarios);
router.get('/nuevo', propietarioController.nuevoPropietario);
router.post('/', propietarioController.crearPropietario);
router.get('/:ci', propietarioController.detallePropietario);
router.get('/:ci/editar', propietarioController.editarPropietario);
router.put('/:ci', propietarioController.actualizarPropietario);
router.delete('/:ci', propietarioController.eliminarPropietario);

module.exports = router;