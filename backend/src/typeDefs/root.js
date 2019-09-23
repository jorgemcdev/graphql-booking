import { gql } from 'apollo-server-express';

const root = gql`
  type Query {
    empty: String
  }

  type Mutation {
    empty: String
  }

  type Subscription {
    empty: String
  }
`;

export default root;
