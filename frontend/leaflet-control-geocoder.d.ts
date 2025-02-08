declare module 'leaflet-control-geocoder' {
    import * as L from 'leaflet';
  
    namespace L.Control.Geocoder {
      interface Result {
        center: L.LatLng;
        text: string;
      }
  
      function nominatim(): Geocoder;
  
      interface Geocoder {
        geocode(query: string, callback: (results: Result[]) => void): void;
      }
    }
  
    export = L.Control.Geocoder;
  }
  