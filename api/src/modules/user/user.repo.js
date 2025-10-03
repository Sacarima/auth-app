import { User } from './user.model.js';

export async function findUserByEmail(email) {
  return User.findOne({ email })
};


export async function createUser({email, password}) {
    const user = new User({ email });
    await user.setPassword(password);
    await user.save();
    return user;
}

