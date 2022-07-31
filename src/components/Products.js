import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
  Typography,
  } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard";
import Cart, {generateCartItemsFrom} from "./Cart";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 * 
 * @property {string} name - The name or title of the product


/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */


const Products = () => {

  const [loader, setLoader] = useState(false);
  const [allProductsList, setallProductsList] = useState([]);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  // const [searchValue, setSearchValue] = useState("");
  const [debounceTimeout, setDebounceTimeout] = useState(0);
  const [cartUpdate, setCartUpdate] = useState("");



  // const searchChangeHandler = (e) => {
  //   setSearchValue(e.target.value);
  // }

  // const handleAddToCart = (e) => {
  //   console.log(e._id, "target");
  //   console.log(e.currentTarget.id, "target Value");
  // }


  useEffect(() => {
    const populatingProductsOnLoad = async() => {
      let allProductsAvailable = await performAPICall();
      console.log(allProductsAvailable);
      setallProductsList(allProductsAvailable);
      let productsInCart = []
      if (localStorage.getItem('token')) {
        productsInCart = await fetchCart(localStorage.getItem('token'));
        let result = generateCartItemsFrom(productsInCart.data, allProductsAvailable);
        console.log("result", result);
        setCartUpdate(result);
      }
    }
    populatingProductsOnLoad()
  }, [])

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const performAPICall = async () => {

    let url = `${config.endpoint}/products`
    setLoader(true);
    try {
      let response = await axios.get(url);
      if (response.status === 200) {
        console.log(response);
        setLoader(false);
        return response.data;
      }
    }
    catch (error) {
      console.log(error);
        setLoader(false);
        closeSnackbar();
    } 
  };
  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    let url = `${config.endpoint}/products`
    try {
      if (text !== "") {
        url =  `${config.endpoint}/products/search?value=${text}`;
      }
        let response = await axios.get(url);
        if (response.status === 200) {
          console.log("Response", response);
          response = response.data;
        }
        setallProductsList(response);
      }
    catch (error) {
      console.log(error.response);
      if (error.response.status === 404) {
        setallProductsList("");
      } else {
        enqueueSnackbar("Something went wrong. Check the backend console for more details", { variant: 'error' , autoHideDuration: 2000 })
      }
      closeSnackbar();
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {
    if(debounceTimeout!==0){
      clearTimeout(debounceTimeout);
    }
    const timeOut = setTimeout(async ()=>{
      await performSearch(event.target.value);
    }, 500);

    setDebounceTimeout(timeOut);
  };

   /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
  const fetchCart = async (token) => {
    if (!token) return;

    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
      let response = await axios.get(`${config.endpoint}/cart`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      console.log(response);
      return response;
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" , autoHideDuration: 2000 });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          autoHideDuration: 2000 })
      }
      return null;
    }
  };


  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {
    let productIdList = items.map((element) => element.productId);
    console.log(productIdList)
    if (productIdList.includes(productId)) {
      console.log("true")
      return true;
    } else {
      console.log("false");
      return false;
    }
  };

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */
  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
    if (!localStorage.getItem('token')) {
      console.log("Hello1")
      enqueueSnackbar("Login to add an item to the Cart", { variant: 'warning' , autoHideDuration: 2000 })
    } else if (options.preventDuplicate && isItemInCart(items, productId)) {
      console.log("Hello2")
      enqueueSnackbar("Item already in cart. Use the cart sidebar to update quantity or remove item.", { variant: 'warning', autoHideDuration: 2000 })
    } else {
      console.log("Hello3")
      try {
        let response = await axios.post(`${config.endpoint}/cart`, {
          "productId": productId,
          "qty": qty
        }
          ,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        )
        console.log("response", response);
        const cartItems = generateCartItemsFrom(response.data, products);
        console.log(cartItems);
        setCartUpdate(cartItems);
      }
      catch (e) {
      if (e.response) {
        enqueueSnackbar(e.response.data.message, { variant: "error" , autoHideDuration: 2000});
      } else {
        enqueueSnackbar(
          "Could not fetch products. Check that the backend is running, reachabe and returns valid JSON.",
          {
            variant: "error", autoHideDuration: 2000
          }
        );
      }
      }
    }
  }
  
  return (
    <div>
      <Header hasHiddenAuthButtons = {false}>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
        <TextField
        className="search-desktop"
          size="small"
          onChange = {(e)=>{debounceSearch(e, debounceTimeout)}}
          InputProps={{
          className: "search",
          endAdornment: (
            <InputAdornment position="center">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
      />
      </Header>

      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        onChange = {debounceSearch}
        
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
      />
      {localStorage.getItem("username") ? <Grid container >
        <Grid item md = {9} xs = {12} >
          <Grid item className="product-grid">
           <Box className="hero">
             <p className="hero-heading">
               <b>India's <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
               to your door step</b>
            </p>
          </Box>
        </Grid>
          {loader ? <Grid container className="loading"
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}><CircularProgress color="success" />
            <Typography variant="h5"> <b>Loading Products...</b></Typography></Grid> : allProductsList ? <Grid container sx={{ mt: 0.001 }} spacing={2}> {allProductsList.map((element) => <Grid item className="product-grid" key={element._id} xs={6} md={3}><ProductCard product={element} handleAddToCart={addToCart} productsInCart = {cartUpdate} productsInList = {allProductsList}></ProductCard></Grid>)} </Grid>  : <div className="loading"> <SentimentDissatisfied color="action" fontSize="large" />
                <Typography variant="h5" style={{ color: "#636363" }}><b>No Products found</b></Typography></div>}
        </Grid>
        <Grid item spacing={3} md = {3} xs = {12} style={{ backgroundColor: '#E9F5E1' }}>
          <Cart products={allProductsList} items={cartUpdate} handleQuantity={addToCart}/>
        </Grid>
        </Grid> :  <Grid container spacing = {2}>
         <Grid item className="product-grid">
           <Box className="hero"> 
             <p className="hero-heading">
               <b>India's <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
               to your door step</b>
            </p>
          </Box>
        </Grid>
        {loader ? <Grid container spacing={0} direction="column" alignItems="center" justifyContent="center"><CircularProgress color="success" />
            <Typography variant="h5"> <b>Loading Products...</b></Typography></Grid> : allProductsList ? allProductsList.map((element) => <Grid item className="product-grid" key = {element._id} xs={6} md={3} style={{ backgroundColor: '#E9F5E1' }}><ProductCard product={element} handleAddToCart = {addToCart} productsInCart = {cartUpdate} productsInList = {allProductsList}></ProductCard></Grid>) : <div className="loading"><SentimentDissatisfied color="action" fontSize="large" />
                <Typography variant="h5" style={{ color: "#636363" }}><b>No Products found</b></Typography></div>}
        </Grid>}
      <Footer />
    </div>
  );
};

export default Products;
