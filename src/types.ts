export interface LocationOfInterest {
    latlng: L.LatLngExpression;
    zoom: number;
    text: string;
    description: string;
    time: string;
    index?: number;
  }
export interface InterestingEvent {
    date: Date;
    endDate?: Date;
    dateString: string;
    locations: LocationOfInterest[];
    label?: string;
    info?: string;
    highlighted?: boolean;
    hasFeature?: boolean;
  }
  
import L from 'leaflet';
export class LatLng extends L.LatLng {
  constructor(lat: number, lng: number) {
    super(lat, lng);
  }

  toLeaflet(): L.LatLng {
    return this;
  }
  
}
export class LatLngBounds extends L.LatLngBounds {
  constructor(sw: L.LatLng, ne: L.LatLng) {
    super(sw, ne);
  }

  toLeaflet(): L.LatLngBounds {
    return this;
  }
}