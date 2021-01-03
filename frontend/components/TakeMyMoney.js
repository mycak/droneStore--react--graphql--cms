import React from 'react';
import StripeCheckout from 'react-stripe-checkout';
import Router from 'next/router';
import { useMutation, gql } from '@apollo/client';
import NProgress from 'nprogress';
import Proptypes from 'prop-types';
import calcTotalPrice from '../lib/calcTotalPrice';
import Error from './ErrorMessage';
import User, { CURRENT_USER_QUERY } from './User';

function totalItems(cart) {
  return cart.reduce((tally, cartItem) => tally + cartItem.quantity, 0);
}

const TakeMyMoney = (props) => {
  const onToken = (res) => {
    console.log('On Token Called!');
    console.log(res.id);
  };
  return (
    <User>
      {({ me }) => (
        <StripeCheckout
          amount={calcTotalPrice(me.cart)}
          name="Sick Fits"
          description={`Order of ${totalItems(me.cart)} items!`}
          image={me.cart[0].item && me.cart[0].item.image}
          stripeKey="pk_test_Vtknn6vSdcZWSG2JWvEiWSqC"
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
