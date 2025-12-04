const bcrypt = require('bcryptjs');

class PasswordHasher {
  async hash(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  async verify(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }

  generateRandomPassword(length = 12) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  }
}

module.exports = new PasswordHasher();
