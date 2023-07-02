import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";

export const featureLayer = new FeatureLayer({
  url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/US_National_Parks_Annual_Visitation/FeatureServer/0",
  outFields: ["*"],
  popupTemplate: {
    title: "{Park}",
    content: [
      {
        type: "fields",
        fieldInfos: [
          {
            fieldName: "F2020",
            label: "2020",
            format: { digitSeparator: true },
          },
          {
            fieldName: "F2021",
            label: "2021",
            format: { digitSeparator: true },
          },
          {
            fieldName: "F2022",
            label: "2022",
            format: { digitSeparator: true },
          },
        ],
      },
    ],
  },
});

export const map = new Map({
  basemap: "topo-vector",
  layers: [featureLayer],
});

export const view = new MapView({
  map: map,
  center: [-120, 45],
  zoom: 3,
});
