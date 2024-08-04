const User = require('../models/userModel');
const logger = require('../utils/logger');

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
};

module.exports = UserController;