import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Alert,
  Paper,
  Chip,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

interface Product {
  _id: string;
  name: string;
  price: number;
  color: string;
  size: string;
  quantity: number;
  description: string;
  imageUrl: string;
  category: string;
}

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      setError('Failed to fetch product details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!product) return;

    addToCart({
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: selectedQuantity,
      color: product.color,
      size: product.size,
      imageUrl: product.imageUrl,
    });

    navigate('/cart');
  };

  if (loading) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container>
        <Alert severity="error">{error || 'Product not found'}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <img
              src={product.imageUrl}
              alt={product.name}
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '500px',
                objectFit: 'cover',
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ position: 'relative' }}>
              {product.quantity === 0 && (
                <Chip
                  label="Sold Out"
                  color="error"
                  sx={{ position: 'absolute', top: 0, right: 0 }}
                />
              )}
              <Typography variant="h4" component="h1" gutterBottom>
                {product.name}
              </Typography>
              <Typography variant="h5" color="primary" gutterBottom>
                ${product.price}
              </Typography>
              <Typography variant="body1" paragraph>
                {product.description}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Color: {product.color}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Size: {product.size}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Category: {product.category}
              </Typography>
              {product.quantity > 0 && (
                <Typography variant="body2" color="text.secondary" paragraph>
                  In Stock: {product.quantity}
                </Typography>
              )}

              {product.quantity > 0 ? (
                <Box sx={{ mt: 3 }}>
                  <FormControl sx={{ minWidth: 120, mr: 2 }}>
                    <InputLabel>Quantity</InputLabel>
                    <Select
                      value={selectedQuantity}
                      label="Quantity"
                      onChange={(e) => setSelectedQuantity(Number(e.target.value))}
                    >
                      {[...Array(Math.min(product.quantity, 10))].map((_, i) => (
                        <MenuItem key={i + 1} value={i + 1}>
                          {i + 1}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleAddToCart}
                    sx={{ mt: 1 }}
                  >
                    Add to Cart
                  </Button>
                </Box>
              ) : (
                <Typography variant="h6" color="error" sx={{ mt: 2 }}>
                  This product is currently out of stock
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ProductDetails; 