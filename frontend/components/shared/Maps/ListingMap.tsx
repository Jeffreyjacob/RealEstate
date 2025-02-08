"use client"
import { useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import { Map, Overlay, View } from 'ol';
import { OSM } from 'ol/source';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { Point } from 'ol/geom';
import { Feature } from 'ol';
import { Icon, Style } from 'ol/style';
import { fromLonLat } from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import { ApartmentType } from '@/lib/types';
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import MapPopOver from './MapPopOver';

interface ListingMapProps {
  data: ApartmentType[] | undefined;
}

const ListingMap: React.FC<ListingMapProps> = ({ data }) => {
  const [addresses, setAddresses] = useState<string[]>([]);
  const mapRef = useRef<HTMLDivElement>(null);
  const [location, setLocation] = useState<[number, number][]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApartment, setSelectedApartment] = useState<ApartmentType | null>(null);
  const overlayRef = useRef<Overlay | null>(null);

  useEffect(() => {
    const location = data?.map((apartment) => apartment.location) || [];
    setAddresses(location);
  }, [data]);

  useEffect(() => {
    if (addresses.length > 0) {
      const getCoordinates = async () => {
        setLoading(true);

        try {
          const fetchedLocation: [number, number][] = [];

          for (let address of addresses) {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/search?format=json&q=${address}`
            );

            const data = await response.json();

            if (data.length > 0) {
              const lat = parseFloat(data[0].lat);
              const lon = parseFloat(data[0].lon);
              fetchedLocation.push([lon, lat]);
            } else {
              console.error(`No location found for address: ${address}`);
            }
          }
          setLocation(fetchedLocation);
        } catch (error) {
          console.error('Error fetching geocoding data: ', error);
        } finally {
          setLoading(false);
        }
      };
      getCoordinates();
    }
  }, [addresses]);

  useEffect(() => {
    if (location.length > 0 && mapRef.current) {
      const center = fromLonLat(location[0]);

      const map = new Map({
        target: mapRef.current,
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],
        view: new View({
          center: center,
          zoom: 13,
        }),
      });

      const markers = location.map((location, index) => {
        const marker = new Feature({
          geometry: new Point(fromLonLat(location)),
        });

        marker.setStyle(
          new Style({
            image: new Icon({
              src: 'https://openlayers.org/en/v4.6.5/examples/data/icon.png',
              scale: 0.8,
            }),
          })
        );

        marker.set('apartment', data?.[index]);
        return marker;
      });

      const vectorLayer = new VectorLayer({
        source: new VectorSource({
          features: markers,
        }),
      });

      map.addLayer(vectorLayer);

      overlayRef.current = new Overlay({
        element: document.createElement('div'), // Initially an empty div
        positioning: 'bottom-center', // Position the popover above the marker
        stopEvent: false,
      });
      map.addOverlay(overlayRef.current);

      map.on('click', (event) => {
        const pixel = map.getEventPixel(event.originalEvent);
        const feature = map.forEachFeatureAtPixel(pixel, (feature) => feature);

        if (feature) {
          const apartment = feature.get('apartment');
          console.log('Apartment data from clicked marker: ', apartment); // Debug log

          if (apartment) {
            setSelectedApartment(apartment); // Set the selected apartment state
            console.log('Selected Apartment set: ', apartment);
          }

          const geometry = feature.getGeometry();
          if (geometry instanceof Point) {
            const coordinates = geometry.getCoordinates();
            console.log("Coordinates for Overlay: ", coordinates); // Debug log

            // No need to call fromLonLat again, coordinates are already in EPSG:3857
            overlayRef.current?.setPosition(coordinates);

            // Ensure the overlay is visible
            const overlayElement = overlayRef.current?.getElement();
            if (overlayElement) {
              overlayElement.style.display = 'block'; // Ensure the popover is visible
              overlayElement.style.zIndex = '9999'; // Ensure it's on top of everything else
            }
          }
        }
      });

      return () => map.setTarget(undefined);
    }
  }, [location, data]);

  if (loading) {
    return (
      <div className="w-full h-[350px]">
        <Skeleton className="w-full h-[350px] rounded-lg" />
      </div>
    );
  }

  return (
    <div>
      <div ref={mapRef} style={{ width: '100%', height: '350px', borderRadius: '10px' }}></div>
      {selectedApartment && (
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            zIndex: 1000,
            backgroundColor: 'white', // Ensure visibility
            padding: '10px',
            borderRadius: '5px',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', // Styling the popover
          }}
        >
          {selectedApartment.title}
        </div>
      )}
      {location.length === 0 && <p>Unable to find any locations.</p>}
    </div>
  );
};

export default ListingMap;
