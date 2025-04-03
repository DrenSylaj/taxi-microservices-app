import React, { useState } from "react";
import bg from '../assets/images/SignInPage/background.png'

function SignIn() {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(loginData);
  };
  return (
    <div className="relative h-dvh w-full " >
        <div className="absolute w-full h-full -z-10 blur-md">
            <img src={bg} className="w-full h-full object-cover " alt="" />
        </div>
      <div className="container h-full flex flex-col">
        <div className="header h-[10%] flex items-center">
          <p className="roboto">PLACEHOLDER LOGO</p>
        </div>
        <div className="h-[80%] flex justify-center items-center ">
          <div className="p-10 flex flex-col justify-between w-[40%] max-lg:w-[80%] gap-[30px] bg-[#191919] shadow-md rounded-md">
            <div className="w-full flex justify-between">
              <p className="font-bold text-[20px] text-white">Login</p>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-[30px]">
              <div className="flex flex-col gap-[15px]">
                <label htmlFor="email" className="text-[#717171]">
                  Email Address
                </label>
                <input
                  className="p-2 outline-none rounded-md bg-[#080808] text-white"
                  type="email"
                  id="email"
                  name="email"
                  value={loginData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="flex flex-col gap-[15px]">
                <label htmlFor="password" className="text-[#717171]">
                  Password
                </label>
                <input
                  className="p-2 outline-none rounded-md bg-[#080808] text-white"
                  type="password"
                  id="password"
                  name="password"
                  value={loginData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-[#080808] p-3 rounded-xl text-white font-semibold"
              >
                Login
              </button>
            </form>
          </div>
        </div>
        <div className="footer h-[10%]  flex justify-between items-center">
          <p className="text-[12px] text-[#717171]">
            © Made with love by AlbiJava and his Team
          </p>
          <div className="flex gap-[20px]">
            <a href="#" class="group text-[12px] text-[#717171] transition duration-75">
              Terms and condition
              <span class="block max-w-0 group-hover:max-w-full transition-all duration-500 h-[1px] bg-[#717171]"></span>
            </a>
            <a href="#" class="group text-[12px] text-[#717171] transition duration-75">
              IDK
              <span class="block max-w-0 group-hover:max-w-full transition-all duration-500 h-[1px] bg-[#717171]"></span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
