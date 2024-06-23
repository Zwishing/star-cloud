import maplibre from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import React, { useEffect, useRef } from 'react';

const Map: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (mapContainer.current) {
      const map = new maplibre.Map({
        container: mapContainer.current,
        style: 'https://api.maptiler.com/maps/satellite/style.json?key=TxU619ucqUp8F321k2JK',
        center: [120, 36],
        zoom: 3,
      });

      return () => {
        map.remove();
      };
    }
  }, []);

  return <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />;
};

export default Map;
