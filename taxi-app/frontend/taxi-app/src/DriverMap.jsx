import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import useWebSocket from "./useWebSocket";

export default function DriverMap({ userId }) {
  const { updates, client } = useWebSocket(userId);
  const [location, setLocation] = useState(null);
  const [map, setMap] = useState(null);
  const [rideRequests, setRideRequests] = useState([]);
  const [rideOffer, setRideOffer] = useState(null);
  const [currentRide, setCurrentRide] = useState(null);
  const watchId = useRef(null);

  const [userMarker, setUserMarker] = useState(null);

  const handleRideOffer = (
    rideUserId,
    latitude,
    longitude,
    destLatitude,
    destLongitude
  ) => {
    if (!client) return;

    client.publish({
      destination: "/app/offerRide",
      body: JSON.stringify({
        userId: rideUserId,
        driverId: userId,
        latitude,
        longitude,
        destLatitude,
        destLongitude,
      }),
    });

    console.log("Ride offer sent:", { userId, latitude, longitude });
  };

  let routeLayerId = "route-line";

  const drawRoute = async (from, to) => {
    console.log(`from.latitude:`, from.latitude);
    console.log(`from.longitude:`, from.longitude);
    console.log(`to.latitude:`, to.latitude);
    console.log(`to.longitude:`, to.longitude);

    const url = `https://router.project-osrm.org/route/v1/driving/${from.latitude},${from.longitude};${to.latitude},${to.longitude}?overview=full&geometries=geojson`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (!data.routes || data.routes.length === 0 || !currentRide) return;

      const route = data.routes[0].geometry;

      // Heke route paraprak nese ekziston !!
      if (map.getSource("route")) {
        map.getSource("route").setData({
          type: "Feature",
          geometry: route,
        });
      } else {
        map.addSource("route", {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: route,
          },
        });

        map.addLayer({
          id: routeLayerId,
          type: "line",
          source: "route",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#0074D9",
            "line-width": 5,
          },
        });
      }
    } catch (err) {
      console.error("Error fetching route:", err);
    }
  };
  useEffect(() => {
    if (location && client) {
      fetch(
        `http://localhost:8111/api/users/nearby?latitude=${location.latitude}&longitude=${location.longitude}&radiusKm=5&driverId=${userId}`
      )
        .then((res) => res.json())
        .then((data) => {
          setRideRequests(data);
        })
        .catch((err) => {
          console.error("Error fetching nearby requests:", err);
          if (err.response) {
            console.error("Response error:", err.response);
          } else if (err.request) {
            console.error("Request error:", err.request);
          } else {
            console.error("Unexpected error:", err.message);
          }
        });
    }
  }, [location, client]);

  useEffect(() => {
    if (location && client) {
      fetch(
        `http://localhost:8111/api/users/currentRideDriver?driverId=${userId}`
      )
        .then((res) => res.json())
        .then((data) => {
          setCurrentRide(data);
        })
        .catch((err) => {
          if (err.response) {
            console.error("Response error:", err.response);
          } else if (err.request) {
            console.error("Request error:", err.request);
          }
        });
    }
  }, [client, location]);

  useEffect(() => {
    if (location && !map) {
      const mapInstance = new maplibregl.Map({
        container: "map",
        style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
        center: [location.longitude, location.latitude],
        zoom: 13,
      });

      setMap(mapInstance);
    }
  }, [location]);

  // Your marker!!!!
  useEffect(() => {
    if (map && userId && location) {
      if (userMarker) {
        userMarker.remove();
      }
      const newMarker = new maplibregl.Marker({ color: "blue" })
        .setLngLat([location.longitude, location.latitude])
        .addTo(map);

      setUserMarker(newMarker);
      const popup = new maplibregl.Popup({ offset: 25 }).setText(
        "Your Location"
      );
      newMarker.setPopup(popup);
    }
  }, [location, map]);

  useEffect(() => {
    if (client) {
      if (!currentRide) {
        const driverSub = client.subscribe(
          `/topic/driver-${userId}`,
          (message) => {
            const newRequest = JSON.parse(message.body);

            // Gjeje se a ekziston rideRequest i payload n'varg.
            // Nese Po kqyr ku po dallon, ruje nese dallon.
            const existingRequest = rideRequests.find(
              (request) => request.userId === newRequest.userId
            );
            if (existingRequest) {
              const isDifferent =
                existingRequest.latitude !== newRequest.latitude ||
                existingRequest.longitude !== newRequest.longitude ||
                existingRequest.destLatitude !== newRequest.destLatitude ||
                existingRequest.destLongitude !== newRequest.destLongitude;

              if (isDifferent) {
                setRideRequests((prevRequests) =>
                  prevRequests.map((request) =>
                    request.userId === newRequest.userId
                      ? { ...request, ...newRequest }
                      : request
                  )
                );
              }
            } else {
              setRideRequests((prevRequests) => [...prevRequests, newRequest]);
            }
          }
        );
      }
      const removeSub = client.subscribe("/topic/remove-user", (message) => {
        // INFO: payload osht rideAccepted(userId,driverId etc...)
        const rideAccepted = JSON.parse(message.body);
        console.log("Accepted Ride:", JSON.stringify(rideAccepted, null, 2));
        console.log(
          "Current Ride update:",
          JSON.stringify(currentRide, null, 2)
        );
        if (userId == rideAccepted.driverId) {
          setCurrentRide(rideAccepted);
          setRideRequests([]);
          console.log(
            `RideRequests of the Accepted Ride Driver: ${rideRequests}`
          );
        } else {
          setRideRequests((prevRequests) => {
            return prevRequests.filter(
              (req) => req.userId !== rideAccepted.userId
            );
          });
          console.log(`RideRequests of the other Drivers: ${rideRequests}`);
        }
      });
      // Ndegjo per ndryshime tstatusit (status)
      const statusSub = client.subscribe(
        `/topic/status-${userId}`,
        (message) => {
          const newStatus = JSON.parse(message.body);
          console.log("Status update: ", newStatus);
          if (
            newStatus.status === "CANCELED" ||
            newStatus.status === "COMPLETED"
          ) {
            setCurrentRide(null);
            map.removeLayer(routeLayerId);
          } else {
            setCurrentRide(newStatus);
          }
        }
      );
      return () => {
        removeSub.unsubscribe();
        statusSub.unsubscribe();
      };
    }
  }, [client, currentRide]);

  // RideRequestes Marker
  // Per qdo rideRequest qe vjen prej websocket (mrena 5km)
  // shfaqe nmap
  useEffect(() => {
    if (!map) return;

    const markers = [];

    rideRequests.forEach((rideRequest) => {
      const popupContent = document.createElement("div");
      popupContent.className = "popup-content";

      const acceptButton = document.createElement("button");
      acceptButton.textContent = "Offer Ride";
      popupContent.innerHTML = `<p>Driver ID: ${rideRequest.userId}</p>`;
      acceptButton.className = "accept-button";
      acceptButton.onclick = () => {
        handleRideOffer(
          rideRequest.userId,
          location.latitude,
          location.longitude,
          rideRequest.destLatitude,
          rideRequest.destLongitude
        );
      };

      popupContent.appendChild(acceptButton);

      const popup = new maplibregl.Popup({ offset: 25, closeOnClick: false })
        .setDOMContent(popupContent)
        .setMaxWidth("200px");

      const marker = new maplibregl.Marker({ color: "red" })
        .setLngLat([rideRequest.longitude, rideRequest.latitude])
        .setPopup(popup)
        .addTo(map);

      markers.push(marker);
    });

    return () => {
      markers.forEach((marker) => marker.remove());
    };
  }, [rideRequests, map]);

  // Current ride Marker !!!
  useEffect(() => {
    if (!map || !currentRide || !location) return;

    const from = {
      latitude: location.longitude,
      longitude: location.latitude,
    };
    const to = {
      latitude: currentRide.destLatitude,
      longitude: currentRide.destLongitude,
    };

    drawRoute(from, to);

    const rideMarker = new maplibregl.Marker({ color: "red" })
      .setLngLat([currentRide.longitude, currentRide.latitude])
      .addTo(map);

    const popup = new maplibregl.Popup({ offset: 25 }).setText(
      "Rider Location"
    );
    rideMarker.setPopup(popup);

    return () => {
      rideMarker.remove();
      if (map.getLayer(routeLayerId)) {
        map.removeLayer(routeLayerId);
      }
      if (map.getSource("route")) {
        map.removeSource("route");
      }
    };
  }, [currentRide, map, location]);

  // Status update
  const handleStatusUpdate = (status) => {
    if (!currentRide) return;

    client.publish({
      destination: "/app/status",
      body: JSON.stringify({ ...currentRide, status }),
    });

    if (status === "CANCELED" || "COMPLETED") {
      setCurrentRide(null);
      map.removeLayer(routeLayerId);
    } else setCurrentRide({ ...currentRide, status });
  };

  // Update pozicionin e user-it nhart
  useEffect(() => {
    if (client) {
      watchId.current = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setLocation({ latitude, longitude });

          client.publish({
            destination: "/app/updateLocation",
            body: JSON.stringify({
              userId,
              latitude,
              longitude,
            }),
          });
        },
        (err) => console.error("Geolocation error:", err),
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 5000,
        }
      );
    }
    return () => {
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
      }
    };
  }, [client]);

  return (
    <div>
      <h4>HEllo from driver map</h4>
      <div id="map" style={{ width: "100%", height: "500px" }} />
      {/* <button onClick={requestRide}>Request Ride</button> */}
      {currentRide && (
        <div>
          <h4>
            Ride:
            <br />
            Driver ID: {currentRide.driverId} <br />
            User ID: {currentRide.userId} <br />
            Rider Location: {currentRide.latitude} {currentRide.longitude}
            <br />
            Destination: {currentRide.destLatitude} {currentRide.destLongitude}
            {currentRide.status === "PICKEDUP" ? (
              <div>
                <h4>RIDER HAS BEEN PICKED UP</h4>
                <button onClick={() => handleStatusUpdate("COMPLETED")}>
                  Ride COMPLETED
                </button>
              </div>
            ) : (
              <h4>PICKING UP THE RIDER....</h4>
            )}
          </h4>
          {currentRide.status === "PICKINGUP" && (
            <div>
              <button onClick={() => handleStatusUpdate("PICKEDUP")}>
                Picked Up
              </button>
              <button onClick={() => handleStatusUpdate("CANCELED")}>
                Cancel Ride
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
