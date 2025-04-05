import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import useWebSocket from "./useWebSocket";

export default function RideMap({ userId }) {
  const { updates, client } = useWebSocket(userId);
  const [location, setLocation] = useState(null);
  const [map, setMap] = useState(null);
  const [rideOffers, setRideOffers] = useState([]);
  const [destinationInput, setDestinationInput] = useState("");
  const [destination, setDestination] = useState(null);
  const [userMarker, setUserMarker] = useState(null);
  const watchId = useRef(null);

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
      )}&viewbox=${kosovoViewbox.left},${kosovoViewbox.top},${kosovoViewbox.right},${kosovoViewbox.bottom}&bounded=1`
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
            new maplibregl.Marker({ color: "red" })
              .setLngLat([lon, lat])
              .setPopup(new maplibregl.Popup().setText("Destination"))
              .addTo(map);
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
    let markers = [];

    if (map) {
      rideOffers.forEach((rideOffer) => {
        const popupContent = document.createElement("div");
        popupContent.className = "popup-content";
        popupContent.innerHTML = `<p>Driver ID: ${rideOffer.driverId}</p>`;

        const acceptButton = document.createElement("button");
        acceptButton.textContent = "accept ride";
        acceptButton.className = "accept-button";
        acceptButton.onclick = () => {
          handleAcceptRide(
            rideOffer.driverId,
            location.latitude,
            location.longitude
          );
        };

        popupContent.appendChild(acceptButton);

        const marker = new maplibregl.Marker({ color: "green" })
          .setLngLat([rideOffer.longitude, rideOffer.latitude])
          .addTo(map);

        const popup = new maplibregl.Popup({ offset: 25 })
          .setDOMContent(popupContent)
          .setMaxWidth("200px");

        marker.setPopup(popup);
        marker.getElement().addEventListener("click", () => {
          marker.togglePopup();
        });

        popup.addTo(map);
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
        style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
        center: [location.longitude, location.latitude],
        zoom: 13,
      });

      setMap(mapInstance);
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
      const popup = new maplibregl.Popup({ offset: 25 })
        .setText("Your Location");
      newMarker.setPopup(popup);
    }
  }, [location, map]); 
  useEffect(() => {
    if (location && client) {
      fetch(`http://localhost:8111/api/users/rideOffers?userId=${userId}`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
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
  }, [location,client]);

  useEffect(() => {
    if (client) {

      client.subscribe(`/topic/user-${userId}`, (message) => {
        const newRideOffer = JSON.parse(message.body);
      
        setRideOffers((prevOffers) => {
          const exists = prevOffers.some((offer) =>
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
      client.subscribe("/topic/remove-driver", (message) => {
        const busyDriverId = JSON.parse(message.body);
        setRideOffers((prevOffers) =>
          prevOffers.filter((offer) => offer.driverId !== busyDriverId)
        );
      });
    }
  }, [client]);

  const requestRide = () => {
    client.publish({
      destination: "/app/requestRide",
      body: JSON.stringify({
        userId,
        latitude: location.latitude,
        longitude: location.longitude,
        destLatitude: destination.latitude,
        destLongitude: destination.longitude
      }),
    });
  };
  const handleAcceptRide = (driverId, latitude, longitude) => {
    client.publish({
      destination: "/app/acceptRide",
      body: JSON.stringify({
        userId,
        driverId,
        latitude,
        longitude,
      }),

    });
      setRideOffers([]);
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
          timeout: 5000
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
      <h4>HEllo from rider map</h4>
      <div id="map" style={{ width: "100%", height: "500px" }} />
      <button onClick={requestRide}>Request Ride</button>
      <input
        type="text"
        placeholder="Enter destination"
        value={destinationInput}
        onChange={(e) => setDestinationInput(e.target.value)}
      />
      <button onClick={handleSetDestination}>Set Destination</button>
    </div>
  );
}
