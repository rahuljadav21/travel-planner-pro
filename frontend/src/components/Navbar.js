import React from 'react';
import { Link as RouteLink, useNavigate } from 'react-router-dom'
import NavLink from './NavLink';

// redux store
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, selectIsLoggedIn, logout } from './../redux/features/auth'

// API
import axios from 'axios';
import { logoutRoute } from './../utils/APIRoutes'

// components from MUI
import {
  Box,
  Container,
  Button,
  Avatar,
  Tooltip,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Link,
  Divider
} from '@mui/material';

// icons from MUI console.log(user)
import {
  AccountCircleOutlined as ProfileIcon,
  DashboardCustomize as DashboardIcon,
  LogoutRounded as LogoutIcon,
} from '@mui/icons-material';

const pages = [
  { name: 'Home', path: '/' },
  { name: 'Contact', path: '/contact' }
];

const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const username = user?.username ?? "gust";

  const isLoggedIn = useSelector(selectIsLoggedIn);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const handleOpenUserMenu = (event) => {
    if (event.currentTarget instanceof Element) {
      setAnchorElUser(event.currentTarget);
    }
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogoutAndCloseUserMenu = () => {
    // Call both functions
    handleLogout();
    handleCloseUserMenu();
  };

  // logout
  const navigate = useNavigate();
  const handleLogout = async () => {
    // const id = await JSON.parse(
    //   localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    // )._id;

    axios({
      method: "GET",
      url: `${logoutRoute}${user._id}`,
    }).then(response => {
      if (response.status === 200) {
        localStorage.clear();
        dispatch(logout());
        navigate("/login");
      }
    })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <Box sx={{ height: '60px', width: '100%', position: 'fixed', top: 0, zIndex: 1000, backgroundColor: 'white', boxShadow: 1 }}>
      <Container maxWidth="xl" sx={{ display: 'flex', justifyContent: 'space-between', height: '100%' }}>
        <Box sx={{ display: 'flex' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography
              variant="h6"
              noWrap
              component={RouteLink}
              to="/"
              sx={{
                mr: 2,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.1rem',
                color: 'inherit',
                textDecoration: 'none',
                textTransform: 'uppercase'
              }}
            >
              Safar Sujhao
            </Typography>
          </Box>

          <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center' }}>
            {pages.map((page, index) => (
              <NavLink key={page.name} page={page} index={index} />
            ))}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {!isLoggedIn ? (
            <>
              <Link component={RouteLink} to='/login'>
                <Button variant="outlined" sx={{ ml: 1.5, textTransform: 'none' }}>Login</Button>
              </Link>
              <Link component={RouteLink} to='/signup'>
                <Button variant="contained" sx={{ ml: 1.5, textTransform: 'none' }}>Signup</Button>
              </Link>
            </>
          ) : (
            <Box sx={{ flexGrow: 0, ml: 1 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="User Name" src="https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px', p: '10px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem sx={{ minWidth: '220px', py: 1 }}>
                  <Typography textAlign="center" sx={{ ml: 1 }}>
                    {username}
                  </Typography>
                </MenuItem>

                <Divider />

                <MenuItem component={RouteLink} to="/dashboard" onClick={handleCloseUserMenu} sx={{ minWidth: '220px', py: 1 }}>
                  <DashboardIcon />
                  <Typography textAlign="center" sx={{ ml: 1 }}>
                    Dashboard
                  </Typography>
                </MenuItem>

                <MenuItem onClick={handleLogoutAndCloseUserMenu} sx={{ minWidth: '220px', py: 1 }}>
                  <LogoutIcon />
                  <Typography textAlign="center" sx={{ ml: 1 }}>
                    Logout
                  </Typography>
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Box>
      </Container>
    </Box >
  );
};

export default Navbar;
