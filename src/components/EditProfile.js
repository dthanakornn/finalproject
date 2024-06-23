import React, { useState, useEffect } from "react";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

function EditProfile() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [address, setAddress] = useState("");
    const [telephone, setTelephone] = useState("");
    const [passwordError, setPasswordError] = useState('');
  
    useEffect(() => {
        const token = localStorage.getItem('token')
        const iduser = localStorage.getItem('iduser')
        const usertype = localStorage.getItem('usertype')
        fetch('http://chaibwoot.no-ip.org:4452/authen', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            'Authorization': 'Bearer '+ token
          }
        })
        .then(response => response.json())
        .then(data =>{
          if(data.status === 'ok'){
            localStorage.setItem('token', token)
            localStorage.setItem('id_user', iduser)
            localStorage.setItem('usertype', usertype)
          }else{
            alert('Authen Failed')
            localStorage.removeItem('token');
            window.location ='/login'
          }
          console.log('Success: ', data)
        })
        .catch((error) => {
          console.log('Error', error)
        });
      // Fetch user data from the server
      fetch(`http://chaibwoot.no-ip.org:4452/getprofiles/${iduser}`)
        .then((response) => response.json())
        .then((data) => {
          // Assuming data is an array and the first item is the user data
          const user = data[0];
  
          setFirstName(user.fname);
          setLastName(user.lname);
          setEmail(user.email);
          setPassword(user.password); // Assuming you don't want to display the password in the form
          setAddress(user.address);
          setTelephone(user.telephone);
        })
        .catch((error) => console.error("Error fetching user data:", error));
    }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const iduser = localStorage.getItem('iduser')
    const data = new FormData(event.target);
    
    if (password.length < 4) {
      setPasswordError('Password must be at least 4 characters');
      return;
    }
  
    const updatedData = {
      password: data.get('password'),
      fname: data.get('firstName'),
      address: data.get('address'),
      telephone: data.get('telephone'),
      email: data.get('email'),
      lname: data.get('lastName'),
      id_user: iduser
    };
  
    // Send updated user data to the server
    fetch('http://chaibwoot.no-ip.org:4452/updateprofile', {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'ok') {
          alert('Update Profile Success');
        } else {
          alert('Update Profile Failed');
        }
        console.log('Success:', data);
      })
      .catch((error) => {
        console.log('Error:', error);
      });
  };

  return (
    <ThemeProvider theme={createTheme()}>
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
            <AccountBoxIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Update Profiles
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
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
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
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="password"
                  label="Password"
                  name="password"
                  autoComplete="new-password"
                  type="password"
                  value={password}
                  // You might want to consider whether you want to display the password
                  onChange={(e) => {
                    setPassword(e.target.value);
                    // Check password length and set the error
                    if (e.target.value.length < 4) {
                      setPasswordError('Password must be at least 4 characters');
                    } else {
                      setPasswordError('');
                    }
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
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
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
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Update Profile
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default EditProfile;
