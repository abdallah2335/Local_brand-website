import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  CircularProgress,
  Alert,
  InputAdornment,
  Button,
  Paper,
  IconButton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, FilterList as FilterIcon } from '@mui/icons-material';
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

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    color: '',
    size: '',
    minPrice: '',
    maxPrice: '',
    search: '',
  });
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    fetchProducts();
  }, [filters, sortBy, sortOrder]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const queryParams = new URLSearchParams();
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.color) queryParams.append('color', filters.color);
      if (filters.size) queryParams.append('size', filters.size);
      if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
      if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
      if (filters.search) queryParams.append('search', filters.search);
      if (sortBy) {
        queryParams.append('sortBy', sortBy);
        queryParams.append('sortOrder', sortOrder);
      }

      const url = `http://localhost:5000/api/products?${queryParams}`;
      console.log('Fetching products from:', url);
      
      const response = await axios.get(url);
      console.log('Products received:', response.data?.length || 0);
      
      setProducts(response.data || []);
      if (response.data && response.data.length === 0) {
        // Only show error if filters are applied, otherwise it's just empty
        const hasFilters = filters.category || filters.color || filters.size || filters.minPrice || filters.maxPrice || filters.search;
        if (hasFilters) {
          setError('No products found matching your filters. Try adjusting your search criteria.');
        } else {
          setError('');
        }
      } else {
        setError('');
      }
    } catch (error: any) {
      console.error('Error fetching products:', error);
      if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
        setError('Cannot connect to server. Please make sure the server is running on port 5000.');
      } else {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch products';
        const errorDetails = error.response?.data?.error || '';
        setError(`${errorMessage}${errorDetails ? `: ${errorDetails}` : ''}. Please make sure the server is running and MongoDB is connected.`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  const categories = [
    { name: 'Shirts', value: 'shirts', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400' },
    { name: 'Pants', value: 'pants', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400' },
    { name: 'Shoes', value: 'shoes', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400' },
    { name: 'Accessories', value: 'accessories', image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400' },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          mb: 6,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h2"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  mb: 2,
                }}
              >
                Fashion That Speaks
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  mb: 4,
                  opacity: 0.9,
                  fontSize: { xs: '1.2rem', md: '1.5rem' },
                }}
              >
                Discover the latest trends in clothing and accessories
              </Typography>
              <Button
                variant="contained"
                size="large"
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.9)',
                  },
                }}
                onClick={() => {
                  window.scrollTo({ top: document.getElementById('products')?.offsetTop || 0, behavior: 'smooth' });
                }}
              >
                Shop Now
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                }}
              >
                {categories.slice(0, 4).map((cat) => (
                  <Box
                    key={cat.value}
                    sx={{
                      width: { xs: 120, md: 150 },
                      height: { xs: 120, md: 150 },
                      borderRadius: 2,
                      overflow: 'hidden',
                      boxShadow: 3,
                      opacity: 0.9,
                    }}
                  >
                    <img
                      src={cat.image}
                      alt={cat.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" id="products">
        {/* Featured Categories */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            Shop by Category
          </Typography>
          <Grid container spacing={3}>
            {categories.map((category) => (
              <Grid item xs={6} sm={3} key={category.value}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    height: 200,
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      transition: 'transform 0.3s ease-in-out',
                      '& .category-overlay': {
                        opacity: 1,
                      },
                    },
                  }}
                  onClick={() => handleFilterChange('category', category.value)}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={category.image}
                    alt={category.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <Box
                    className="category-overlay"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      bgcolor: 'rgba(0,0,0,0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0,
                      transition: 'opacity 0.3s ease-in-out',
                    }}
                  >
                    <Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>
                      {category.name}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      bgcolor: 'rgba(0,0,0,0.7)',
                      p: 1.5,
                    }}
                  >
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, textAlign: 'center' }}>
                      {category.name}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Search and Filters */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
              <FilterIcon /> Filter Products
            </Typography>
          </Box>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Search Products"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={filters.category}
                  label="Category"
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="shirts">Shirts</MenuItem>
                  <MenuItem value="pants">Pants</MenuItem>
                  <MenuItem value="shoes">Shoes</MenuItem>
                  <MenuItem value="accessories">Accessories</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Color</InputLabel>
                <Select
                  value={filters.color}
                  label="Color"
                  onChange={(e) => handleFilterChange('color', e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="black">Black</MenuItem>
                  <MenuItem value="white">White</MenuItem>
                  <MenuItem value="blue">Blue</MenuItem>
                  <MenuItem value="red">Red</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Size</InputLabel>
                <Select
                  value={filters.size}
                  label="Size"
                  onChange={(e) => handleFilterChange('size', e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="S">Small</MenuItem>
                  <MenuItem value="M">Medium</MenuItem>
                  <MenuItem value="L">Large</MenuItem>
                  <MenuItem value="XL">Extra Large</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Min"
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    size="small"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Max"
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    size="small"
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>

        {/* Products Grid */}
        {products.length === 0 && !loading && error && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Alert severity="info" sx={{ mb: 2, maxWidth: 600, mx: 'auto' }}>
              {error}
            </Alert>
            <Button
              variant="contained"
              onClick={() => {
                setFilters({
                  category: '',
                  color: '',
                  size: '',
                  minPrice: '',
                  maxPrice: '',
                  search: '',
                });
                setSortBy('');
                setSortOrder('asc');
              }}
            >
              Clear All Filters
            </Button>
          </Box>
        )}

        {products.length === 0 && !loading && !error && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h5" color="text.secondary" gutterBottom>
              No products available
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Products will appear here once they are added to the database.
            </Typography>
          </Box>
        )}

        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          All Products
        </Typography>

        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item key={product._id} xs={12} sm={6} md={4} lg={3}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  borderRadius: 2,
                  overflow: 'hidden',
                  boxShadow: 2,
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6,
                    '& .product-image': {
                      transform: 'scale(1.1)',
                    },
                    '& .product-overlay': {
                      opacity: 1,
                    },
                  },
                }}
                onClick={() => navigate(`/products/${product._id}`)}
              >
                <Box
                  sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    height: 300,
                    bgcolor: '#f5f5f5',
                  }}
                >
                  <CardMedia
                    className="product-image"
                    component="img"
                    height="300"
                    image={product.imageUrl}
                    alt={product.name}
                    sx={{
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease-in-out',
                    }}
                  />
                  <Box
                    className="product-overlay"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      bgcolor: 'rgba(0,0,0,0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0,
                      transition: 'opacity 0.3s ease-in-out',
                    }}
                  >
                    <Button
                      variant="contained"
                      sx={{
                        bgcolor: 'white',
                        color: 'primary.main',
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,0.9)',
                        },
                      }}
                    >
                      View Details
                    </Button>
                  </Box>
                  {product.quantity === 0 && (
                    <Chip
                      label="Sold Out"
                      color="error"
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        fontWeight: 600,
                      }}
                    />
                  )}
                </Box>
                <CardContent sx={{ flexGrow: 1, p: 2 }}>
                  <Typography
                    gutterBottom
                    variant="h6"
                    component="h3"
                    sx={{
                      fontWeight: 600,
                      mb: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {product.name}
                  </Typography>
                  <Typography
                    variant="h5"
                    color="primary"
                    sx={{ fontWeight: 700, mb: 1.5 }}
                  >
                    ${product.price.toFixed(2)}
                  </Typography>
                  <Box display="flex" gap={1} flexWrap="wrap">
                    <Chip
                      label={product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ fontWeight: 500 }}
                    />
                    <Chip
                      label={product.color.charAt(0).toUpperCase() + product.color.slice(1)}
                      size="small"
                      sx={{
                        bgcolor: product.color === 'black' ? '#000' : product.color === 'white' ? '#fff' : product.color,
                        color: product.color === 'white' ? '#000' : '#fff',
                        fontWeight: 500,
                      }}
                    />
                    <Chip
                      label={`Size: ${product.size}`}
                      size="small"
                      variant="outlined"
                      sx={{ fontWeight: 500 }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home; 