import React, { useState } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import Router from 'next/router';
import Form from './styles/Form';
import Error from './ErrorMessage';

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      price
    }
  }
`;
const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION(
    $id: ID!
    $title: String
    $description: String
    $price: Int
  ) {
    updateItem(
      id: $id
      title: $title
      description: $description
      price: $price
    ) {
      id
      title
      description
      price
    }
  }
`;

const UpdateItem = ({ id }) => {
  const { loading, data } = useQuery(SINGLE_ITEM_QUERY, {
    variables: { id },
  });
  const [
    updateItem,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation(UPDATE_ITEM_MUTATION);

  const [state, setState] = useState({});

  const handleUpdateItem = async (e) => {
    e.preventDefault();
    setState({ ...state, id: `${id}` });
    const res = await updateItem({
      variables: { id, ...state },
    });
    Router.push({
      pathname: '/item',
      query: { id: res.data.updateItem.id },
    });
  };

  const queryExist = () => {
    if (data) {
      return !!data.item;
    }
  };

  const queryNotExist = () => {
    if (data) {
      if (!data.item) {
        return true;
      }
    }
  };

  return (
    <>
      {loading && <p>Loading...</p>}
      {queryNotExist() && <p>No Item Found for ID {id}</p>}
      {queryExist() && (
        <Form onSubmit={handleUpdateItem}>
          <fieldset aria-busy={mutationLoading} disabled={mutationLoading}>
            <label htmlFor="title">
              Title
              <input
                type="text"
                id="title"
                name="title"
                placeholder={data.title}
                defaultValue={data.item.title}
                required
                onChange={(e) =>
                  setState({ ...state, title: `${e.target.value}` })
                }
              />
            </label>
            <label htmlFor="price">
              Price
              <input
                type="number"
                id="price"
                name="price"
                placeholder="Price"
                defaultValue={data.item.price}
                required
                onChange={(e) =>
                  setState({ ...state, price: parseFloat(`${e.target.value}`) })
                }
              />
            </label>
            <label htmlFor="description">
              Description
              <textarea
                id="description"
                name="description"
                placeholder="Enter a description"
                defaultValue={data.item.description}
                required
                onChange={(e) =>
                  setState({ ...state, description: `${e.target.value}` })
                }
              />
            </label>
            <button type="submit">Save changes</button>
          </fieldset>
        </Form>
      )}
      {mutationError && <Error error={mutationError} />}
    </>
  );
};
export default UpdateItem;
export { UPDATE_ITEM_MUTATION };
