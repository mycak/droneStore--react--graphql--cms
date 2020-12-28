import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import Form from './styles/Form';
import Error from './ErrorMessage';

const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    requestReset(email: $email) {
      message
    }
  }
`;

const Signin = () => {
  const [state, setState] = useState({
    email: '',
  });

  const [reset, { loading, error, called }] = useMutation(
    REQUEST_RESET_MUTATION
  );

  const saveToState = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  return (
    <Form
      method="post"
      onSubmit={async (e) => {
        e.preventDefault();
        await reset({
          variables: { ...state },
        });
        setState({ ...state, email: '' });
      }}
    >
      <fieldset disabled={loading} aria-busy={loading}>
        <h2>Request a password reset !</h2>
        <Error error={error} />
        {!error && !loading && called && <p>Check Your email</p>}
        <label htmlFor="email">
          Email
          <input
            type="email"
            name="email"
            placeholder="email"
            value={state.email}
            onChange={saveToState}
          />
        </label>
        <button type="submit">Request Reset !</button>
      </fieldset>
    </Form>
  );
};

export default Signin;
