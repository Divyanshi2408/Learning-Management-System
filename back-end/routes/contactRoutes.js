const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact'); // We'll create this model next

// Submit contact form
router.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const newContact = new Contact({ name, email, message });
    await newContact.save();
    res.status(201).json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error saving contact message:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;