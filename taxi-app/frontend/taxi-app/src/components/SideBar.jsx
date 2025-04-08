import React, { useState } from "react";
import Hamburger from "hamburger-react";
import { Link } from "react-router-dom";

function SideBar({ children, patharray }) {
  const [opened, setOpened] = useState(false);

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className="h-screen bg-red-500 transition-all p-4 flex flex-col"
        style={{ width: opened ? "20vw" : "4vw" }}
      >
        <Hamburger color="#FFFFFF" toggled={opened} toggle={setOpened} />
        <Link to={"/1"}>asd</Link>

        {opened && (
          <div className="flex flex-col mt-4 text-white">
            {patharray.map((category) => (
              <ul key={category.title} className="mb-4">
                <li className="font-bold mb-2">{category.title}</li>
                {category.components.map((item) => (
                  <li
                    key={item.name}
                    className="pl-2 hover:bg-red-600 rounded p-1"
                  >
                    <Link
                      to={item.path}
                      className="flex items-center space-x-2"
                    >
                      <span>{item.logo}</span>
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 transition-all">{children}</div>
    </div>
  );
}

export default SideBar;
