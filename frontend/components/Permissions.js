import { gql, useQuery, useMutation } from '@apollo/client';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Error from './ErrorMessage';
import Table from './styles/Table';
import SickButton from './styles/SickButton';

const possiblePermissions = [
  'ADMIN',
  'USER',
  'ITEMCREATE',
  'ITEMUPDATE',
  'ITEMDELETE',
  'PERMISSIONUPDATE',
];

const UPDATE_PERMISSIONS_MUTATION = gql`
  mutation updatePermissions($permissions: [Permission], $userId: ID!) {
    updatePermissions(permissions: $permissions, userId: $userId) {
      id
      permissions
      name
      email
    }
  }
`;

const ALL_USERS_QUERY = gql`
  query {
    users {
      id
      name
      email
      permissions
    }
  }
`;

const Permissions = () => {
  const { data, error } = useQuery(ALL_USERS_QUERY);
  return (
    <div>
      <Error error={error} />
      <div>
        <h2>Manage Permissions</h2>
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              {possiblePermissions.map((permission) => (
                <th key={permission}>{permission}</th>
              ))}
              <th>👇🏻</th>
            </tr>
          </thead>
          <tbody>
            {data &&
              data.users.map((user) => (
                <UserPermission key={user.id} user={user} />
              ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

const UserPermission = ({ user }) => {
  const [state, setState] = useState({ permissions: user.permissions });
  const [updatePermissionsMutation, { error, loading }] = useMutation(
    UPDATE_PERMISSIONS_MUTATION
  );

  const handlePermissionsChange = (e) => {
    const checkbox = e.target;
    let updatedPermissions = [...state.permissions];
    if (checkbox.checked) {
      updatedPermissions.push(checkbox.value);
    } else {
      updatedPermissions = updatedPermissions.filter(
        (permission) => permission !== checkbox.value
      );
    }
    setState({ permissions: updatedPermissions });
  };
  return (
    <>
      {error && (
        <tr>
          <td colSpan="8">
            <Error error={error} />
          </td>
        </tr>
      )}
      <tr>
        <td>{user.name}</td>
        <td>{user.email}</td>
        {possiblePermissions.map((permission) => (
          <td key={permission}>
            <label htmlFor={`${user.id}-permission-${permission}`}>
              <input
                id={`${user.id}-permission-${permission}`}
                type="checkbox"
                checked={state.permissions.includes(permission)}
                value={permission}
                onChange={(e) => handlePermissionsChange(e)}
              />
            </label>
          </td>
        ))}
        <td>
          <SickButton
            disabled={loading}
            type="button"
            onClick={() =>
              updatePermissionsMutation({
                variables: {
                  permissions: state.permissions,
                  userId: user.id,
                },
              })
            }
          >
            Updat{loading ? 'ing' : 'e'}
          </SickButton>
        </td>
      </tr>
    </>
  );
};

UserPermission.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    id: PropTypes.string,
    permissions: PropTypes.array,
  }).isRequired,
};

export default Permissions;
