import React from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { adopt } from 'react-adopt';
import User from './User';
import CartStyles from './styles/CartStyles';
import CartItem from './CartItem';
import Supreme from './styles/Supreme';
import CloseButton from './styles/CloseButton';
import SickButton from './styles/SickButton';
import calcTotalPrice from '../lib/calcTotalPrice';
import formatMoney from '../lib/formatMoney';

const LOCAL_STATE_QUERY = gql`
  query {
    cartOpen @client
  }
`;

const TOGGLE_CART_MUTATION = gql`
  mutation {
    toggleCart @client
  }
`;

const Composed = adopt({
  // eslint-disable-next-line react/display-name
  user: ({ render }) => <User>{render}</User>,
});

const Cart = () => {
  const { data } = useQuery(LOCAL_STATE_QUERY);
  const [toggleCart] = useMutation(TOGGLE_CART_MUTATION);
  return (
    <Composed>
      {({ user }) => {
        const userData = !!user;
        if (!userData) return <p>Loading...</p>;
        if (userData && !userData.me) return null;
        return (
          <CartStyles open={data.cartOpen}>
            <header>
              <CloseButton title="close" onClick={toggleCart}>
                &times;
              </CloseButton>
              <Supreme>{userData.me.name} Your Cart</Supreme>
              <p>
                You Have {userData.me.cart.length} Item
                {userData.me.cart.length === 1 ? '' : 's'} in your cart.
              </p>
            </header>
            <ul>
              {userData.me.cart.map((cartItem) => (
                <CartItem key={cartItem.id} cartItem={cartItem} />
              ))}
            </ul>
            <footer>
              <p>{formatMoney(calcTotalPrice(userData.me.cart))}</p>
              <SickButton>Checkout</SickButton>
            </footer>
          </CartStyles>
        );
      }}
    </Composed>
  );
};
export default Cart;
export { LOCAL_STATE_QUERY, TOGGLE_CART_MUTATION };
