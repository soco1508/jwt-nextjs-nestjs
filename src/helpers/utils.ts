import bcrypt = require('bcrypt');

export const hashPasswordHelper = async (plainPassword: string) => {
  try {
    return await bcrypt.hash(plainPassword, 10);
  } catch (error) {
    console.log(error);
  }
};
