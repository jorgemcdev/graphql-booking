/* eslint-disable no-use-before-define */
/* eslint-disable func-names */
import { hash, compare } from 'bcryptjs';

const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      validate: {
        validator: email => User.dontExist({ email }),
        message: () => 'Email has already been taken1 '
      }
    },
    password: {
      type: String,
      required: true
    },
    createdEvents: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Event'
      }
    ],
  },
  {
    timestamps: true
  }
);

userSchema.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await hash(this.password, 10);
  }
});

userSchema.statics.dontExist = async function (options) {
  return await this.where(options).countDocuments() === 0;
};

userSchema.methods.matchPassword = function (password) {
  return compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
