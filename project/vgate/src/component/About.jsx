import { Box, Typography, Container, Paper, Grid, useTheme, Avatar, Divider } from '@mui/material';
import { School, Security, QrCode, People, Schedule, ContactMail, Phone, AccessTime, VerifiedUser, Dashboard } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const FeatureCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  height: '100%',
  borderRadius: 16,
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8],
    '&:before': {
      opacity: 1
    }
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: 5,
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    opacity: 0.7,
    transition: 'opacity 0.3s ease'
  }
}));

const StatCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  borderRadius: 12,
  background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
  height: '100%',
  border: `1px solid ${theme.palette.divider}`
}));

const About = () => {
  const theme = useTheme();

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Hero Section */}
      <Box sx={{ 
        textAlign: 'center', 
        mb: 10,
        px: { xs: 2, md: 0 },
        position: 'relative'
      }}>
        <Typography 
          variant="h2" 
          component="h1" 
          sx={{ 
            fontWeight: 800,
            mb: 3,
            color: theme.palette.primary.dark,
            fontFamily: '"Poppins", sans-serif',
            fontSize: { xs: '2.25rem', sm: '3rem', md: '3.75rem' },
            lineHeight: 1.2,
            position: 'relative',
            display: 'inline-block',
            '&:after': {
              content: '""',
              position: 'absolute',
              bottom: -8,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '70%',
              height: 4,
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              borderRadius: 2
            }
          }}
        >
          About <Box component="span" sx={{ 
            color: theme.palette.primary.main,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}></Box>
        </Typography>
        <Typography 
          variant="h5" 
          component="p" 
          sx={{ 
            color: theme.palette.text.secondary,
            maxWidth: 800,
            mx: 'auto',
            fontSize: { xs: '1.1rem', md: '1.4rem' },
            lineHeight: 1.6,
            mb: 4
          }}
        >
          Revolutionizing campus access management at Vimala College (Autonomous), Thrissur with cutting-edge digital solutions
        </Typography>
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 4,
          flexWrap: 'wrap',
          mt: 4
        }}>
          {[
            { icon: <VerifiedUser fontSize="large" />, text: "Secure Access" },
            { icon: <AccessTime fontSize="large" />, text: "Real-time Tracking" },
            { icon: <Dashboard fontSize="large" />, text: "Seamless Integration" }
          ].map((item, index) => (
            <Box key={index} sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              px: 3,
              py: 1.5,
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              background: theme.palette.background.paper
            }}>
              <Avatar sx={{ 
                bgcolor: theme.palette.primary.light,
                color: theme.palette.primary.dark,
                width: 40,
                height: 40
              }}>
                {item.icon}
              </Avatar>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {item.text}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

  {/* Introduction Section */}
<Paper 
  elevation={0} 
  sx={{ 
    p: { xs: 4, md: 6 },
    mb: 10,
    borderRadius: 4,
    background: `
      linear-gradient(
        145deg, 
        ${theme.palette.background.paper} 0%, 
        ${theme.palette.grey[50]} 100%
      )`,
    border: `1px solid ${theme.palette.divider}`,
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)',
    '&:before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: 6,
      height: '100%',
      background: `
        linear-gradient(
          to bottom, 
          ${theme.palette.primary.main}, 
          ${theme.palette.secondary.main}
        )`,
      borderRadius: '0 4px 4px 0'
    },
    '&:after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: '40%',
      height: '40%',
      background: `
        radial-gradient(
          circle at 70% 70%, 
          ${theme.palette.primary.light} 0%, 
          transparent 70%
        )`,
      opacity: 0.1,
      zIndex: 0
    }
  }}
>
  <Box position="relative" zIndex={1}>
    <Typography 
      variant="h3" 
      component="h2" 
      sx={{ 
        mb: 4, 
        fontWeight: 800,
        color: theme.palette.primary.dark,
        fontSize: { xs: '2rem', md: '2.5rem' },
        lineHeight: 1.3,
        position: 'relative',
        '&:after': {
          content: '""',
          position: 'absolute',
          bottom: -8,
          left: '35%',
          width: 300,
          height: 4,
          background: `
            linear-gradient(
              to right, 
              ${theme.palette.primary.main}, 
              ${theme.palette.secondary.main}
            )`,
          borderRadius: 2
        }
      }}
    >
      Transforming Campus Access Management
    </Typography>
    
    <Grid container spacing={4}>
      <Grid  xs={12} md={6}>
        <Box 
          sx={{ 
            p: 3,
            borderRadius: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(4px)',
            mb: 3,
          
          }}
        >
          <Typography 
            paragraph 
            sx={{
              mb: 0,
              fontSize: '1.1rem',
              lineHeight: 1.8,
              color: theme.palette.text.primary
            }}
          >
            Our GatePass System is designed to streamline and secure the entry and exit process for students, faculty, and staff on college campuses. The system aims to provide a convenient, efficient, and safe way to manage access to the campus, while also ensuring compliance with institutional policies and regulations.
          </Typography>
        </Box>
      </Grid>
      
      <Grid  xs={12} md={6}>
        <Box
          sx={{
            p: 3,
            borderRadius: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(4px)',
            
          }}
        >
          <Typography 
            
            sx={{
              mb: 0,
              fontSize: '1.1rem',
              lineHeight: 1.8,
              color: theme.palette.text.primary
            }}
          >
            The GatePass System aims to provide a secure, efficient, and convenient way to manage access to the college campus, while also promoting a culture of accountability and responsibility. By leveraging technology and automation, we strive to enhance the overall college experience and support the institution's mission.
          </Typography>
        </Box>
      </Grid>
    </Grid>
  </Box>
</Paper>
  {/* Features Section */}
      <Box sx={{ mb: 12, width: '100%' }}>
        <Typography variant="h3" component="h2" sx={{ 
          mb: 8, 
          fontWeight: 800,
          textAlign: 'center',
          color: theme.palette.primary.dark,
          position: 'relative',
          fontSize: { xs: '2rem', md: '2.5rem' },
          '&:after': {
            content: '""',
            position: 'absolute',
            bottom: -16,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 120,
            height: 5,
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            borderRadius: 3
          }
        }}>
          Advanced System Features
        </Typography>

        <Grid container spacing={4} sx={{ width: '100%', margin: '10 0 10 0',height:'0' }}>
          {[
            {
              icon: <Security sx={{ fontSize: 48 }} />,
              title: "Enhanced Security",
              description: "Comprehensive digital audit trails with real-time verification and multi-factor authentication options."
            },
            {
              icon: <QrCode sx={{ fontSize: 48 }} />,
              title: "Dynamic Digital Passes",
              description: "Unique, time-sensitive QR codes with mobile verification capabilities."
            },
            {
              icon: <People sx={{ fontSize: 48 }} />,
              title: "Granular Access Control",
              description: "Hierarchical permission system with customizable access levels."
            },
            {
              icon: <Schedule sx={{ fontSize: 48 }} />,
              title: "Precise Time Management",
              description: "Automated access windows with configurable duration limits."
            },
            {
              icon: <School sx={{ fontSize: 48 }} />,
              title: "Seamless Integration",
              description: "Bi-directional synchronization with college databases."
            },
            {
              icon: <ContactMail sx={{ fontSize: 48 }} />,
              title: "Visitor Management",
              description: "Streamlined visitor registration with automated notifications."
            }
          ].map((feature, index) => (
            <Grid  xs={12} sm={6} lg={4} key={index} sx={{ width: '100%' }}>
              <FeatureCard elevation={2}>
                <Box sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  mb: 3,
                  '& .MuiSvgIcon-root': {
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    p: 1
                  }
                }}>
                  {feature.icon}
                  <Typography variant="h5" component="h3" sx={{ 
                    fontWeight: 700,
                    ml: 2,
                    color: theme.palette.primary.dark
                  }}>
                    {feature.title}
                  </Typography>
                </Box>
                <Typography sx={{ 
                  color: theme.palette.text.secondary,
                  lineHeight: 1.8,
                  fontSize: '1.05rem',
                  flexGrow: 1
                }}>
                  {feature.description}
                </Typography>
              </FeatureCard>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default About;