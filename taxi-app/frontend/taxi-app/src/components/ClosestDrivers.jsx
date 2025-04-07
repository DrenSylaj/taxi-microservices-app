import React, { useState } from "react";
import {
  MessageOutlined,
  PhoneOutlined,
  DoubleRightOutlined,
  DoubleLeftOutlined,
  CloseOutlined
} from "@ant-design/icons";

export default function ClosestDrivers() {
  const [isVisible, setIsVisible] = useState(true);
  const [isInfoToggled, setInfoToggled] = useState(null);

  const toggleVisibility = () => {
    setIsVisible((prev) => !prev);
  };

  const toggleInfo = (carId) => {
    if (isInfoToggled === carId) {
      setInfoToggled(null);
    } else {
      setInfoToggled(carId);
    }
  };

  const closeModal = () => {
    setInfoToggled(null);  
  };

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
      carPlate: "04 121 DS"
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
      carPlate: "04 121 AQ"
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
      carPlate: "04 121 AA"
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
      carPlate: "04 121 AB"
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
      carPlate: "04 121 BE"
    },
  ];

  return (
    <div className="fixed mx-auto mt-2 right-12 z-50">
      {isVisible ? (
        <div className="w-80 bg-white rounded-xl shadow-lg p-1 transform transition-all duration-300 ease-in-out">
          <div className="flex justify-between items-center bg-gray-50 p-2 border-b rounded-tl-lg rounded-tr-lg">
            <div className="text-sm font-semibold text-gray-700">
              Active Nearby Drivers
            </div>
            <button
              onClick={toggleVisibility}
              className="p-3 flex justify-center items-center hover:bg-slate-200 transition-colors duration-200 border rounded shadow-sm"
            >
              <DoubleRightOutlined className="text-gray-700" />
            </button>
          </div>

          <div className="flex flex-col space-y-4">
            {carEntries.map((entry, index) => (
              <div key={entry.id} className="shadow-sm">
                <div className="flex justify-between items-center mb-2 px-3 py-2">
                  <div className="flex flex-col items-center">
                    <p className="text-sm font-medium">{entry.name}</p>
                    <img src="/images.png" alt="Logo" className="h-5 w-20" />
                  </div>

                  <div
                    className="relative mx-2 bg-slate-100 rounded border border-gray-300 shadow-sm hover:bg-slate-200 transition-colors duration-200 cursor-pointer"
                    onClick={() => toggleInfo(entry.id)}
                  >
                    <div
                      className={`absolute top-2 left-1 ${entry.carColor} h-3 w-3 rounded-full border border-black`}
                    />
                    <img
                      src={entry.image}
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

                {index !== carEntries.length - 1 && (
                  <hr className="border-t border-gray-300" />
                )}
              </div>
            ))}
          </div>
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
              <CloseOutlined className="text-gray-700"/>
            </button>

            <h2 className="text-xl font-semibold mb-4">Car Details</h2>
            <div>
              {carEntries
                .filter((car) => car.id === isInfoToggled)
                .map((car) => (
                  <div key={car.id}>
                    <p>
                      <strong>Car Model:</strong> {car.carModel}
                    </p>
                    <p>
                      <strong>License Plate:</strong> {car.carPlate}
                    </p>
                    <p>
                      <strong>Year:</strong> {car.carYear}
                    </p>
                    <p>
                      <strong>Color:</strong> {car.color}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
