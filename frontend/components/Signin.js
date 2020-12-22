import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import Form from './styles/Form';
import Error from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      id
      email
      name
    }
  }
`;

const Signin = () => {
  const [state, setState] = useState({
    password: '',
    email: '',
  });

  const [signup, { loading, error }] = useMutation(SIGNIN_MUTATION);

  const saveToState = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  return (
    <Form
      method="post"
      onSubmit={async (e) => {
        e.preventDefault();
        await signup({
          variables: { ...state },
          refetchQueries: [{ query: CURRENT_USER_QUERY }],
        });
        setState({ ...state, name: '', email: '', password: '' });
      }}
    >
      <fieldset disabled={loading} aria-busy={loading}>
        <h2>Sign Into your Account</h2>
        <Error error={error} />
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
        <label htmlFor="password">
          Password
          <input
            type="password"
            name="password"
            placeholder="password"
            value={state.password}
            onChange={saveToState}
          />
        </label>

        <button type="submit">Sign In!</button>
      </fieldset>
    </Form>
  );
};

export default Signin;
