import { useState } from "react";
import "./App.css";
import LoggedIn from "./auth/LoggedIn";
import SignIn from "./auth/SignIn";

import router from './routes';
import ThemeCustomization from './themes';
import { RouterProvider } from "react-router-dom";

import ScrollTop from './components/ScrollTop';

import "./App.css";
import { isAuthenticated } from "./jsMethods";

export default function App() {
  // // qetu ko me kan metoda e isAuthenticated
  // const [loggedIn, setLoggedIn] = useState(true);
  // return <>{loggedIn ? <LoggedIn /> : <SignIn />}</>;
  return (
    <ThemeCustomization>
      <ScrollTop>
        <RouterProvider router={router} />
      </ScrollTop>
    </ThemeCustomization>
  );
}
