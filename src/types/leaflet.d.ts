import 'leaflet';

declare module 'leaflet' {
  interface Map {
    _map?: any;
    options: {
      layers?: Layer[];
    };
  }
  
  interface Layer {
    _map?: any;
    addTo(map: Map | LayerGroup): this;
    remove(): this;
    removeFrom(map: Map): this;
  }
} 