import mongoose from 'mongoose';
import { UserInputError } from 'apollo-server-express';

export const isObjectId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new UserInputError('Is not a Valid user ID');
  }
  return true;
};

export const isAuthenticated = 1;
