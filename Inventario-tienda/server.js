const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

const DATA_PATH = path.join(__dirname, 'productos.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Leer productos
app.get('/api/productos', (req, res) => {
  fs.readFile(DATA_PATH, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'No se pudo leer productos' });
    res.json(JSON.parse(data || '[]'));
  });
});

// Guardar o actualizar producto
app.post('/api/productos', (req, res) => {
  const producto = req.body;
  fs.readFile(DATA_PATH, 'utf8', (err, data) => {
    const productos = data ? JSON.parse(data) : [];

    if (producto.index != null && productos[producto.index]) {
      productos[producto.index] = { nombre: producto.nombre, precio: producto.precio };
    } else {
      productos.push({ nombre: producto.nombre, precio: producto.precio });
    }

    fs.writeFile(DATA_PATH, JSON.stringify(productos, null, 2), err => {
      if (err) return res.status(500).json({ error: 'No se pudo guardar' });
      res.json({ success: true });
    });
  });
});

// Eliminar producto
app.delete('/api/productos/:index', (req, res) => {
  const index = parseInt(req.params.index);
  fs.readFile(DATA_PATH, 'utf8', (err, data) => {
    const productos = JSON.parse(data);
    productos.splice(index, 1);
    fs.writeFile(DATA_PATH, JSON.stringify(productos, null, 2), err => {
      if (err) return res.status(500).json({ error: 'No se pudo eliminar' });
      res.json({ success: true });
    });
  });
});

app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
