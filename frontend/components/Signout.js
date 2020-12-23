import React from 'react';
import { useMutation, gql } from '@apollo/client';
import { CURRENT_USER_QUERY } from './User';

const SIGN_OUT_MUTATION = gql`
  mutation SIGN_OUT_MUTATION {
    signout {
      message
    }
  }
`;

const Signout = () => {
  const [signout] = useMutation(SIGN_OUT_MUTATION);
  return (
    <button
      type="button"
      onClick={() =>
        signout({ refetchQueries: [{ query: CURRENT_USER_QUERY }] })
      }
    >
      Sign Out
    </button>
  );
};
export default Signout;
