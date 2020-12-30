import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useMutation, gql } from '@apollo/client';
import { CURRENT_USER_QUERY } from './User';

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
  const update = (cache, payload) => {
    console.log('Running remove from cart update fn');
    // 1. first read the cache
    const data = cache.readQuery({ query: CURRENT_USER_QUERY });
    console.log(data);
    // 2. remove that item from the cart
    const cartItemId = payload.data.removeFromCart.id;
    data.me.cart = data.me.cart.filter(
      (cartItem) => cartItem.id !== cartItemId
    );
    // 3. write it back to the cache
    cache.writeQuery({ query: CURRENT_USER_QUERY, data });
  };
  return (
    <BigButton
      disabled={loading}
      onClick={() => {
        removeFromCartMutation({
          variables: { id },
          update: (cache, payload) => {
            update(cache, payload);
          },
          optimisticResponse: {
            __typename: 'Mutation',
            removeFromCart: {
              __typename: 'CartItem',
              id,
            },
          },
        }).catch((err) => alert(err.message));
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
