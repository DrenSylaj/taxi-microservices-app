import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { PlusCircleOutlined, PlusCircleFilled } from "@ant-design/icons";
import { Box, Typography } from '@mui/material';


const MapView = () => {
  const mapContainer = useRef(null);
  const lon = 21.164659
  const lat = 42.660573
  
  const handleClick = () => {
    console.log("You pressed me: -> uWu <-")
  }

  useEffect(() => {
    const map = new maplibregl.Map({
        container: mapContainer.current,
        center: [lon, lat],
        zoom: 15,
        style: {
          version: 8,
          sources: {
            osm: {
              type: 'raster',
              tiles: ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'],
              tileSize: 256,
              attribution: '&copy; OpenStreetMap contributors',
            },
          },
          layers: [
            {
              id: 'osm',
              type: 'raster',
              source: 'osm',
            },
          ],
        },
      });

    // Optional marker
    // new maplibregl.Marker()
    //   .setLngLat([-0.09, 51.505])
    //   .addTo(map);

    return () => map.remove(); // Clean up on unmount
  }, []);

  return (
    <>
    <div
      ref={mapContainer}
      style={{ width: '100%', height: '100vh' }}
    />
    <Box
          sx={{
            position: "absolute",
            bottom: 105,
            left: "50%",
            transform: "translate(-50%, 0)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
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
              onClick={handleClick}
            >
              <Typography
                sx={{
                  fontSize: "18px",
                  letterSpacing: "0.3px",
                  fontWeight: 500,
                  fontFamily: 'Segoe UI'
                }}
              >
                REQUEST RIDE
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
                }}
            >
              <PlusCircleOutlined
                style={{
                  color: "#1976d2",
                  fontSize: "24px",
                  transition: "transform 0.2s ease",
                  "&:hover": {
                    transform: "scale(1.1)",
                  },
                }}
              />
            </Box>
          </Box>
        </Box>
        
</>
  );
};

export default MapView;
