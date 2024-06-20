const UserModel = require('../models/userModel');
const UserDTO = require('../dto/userDTO');

class UserDAO {
  async createUser(userDTO) {
    const user = new UserModel(userDTO);
    return await user.save();
  }

  async getUserByEmail(email) {
    return await UserModel.findOne({ email });
  }

  async updateUserByEmail(email, newData) {
    return await UserModel.findOneAndUpdate({ email }, newData, { new: true });
  }

  async deleteUserByEmail(email) {
    return await UserModel.findOneAndDelete({ email });
  }

  async getUserById(userId) {
    return await UserModel.findById(userId);
  }
}

module.exports = new UserDAO();