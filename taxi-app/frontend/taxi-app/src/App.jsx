import { useState } from "react";
import "./App.css";
import LoggedIn from "./auth/LoggedIn";
import SignIn from "./auth/SignIn";

import "./App.css";


function App() {
  const [loggedIn, setLoggedIn] = useState(true);
  return <>{loggedIn ? <LoggedIn /> : <SignIn />}</>;
}

export default App;
