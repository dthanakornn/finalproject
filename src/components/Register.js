import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const defaultTheme = createTheme();

const isValidEmail = (email) => {
  const validDomains = ["@gmail.com", "@hotmail.com"];
  return validDomains.some(domain => email.endsWith(domain));
};

export default function SignUp() {
  const [passwordError, setPasswordError] = React.useState('');
  const handleSubmit = (event) => {
    event.preventDefault();
    const formElements = event.currentTarget.elements;
    for (let i = 0; i < formElements.length; i++) {
      if (formElements[i].hasAttribute('required') && formElements[i].value.trim() === '') {
        alert('Please fill in all required fields.');
        return;
      }
    }
    const email = formElements.email.value;
    const isValid = isValidEmail(email);
    if (!isValid) {
      alert('Please enter a valid email address ending with @gmail.com or @hotmail.com.');
      return;
    }
    if (passwordError) {
      return;
    }
  
    const data = new FormData(event.currentTarget);
    const jsonData = {
      password: data.get('password'),
      fname: data.get('firstName'),
      address: data.get('address'),
      telephone: data.get('telephone'),
      email: data.get('email'),
      usertype: "user",
      lname: data.get('lastName'),
    };
  
    fetch('http://chaibwoot.no-ip.org:4452/register', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonData),
    })
    .then(response => response.json())
    .then(data =>{
      if(data.status === 'ok'){
        alert('Register Success')
        window.location = '/login'
      }else{
        alert('Register Failed')
      }
      console.log('Success: ', data)
    })
    .catch((error) => {
      console.log('Error', error)
    });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={(e) => {
                    const email = e.target.value;
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(email)) {
                      e.target.setCustomValidity('Please enter a valid email address');
                    } else {
                      e.target.setCustomValidity('');
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="password"
                  label="Password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  onChange={(e) => {
                    const password = e.target.value;
                    setPasswordError(password.length < 4 ? 'Password must be at least 4 characters' : '');
                  }}
                  error={Boolean(passwordError)}
                  helperText={passwordError}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="address"
                  label="Address"
                  name="address"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="telephone"
                  label="Telephone"
                  name="telephone"
                  maxLength="10"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}