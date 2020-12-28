import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import Form from './styles/Form';
import Error from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';

const RESET_MUTATION = gql`
  mutation RESET_MUTATION(
    $resetToken: String!
    $password: String!
    $confirmPassword: String!
  ) {
    resetPassword(
      resetToken: $resetToken
      password: $password
      confirmPassword: $confirmPassword
    ) {
      id
      email
      name
    }
  }
`;

const Reset = (props) => {
  const [state, setState] = useState({
    password: '',
    confirmPassword: '',
  });

  const [reset, { loading, error }] = useMutation(RESET_MUTATION);

  const saveToState = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  return (
    <Form
      method="post"
      onSubmit={async (e) => {
        e.preventDefault();
        await reset({
          variables: {
            resetToken: props.resetToken,
            password: state.password,
            confirmPassword: state.confirmPassword,
          },
          refetchQueries: [{ query: CURRENT_USER_QUERY }],
        });
        setState({ ...state, email: '' });
      }}
    >
      <fieldset disabled={loading} aria-busy={loading}>
        <h2>Reset Your password</h2>
        <Error error={error} />
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
        <label htmlFor="confirmPassword">
          Confirm Your Password
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
            value={state.confirmPassword}
            onChange={saveToState}
          />
        </label>
        <button type="submit">Reset Your Password!</button>
      </fieldset>
    </Form>
  );
};

export default Reset;
