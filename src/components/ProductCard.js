import {Button, Card, CardActions, CardContent, CardMedia, Rating, Typography, } from "@mui/material";
import React from "react";
import "./ProductCard.css";
import AddShoppingCartRoundedIcon from '@mui/icons-material/AddShoppingCartRounded';

const ProductCard = ({ product, handleAddToCart }) => {
  return (
    <Card className="card">  
      <CardMedia
        className={product.category}
        component="img" 
        image={product.image}
        alt="image"
      />
      <CardContent>
        <Typography gutterBottom  >
          {product.name}
        </Typography>
        <Typography className="card-actions" style={{ fontWeight: "bold" }} variant="subtitle1" gutterBottom>${product.cost}</Typography>
        <Rating
          name="simple-controlled"
          defaultValue={product.rating}
          precision = {0.5}
          readOnly
        />
      </CardContent>
      <CardActions>
        <Button fullWidth className="card-button" variant="contained" startIcon={<AddShoppingCartRoundedIcon />}
          onClick={handleAddToCart}>
          ADD TO CART
        </Button>
      </CardActions>
    </Card>
  ); 
};
export default ProductCard;

