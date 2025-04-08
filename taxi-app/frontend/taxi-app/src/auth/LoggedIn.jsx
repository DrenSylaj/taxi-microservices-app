import React from "react";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  useParams,
} from "react-router-dom";

import SideBar from "../components/SideBar";
import pathArray from "../Routes/Path.jsx";

function LoggedIn() {
  return (
    <>
      <SideBar patharray={pathArray}>
        <Routes>
          {pathArray.flatMap((category) =>
            category.components.map((item) => (
              <Route
                key={item.path}
                path={item.path}
                element={item.components}
              />
            ))
          )}
        </Routes>
      </SideBar>
    </>
  );
}

export default LoggedIn;
