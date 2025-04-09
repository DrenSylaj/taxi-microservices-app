import React, { use, useEffect, useState } from "react";
import {
  MessageOutlined,
  PhoneOutlined,
  DoubleRightOutlined,
  DoubleLeftOutlined,
  CloseOutlined,
} from "@ant-design/icons";

import Avatar from "@mui/material/Avatar";
import Rating from "@mui/material/Rating";
import { Typography, Box } from "@mui/material";

export default function SelectedDriver({
  driverId,
  handleAcceptRide,
  selectedRideOffer,
  setSelectedRideOffer,
  visible
}) {
  const [isVisible, setIsVisible] = useState(true);
  const [isInfoToggled, setInfoToggled] = useState(null);
  const [driverData, setDriverData] = useState(null);

  const toggleVisibility = () => {
    setIsVisible((prev) => !prev);
  };

  const toggleInfo = () => {
    if (selectedRideOffer) {
      setInfoToggled((prev) => !prev);
    } 
  };

  const closeModal = () => {
    setInfoToggled(null);
  };

  const getDriverInfo = () => {
    if (driverId) {
      fetch(`http://localhost:8111/api/users/driverInfo/${driverId}`)
        .then((res) => res.json())
        .then((data) => {
          setDriverData(data);
        })
        .catch((err) => {
          if (err.response) {
            console.error("Response error:", err.response);
          }
        });
    }
  };

  useEffect(() => {
    getDriverInfo(driverId);
    setIsVisible(true);
  }, [driverId]);


  const carEntries = [
    {
      id: 1,
      name: "Dren Sylaj",
      carColor: "bg-red-600",
      message: "Message",
      image: "/ferrari-sideview-icon-png.png",
      color: "red",
      carModel: "Ferrari",
      carYear: "2004",
      carPlate: "04 121 DS",
    },
    {
      id: 2,
      name: "Albion Qerreti",
      carColor: "bg-red-600",
      message: "Message",
      image: "/ferrari-sideview-icon-png.png",
      color: "red",
      carModel: "Ferrari",
      carYear: "2004",
      carPlate: "04 121 AQ",
    },
    {
      id: 3,
      name: "Altin Asllanaj",
      carColor: "bg-red-600",
      message: "Message",
      image: "/ferrari-sideview-icon-png.png",
      color: "red",
      carModel: "Ferrari",
      carYear: "2004",
      carPlate: "04 121 AA",
    },
    {
      id: 4,
      name: "Abubu Beqiri",
      carColor: "bg-red-600",
      message: "Message",
      image: "/ferrari-sideview-icon-png.png",
      color: "red",
      carModel: "Ferrari",
      carYear: "2004",
      carPlate: "04 121 AB",
    },
    {
      id: 5,
      name: "Blend Elezi",
      carColor: "bg-red-600",
      message: "Message",
      image: "/ferrari-sideview-icon-png.png",
      color: "red",
      carModel: "Ferrari",
      carYear: "2004",
      carPlate: "04 121 BE",
    },
  ];

  return (
    <div className="absolute mx-auto mt-2 right-12 z-50 top-5">
      {isVisible ? (
        <div className="w-80 bg-white rounded-xl shadow-lg p-1 transform transition-all duration-300 ease-in-out">
          <div className="flex justify-between items-center bg-gray-50 p-2 border-b rounded-tl-lg rounded-tr-lg">
            <div className="text-sm font-semibold text-gray-700">
              Selected Driver
            </div>
            <button
              onClick={toggleVisibility}
              className="p-3 flex justify-center items-center hover:bg-slate-200 transition-colors duration-200 border rounded shadow-sm"
            >
              <DoubleRightOutlined className="text-gray-700" />
            </button>
          </div>
          {driverData && (
            <div className="flex flex-col space-y-4">
              <div key={driverData.driverId} className="shadow-sm">
                <div className="flex flex-row items-center  justify-between m-3 ">
                  <div className="flex flex-row items-center  gap-2 ">
                    <Avatar>
                      {driverData.firstName?.charAt(0).toUpperCase()}
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">
                        {driverData.firstName} {driverData.lastName}
                      </p>

                      <p className="t text-xs">{driverData.email}</p>
                    </div>
                  </div>

                  <Rating name="read-only" value={3} readOnly size="small" />
                </div>
                <div className="flex justify-between items-center mb-2 px-3 py-2">
                  <img src="/images.png" alt="Logo" className="h-5 w-20" />

                  <div
                    className="relative mx-2 bg-slate-100 rounded border border-gray-300 shadow-sm hover:bg-slate-200 transition-colors duration-200 cursor-pointer"
                    onClick={() => toggleInfo(driverData.id)}
                  >
                    <div
                      className={`absolute top-2 left-1 h-3 w-3 rounded-full border border-black bg-${driverData.color.toLowerCase()}`}
                    />
                    <img
                      src="/ferrari-sideview-icon-png.png"
                      alt="Car"
                      className="h-12 w-24 object-contain"
                    />
                  </div>

                  <div className="flex justify-between items-center border rounded shadow-sm">
                    <button className="flex-1 p-3 flex justify-center items-center hover:bg-slate-200 transition-colors duration-200 border-r">
                      <MessageOutlined className="text-gray-700" />
                    </button>
                    <button className="flex-1 p-3 flex justify-center items-center hover:bg-slate-200 transition-colors duration-200">
                      <PhoneOutlined className="text-gray-700" />
                    </button>
                  </div>
                </div>
                {/* {console.log(driverData)} */}
                <div className="flex flex-column justify-center pb-1">
                  <Box
                    sx={{
                      flex: 1,
                      maxWidth: "100px",
                      maxHeight: "10px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "#0c9c5b",
                      whiteSpace: "nowrap",
                      px: 4,
                      py: 2,
                      color: "white",
                      fontFamily: "Poppins",
                      fontWeight: 500,
                      ":hover": {
                        backgroundColor: "#0ca661",
                        cursor: "pointer",
                      },
                    }}
                    className="rounded rounded-bl-md"
                    onClick={() => {
                      if (selectedRideOffer) {
                        handleAcceptRide(
                          selectedRideOffer.driverId,
                          location.latitude,
                          location.longitude,
                          selectedRideOffer.destLatitude,
                          selectedRideOffer.destLongitude,
                          "PICKINGUP"
                        );
                        setSelectedRideOffer(null);
                      } else {
                        console.warn("No ride offer selected");
                      }
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "12px",
                        letterSpacing: "0.3px",
                        fontWeight: 500,
                        fontFamily: "Segoe UI",
                      }}
                    >
                      Accept Ride
                    </Typography>
                  </Box>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={toggleVisibility}
          className="mt-2 right-12 p-3 flex justify-center items-center bg-slate-50 hover:bg-slate-200 transition-colors duration-200 border rounded shadow-sm"
        >
          <DoubleLeftOutlined className="text-gray-700" />
        </button>
      )}

      {isInfoToggled && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 flex justify-center items-center text-gray-500 border rounded shadow-sm p-2 hover:bg-slate-200 transition-colors duration-300"
            >
              <CloseOutlined className="text-gray-700" />
            </button>

            <h2 className="text-xl font-semibold mb-4">Car Details</h2>
            <div>
              <div>
                <p>
                  <strong>Car Model:</strong> {driverData.model}
                </p>
                <p>
                  <strong>License Plate:</strong> {driverData.plateNumber}
                </p>
                <p>
                  <strong>Year:</strong> {driverData.year}
                </p>
                <p>
                  <strong>Color:</strong> {driverData.color}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
