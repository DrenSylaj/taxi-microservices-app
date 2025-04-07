// material-ui

// project imports

// import MonthlyBarChart from 'sections/dashboard/default/MonthlyBarChart';
// import ReportAreaChart from 'sections/dashboard/default/ReportAreaChart';
// import UniqueVisitorCard from 'sections/dashboard/default/UniqueVisitorCard';
// import SaleReportCard from 'sections/dashboard/default/SaleReportCard';
// import OrdersTable from 'sections/dashboard/default/OrdersTable';

// assets


// avatar style
// const avatarSX = {
//   width: 36,
//   height: 36,
//   fontSize: '1rem'
// };

// // action style
// const actionSX = {
//   mt: 0.75,
//   ml: 1,
//   top: 'auto',
//   right: 'auto',
//   alignSelf: 'flex-start',
//   transform: 'none'
// };

import MapView from "../../components/MapView";
import {Box} from '@mui/material'
import ClosestDrivers from "../../components/ClosestDrivers";

// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function DashboardDefault() {
  return (
    <>
    <Box sx={{ height: '100%', width: '100%', borderRadius: '30px',
      backgroundColor: 'white',
      overflow: 'hidden' }}>
      <MapView />
    </Box>
    <ClosestDrivers/>
    </>

  );
}
