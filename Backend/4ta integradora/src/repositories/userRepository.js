const UserDAO = require('../dao/userDAO');

class UserRepository {
  async createUser(userData) {
    return await UserDAO.createUser(userData);
  }

  async getUserByEmail(email) {
    return await UserDAO.getUserByEmail(email);
  }

  async updateUserByEmail(email, newData) {
    return await UserDAO.updateUserByEmail(email, newData);
  }

  async deleteUserByEmail(email) {
    return await UserDAO.deleteUserByEmail(email);
  }

  async getUserById(userId) {
    return await UserDAO.getUserById(userId);
  }
}

module.exports = new UserRepository();