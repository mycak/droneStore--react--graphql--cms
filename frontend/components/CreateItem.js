import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import Router from 'next/router';
import Form from './styles/Form';
import Error from './ErrorMessage';

const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $price: Int!
    $image: String
    $largeImage: String
  ) {
    createItem(
      title: $title
      description: $description
      price: $price
      image: $image
      largeImage: $largeImage
    ) {
      id
    }
  }
`;
const CreateItem = () => {
  const [state, setState] = useState({
    title: 'Cool Shoes',
    description: 'I love those shoes',
    image: null,
    largeImage: 'large-dog.jpg',
    price: 1000,
  });

  const [
    createItem,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation(CREATE_ITEM_MUTATION);

  const uploadFile = async (e) => {
    const { files } = e.target;
    const data = new FormData();
    data.append('file', files[0]);
    data.append('upload_preset', 'drones_store');

    const res = await fetch(
      'https://api.cloudinary.com/v1_1/dng3to5tn/image/upload',
      {
        method: 'POST',
        body: data,
      }
    );
    const file = await res.json();
    setState({
      ...state,
      image: file.secure_url,
      largeImage: file.eager[0].secure_url,
    });
    console.log(state);
  };

  return (
    <>
      <Form
        onSubmit={async (e) => {
          e.preventDefault();
          const res = await createItem({
            variables: { ...state },
          });
          Router.push({
            pathname: '/item',
            query: { id: res.data.createItem.id },
          });
        }}
      >
        <fieldset aria-busy={mutationLoading} disabled={mutationLoading}>
          <label htmlFor="file">
            Image
            <input
              type="file"
              id="file"
              name="file"
              placeholder="Upload an image"
              required
              onChange={uploadFile}
            />
            {state.image && (
              <img width="200" src={state.image} alt="Upload Preview" />
            )}
          </label>
          <label htmlFor="title">
            Title
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Title"
              value={state.title}
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
              value={state.price}
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
              value={state.description}
              required
              onChange={(e) =>
                setState({ ...state, description: `${e.target.value}` })
              }
            />
          </label>
          <button type="submit">Submit</button>
        </fieldset>
      </Form>
      {mutationLoading && <p>Loading...</p>}
      {mutationError && <Error error={mutationError} />}
    </>
  );
};
export default CreateItem;
export { CREATE_ITEM_MUTATION };
