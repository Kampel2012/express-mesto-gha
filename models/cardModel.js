import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 2,
    maxLength: 30,
    require: true,
  },
  link: {
    type: String,
    require: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    require: true,
  },
  likes: {
    default: [],
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export default mongoose.model('card', cardSchema);
