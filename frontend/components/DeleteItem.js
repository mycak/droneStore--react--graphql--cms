/* eslint-disable no-restricted-globals */
/* eslint-disable import/no-cycle */
import React from 'react';
import { gql, useMutation } from '@apollo/client';
import { ALL_ITEMS_QUERY } from './Items';

const DELETE_ITEM_MUTATION = gql`
  mutation DELETE_ITEM_MUTATION($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
`;
const updateCache = (cache, payload) => {
  const data = cache.readQuery({ query: ALL_ITEMS_QUERY });
  data.items = data.items.filter(
    (item) => item.id !== payload.data.deleteItem.id
  );
  cache.writeQuery({ query: ALL_ITEMS_QUERY, data });
};

const DeleteItem = ({ id, children }) => {
  const [deleteItem] = useMutation(DELETE_ITEM_MUTATION, {
    update: updateCache,
  });

  return (
    <button
      type="button"
      onClick={() => {
        if (confirm('Are you sure you want to delete this item?')) {
          deleteItem({ variables: { id } });
        }
      }}
    >
      {children}
    </button>
  );
};
export default DeleteItem;
