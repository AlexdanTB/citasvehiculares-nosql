const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Tramite = require('../models/Tramite');
const Centro = require('../models/Centro');

const tramites = [
  { nombre: 'Matriculación', duracion_estimada_min: 60, costo: 50, requisitos: ['Cédula de identidad', 'Pago de impuestos'] },
  { nombre: 'Renovación de licencia', duracion_estimada_min: 30, costo: 25, requisitos: ['Cédula de identidad', 'Licencia anterior'] },
  { nombre: 'Transferencia de vehículo', duracion_estimada_min: 90, costo: 80, requisitos: ['Cédula de identidad', 'Documento de compraventa'] },
  { nombre: 'Inspección técnica', duracion_estimada_min: 45, costo: 35, requisitos: ['Vehículo en condiciones'] },
  { nombre: 'Duplicado de placa', duracion_estimada_min: 30, costo: 40, requisitos: ['Denuncia policial'] }
];

const centros = [
  {
    nombre: 'Centro Norte',
    direccion: 'Av. 10 de Agosto y Calle 5',
    telefono: '02-234-5678',
    horario_atencion: { apertura: '08:00', cierre: '17:00', dias_laborales: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'] },
    tramites_disponibles: [
      { nombre_tramite: 'Matriculación' },
      { nombre_tramite: 'Renovación de licencia' },
      { nombre_tramite: 'Inspección técnica' }
    ]
  },
  {
    nombre: 'Centro Sur',
    direccion: 'Av. Morán Valverde y Av. Sweat',
    telefono: '02-345-6789',
    horario_atencion: { apertura: '08:00', cierre: '17:00', dias_laborales: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'] },
    tramites_disponibles: [
      { nombre_tramite: 'Matriculación' },
      { nombre_tramite: 'Transferencia de vehículo' },
      { nombre_tramite: 'Duplicado de placa' }
    ]
  },
  {
    nombre: 'Centro Valle',
    direccion: 'Av. general Rumiñahui y弹',
    telefono: '02-456-7890',
    horario_atencion: { apertura: '08:00', cierre: '16:00', dias_laborales: ['Lunes', 'Martes', 'Miércoles', 'Jueves'] },
    tramites_disponibles: [
      { nombre_tramite: 'Matriculación' },
      { nombre_tramite: 'Renovación de licencia' }
    ]
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado a MongoDB');

    await Tramite.deleteMany({});
    await Centro.deleteMany({});

    const tramitesCreados = await Tramite.insertMany(tramites);
    console.log('Trámites insertados:', tramitesCreados.length);

    for (let centro of centros) {
      centro.tramites_disponibles = centro.tramites_disponibles.map(t => {
        const tramite = tramitesCreados.find(tr => tr.nombre === t.nombre_tramite);
        return { id_tramite: tramite._id, nombre_tramite: t.nombre_tramite };
      });
    }
    await Centro.insertMany(centros);
    console.log('Centros insertados:', centros.length);

    console.log('\nDatos sembrados correctamente');
    console.log('\nEjecutar: npm run dev');
    console.log('Abrir: http://localhost:3000');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

seed();