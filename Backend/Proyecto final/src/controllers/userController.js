const User = require('../models/userModel');
const logger = require('../utils/logger');
const nodemailer = require('nodemailer'); // Para enviar correos electrónicos

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD
  }
});

class UserController {
    static async changeUserRole(req, res) {
        try {
            const userId = req.params.uid;
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            if (user.role === 'user') { // Si el usuario quiere cambiar a premium
                const requiredDocuments = ['Identificación', 'Comprobante de domicilio', 'Comprobante de estado de cuenta'];
                const uploadedDocuments = user.documents.map(doc => doc.name);
        
                const hasRequiredDocuments = requiredDocuments.every(doc => uploadedDocuments.includes(doc));
        
                if (!hasRequiredDocuments) {
                  return res.status(400).json({ error: 'El usuario no ha cargado todos los documentos requeridos' });
                }
              }

            // Cambiar el rol del usuario
            user.role = user.role === 'user' ? 'premium' : 'user';
            await user.save();

            logger.info(`Rol del usuario ${user.email} cambiado a ${user.role}`);
            res.status(200).json({ message: `Rol del usuario cambiado a ${user.role}` });
        } catch (error) {
            logger.error('Error:', error.message);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    static async uploadDocuments(req, res) {
        try {
          const userId = req.params.uid;
          const user = await User.findById(userId);
          if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
          }
    
          const documents = req.files['document'] || [];
          const profiles = req.files['profile'] || [];
          const products = req.files['product'] || [];
    
          const allFiles = [...documents, ...profiles, ...products];
    
          allFiles.forEach(file => {
            const document = {
              name: file.fieldname,
              reference: file.path
            };
            user.documents.push(document);
          });
    
          await user.save();
          res.status(200).json({ message: 'Documentos subidos correctamente', documents: user.documents });
        } catch (error) {
          console.error('Error:', error.message);
          res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    static async getAllUsers(req, res) {
      try {
        const users = await User.find();
        res.render('users', { users });  // Renderiza la vista con la lista de usuarios
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ error: 'Error al obtener usuarios.' });
      }
    }

    static async deleteInactiveUsers(req, res) {
      try {
        // Obtener la fecha de hace 2 días
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
        console.log('Fecha límite para inactividad:', twoDaysAgo);
  
        // Encontrar usuarios inactivos
        const inactiveUsers = await User.find({ last_connection: { $lt: twoDaysAgo } });
        console.log('Usuarios inactivos encontrados:', inactiveUsers);

        if (inactiveUsers.length === 0) {
          console.log('No se encontraron usuarios inactivos.');
          return res.status(200).json({ message: 'No hay usuarios inactivos para eliminar.' });
        }
        
        const userEmails = inactiveUsers.map(user => user.email);
        console.log('Correos electrónicos de usuarios inactivos:', userEmails);
      
        // Eliminar usuarios inactivos
        const result = await User.deleteMany({ last_connection: { $lt: twoDaysAgo } });
        console.log('Resultado de la eliminación:', result);
  
        // Enviar correos a los usuarios eliminados
        for (const email of userEmails) {
          try {
            await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: 'Cuenta eliminada por inactividad',
            text: 'Su cuenta ha sido eliminada debido a inactividad durante más de 2 días.'
          });
            console.log('Correo enviado a:', email);
          } catch (error) {
            console.error('Error al enviar correo a', email, ':', error);
          }
        }
  
        res.status(200).json({ message: 'Usuarios inactivos eliminados y notificados por correo.' });
      } catch (error) {
        res.status(500).json({ error: 'Error al eliminar usuarios inactivos.' });
      }
    }

    static async updateUserRole(req, res) {
      const { uid } = req.params;
      const { role } = req.body;
  
      try {
        const user = await User.findByIdAndUpdate(uid, { role }, { new: true });
        res.status(200).json({ message: 'Rol actualizado correctamente.', user });
      } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el rol del usuario.' });
      }
    }
  
    static async deleteUser(req, res) {
      const { uid } = req.params;
  
      try {
        await User.findByIdAndDelete(uid);
        res.status(200).json({ message: 'Usuario eliminado correctamente.' });
      } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el usuario.' });
      }
    }
};

module.exports = UserController;