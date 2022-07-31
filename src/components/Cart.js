import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Button, IconButton, Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react"; 
import { useHistory } from "react-router-dom";
import "./Cart.css";

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

/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} productId - Unique ID for the product
 */

/**
 * Returns the complete data on all products in cartData by searching in productsData
 *
 * @param { Array.<{ productId: String, qty: Number }> } cartData
 *    Array of objects with productId and quantity of products in cart
 * 
 * @param { Array.<Product> } productsData
 *    Array of objects with complete data on all available products
 *
 * @returns { Array.<CartItem> }
 *    Array of objects with complete data on products in cart
 *
 */
export const generateCartItemsFrom = (cartData, productsData) => {
  if (!cartData) return;
  let cartArray = []
  for(let i = 0 ; i < cartData.length;i++)
  { 
    for(let j = 0 ; j < productsData.length;j++)
    {
         if(productsData[j]._id === cartData[i]["productId"])
         {
           cartArray.push({ ...productsData[j], ...cartData[i] });
           break;
         }
    }
  }
    return  cartArray.filter(item => delete item._id) 
};
/**
 * Get the total value of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products added to the cart
 *
 * @returns { Number }
 *    Value of all items in the cart
 *
 */
export const getTotalCartValue = (items = []) => {
  let totalCost = 0;
  items.forEach((element) => {
    totalCost += element.qty * element.cost;
  })
  return totalCost;
};


// TODO: CRIO_TASK_MODULE_CHECKOUT - Implement function to return total cart quantity
/**
 * Return the sum of quantities of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products in cart
 *
 * @returns { Number }
 *    Total quantity of products added to the cart
 *
 */
export const getTotalItems = (items = []) => {
  let totalItems = 0;
  items.forEach((element) => {
    totalItems += element.qty
  })
  return totalItems;
};

// TODO: CRIO_TASK_MODULE_CHECKOUT - Add static quantity view for Checkout page cart
/**
 * Component to display the current quantity for a product and + and - buttons to update product quantity on cart
 * 
 * @param {Number} value
 *    Current quantity of product in cart
 * 
 * @param {Function} handleAdd
 *    Handler function which adds 1 more of a product to cart
 * 
 * @param {Function} handleDelete
 *    Handler function which reduces the quantity of a product in cart by 1
 * 
 * @param {Boolean} isReadOnly
 *    If product quantity on cart is to be displayed as read only without the + - options to change quantity
 * 
 */
const ItemQuantity = ({
  value,
  products,
  productId,
  items,
  handleAdd,
  handleDelete,
}) => {
  return (
    <Stack direction="row" alignItems="center">
      <IconButton size="small" color="primary" onClick={() => handleDelete(localStorage.getItem('token'), items, products, productId, value - 1, { preventDuplicate: false })}>
        <RemoveOutlined />
      </IconButton>
      <Box padding="0.5rem" data-testid="item-qty">
        {value}
      </Box>
      <IconButton size="small" color="primary" onClick={() => handleAdd(localStorage.getItem('token'), items, products, productId, value + 1, { preventDuplicate: false })}>
        <AddOutlined />
      </IconButton>
    </Stack>
  );
};

/**
 * Component to display the Cart view
 * 
 * @param { Array.<Product> } products
 *    Array of objects with complete data of all available products
 * 
 * @param { Array.<Product> } items
 *    Array of objects with complete data on products in cart
 * 
 * @param {Function} handleDelete
 *    Current quantity of product in cart
 * 
 * @param {Boolean} isReadOnly
 *    If product quantity on cart is to be displayed as read only without the + - options to change quantity
 * 
 */
const Cart = ({
  isReadOnly,
  products,
  items = [],
  handleQuantity,
}) => {

  let history = useHistory();
  const handleClick = () => {
    history.push("/checkout", {from: "/Cart"})
  }



  if (!items.length) {
    return (
      <Box className="cart empty">
        <ShoppingCartOutlined className="empty-cart-icon" />
        <Box color="#aaa" textAlign="center">
          Cart is empty. Add more items to the cart to checkout.
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Box className="cart">
        {/* TODO: CRIO_TASK_MODULE_CART - Display view for each cart item with non-zero quantity */
          items.map((element) => {
            return (
              <Box display="flex" alignItems="flex-start" key={element.productId} padding="1rem">
                <Box className="image-container">
                <img
              // Add product image
              src={`${element.image}`}
              // Add product name as alt eext
              alt={`${element.name}`}
              width="100%"
              height="100%"
              />
                </Box>
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="space-between"
                  height="6rem"
                  paddingX="1rem"
                >
                  <div>{`${element.name}`}</div>
                  <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                    {!isReadOnly ? <ItemQuantity value={element.qty} products={products}
                      items={items} productId={element.productId} handleDelete={handleQuantity} handleAdd={handleQuantity}
                    // Add required props by checking implementation
                    /> : <div>Qty: {element.qty}</div>}
                  <Box padding="0.5rem" fontWeight="700">
                  ${`${element.cost}`}
                  </Box>
                </Box>
              </Box>
            </Box>
          )})  
        }
            <Box
              padding="1rem"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
            <Box color="#3C3C3C" alignSelf="center">
              Order total
            </Box>
            <Box
              color="#3C3C3C"
              fontWeight="700"
              fontSize="1.5rem"
              alignSelf="center"
              data-testid="cart-total"
            >
              ${getTotalCartValue(items)}
            </Box>
          </Box>
        {!isReadOnly && (
          <Box display="flex" justifyContent="flex-end" className="cart-footer">
            <Button
              color="primary"
              variant="contained"
              startIcon={<ShoppingCart />}
              className="checkout-btn"
              onClick={handleClick}
            >
              Checkout
            </Button>
          </Box>
        )}
      </Box>
      {isReadOnly && (
        <Box padding="1rem" className="cart">
          <Typography variant="h5" fontWeight="700" mb={2}>
            Order Details
          </Typography>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography> Products </Typography>
            <Typography>{getTotalItems(items)}</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography>Subtotal</Typography>
            <Typography>${getTotalCartValue(items)} </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography>Shipping Charges</Typography>
            <Typography>$0</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography variant="h6" fontWeight="700">
              Total
            </Typography>
            <Typography variant="h6" fontWeight="700">
              ${getTotalCartValue(items) + 0}
            </Typography>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Cart;
