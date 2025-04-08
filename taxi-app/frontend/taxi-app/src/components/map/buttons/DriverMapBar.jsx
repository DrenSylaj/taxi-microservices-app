import React from "react";
import { PlusCircleFilled, MinusCircleFilled } from "@ant-design/icons";
import { Box, Typography } from "@mui/material";
import { FaLocationDot } from "react-icons/fa6";
import Search from "../../../layout/Dashboard/Header/HeaderContent/Search";
import CustomSearch from "./CustomSearch";
import { useState } from "react";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import SearchOutlined from "@ant-design/icons/SearchOutlined";

const DriverMapBar = ({ handleStatusUpdate, currentRide }) => {
  return (
    <Box
      sx={{
        position: "absolute",
        bottom: 10,
        left: { lg: "85%", sm: "75%", xs: "55%" },
        transform: "translate(-50%, 0)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        zIndex: 1000,
      }}
    >
      {currentRide && (
        <Box
          sx={{
            display: "flex",
          }}
        >
          {currentRide.status === "PICKEDUP" ? (
            <Box
              sx={{
                display: "flex",
                borderRadius: "12px",
                backgroundColor: "white",
                flex: 1,
                marginRight: { xs: "5%", sm: "8%", lg: "10%" },
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                cursor: "pointer",
                transition:
                  "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 12px rgba(0, 0, 0, 0.25)",
                },
              }}
            >
              <Box
                sx={{
                  flex: 1,
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
                  },
                }}
                className="rounded-tl-md rounded-bl-md"
                onClick={() => handleStatusUpdate("COMPLETED")}
              >
                <Typography
                  sx={{
                    fontSize: "12px",
                    letterSpacing: "0.3px",
                    fontWeight: 500,
                    fontFamily: "Segoe UI",
                  }}
                >
                  Completed
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#f0f7ff",
                  padding: 1.5,
                  px: 2,
                  py: 2,
                  borderRadius: "0 12px 12px 0",
                  transition: "background-color 0.2s ease",
                  ":hover": {
                    backgroundColor: "#e3f2fd",
                  },
                }}
              >
                <PlusCircleFilled
                  style={{
                    color: "#0ca661",
                    fontSize: "18px",
                    transition: "transform 0.2s ease",
                    "&:hover": {
                      transform: "scale(1.1)",
                    },
                  }}
                />
              </Box>
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                borderRadius: "12px",
                backgroundColor: "white",
                flex: 1,
                marginRight: { xs: "5%", sm: "8%", lg: "10%" },
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                cursor: "pointer",
                transition:
                  "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 12px rgba(0, 0, 0, 0.25)",
                },
              }}
            >
              <Box
                sx={{
                  flex: 1,
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
                  },
                }}
                className="rounded-tl-md rounded-bl-md"
                onClick={() => handleStatusUpdate("PICKEDUP")}
              >
                <Typography
                  sx={{
                    fontSize: "12px",
                    letterSpacing: "0.3px",
                    fontWeight: 500,
                    fontFamily: "Segoe UI",
                  }}
                >
                  Picked Up
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#f0f7ff",
                  padding: 1.5,
                  px: 2,
                  py: 2,
                  borderRadius: "0 12px 12px 0",
                  transition: "background-color 0.2s ease",
                  ":hover": {
                    backgroundColor: "#e3f2fd",
                  },
                }}
              >
                <PlusCircleFilled
                  style={{
                    color: "#0ca661",
                    fontSize: "18px",
                    transition: "transform 0.2s ease",
                    "&:hover": {
                      transform: "scale(1.1)",
                    },
                  }}
                />
              </Box>
            </Box>
          )}

          <Box
            sx={{
              display: "flex",
              borderRadius: "12px",
              backgroundColor: "white",

              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
              cursor: "pointer",
              transition:
                "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 6px 12px rgba(0, 0, 0, 0.25)",
              },
            }}
          >
            <Box
              sx={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#C80815",
                whiteSpace: "nowrap",
                px: 4,
                py: 2,
                color: "white",
                fontFamily: "Poppins",
                fontWeight: 500,
                ":hover": {
                  backgroundColor: "#dc0917",
                },
              }}
              className="rounded-tl-md rounded-bl-md"
              onClick={() => handleStatusUpdate("CANCELED")}
            >
              <Typography
                sx={{
                  fontSize: "12px",
                  letterSpacing: "0.3px",
                  fontWeight: 500,
                  fontFamily: "Segoe UI",
                }}
              >
                Cancel Ride
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#f0f7ff",
                padding: 1.5,
                px: 2,
                py: 2,
                borderRadius: "0 12px 12px 0",
                transition: "background-color 0.2s ease",
                ":hover": {
                  backgroundColor: "#e3f2fd",
                },
              }}
            >
              <MinusCircleFilled
                style={{
                  color: "#C80815",
                  fontSize: "18px",
                  transition: "transform 0.2s ease",
                  "&:hover": {
                    transform: "scale(1.1)",
                  },
                }}
              />
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default DriverMapBar;
