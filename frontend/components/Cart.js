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
import TakeMyMoney from './TakeMyMoney';

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
        if (user) {
          if (user.me) {
            return (
              <CartStyles open={data.cartOpen}>
                <header>
                  <CloseButton title="close" onClick={toggleCart}>
                    &times;
                  </CloseButton>
                  <Supreme>{user.me.name} Your Cart</Supreme>
                  <p>
                    You Have {user.me.cart.length} Item
                    {user.me.cart.length === 1 ? '' : 's'} in your cart.
                  </p>
                </header>
                <ul>
                  {user.me.cart.map((cartItem) => (
                    <CartItem key={cartItem.id} cartItem={cartItem} />
                  ))}
                </ul>
                <footer>
                  <p>{formatMoney(calcTotalPrice(user.me.cart))}</p>
                  <TakeMyMoney>
                    <SickButton>Checkout</SickButton>
                  </TakeMyMoney>
                </footer>
              </CartStyles>
            );
          }
          return <p>Loading...</p>;
        }
        if (!user) return <p>Loading...</p>;
      }}
    </Composed>
  );
};
export default Cart;
export { LOCAL_STATE_QUERY, TOGGLE_CART_MUTATION };
