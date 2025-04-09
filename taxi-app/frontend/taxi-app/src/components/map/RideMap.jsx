import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import useWebSocket from "./useWebSocket";
import RequestButton from "./mapComponents/RideMapBar";
import SelectedDriver from "./mapComponents/SelectedDriver";

export default function RideMap({ userId }) {
  const { updates, client } = useWebSocket(userId);
  const [location, setLocation] = useState(null);
  const [map, setMap] = useState(null);
  const [rideOffers, setRideOffers] = useState([]);
  const [destinationInput, setDestinationInput] = useState("");
  const [destination, setDestination] = useState(null);
  const [selectedRideOffer, setSelectedRideOffer] = useState(null);
  const [userMarker, setUserMarker] = useState(null);
  const [currentRide, setCurrentRide] = useState(null);
  const watchId = useRef(null);
  const [destinationMarker, setDestinationMarker] = useState(null);

  const handleSetDestination = () => {
    const kosovoViewbox = {
      left: 20.0,
      top: 43.0,
      right: 21.9,
      bottom: 41.8,
    };

    fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        destinationInput
      )}&viewbox=${kosovoViewbox.left},${kosovoViewbox.top},${
        kosovoViewbox.right
      },${kosovoViewbox.bottom}&bounded=1`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) {
          const firstResult = data[0];
          const lat = parseFloat(firstResult.lat);
          const lon = parseFloat(firstResult.lon);
          console.log("Destination coordinates:", lat, lon);
          setDestination({ latitude: lat, longitude: lon });

          if (map) {
            if (destinationMarker) {
              destinationMarker.remove();
            }
            setDestinationMarker(
              new maplibregl.Marker({ color: "red" })
                .setLngLat([lon, lat])
                .setPopup(new maplibregl.Popup().setText("Destination"))
                .addTo(map)
            );
          }
        } else {
          alert("Destination not found in Kosovo.");
        }
      })
      .catch((err) => {
        console.error("Error fetching destination:", err);
      });
  };

  useEffect(() => {
    if (location && client) {
      fetch(`http://localhost:8111/api/users/currentRideUser?userId=${userId}`)
        .then((res) => res.json())
        .then((data) => {
          setCurrentRide(data);
        })
        .catch((err) => {
          if (err.response) {
            console.error("Response error:", err.response);
          }
        });
    }
  }, [client, location]);

  useEffect(() => {
    let markers = [];

    if (map) {
      rideOffers.forEach((rideOffer) => {
        const popupContent = document.createElement("div");
        popupContent.className = "popup-content";
        popupContent.innerHTML = `<p>Selected Driver</p>`;

        // const acceptButton = document.createElement("button");
        // acceptButton.textContent = "accept ride";
        // acceptButton.className = "accept-button";
        // acceptButton.onclick = () => {
        //   handleAcceptRide(
        //     rideOffer.driverId,
        //     location.latitude,
        //     location.longitude,
        //     rideOffer.destLatitude,
        //     rideOffer.destLongitude,
        //     "PICKINGUP"
        //   );
        // };

        // popupContent.appendChild(acceptButton);

        const popup = new maplibregl.Popup({ offset: 25 })
        .setDOMContent(popupContent)
        .setMaxWidth("200px");

        const marker = new maplibregl.Marker({ color: "green" })
          .setLngLat([rideOffer.longitude, rideOffer.latitude])
          .setPopup(popup)
          .addTo(map);

        marker.getElement().addEventListener("click", () => {
          setSelectedRideOffer(rideOffer);
          
        });

        // popup.addTo(map);
        markers.push(marker);
      });
    }

    return () => {
      markers.forEach((marker) => marker.remove());
    };
  }, [rideOffers, map]);

  useEffect(() => {
    if (location && !map) {
      const mapInstance = new maplibregl.Map({
        container: "map",
        center: [location.longitude, location.latitude],
        zoom: 15,
        style: {
          version: 8,
          sources: {
            osm: {
              type: "raster",
              tiles: ["https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"],
              tileSize: 256,
              attribution: "&copy; OpenStreetMap contributors",
            },
          },
          layers: [
            {
              id: "osm",
              type: "raster",
              source: "osm",
            },
          ],
        },
      });
      setMap(mapInstance);
    }
  }, [location]);

  useEffect(() => {
    if (map) {
      map.flyTo({
        center: [location.longitude, location.latitude],
        essential: true,
        zoom: 15,
      });
    }
  }, [location]);

  // Your Marker!
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
    if (location && client) {
      fetch(`http://localhost:8111/api/users/rideOffers?userId=${userId}`)
        .then((res) => res.json())
        .then((data) => {
          setRideOffers(data);
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

  // subscriptionsssss....
  useEffect(() => {
    if (!client) return;

    const userSub = client.subscribe(`/topic/user-${userId}`, (message) => {
      const newRideOffer = JSON.parse(message.body);

      setRideOffers((prevOffers) => {
        const exists = prevOffers.some(
          (offer) =>
            offer.userId === newRideOffer.userId &&
            offer.driverId === newRideOffer.driverId &&
            offer.latitude === newRideOffer.latitude &&
            offer.longitude === newRideOffer.longitude &&
            offer.destLatitude === newRideOffer.destLatitude &&
            offer.destLongitude === newRideOffer.destLongitude
        );
        return exists ? prevOffers : [...prevOffers, newRideOffer];
      });
    });

    const removeSub = client.subscribe("/topic/remove-driver", (message) => {
      const busyDriverId = JSON.parse(message.body);
      setRideOffers((prevOffers) =>
        prevOffers.filter((offer) => offer.driverId !== busyDriverId)
      );
    });

    const statusSub = client.subscribe(`/topic/status-${userId}`, (message) => {
      const newStatus = JSON.parse(message.body);
      console.log("Status update: ", newStatus);
      if (newStatus.status === "CANCELED" || newStatus.status === "COMPLETED") {
        setCurrentRide(null);
        map.removeLayer(routeLayerId);
      } else {
        setCurrentRide(newStatus);
      }
    });

    return () => {
      userSub.unsubscribe();
      removeSub.unsubscribe();
      statusSub.unsubscribe();
    };
  }, [client]);
  const requestRide = () => {
    client.publish({
      destination: "/app/requestRide",
      body: JSON.stringify({
        userId,
        latitude: location.latitude,
        longitude: location.longitude,
        destLatitude: destination.latitude,
        destLongitude: destination.longitude,
      }),
    });
  };
  const handleAcceptRide = (
    driverId,
    latitude,
    longitude,
    destLongitude,
    destLatitude,
    status
  ) => {
    client.publish({
      destination: "/app/acceptRide",
      body: JSON.stringify({
        userId,
        driverId,
        latitude,
        longitude,
        destLongitude,
        destLatitude,
        status,
      }),
    });
    setRideOffers([]);
    setCurrentRide({
      userId,
      driverId,
      latitude,
      longitude,
      destLongitude,
      destLatitude,
      status,
    });
  };

  // Status update
  const handleStatusUpdate = (status) => {
    if (!currentRide) return;

    client.publish({
      destination: "/app/status",
      body: JSON.stringify({ ...currentRide, status }),
    });

    if (status === "CANCELED" || status === "COMPLETED") setCurrentRide(null);
    else setCurrentRide({ ...currentRide, status });
  };
  useEffect(() => {
    if (client) {
      watchId.current = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          // console.log('Updated location:', latitude, longitude);
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
      <div id="map" style={{ width: "100%", height: "83vh" }} />
      {(selectedRideOffer && location) && (
        <SelectedDriver
          location={location}
          driverId={selectedRideOffer.driverId}
          selectedRideOffer={selectedRideOffer}
          setSelectedRideOffer={setSelectedRideOffer}
          handleAcceptRide={handleAcceptRide}
          visible={true}
        />
      )}

      <RequestButton
        requestRide={requestRide}
        setDestinationInput={setDestinationInput}
        handleSetDestination={handleSetDestination}
        handleStatusUpdate={handleStatusUpdate}
        currentRide={currentRide}
      />
    </div>
  );
}
