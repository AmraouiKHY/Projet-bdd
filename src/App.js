import React, { useState, useEffect } from 'react';
import InventoryForm from './InventoryForm';
import InventoryList from './InventoryList';
import { createStore, applyMiddleware } from 'redux';
import { thunk } from "redux-thunk";
import './input.css';  
import LoginPage from './LoginPage'; 


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
    case 'SET_PRODUCTS': // New action type to set products directly
      return {
        ...state,
        products: action.payload,
      };
    case 'CLEAR_PRODUCTS': // New action type to clear products
      return {
        ...state,
        products: [],
      };
    default:
      return state;
  }
};
const store = createStore(reducer, applyMiddleware(thunk));

const fetchProducts = () => {
  const apiUrl = 'http://localhost:5000/api/products';
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      store.dispatch({ type: 'CLEAR_PRODUCTS' }); // Clear existing products
      data.forEach(product => {
        store.dispatch({ type: 'ADD_PRODUCT', payload: product });
      });
    })
    .catch((error) => {
      console.error('Error fetching products:', error);
    });
};

const App = () => {
  const [products, setProducts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // New state for login status

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    // Subscribe to store changes to update local component state
    const unsubscribe = store.subscribe(() => setProducts(store.getState().products));
    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, []);

  const submitProduct = (productData) => {
    // Dispatch an action to update the Redux store
    store.dispatch({ type: 'ADD_PRODUCT', payload: productData });
  };

  const handleLogin = (username, password) => {
    // Here you would normally check the username and password against a database
    // For simplicity, we'll just log the username and password and set isLoggedIn to true
    console.log(`Logging in with username: ${username} and password: ${password}`);
    setIsLoggedIn(true);
  };
  return (
    <div className="mx-auto px-4 py-8 ">
      <h1 className="text-center text-3xl font-bold mb-4">Inventory Management</h1>
      {isLoggedIn ? (
        <>
          <InventoryForm onSubmit={submitProduct} onProductsUpdated={fetchProducts} />
          <InventoryList products={products} />
        </>
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;
