import {Button, Card, CardActions, CardContent, CardMedia, Rating, Typography, } from "@mui/material";
import React from "react";
import "./ProductCard.css";
import { makeStyles } from "@material-ui/core/styles";
import AddShoppingCartRoundedIcon from '@mui/icons-material/AddShoppingCartRounded';

const useStyles = makeStyles({
  card: {
    maxWidth: 100,
    boxShadow: "0 5px 8px 0 rgba(0, 0, 0, 0.3)",
    backgroundColor: "#fafafa",
  },
  media: {
    height: 160, 
  }, 
});

const ProductCard = ({ product, handleAddToCart }) => {
  const classes = useStyles();
  return (
    <Card className="card">  
      <CardMedia
        className={classes.media}
        component="img" 
        image={product.image}
        alt="image"
      />
      <CardContent>
        <Typography gutterBottom variant="subtitle1">
          {product.name}
        </Typography>
        <Typography className="card-actions" style={{ fontWeight: "bold" }} variant="subtitle1" gutterBottom>${product.cost}</Typography>
        <Rating value={product.rating} readOnly/>
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

