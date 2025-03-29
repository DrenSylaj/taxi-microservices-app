import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { connectWebSocket, disconnectWebSocket, sendLocationUpdate, getLocations } from "./connectWebSocket";

function LocationTracker() {
    const [currentLocation, setCurrentLocation] = useState(null);
    const [locations, setLocations] = useState([]);
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const markersRef = useRef({});
    const currentUserId = 2; 

    useEffect(() => {
        const map = new maplibregl.Map({
            container: mapContainerRef.current,
            style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
            center: [20.902, 42.667],
            zoom: 8,
        });
        mapRef.current = map;

        connectWebSocket(onLocationUpdate, () => {
            getLocations(setLocations);
        });

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
            disconnectWebSocket();
        };
    }, []);

    const onLocationUpdate = (update) => {
        const { latitude, longitude } = update;
        setCurrentLocation({ latitude, longitude });
        getLocations(setLocations);

        if (mapRef.current && markerRef.current) {
            mapRef.current.flyTo({ center: [longitude, latitude], essential: true });
            markerRef.current.setLngLat([longitude, latitude]);
        }
    };

    useEffect(() => {
        if (currentLocation && mapRef.current) {
            if (!markerRef.current) {
                markerRef.current = new maplibregl.Marker()
                    .setLngLat([currentLocation.longitude, currentLocation.latitude])
                    .addTo(mapRef.current);
            } else {
                markerRef.current.setLngLat([
                    currentLocation.longitude,
                    currentLocation.latitude,
                ]);
            }

            mapRef.current.flyTo({
                center: [currentLocation.longitude, currentLocation.latitude],
                essential: true,
            });
        }
    }, [currentLocation]);

    useEffect(() => {
      if (!mapRef.current) return;

      locations.forEach(location => {
          const markerId = location.userId.toString();
          if (!markersRef.current[markerId]) {
              markersRef.current[markerId] = new maplibregl.Marker()
                  .setLngLat([location.longitude, location.latitude])
                  .addTo(mapRef.current);
          } else {
              markersRef.current[markerId].setLngLat([
                  location.longitude,
                  location.latitude,
              ]);
          }
      });

      return () => {
          Object.values(markersRef.current).forEach(marker => marker.remove());
          markersRef.current = {};
      };
  }, [locations]);
    const handleLocationUpdate = () => {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            sendLocationUpdate({ userId: 2, latitude, longitude });
            setCurrentLocation({ latitude, longitude });
        });
    };

    return (
        <div>
            <button onClick={handleLocationUpdate}>Update My Location</button>
            <div ref={mapContainerRef} style={{ width: "1000px", height: "600px" }} />
            
            {currentLocation && (
                <div>
                    <p>Your Current Location User 2: {currentLocation.latitude}, {currentLocation.longitude}</p>
                </div>
            )}

            <h3>User Locations:</h3>
            <ul>
                {locations.map((location) => (
                    <li key={location.userId}>
                        User {location.userId}: {location.latitude}, {location.longitude}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default LocationTracker;