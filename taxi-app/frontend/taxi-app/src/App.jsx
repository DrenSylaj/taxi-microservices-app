import { useState } from "react";
import "./App.css";
import axios from "axios";
import LoggedIn from "./auth/LoggedIn";
import SignIn from "./auth/SignIn";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  return <>{loggedIn ? <LoggedIn /> : <SignIn />}</>;
}

export default App;
