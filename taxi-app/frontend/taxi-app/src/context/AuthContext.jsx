import { createContext, useContext } from "react";
import axios from "axios";
import Cookies from 'js-cookie'

const AxiosContext = createContext(null);

export const AxiosProvider = ({ children }) => {
  const accessToken = Cookies.get("access_token"); // aksess tokeni
  const baseUrl = "http://localhost:8080/api/"; // URL e Backendit

  const authAxios = axios.create({
    baseURL: baseUrl,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return (
    <AxiosContext.Provider value={authAxios}>{children}</AxiosContext.Provider>
  );
};
// MOS HARRO QE NE CDO instanc te qesaj duhet me perdor 
//const authAxios = useAxios(); si psh qe tani kur te bani requests me ba authAxios.get("/endpoint")

export const useAxios = () => {
  const context = useContext(AxiosContext);
  if (!context) {
    throw new Error("useAxios must be used within an AxiosProvider");
  }
  return context;
};
