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
  const routeVisibleRef = useRef(false);
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

  const drawRoute = async (from, to) => {
    if (routeVisibleRef.current && map.getLayer("route-line")) {
      map.removeLayer("route-line");
      map.removeSource("route");
      routeVisibleRef.current = false;
      return;
    }
    try {
      const res = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${from.longitude},${from.latitude};${to.longitude},${to.latitude}?overview=full&geometries=geojson`
      );
      const data = await res.json();
      const routeGeoJSON = {
        type: "Feature",
        geometry: data.routes[0].geometry,
      };
      if (map.getSource("route")) {
        map.getSource("route").setData(routeGeoJSON);
      } else {
        map.addSource("route", {
          type: "geojson",
          data: routeGeoJSON,
        });

        map.addLayer({
          id: "route-line",
          type: "line",
          source: "route",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#ff5733",
            "line-width": 5,
          },
        });
      }

      routeVisibleRef.current = true;
    } catch (err) {
      console.error("OSRM routing error:", err);
    }
  };
  useEffect(() => {
    if (currentRide === null && location && client) {
      fetch(
        `http://localhost:8111/api/users/nearby?latitude=${location.latitude}&longitude=${location.longitude}&radiusKm=5&driverId=${userId}`
      )
        .then((res) => res.json())
        .then((data) => {
          console.log(currentRide);
          console.log(data);
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
  }, [location, client, currentRide]);

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
        client.subscribe(`/topic/driver-${userId}`, (message) => {
          const newRequest = JSON.parse(message.body);

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
        });
      }

      client.subscribe("/topic/remove-user", (message) => {
        // INFO: payload osht RideOffer(userId,driverId etc...)
        const rideOffer = JSON.parse(message.body);
        if (userId == rideOffer.driverId) {
          setRideRequests((prevRequests) => {
            return prevRequests.filter(
            (req) => 
              req.userId === rideOffer.userId
            );
          });
        } else {
          setRideRequests((prevRequests) => {
            return prevRequests.filter(
              (req) =>
                req.userId !== rideOffer.userId
            );
          });
        }
          
      });
    }
  }, [client]);

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

  useEffect(() => {
    if (!map || !currentRide) return;

    const markers = [];

    const popupContent = document.createElement("div");
    popupContent.className = "popup-content";

    const acceptButton = document.createElement("button");
    acceptButton.textContent = "Accepted Ride";
    acceptButton.className = "accept-button";
    // acceptButton.onclicrk = () => {
    //   handleRideOffer(
    //     currentRide.userId,
    //     location.latitude,
    //     location.longitude
    //   );
    // };

    popupContent.appendChild(acceptButton);

    const popup = new maplibregl.Popup({ offset: 25, closeOnClick: false })
      .setDOMContent(popupContent)
      .setMaxWidth("200px");

    const marker = new maplibregl.Marker({ color: "red" })
      .setLngLat([currentRide.longitude, currentRide.latitude])
      .setPopup(popup)
      .addTo(map);

    markers.push(marker);

    return () => {
      markers.forEach((marker) => marker.remove());
    };
  }, [currentRide, map]);

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
      <button>Picked Up</button>
    </div>
  );
}
