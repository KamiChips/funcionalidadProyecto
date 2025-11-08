const express = require('express');
const { v4: uuidv4 } = require('uuid');
const Expediente = require('./db'); 

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static('public'));


app.get('/', async (req, res) => {
    try {
        const pacientes = await Expediente.find();
        res.render('index', { pacientes });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener los pacientes');
    }
});

app.get('/pacientes', async (req, res) => {
    const pacientes = await Expediente.find();
    res.json(pacientes);
});

app.get('/pacientes/:id', async (req, res) => {
    const paciente = await Expediente.findOne({ id: req.params.id });
    if (!paciente) return res.status(404).json({ error: 'Paciente no encontrado' });
    res.json(paciente);
});

app.post('/pacientes', async (req, res) => {
    const { secure_key } = req.body;
    if (!secure_key) return res.status(400).json({ error: 'secure_key es obligatorio' });

    try {
        const nuevoPaciente = new Expediente({
            id: uuidv4(),
            secure_key,
            registerDate: new Date().toISOString(),
        });

        await nuevoPaciente.save();
        res.status(201).json(nuevoPaciente);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al crear el paciente' });
    }
});

app.put('/pacientes/:id', async (req, res) => {
    const { secure_key } = req.body;
    if (!secure_key) return res.status(400).json({ error: 'secure_key es obligatorio' });

    try {
        const actualizado = await Expediente.findOneAndUpdate(
            { id: req.params.id },
            { secure_key },
            { new: true }
        );

        if (!actualizado) return res.status(404).json({ error: 'Paciente no encontrado' });
        res.json(actualizado);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al actualizar el paciente' });
    }
});

app.delete('/pacientes/:id', async (req, res) => {
    try {
        const eliminado = await Expediente.findOneAndDelete({ id: req.params.id });
        if (!eliminado) return res.status(404).json({ error: 'Paciente no encontrado' });
        res.json({ mensaje: 'Paciente eliminado' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al eliminar el paciente' });
    }
});


app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
