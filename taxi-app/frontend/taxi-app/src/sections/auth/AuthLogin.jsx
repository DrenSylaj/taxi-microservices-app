import { Button, Checkbox, FormControlLabel, FormHelperText, Grid, Link, InputAdornment, InputLabel, OutlinedInput, Stack, Typography } from "@mui/material";
import * as Yup from 'yup';
import { Formik } from "formik";
import React from "react";
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import PropTypes from 'prop-types';
import IconButton from '../../components/@extended/IconButton';
import AnimateButton from '../../components/@extended/AnimateButton';

import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import axios from "axios";

export default function AuthLogin({ isDemo = false }) {
  const [checked, setChecked] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const navigate = useNavigate();
  
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          password: Yup.string()
            .required('Password is required')
            .test('no-leading-trailing-whitespace', 'Password cannot start or end with spaces', (value) => value === value?.trim())
            .max(10, 'Password must be less than 10 characters'),
        })}
        onSubmit={async (values, { setSubmitting, setErrors }) => {
          try {
            console.log("Form Submitted with values: ", values);
            
            const response = await axios.post('http://localhost:8111/api/v1/auth/login', 
              {
                email: values.email,
                password: values.password,
              },
              {
                headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
                },
                withCredentials: true 
              }
            );

            console.log('Login successful:', response.data);
            localStorage.setItem('authToken', response.data.token);
            navigate("/dashboard/default"); 

          } catch (error) {
            console.error("Login error:", error);
            if (error.response) {
              const { message } = error.response.data;
              setErrors({ submit: message || "Authentication failed. Please check your credentials." });
            } else {
              setErrors({ submit: "No response from server. Please try again." });
            }
          } finally {
            setSubmitting(false);  
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, touched, values, isSubmitting }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid size={{xs: 12}}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="email-login">Email Address</InputLabel>
                  <OutlinedInput
                    id="email-login"
                    type="email"
                    value={values.email}
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    fullWidth
                    error={Boolean(touched.email && errors.email)}
                  />
                </Stack>
                {touched.email && errors.email && (
                  <FormHelperText error id="standard-weight-helper-text-email-login">
                    {errors.email}
                  </FormHelperText>
                )}
              </Grid>
              <Grid size={{xs: 12}}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="password-login">Password</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.password && errors.password)}
                    id="password-login"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    name="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          color="secondary"
                        >
                          {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                        </IconButton>
                      </InputAdornment>
                    }
                    placeholder="Enter password"
                  />
                </Stack>
                {touched.password && errors.password && (
                  <FormHelperText error id="standard-weight-helper-text-password-login">
                    {errors.password}
                  </FormHelperText>
                )}
              </Grid>

              {errors.submit && (
                <Grid size={{xs: 12}}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}

              <Grid size={{xs: 12}} sx={{ mt: -1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checked}
                        onChange={(event) => setChecked(event.target.checked)}
                        name="checked"
                        color="primary"
                        size="small"
                      />
                    }
                    label={<Typography variant="h6">Keep me sign in</Typography>}
                  />
                  <Link variant="h6" component={RouterLink} to="/forgot-password" color="text.primary">
                    Forgot Password?
                  </Link>
                </Stack>
              </Grid>

              <Grid size={{xs: 12}}>
                <AnimateButton>
                  <Button 
                    fullWidth 
                    size="large" 
                    variant="contained" 
                    color="primary" 
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Logging in...' : 'Login'}
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
}

AuthLogin.propTypes = { isDemo: PropTypes.bool };