import { gql } from 'apollo-server-express';

const user = gql`
  extend type Query {
    me: User
    user(id: ID!): User
    users: [User!]
  }

  extend type Mutation {
    signUp(email: String!, password: String!): User
    signIn(email: String!, password: String!): User
    logOut: Boolean
    delUser(id: ID!): Boolean
    updateUser(email: String!, password: String!): User
  }

  type User {
    _id: ID!
    email: String!
    password: String
    createdEvents: [Event!]
    createdAt: String
    updatedAt: String
  }
`;

export default user;
