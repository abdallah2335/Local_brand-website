import { AppBar, Toolbar, Typography, Button, Badge, IconButton } from '@mui/material';
import { ShoppingCart, Person } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { items } = useCart();

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit'
          }}
        >
          Local Brand
        </Typography>

        {user ? (
          <>
            {user.role === 'admin' && (
              <Button
                color="inherit"
                component={RouterLink}
                to="/admin"
                sx={{ mr: 2 }}
              >
                Admin Dashboard
              </Button>
            )}
            <Button
              color="inherit"
              component={RouterLink}
              to="/orders"
              sx={{ mr: 2 }}
            >
              My Orders
            </Button>
            <IconButton
              color="inherit"
              component={RouterLink}
              to="/cart"
              sx={{ mr: 2 }}
            >
              <Badge badgeContent={items.length} color="secondary">
                <ShoppingCart />
              </Badge>
            </IconButton>
            <IconButton
              color="inherit"
              component={RouterLink}
              to="/profile"
              sx={{ mr: 2 }}
            >
              <Person />
            </IconButton>
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button
              color="inherit"
              component={RouterLink}
              to="/login"
              sx={{ mr: 2 }}
            >
              Login
            </Button>
            <Button
              color="inherit"
              component={RouterLink}
              to="/register"
            >
              Register
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 