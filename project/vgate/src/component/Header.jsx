import { AppBar, Toolbar, Typography, Menu, MenuItem, IconButton, Box, Button, useMediaQuery, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import React from 'react';
import MenuIcon from '@mui/icons-material/Menu';

export const Header = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar 
      position="static" 
      sx={{ 
        backgroundColor: '#ffffff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        py: { xs: 0.2, sm: 0.5 },
        borderBottom: '2px solid #3a4a6b'
      }}
    >
      <Toolbar sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: { xs: '0 8px', sm: '0 16px', md: '0 24px' },
        minHeight: { xs: '48px', sm: '56px' },
        flexWrap: 'wrap'
      }}>
        {/* Logo and Branding Section */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: { xs: '4px', sm: '8px', md: '12px' },
          order: { xs: 1, sm: 1 },
          flex: { xs: 1, sm: 'none' },
          minWidth: 0 // Allows text truncation
        }}>
          {/* Logo would go here */}
          <Box sx={{ minWidth: 0, overflow: 'hidden' }}>
            <Typography 
              component="div"
              sx={{ 
                fontWeight: 700,
                letterSpacing: '0.5px',
                fontFamily: '"Elephant", sans-serif',
                color: '#2c3e50',
                lineHeight: 1,
                whiteSpace: 'nowrap',
                fontSize: { xs: 18, sm: 22, md: 26, lg: 30 },
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              AUTOMATED GATE<br />PASS SYSTEM
            </Typography>
            <Typography 
              variant="caption"
              sx={{
                display: { xs: 'none', sm: 'block' },
                color: '#3a4a6b',
                fontStyle: 'italic',
                fontWeight: 500,
                letterSpacing: '0.3px',
                fontSize: { sm: '0.6rem', md: '0.7rem', lg: '0.8rem' },
                mt: -0.5,
                ml: 0.5
              }}
            >
              "Your Key to Exit"
            </Typography>
          </Box>
        </Box>

        
        {/* Action Buttons and Menu */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: { xs: 0.5, sm: 1, md: 2 },
          order: { xs: 2, sm: 3 },
          flexShrink: 0
        }}>
          {!isSmallScreen ? (
            <>
              <Link to="/r">
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    backgroundColor: '#3a4a6b',
                    color: 'white',
                    borderRadius: '4px',
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' },
                    px: { xs: 1, sm: 1.5, md: 2 },
                    py: { xs: 0.4, sm: 0.6, md: 0.8 },
                    minWidth: 'auto',
                    '&:hover': {
                      backgroundColor: '#2c3e50',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                    },
                    whiteSpace: 'nowrap'
                  }}
                >
                  Register
                </Button>
              </Link>
              <Link to="/tutor/register">
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    backgroundColor: '#3a4a6b',
                    color: 'white',
                    borderRadius: '4px',
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' },
                    px: { xs: 1, sm: 1.5, md: 2 },
                    py: { xs: 0.4, sm: 0.6, md: 0.8 },
                    minWidth: 'auto',
                    '&:hover': {
                      backgroundColor: '#2c3e50',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                    },
                    whiteSpace: 'nowrap'
                  }}
                >
                  {isMediumScreen ? 'Tutor' : 'Tutor Register'}
                </Button>
              </Link>
            </>
          ) : null}

          <IconButton
            size={isSmallScreen ? "small" : "medium"}
            edge="end"
            aria-label="menu"
            aria-controls="basic-menu"
            aria-haspopup="true"
            onClick={handleClick}
            sx={{ 
              color: '#2c3e50',
              padding: { xs: '4px', sm: '6px', md: '8px' },
              '&:hover': {
                backgroundColor: 'rgba(58, 74, 107, 0.1)'
              }
            }}
          >
            <MenuIcon sx={{ fontSize: { xs: '20px', sm: '24px', md: '28px' } }} />
          </IconButton>
          
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              sx: {
                mt: 0.5,
                minWidth: { xs: '140px', sm: '160px', md: '200px' },
                borderRadius: '8px',
                boxShadow: '0 2px 15px rgba(0,0,0,0.15)',
                border: '1px solid rgba(0,0,0,0.05)',
                '&:before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: 'linear-gradient(90deg, #3a4a6b 0%, #2c3e50 100%)'
                }
              }
            }}
          >
            <Typography 
              variant="subtitle2" 
              sx={{
                px: 2,
                py: 1,
                color: '#3a4a6b',
                fontWeight: 600,
                fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' },
                borderBottom: '1px solid rgba(0,0,0,0.05)',
                background: 'rgba(58, 74, 107, 0.05)'
              }}
            >
              ACCESS MENU
            </Typography>
            
            {isSmallScreen && (
              <>
                <Link to="/r">
                  <MenuItem 
                    onClick={handleClose}
                    sx={{
                      fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.9rem' },
                      padding: { xs: '6px 10px 6px 16px', sm: '8px 12px 8px 20px', md: '10px 16px 10px 24px' },
                      color: '#2c3e50',
                      '&:hover': {
                        backgroundColor: 'rgba(58, 74, 107, 0.08)'
                      }
                    }}
                  >
                    Student Register
                  </MenuItem>
                </Link>
                <Link to="/tutor/register">
                  <MenuItem 
                    onClick={handleClose}
                    sx={{
                      fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.9rem' },
                      padding: { xs: '6px 10px 6px 16px', sm: '8px 12px 8px 20px', md: '10px 16px 10px 24px' },
                      color: '#2c3e50',
                      '&:hover': {
                        backgroundColor: 'rgba(58, 74, 107, 0.08)'
                      }
                    }}
                  >
                    Tutor Register
                  </MenuItem>
                </Link>
              </>
            )}
            
            <Link to="/l">
              <MenuItem 
                onClick={handleClose}
                sx={{
                  fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.9rem' },
                  padding: { xs: '6px 10px 6px 16px', sm: '8px 12px 8px 20px', md: '10px 16px 10px 24px' },
                  color: '#2c3e50',
                  '&:hover': {
                    backgroundColor: 'rgba(58, 74, 107, 0.08)'
                  }
                }}
              >
                Student Portal
              </MenuItem>
            </Link>
            <Link to="/l">
              <MenuItem 
                onClick={handleClose}
                sx={{
                  fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.9rem' },
                  padding: { xs: '6px 10px 6px 16px', sm: '8px 12px 8px 20px', md: '10px 16px 10px 24px' },
                  color: '#2c3e50',
                  '&:hover': {
                    backgroundColor: 'rgba(58, 74, 107, 0.08)'
                  }
                }}
              >
                Faculty Access
              </MenuItem>
            </Link>
            <Link to="/admin/login">
              <MenuItem 
                onClick={handleClose}
                sx={{
                  fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.9rem' },
                  padding: { xs: '6px 10px 6px 16px', sm: '8px 12px 8px 20px', md: '10px 16px 10px 24px' },
                  color: '#2c3e50',
                  '&:hover': {
                    backgroundColor: 'rgba(58, 74, 107, 0.08)'
                  }
                }}
              >
                Office Admin 
              </MenuItem>
            </Link>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;