import React, { useEffect, useState } from "react";
import {
  Link as RouterLink,
  useSearchParams,
  useNavigate,
} from "react-router-dom";

// material-ui
import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  Link,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
  Box,
  MenuItem,
  Select,
} from "@mui/material";

// third-party
import * as Yup from "yup";
import { Formik, useField } from "formik";

// project imports
import IconButton from "../../components/@extended/IconButton";
import AnimateButton from "../../components/@extended/AnimateButton";

import {
  strengthColor,
  strengthIndicator,
} from "../../utils/password-strength";

// assets
import EyeOutlined from "@ant-design/icons/EyeOutlined";
import EyeInvisibleOutlined from "@ant-design/icons/EyeInvisibleOutlined";
import axios from "axios";

// ============================|| JWT - REGISTER ||============================ //

const FormikSelectField = ({ name, label, options }) => {
  const [field, meta] = useField(name);

  return (
    <FormControl fullWidth error={meta.touched && Boolean(meta.error)}>
      <Stack sx={{ gap: 1 }}>
        <InputLabel htmlFor={name}>{label}</InputLabel>
        <Select
          {...field}
          id={name}
          displayEmpty
          inputProps={{ id: name }}
          onChange={(e) =>
            field.onChange({
              target: {
                name,
                value: e.target.value === "true",
              },
            })
          }
        >
          <MenuItem value="">
            <em>Select {label}</em>
          </MenuItem>
          {options.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
        {meta.touched && meta.error && (
          <FormHelperText>{meta.error}</FormHelperText>
        )}
      </Stack>
    </FormControl>
  );
};

export default function AuthRegister() {
  const [level, setLevel] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [isNext, setNext] = useState(false);
  const [searchParams] = useSearchParams();
  const auth = searchParams.get("auth");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    city: "",
    address: "",
    birthDate: "",
    phoneNumber: "",
    gender: null,
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleNext = (values) => {
    setFormData((prev) => ({ ...prev, ...values }));
    setNext(true);
  };

  const handlePrevious = () => {
    setNext(false);
  };

  const changePassword = (value) => {
    const temp = strengthIndicator(value);
    setLevel(strengthColor(temp));
  };

  const handleSubmit = async (stepTwoValues) => {
    const combinedData = { ...formData, ...stepTwoValues };
    console.log(combinedData);

    try {
      const response = await axios.post(
        "http://localhost:8111/api/v1/auth/register",
        combinedData
      );
      console.log("Response", response);
      console.log(response.data.token);
      navigate("/login");
    } catch (error) {
      console.error("Error submitting form:", error);

      if (error.response) {
        console.error("Error data:", error.response.data);
        console.error("Error status:", error.response.status);
      } else if (error.request) {
        console.error("No response received:", error.request);
      }
    }
  };

  useEffect(() => {
    changePassword("");
  }, []);

  const stepOneSchema = Yup.object().shape({
    firstName: Yup.string().max(255).required("First Name is required"),
    lastName: Yup.string().max(255).required("Last Name is required"),
    email: Yup.string()
      .email("Must be a valid email")
      .max(255)
      .required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .test(
        "no-leading-trailing-whitespace",
        "Password cannot start or end with spaces",
        (value) => value === value?.trim()
      )
      .max(15, "Password must be less than 15 characters"),
  });

  const stepTwoSchema = Yup.object().shape({
    city: Yup.string().required("City is required"),
    address: Yup.string().required("Address is required"),
    birthDate: Yup.string().required("Birthdate is required"),
    phoneNumber: Yup.string()
      .required("Phone number is required")
      .matches(
        /^\+383\s?0?4/,
        'Phone number must start with "+383 04" or similar'
      ),
    gender: Yup.boolean().required("Gender is required"),
  });

  return (
    <>
      {!isNext ? (
        <Formik
          enableReinitialize
          initialValues={{
            firstName: formData.firstName || "",
            lastName: formData.lastName || "",
            email: formData.email || "",
            password: formData.password || "",
          }}
          validationSchema={stepOneSchema}
          onSubmit={handleNext}
        >
          {({
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            touched,
            values,
          }) => (
            <form noValidate onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Stack sx={{ gap: 1 }}>
                    <InputLabel htmlFor="firstname-signup">
                      First Name*
                    </InputLabel>
                    <OutlinedInput
                      id="firstname-signup"
                      name="firstName"
                      value={values.firstName}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="John"
                      fullWidth
                      error={Boolean(touched.firstName && errors.firstName)}
                    />
                  </Stack>
                  {touched.firstName && errors.firstName && (
                    <FormHelperText error id="helper-text-firstname-signup">
                      {errors.firstName}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Stack sx={{ gap: 1 }}>
                    <InputLabel htmlFor="lastname-signup">
                      Last Name*
                    </InputLabel>
                    <OutlinedInput
                      fullWidth
                      error={Boolean(touched.lastName && errors.lastName)}
                      id="lastname-signup"
                      name="lastName"
                      value={values.lastName}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Doe"
                    />
                  </Stack>
                  {touched.lastName && errors.lastName && (
                    <FormHelperText error id="helper-text-lastname-signup">
                      {errors.lastName}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Stack sx={{ gap: 1 }}>
                    <InputLabel htmlFor="email-signup">
                      Email Address*
                    </InputLabel>
                    <OutlinedInput
                      fullWidth
                      error={Boolean(touched.email && errors.email)}
                      id="email-signup"
                      type="email"
                      name="email"
                      value={values.email}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="demo@company.com"
                    />
                  </Stack>
                  {touched.email && errors.email && (
                    <FormHelperText error id="helper-text-email-signup">
                      {errors.email}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Stack sx={{ gap: 1 }}>
                    <InputLabel htmlFor="password-signup">Password</InputLabel>
                    <OutlinedInput
                      fullWidth
                      error={Boolean(touched.password && errors.password)}
                      id="password-signup"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={values.password}
                      onBlur={handleBlur}
                      onChange={(e) => {
                        handleChange(e);
                        changePassword(e.target.value);
                      }}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            color="secondary"
                          >
                            {showPassword ? (
                              <EyeOutlined />
                            ) : (
                              <EyeInvisibleOutlined />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                      placeholder="******"
                    />
                  </Stack>
                  {touched.password && errors.password && (
                    <FormHelperText error id="helper-text-password-signup">
                      {errors.password}
                    </FormHelperText>
                  )}
                  <FormControl fullWidth sx={{ mt: 2 }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item>
                        <Box
                          sx={{
                            bgcolor: level?.color,
                            width: 85,
                            height: 8,
                            borderRadius: "7px",
                          }}
                        />
                      </Grid>
                      <Grid item>
                        <Typography variant="subtitle1" fontSize="0.75rem">
                          {level?.label}
                        </Typography>
                      </Grid>
                    </Grid>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2">
                    By Signing up, you agree to our &nbsp;
                    <Link variant="subtitle2" component={RouterLink} to="#">
                      Terms of Service
                    </Link>
                    &nbsp; and &nbsp;
                    <Link variant="subtitle2" component={RouterLink} to="#">
                      Privacy Policy
                    </Link>
                  </Typography>
                </Grid>
                {errors.submit && (
                  <Grid item xs={12}>
                    <FormHelperText error>{errors.submit}</FormHelperText>
                  </Grid>
                )}
                <Grid size={{ xs: 12 }}>
                  <AnimateButton>
                    <Button
                      fullWidth
                      size="large"
                      variant="contained"
                      color="primary"
                      type="submit"
                    >
                      Next
                    </Button>
                  </AnimateButton>
                </Grid>
              </Grid>
            </form>
          )}
        </Formik>
      ) : (
        <Formik
          enableReinitialize
          initialValues={{
            city: formData.city || "",
            address: formData.address || "",
            birthDate: formData.birthDate || "",
            phoneNumber: formData.phoneNumber || "",
            gender: formData.gender || "",
          }}
          validationSchema={stepTwoSchema}
          onSubmit={handleSubmit}
        >
          {({
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            touched,
            values,
          }) => (
            <form noValidate onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Stack sx={{ gap: 1 }}>
                    <InputLabel htmlFor="city">City*</InputLabel>
                    <OutlinedInput
                      id="city"
                      name="city"
                      value={values.city}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Prishtina"
                      fullWidth
                      error={Boolean(touched.city && errors.city)}
                    />
                  </Stack>
                  {touched.city && errors.city && (
                    <FormHelperText error id="helper-text-city">
                      {errors.city}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Stack sx={{ gap: 1 }}>
                    <InputLabel htmlFor="address">Address*</InputLabel>
                    <OutlinedInput
                      fullWidth
                      error={Boolean(touched.address && errors.address)}
                      id="address"
                      name="address"
                      value={values.address}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Dardania"
                    />
                  </Stack>
                  {touched.address && errors.address && (
                    <FormHelperText error id="helper-text-address">
                      {errors.address}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Stack sx={{ gap: 1 }}>
                    <InputLabel htmlFor="email">Phone Number*</InputLabel>
                    <OutlinedInput
                      fullWidth
                      error={Boolean(touched.phoneNumber && errors.phoneNumber)}
                      id="phoneNumber"
                      type="text"
                      name="phoneNumber"
                      value={values.phoneNumber}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="+383 04xxxxxxx"
                    />
                  </Stack>
                  {touched.phoneNumber && errors.phoneNumber && (
                    <FormHelperText error id="helper-text-phone-number">
                      {errors.phoneNumber}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Stack sx={{ gap: 1 }}>
                    <InputLabel htmlFor="birthdate">Birthdate*</InputLabel>
                    <OutlinedInput
                      fullWidth
                      error={Boolean(touched.birthDate && errors.birthDate)}
                      id="birthDate"
                      name="birthDate"
                      value={values.birthDate}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="DD-MM-YYYY"
                      inputProps={{
                        type: "date",
                      }}
                    />
                  </Stack>
                  {touched.birthDate && errors.birthDate && (
                    <FormHelperText error id="helper-text-birthdate">
                      {errors.birthDate}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Stack gap={1}>
                    <InputLabel htmlFor="gender">Gender*</InputLabel>

                    <FormikSelectField
                      name="gender"
                      options={[
                        { value: false, label: "Male" },
                        { value: true, label: "Female" },
                      ]}
                    />
                    {touched.gender && errors.gender && (
                      <FormHelperText error id="helper-text-gender">
                        {errors.gender}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2">
                    By Signing up, you agree to our &nbsp;
                    <Link variant="subtitle2" component={RouterLink} to="#">
                      Terms of Service
                    </Link>
                    &nbsp; and &nbsp;
                    <Link variant="subtitle2" component={RouterLink} to="#">
                      Privacy Policy
                    </Link>
                  </Typography>
                </Grid>
                {errors.submit && (
                  <Grid item xs={12}>
                    <FormHelperText error>{errors.submit}</FormHelperText>
                  </Grid>
                )}
                <Grid size={{ xs: 12, md: 6 }}>
                  <AnimateButton>
                    <Button
                      fullWidth
                      size="large"
                      variant="contained"
                      color="primary"
                      type="submit"
                    >
                      Submit
                    </Button>
                  </AnimateButton>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Button
                    fullWidth
                    size="large"
                    variant="outlined"
                    color="primary"
                    onClick={handlePrevious}
                  >
                    Back
                  </Button>
                </Grid>
              </Grid>
            </form>
          )}
        </Formik>
      )}
    </>
  );
}
