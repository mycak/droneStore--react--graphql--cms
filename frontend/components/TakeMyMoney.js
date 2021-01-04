import React from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { useMutation, gql } from '@apollo/client';
import calcTotalPrice from '../lib/calcTotalPrice';
import User, { CURRENT_USER_QUERY } from './User';
// import Router from 'next/router';
// import NProgress from 'nprogress';
// import Proptypes from 'prop-types';
// import Error from './ErrorMessage';

const CREATE_ORDER_MUTATION = gql`
  mutation createOrder($token: String!) {
    createOrder(token: $token) {
      id
      charge
      total
      items {
        id
        title
      }
    }
  }
`;

function totalItems(cart) {
  return cart.reduce((tally, cartItem) => tally + cartItem.quantity, 0);
}

const TakeMyMoney = (props) => {
  const [createOrder] = useMutation(CREATE_ORDER_MUTATION);

  const onToken = async (res) => {
    console.log('On Token Called!');
    console.log(res.id);

    const order = await createOrder({
      variables: {
        token: res.id,
      },
      refetchQueries: [{ query: CURRENT_USER_QUERY }],
    }).catch((err) => {
      alert(err.message);
    });

    console.log(order);
  };

  return (
    <User>
      {({ me }) => (
        <StripeCheckout
          amount={calcTotalPrice(me.cart)}
          name="Drones Store"
          description={`Order of ${totalItems(me.cart)} items!`}
          image={me.cart && me.cart[0] ? me.cart[0].item.image : ''}
          stripeKey="pk_test_51I5WTNGip6lmwTdnIMajRM89x2nVnrLyvXuXxgQiVaPoenquczSntCyPr6DvZyX0sgpTNE7uepz19WdYWvq3Disd00faprUonn"
          currency="USD"
          email={me.email}
          token={(res) => onToken(res)}
        >
          {props.children}
        </StripeCheckout>
      )}
    </User>
  );
};

export default TakeMyMoney;
