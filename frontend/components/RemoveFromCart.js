import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useMutation, gql } from '@apollo/client';

const REMOVE_FROM_CART_MUTATION = gql`
  mutation removeFromCart($id: ID!) {
    removeFromCart(id: $id) {
      id
    }
  }
`;

const BigButton = styled.button`
  font-size: 3rem;
  background: none;
  border: 0;
  &:hover {
    color: ${(props) => props.theme.red};
    cursor: pointer;
  }
`;
const RemoveFromCart = ({ id }) => {
  const [removeFromCartMutation, { loading }] = useMutation(
    REMOVE_FROM_CART_MUTATION
  );

  return (
    <BigButton
      disabled={loading}
      onClick={() => {
        removeFromCartMutation({ variables: { id } }).catch((err) =>
          alert(err.message)
        );
      }}
      title="Delete Item"
    >
      &times;
    </BigButton>
  );
};

RemoveFromCart.propTypes = {
  id: PropTypes.string.isRequired,
};

export default RemoveFromCart;
