import { useQuery, gql } from '@apollo/client';
import PropTypes from 'prop-types';

import React from 'react';
import styled from 'styled-components';

const CURRENT_USER_QUERY = gql`
  query {
    me {
      id
      email
      name
      permissions
      cart {
        id
        quantity
        item {
          id
          price
          image
          title
          description
        }
      }
    }
  }
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const User = ({ children }) => {
  const { data, loading } = useQuery(CURRENT_USER_QUERY);
  console.log(data);
  return <Container>{children(data, loading)}</Container>;
};

User.propTypes = {
  children: PropTypes.func.isRequired,
};

export default User;
export { CURRENT_USER_QUERY };
