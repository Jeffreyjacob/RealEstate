"use client"
import { useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import { Map, View } from 'ol';
import { OSM } from 'ol/source';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { Point } from 'ol/geom';
import { Feature } from 'ol';
import { Icon, Style } from 'ol/style';
import { fromLonLat } from 'ol/proj';
import VectorSource from 'ol/source/Vector';

interface PropertyMapProps {
  address: string;
}

const PropertyMap: React.FC<PropertyMapProps> = ({ address }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [location, setLocation] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(true);  // Track loading state

  useEffect(() => {
    if (address) {
      const getCoordinates = async () => {
        setLoading(true);  // Start loading
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${address}`
          );
          const data = await response.json();
          
          if (data.length > 0) {
            const lat = parseFloat(data[0].lat);
            const lon = parseFloat(data[0].lon);
            setLocation([lon, lat]);
            console.log('Location found:', { lat, lon });
          } else {
            console.error('No location data found.');
          }
        } catch (error) {
          console.error('Error fetching geocoding data:', error);
        } finally {
          setLoading(false);  // End loading
        }
      };

      getCoordinates();
    }
  }, [address]);

  useEffect(() => {
    if (location && mapRef.current) {
      const map = new Map({
        target: mapRef.current,
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],
        view: new View({
          center: fromLonLat(location),
          zoom: 13,
        }),
      });

      const marker = new Feature({
        geometry: new Point(fromLonLat(location)),
      });

      marker.setStyle(
        new Style({
          image: new Icon({
            src: 'https://openlayers.org/en/v4.6.5/examples/data/icon.png',
            scale: 0.6,
          }),
        })
      );

      const vectorLayer = new VectorLayer({
        source: new VectorSource({
          features: [marker],
        }),
      });

      map.addLayer(vectorLayer);

      return () => map.setTarget(undefined); // Clean up map when component unmounts
    }
  }, [location]);  // Re-run this effect when location changes

  if (loading) {
    return <p>Loading map...</p>;
  }

  return (
    <div>
      <div ref={mapRef} style={{ width: '100%', height: '250px',borderRadius:'10px'}}></div>
      {!location && <p>Unable to find location.</p>}
    </div>
  );
};

export default PropertyMap;
