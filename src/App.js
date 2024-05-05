import React, { useState, useEffect } from 'react';
import InventoryForm from './InventoryForm';
import InventoryList from './InventoryList';
import { createStore, applyMiddleware } from 'redux';
import { thunk } from "redux-thunk";
import './input.css';  // Middleware for asynchronous actions

const initialState = {
  products: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_PRODUCT':
      return {
        ...state,
        products: [...state.products, action.payload],
      };
    default:
      return state;
  }
};

const store = createStore(reducer, applyMiddleware(thunk));

const App = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Implement fetching of existing products (optional)
  }, []);

  const submitProduct = (productData) => {
    // Dispatch an action to update the Redux store
    store.dispatch({ type: 'ADD_PRODUCT', payload: productData });
  };

  // Subscribe to store changes to update local component state
  store.subscribe(() => setProducts(store.getState().products));

  return (
    <div className="container mx-auto px-4 py-8 bg-black">
      <h1 className="text-3xl font-bold mb-4">Inventory Management</h1>
      <InventoryForm onSubmit={submitProduct} />
      <InventoryList products={products} />
    </div>
  );
};

export default App;
