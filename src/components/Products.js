import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid, 
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios"; 
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App"; 
import Footer from "./Footer"; 
import Header from "./Header";
import Typography from "@mui/material/Typography";
import "./Products.css"; 
import ProductCard from "./ProductCard"

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 * 
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

const Products = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const [products, setProducts] = useState([]);
  const [debounceTimeout, setDebounceTimeout] = useState(0);
  const [searchValid, setIfSearchValid] = useState("true")

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
  const username = localStorage.getItem("username")
    ? localStorage.getItem("username")
    : "";
  let isLoggedIn = false;
  if (username !== "") {
    isLoggedIn = true;
  }

  // useEffect( () => { 
    
  //    async function fetchData() {
  //      const products = await performAPICall();
       
  //      setProducts(products);
  //      setLoading(false);
  //   }
  //   fetchData();
  // },[]);

  const performAPICall = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${config.endpoint}/products`);
      const data = response.data;
      setLoading(false);
      setProducts(data);
      return data;
    } catch (error) {
      // setLoading(false);
      if (error.response.status === 500 && error.response) {
        enqueueSnackbar(error.response.data.message, { variant: "error", autoHideDuration: 2000 });
      } else {
        enqueueSnackbar("Something went wrong. Check the backend console for more details", { variant: "error", autoHideDuration: 2000 });
      }
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
    try {
      const response = await axios.get(`${config.endpoint}/products/search?value=${text}`);
      const data = response.data;
      setProducts(data);
      setIfSearchValid(true);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          setProducts([]);
        }
        if (error.response.status === 500) {
          enqueueSnackbar(error.response.data.message, { variant: "error" });
        }
      } else {
        enqueueSnackbar("Something went wrong!", { variant: "error" });
        setIfSearchValid(false);
      }
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
    const value = event.target.value;
    if (debounceTimeout !== 0) {
      clearTimeout(debounceTimeout);
    }
    const timeOut = setTimeout(async () => {
      await performSearch(value);
    }, 400);
    setDebounceTimeout(timeOut);
  };

  useEffect(() => { performAPICall(); }, []);

  return (
    <div>
      <Header>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
        {/* Search view for desktop */}
        <TextField
        className="search-desktop"
        size="small"
          InputProps={{
          className: "search",
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
          name="search"
          onChange={(e) => debounceSearch(e, debounceTimeout)}
      />
      </Header>

      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
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
        onChange={(e) => debounceSearch(e, debounceTimeout)}
      />
       <Grid container>
         <Grid item className="product-grid">
           <Box className="hero">
             <p className="hero-heading">
               <b>India's <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
               to your door step</b>
             </p>
           </Box>
         </Grid>
      </Grid>
      {loading ? (
        <div className="loading">
          <CircularProgress color="success"/>
          <Typography variant="h4"> <b>Loading Products...</b></Typography>
        </div>
      ) : (
          <Grid container spacing={2} rowSpacing={2} my={1}>
            {products.length ? (
              products.map((product) => {
                const { _id, name, category, rating, cost, image } = product;
                return (
                  <Grid item xs={6} md={3} key={_id}>
                    <ProductCard product={product} />
                  </Grid>
                );
              })
            ) : (
              <div className="loading">
                <SentimentDissatisfied color="action" fontSize="large" />
                <Typography variant="h5" style={{ color: "#636363" }}><b>No Products found</b></Typography>
              </div>
            )} 
          </Grid>
      )}
      <Footer />
    </div>
  );
};

export default Products;
