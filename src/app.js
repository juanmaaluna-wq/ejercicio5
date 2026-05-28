const express = require('express');
const app = express();

app.use(express.json());

let contacts = [];
let idCounter = 1;

// GET todos
app.get('/api/contacts', (req, res) => {
  res.status(200).json(contacts);
});

// GET por id
app.get('/api/contacts/:id', (req, res) => {
  const contact = contacts.find(c => c.id === parseInt(req.params.id));
  if (!contact) return res.status(404).json({ error: 'Contacto no encontrado' });
  res.json(contact);
});

// POST crear contacto
app.post('/api/contacts', (req, res) => {
  const { name, email, phone } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'El nombre es requerido, ok?' });
  }

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Email inválido' });
  }

  const newContact = {
    id: idCounter++,
    name,
    email,
    phone
  };

  contacts.push(newContact);
  res.status(201).json(newContact);
});

// PUT actualizar
app.put('/api/contacts/:id', (req, res) => {
  const contact = contacts.find(c => c.id === parseInt(req.params.id));
  if (!contact) return res.status(404).json({ error: 'Contacto no encontrado' });

  const { name, email, phone } = req.body;

  if (name !== undefined) contact.name = name;
  if (email !== undefined) {
    if (!email.includes('@')) {
      return res.status(400).json({ error: 'Email inválido' });
    }
    contact.email = email;
  }
  if (phone !== undefined) contact.phone = phone;

  res.json(contact);
});

// DELETE
app.delete('/api/contacts/:id', (req, res) => {
  const index = contacts.findIndex(c => c.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Contacto no encontrado' });

  contacts.splice(index, 1);
  res.status(200).json({ message: 'Contacto eliminado' });
});

module.exports = app;