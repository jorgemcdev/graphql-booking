/* eslint-disable arrow-body-style */
/* eslint no-unused-vars: 0 */
import { AuthenticationError, UserInputError, ApolloError } from 'apollo-server-express';
import { hash } from 'bcryptjs';

import { User } from '../models';

import { isObjectId } from '../utils/utils';

require('dotenv').config();

const { SESSION_NAME } = process.env;

export default {
  Query: {
    me: (root, arg, { req }, info) => {
      return User.findById(req.session.userId);
    },
    users: (root, arg, { req }, info) => {
      return User.find({});
    },
    user: (root, { id }, context, info) => {
      isObjectId(id);
      return User.findById(id);
    }
  },
  Mutation: {
    signUp: async (root, args, { req }, info) => {
      const user = await User.create(args);
      return user;
    },
    signIn: async (root, args, { req }, info) => {
      const { email, password } = args;
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError('Email incorrect.');
      }
      if (!await user.matchPassword(password)) {
        throw new AuthenticationError('Password incorrect.');
      }
      req.session.userId = user.id;
      return user;
    },
    delUser: async (root, { id }, { req }, info) => {
      isObjectId(id);
      const user = await User.deleteOne({ _id: id });
      return user.deletedCount === 1 && true;
    },
    updateUser: async (root, { email, password }, { req }, info) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          throw new UserInputError('Email incorrect.');
        }
        const hashPassword = await hash(password, 10);
        await User.updateOne(
          { _id: user._doc._id },
          { $set: { password: hashPassword } },
          { new: true }
        );
        return user;
      } catch (e) {
        throw new ApolloError('Server Error');
      }
    },
    logOut: async (root, args, { req, res }, info) => {
      try {
        await req.session.destroy();
        await res.clearCookie(SESSION_NAME);
      } catch (e) {
        throw new AuthenticationError('Error try to logout.');
      }
      return true;
    }
  }
};
