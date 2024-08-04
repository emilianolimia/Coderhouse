require('dotenv').config();  // Carga las variables de entorno

const config = {
  githubClientId: process.env.GITHUB_CLIENT_ID,
  githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
  dbUrl: process.env.DB_URL,
  sessionSecret: process.env.SESSION_SECRET
};

module.exports = config;