import React from 'react';
import PleaseSignIn from '../components/PleaseSignIn';
import Order from '../components/Order';

const Sell = ({ query }) => (
  <div>
    <PleaseSignIn>
      <Order id={query.id} />
    </PleaseSignIn>
  </div>
);

export default Sell;
