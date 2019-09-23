import { gql } from 'apollo-server-express';

const user = gql`
  type Event {
    _id: ID!
    title: String!
    description: String!
    price: Float!
    date: String!
    creator: User!
  }
`;

export default user;
