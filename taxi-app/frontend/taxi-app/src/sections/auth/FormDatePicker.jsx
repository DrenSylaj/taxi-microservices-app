import React from 'react';

// material-ui
import {
  InputLabel,
  Stack,

} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';






// Custom FormikDatePicker component
const FormikDatePicker = ({ name, label, ...props }) => {
  const { setFieldValue, values, errors, touched, handleBlur } = props.formik;
  
  return (
    <Stack sx={{ gap: 1 }}>
      <InputLabel htmlFor={name}>{label}</InputLabel>
      <DatePicker
        value={values[name]}
        onChange={(date) => setFieldValue(name, date)}
        slotProps={{
          textField: {
            id: name,
            name: name,
            fullWidth: true,
            onBlur: handleBlur,
            error: Boolean(touched[name] && errors[name]),
            helperText: touched[name] && errors[name]
          }
        }}
      />
    </Stack>
  );
};