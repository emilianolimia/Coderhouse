const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: false },
  password: { type: String, required: true },  // Ahora es obligatorio
  cart: { type: mongoose.Schema.Types.ObjectId, ref: 'carts', required: false },  // Referencia a Carts
  role: { type: String, enum: ['user', 'premium', 'admin'], default: 'user' },  // Valor por defecto 'user'
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  documents: [{
    name: { type: String, required: false },
    reference: { type: String, required: false }
  }],
  last_connection: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);