/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import Downshift from 'downshift';
import Router from 'next/router';
import { ApolloConsumer, gql } from '@apollo/client';
import debounce from 'lodash.debounce';
import { DropDown, DropDownItem, SearchStyles } from './styles/DropDown';

const SEARCH_ITEMS_QUERY = gql`
  query SEARCH_ITEMS_QUERY($searchTerm: String!) {
    items(
      where: {
        OR: [
          { title_contains: $searchTerm }
          { description_contains: $searchTerm }
        ]
      }
    ) {
      id
      image
      title
    }
  }
`;
function routeToItem(item) {
  Router.push({
    pathname: '/item',
    query: {
      id: item.id,
    },
  });
}

const AutoComplete = () => {
  const [state, setState] = useState({ items: [], loading: false });

  const onChange = debounce(async (e, client) => {
    setState({ loading: true });
    const res = await client.query({
      query: SEARCH_ITEMS_QUERY,
      variables: { searchTerm: e.target.value },
    });
    setState({
      items: res.data.items,
      loading: false,
    });
  }, 350);

  return (
    <SearchStyles>
      <Downshift
        onChange={routeToItem}
        itemToString={(item) => (item === null ? '' : item.title)}
        id="search"
      >
        {({
          getInputProps,
          getItemProps,
          isOpen,
          inputValue,
          highlightedIndex,
        }) => (
          <div>
            <ApolloConsumer>
              {(client) => (
                <input
                  {...getInputProps({
                    type: 'search',
                    onChange: (e) => {
                      e.persist();
                      onChange(e, client);
                    },
                    placeholder: 'Search for an item',
                    id: 'search',
                    className: state.loading ? 'loading' : '',
                  })}
                />
              )}
            </ApolloConsumer>
            {isOpen && state.items && (
              <DropDown>
                {state.items.map((item, index) => (
                  <DropDownItem
                    {...getItemProps({ item })}
                    key={item.id}
                    highlighted={index === highlightedIndex}
                  >
                    <img width="50" src={item.image} alt={item.title} />
                    {item.title}
                  </DropDownItem>
                ))}
              </DropDown>
            )}
            {isOpen && state.items && !state.items.length && !state.loading && (
              <DropDownItem> Nothing Found {inputValue}</DropDownItem>
            )}
          </div>
        )}
      </Downshift>
    </SearchStyles>
  );
};

export default AutoComplete;
