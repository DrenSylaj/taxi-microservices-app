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

const RideMapBar = ({
  requestRide,
  disabled,
  handleSetDestination,
  setDestinationInput,
  handleStatusUpdate,
  currentRide,
}) => {
  return (
    <Box
      sx={{
        position: "absolute",
        bottom: 10,
        left: "50%",
        transform: "translate(-50%, 0)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        zIndex: 1000,
      }}
    >
      {!currentRide ? (
        <>
          <Box
            sx={{
              width: "100%",
              ml: { xs: 0, md: 1 },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 0.3,
              marginRight: {xs:5, sm:30, lg:60},
              minWidth: "250px",
              maxWidth: { xs: "100%", sm: "500px" }, 
            }}
          >
            <Box>
              <FormControl sx={{ width: { xs: "100%", md: 224 } }}>
                <OutlinedInput
                  size="small"
                  id="header-search"
                  onChange={(e) => setDestinationInput(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start" sx={{ mr: -0.5 }}>
                      <SearchOutlined />
                    </InputAdornment>
                  }
                  aria-describedby="header-search-text"
                  inputProps={{
                    "aria-label": "weight",
                  }}
                  placeholder="Your Destination..."
                  sx={{
                    backgroundColor: "white",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "grey.500",
                      borderWidth: "2px",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "grey.600",
                      borderWidth: "2px",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "grey.700",
                      borderWidth: "2px",
                    },
                    color: "black",
                  }}
                />
              </FormControl>
            </Box>{" "}
            <Box
              sx={{
                backgroundColor: "primary.dark",
                padding: "8px",
                borderRadius: "8px",
                cursor: "pointer",
                transition:
                  "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 12px rgba(0, 0, 0, 0.25)",
                },
                ":hover": {
                  backgroundColor: "#1976d2",
                },
              }}
              onClick={handleSetDestination}
            >
              <FaLocationDot color="white" size={20} />
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              borderRadius: "12px",
              backgroundColor: "white",
              flex: 1, 
              marginRight: {xs: "50%", sm:"75%", lg:"100%"},
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
                backgroundColor: "primary.dark",
                whiteSpace: "nowrap",
                px: 4,
                py: 2,
                color: "white",
                fontFamily: "Poppins",
                fontWeight: 500,
                ":hover": {
                  backgroundColor: "#1976d2",
                },
              }}
              className="rounded-tl-md rounded-bl-md"
              onClick={!disabled ? requestRide : undefined}
            >
              <Typography
                sx={{
                  fontSize: "12px",
                  letterSpacing: "0.3px",
                  fontWeight: 500,
                  fontFamily: "Segoe UI",
                }}
              >
                Request Ride
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
                  color: "#1976d2",
                  fontSize: "18px",
                  transition: "transform 0.2s ease",
                  "&:hover": {
                    transform: "scale(1.1)",
                  },
                }}
              />
            </Box>
          </Box>
        </>
      ) : (
        <Box
          sx={{
            display: "flex",
            borderRadius: "12px",
            backgroundColor: "white",
            marginLeft: "33vw",
            marginRight: "",
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
      )}
    </Box>
  );
};

export default RideMapBar;
