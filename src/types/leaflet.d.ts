import 'leaflet';

declare module 'leaflet' {
  interface Map {
    _map: any;
  }
  
  interface Layer {
    _map: any;
  }
} 