import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 2,
    maxLength: 30,
    require: true,
  },
  about: {
    type: String,
    minLength: 2,
    maxLength: 30,
    require: true,
  },
  avatar: {
    type: String,
    require: true,
  },
});

export default mongoose.model('user', userSchema);
