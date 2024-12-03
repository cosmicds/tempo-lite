/* eslint-disable @typescript-eslint/naming-convention */
// import L from 'leaflet';
// import * as esri from 'esri-leaflet';

// const earthdataRestSerivceURL = "https://gis.earthdata.nasa.gov/image/rest/services/C2930763263-LARC_CLOUD/TEMPO_NO2_L3_V03_HOURLY_TROPOSPHERIC_VERTICAL_COLUMN_BETA/ImageServer";

export const renderingRule =  {
  'rasterFunctionArguments': {
    'ColorrampName': 'Magma',
    'Raster': {'rasterFunctionArguments': {
      'StretchType': 5,
      'Statistics': [[
        100000000000000,
        15000000000000000,
        210863682171422.1,
        2474291611234248
      ]],
      'DRA': false,
      'UseGamma': false,
      'Gamma': [1],
      'ComputeGamma': true,
      'Min': 255,
      'Max': 0
    },
    'rasterFunction': 'Stretch',
    'outputPixelType': 'U8',
    'variableName': 'Raster'
    }
  },
  'rasterFunction': 'Colormap',
  'variableName': 'Raster'
};

export interface EsriSlice {
  sliceId: number;
  multidimensionalDefinition: MultidimensionalDefinition[];
}

interface MultidimensionalDefinition {
  variableName: string;
  dimensionName: string;
  values: number[];
}

export interface EsriSliceResponse {
  slices: EsriSlice[];
}