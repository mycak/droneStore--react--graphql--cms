import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import Form from './styles/Form';
import Error from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION(
    $email: String!
    $name: String!
    $password: String!
  ) {
    signup(email: $email, name: $name, password: $password) {
      id
      email
      name
    }
  }
`;

const Signup = () => {
  const [state, setState] = useState({
    name: '',
    password: '',
    email: '',
  });

  const [signup, { loading, error }] = useMutation(SIGNUP_MUTATION);

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
        <h2>Sign Up for An Account</h2>
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
        <label htmlFor="name">
          Name
          <input
            type="text"
            name="name"
            placeholder="name"
            value={state.name}
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

        <button type="submit">Sign Up!</button>
      </fieldset>
    </Form>
  );
};

export default Signup;
