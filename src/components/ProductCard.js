import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";
const ProductCard = ({ product, handleAddToCart , productsInCart, productsInList}) => {
  return (
    <Card className="card">
      <CardMedia component="img" alt={product.name} className={product.category} image={product.image} />
      <CardContent>
        <Typography gutterBottom variant="subtitle1" component="div">
          <b>{product.name}</b>
        </Typography>
        <Typography variant="subtitle2" gutterBottom component="div">
            ${product.cost}
        </Typography>
        <Rating name="half-rating-read" value={product.rating} precision={0.5} readOnly />
      </CardContent>
      <CardActions>
        <Button variant="contained" fullWidth={true} className="card-button" startIcon={<AddShoppingCartOutlined />} onClick=
          {() => handleAddToCart(localStorage.getItem('token'), productsInCart, productsInList, product["_id"], 1, { preventDuplicate: true })}>Add To Cart</Button>
      </CardActions>
    </Card>
  )}

export default ProductCard;
