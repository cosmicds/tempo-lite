/* eslint-disable @typescript-eslint/naming-convention */
export interface EsriGetSamplesReturn {
  samples: EsriGetSamplesSample[];
}

export interface EsriGetSamplesSample {
  location: Location;
  locationId: number;
  value: string;
  resolution: number;
  attributes: Attributes;
}

export interface EsriGetSamplesReturnError {
  error: Error;
}


export interface Attributes {
  NO2_Troposphere?: string;
  HCHO?: string;
  Ozone_Column_Amount?: string;
  StdTime: number;
  StdTime_Max: number;
  Variables: Variables;
  Dimensions: Dimensions;
}

export type Dimensions = "StdTime";

export type Variables = "NO2_Troposphere" | "HCHO" | "Ozone_Column_Amount";


export interface Location {
  x: number;
  y: number;
  spatialReference: SpatialReference;
}

export interface SpatialReference {
  wkid: number;
  latestWkid: number;
}


export interface CEsriTimeseries {
  x: number;
  y: number;
  time: number;
  date: Date; 
  variable: number | null;
  value: number | null;
  locationId: number;
}


export interface Error {
  code:         number;
  extendedCode: number;
  message:      string;
  details:      string[];
}


export type EsriInterpolationMethod = "RSP_BilinearInterpolation" | "RSP_CubicConvolution" | "RSP_Majority" | "RSP_NearestNeighbor";