const express = require('express');
const app = express();
app.use(express.json());

// ── Regex email (Bloque A)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ── Validación
function validateContact({ name, email }) {
  if (!name || name.trim() === '') {
    return { valid: false, error: 'name es requerido' };
  }

  if (!email || !EMAIL_REGEX.test(email)) {
    return { valid: false, error: 'email inválido' };
  }

  return { valid: true };
}

// ── Datos iniciales
let contacts = [];
let nextId = 1;

// ── Reset para tests (MUY IMPORTANTE)
function resetContacts() {
  contacts = [
    { id: 1, name: 'Ana García', email: 'ana@example.com', phone: '555-0001', favorite: false },
    { id: 2, name: 'Luis Pérez', email: 'luis@example.com', phone: '555-0002', favorite: true },
    { id: 3, name: 'Eva Martínez', email: 'eva@example.com', phone: null, favorite: false }
  ];
  nextId = 4;
}

resetContacts();

// GET /api/contacts (Bloque C)
app.get('/api/contacts', (req, res) => {
  let result = [...contacts];
  const { search, favorite } = req.query;

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q)
    );
  }

  if (favorite === 'true') {
    result = result.filter(c => c.favorite === true);
  }

  res.json(result);
});

// GET /api/contacts/:id
app.get('/api/contacts/:id', (req, res) => {
  const contact = contacts.find(c => c.id === Number(req.params.id));

  if (!contact) {
    return res.status(404).json({ status: 404, error: 'Contacto no encontrado' });
  }

  res.json(contact);
});

// POST /api/contacts (A + B)
app.post('/api/contacts', (req, res) => {
  const { name, email, phone } = req.body;

  const validation = validateContact({ name, email });
  if (!validation.valid) {
    return res.status(400).json({ status: 400, error: validation.error });
  }

  // duplicado (case insensitive)
  const exists = contacts.find(
    c => c.email.toLowerCase() === email.toLowerCase()
  );

  if (exists) {
    return res.status(409).json({ status: 409, error: 'email duplicado' });
  }

  const newContact = {
    id: nextId++,
    name: name.trim(),
    email: email.toLowerCase(),
    phone: phone?.trim() || null,
    favorite: false
  };

  contacts.push(newContact);
  res.status(201).json(newContact);
});

// PUT /api/contacts/:id (Bloque E)
app.put('/api/contacts/:id', (req, res) => {
  const contact = contacts.find(c => c.id === Number(req.params.id));

  if (!contact) {
    return res.status(404).json({ status: 404, error: 'Contacto no encontrado' });
  }

  const { name, email, phone } = req.body;

  if (name !== undefined) {
    if (name.trim() === '') {
      return res.status(400).json({ status: 400, error: 'name inválido' });
    }
    contact.name = name.trim();
  }

  if (email !== undefined) {
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ status: 400, error: 'email inválido' });
    }

    const exists = contacts.find(
      c => c.id !== contact.id &&
      c.email.toLowerCase() === email.toLowerCase()
    );

    if (exists) {
      return res.status(409).json({ status: 409, error: 'email duplicado' });
    }

    contact.email = email.toLowerCase();
  }

  if (phone !== undefined) {
    contact.phone = phone?.trim() || null;
  }

  res.json(contact);
});

// PATCH favorito (Bloque D)
app.patch('/api/contacts/:id/favorite', (req, res) => {
  const contact = contacts.find(c => c.id === Number(req.params.id));

  if (!contact) {
    return res.status(404).json({ status: 404, error: 'Contacto no encontrado' });
  }

  contact.favorite = !contact.favorite;

  res.json(contact);
});

// DELETE
app.delete('/api/contacts/:id', (req, res) => {
  const index = contacts.findIndex(c => c.id === Number(req.params.id));

  if (index === -1) {
    return res.status(404).json({ status: 404, error: 'Contacto no encontrado' });
  }

  contacts.splice(index, 1);

  res.json({ status: 200, message: 'Contacto eliminado' });
});

// Middleware 404 (Bloque F)
app.use((req, res) => {
  res.status(404).json({
    status: 404,
    error: 'Ruta no encontrada'
  });
});

// Middleware error general
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 500,
    error: 'Error interno del servidor'
  });
});

module.exports = { app, resetContacts };