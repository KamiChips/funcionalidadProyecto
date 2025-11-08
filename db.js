require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Conexión exitosa a MongoDB'))
    .catch(err => console.log('Error de conexión a MongoDB:', err));

const expedienteSchema = new mongoose.Schema({
    id: { type: String, required: true },
    secure_key: { type: String, required: true },
    registerDate: { type: String, required: true }
});


const Expediente = mongoose.model('Expediente', expedienteSchema);
module.exports = Expediente;
