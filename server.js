require('dotenv').config();
const express = require('express');
const path = require('path');
const scannerController = require('./src/controllers/scannerController');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json({ limit: '50mb' })); // Permitir JSON grandes por los Excel
app.use(express.static(path.resolve(__dirname, 'public')));

// Rutas API
app.post('/api/save', scannerController.guardarRegistros);
app.get('/api/search', scannerController.buscarRegistros);

app.listen(PORT, () => {
    console.log(`Servidor NEO-SCANNER activo en: http://localhost:${PORT}`);
});