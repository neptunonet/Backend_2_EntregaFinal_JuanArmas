import UserDao from '../dao/user.dao.js';
import UserDto from '../dto/user.dto.js';
import CurrentUserDto from '../dto/currentUser.dto.js';
import { isValidPassword } from '../utils/index.js'

class UserRepository {
  async createUser(userData) {
    const user = await UserDao.create(userData);
    return new UserDto(user);
  }

  async getCurrentUserById(id) {
    const user = await UserDao.getUserById(id);
    return user ? new CurrentUserDto(user) : null;
  }
  
  // async getUserByEmail(email) {
  //   const user = await UserDao.findByEmail(email);
  //   return user ? new UserDto(user) : null;
  // }

  async updateUser(id, userData) {
    const updatedUser = await UserDao.updateUser(id, userData);
    return updatedUser ? new UserDto(updatedUser) : null;
  }

  async deleteUser(id) {
    const deletedUser = await UserDao.deleteUser(id);
    return deletedUser ? new UserDto(deletedUser) : null;
  }

  // async validateUser(email, password) {
  //   const user = await UserDao.getUserByEmail(email);
  //   if (user && await isValidPassword(user, password)) {
  //     return new UserDto(user);
  //   }
  //   return null;
  // }


  async validateUser (email, password) {
    const user = await UserDao.findByEmail(email);
    if (!user) {
      return null;
    }
    
    const isValid = await isValidPassword(user, password);
    if (!isValid) {
      return null;
    }
  
    return {
      _id: user._id,
      email: user.email,
      role: user.role

    };
  };

  async getUserByEmail(email) {
    const user = await UserDao.getUserByEmail(email);
    return user ? new UserDto(user) : null;
  }

  async getAllUsers() {
    const users = await UserDao.getAll();
    return users.map(user => new UserDto(user));
  }

}

export default new UserRepository();