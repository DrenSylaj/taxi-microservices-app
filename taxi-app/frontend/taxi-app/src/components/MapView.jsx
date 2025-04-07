import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const MapView = () => {
  const mapContainer = useRef(null);
  const lon = 21.164659
  const lat = 42.660573 

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
    <div
      ref={mapContainer}
      style={{ width: '100%', height: '100vh' }}
    />
  );
};

export default MapView;
