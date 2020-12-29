import React from 'react';
import { useMutation, gql } from '@apollo/client';

const ADD_TO_CART_MUTATION = gql`
  mutation addToCart($id: ID!) {
    addToCart(id: $id) {
      id
      quantity
    }
  }
`;

const AddToCart = ({ id }) => {
  const [addToCart] = useMutation(ADD_TO_CART_MUTATION);
  return (
    <button type="button" onClick={() => addToCart({ variables: { id } })}>
      Add To Cart 🛒
    </button>
  );
};

export default AddToCart;
