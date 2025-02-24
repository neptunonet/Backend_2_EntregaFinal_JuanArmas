import User from '../models/user.model.js';

class UserDao {
  async create(userData) {
    return await User.create(userData);
  }

  async findById(id) {
    return await User.findById(id);
  }

  async findByEmail(email) {
    return await User.findOne({ email });
  }

  async update(id, userData) {
    return await User.findByIdAndUpdate(id, userData, { new: true });
  }

  async delete(id) {
    return await User.findByIdAndDelete(id);
  }

  async getUserByEmail(email) {
    return await User.findOne({ email });
  }
  async getAll() {
    return await User.find({});
  }

  
}

export default new UserDao();