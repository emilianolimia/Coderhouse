const MessageModel = require('../models/message');
const MessageDTO = require('../dto/messageDTO');

class MessageDAO {
  async createMessage(messageDTO) {
    const message = new MessageModel(messageDTO);
    return await message.save();
  }

  async getAllMessages() {
    return await MessageModel.find();
  }

  async getMessageById(messageId) {
    return await MessageModel.findById(messageId);
  }

  async deleteMessageById(messageId) {
    return await MessageModel.findByIdAndDelete(messageId);
  }
}

module.exports = new MessageDAO();