// Ambient type declarations for Google Maps JavaScript API

declare namespace google {
  export namespace maps {
    export class Map {
      constructor(mapDiv: Element | null, opts?: any);
      setCenter(latLng: any): void;
      setZoom(zoom: number): void;
      panTo(latLng: any): void;
    }

    export class Marker {
      constructor(opts?: any);
      setMap(map: Map | null): void;
      setPosition(latLng: any): void;
      addListener(eventName: string, handler: Function): void;
    }

    export class Polyline {
      constructor(opts?: any);
      setMap(map: Map | null): void;
      setPath(path: any): void;
    }

    export class Circle {
      constructor(opts?: any);
      setMap(map: Map | null): void;
    }

    export enum SymbolPath {
      BACKWARD_CLOSED_ARROW = 0,
      BACKWARD_OPEN_ARROW = 1,
      CIRCLE = 2,
      FORWARD_CLOSED_ARROW = 3,
      FORWARD_OPEN_ARROW = 4,
    }

    export interface MapTypeStyle {
      elementType?: string;
      featureType?: string;
      stylers: object[];
    }
  }
}

declare const google: any;
