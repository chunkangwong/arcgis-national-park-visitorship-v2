import { useFilter } from "@/store/filterStore";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import FeatureFilter from "@arcgis/core/layers/support/FeatureFilter";
import Map from "@arcgis/core/Map";
import TopFeaturesQuery from "@arcgis/core/rest/support/TopFeaturesQuery";
import TopFilter from "@arcgis/core/rest/support/TopFilter";
import MapView from "@arcgis/core/views/MapView";
import { Paper, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { useQuery } from "@tanstack/react-query";
import FilterPanel from "./FilterPanel";
import ResultPanel from "./ResultPanel";

declare global {
  interface Window {
    map: __esri.Map;
    view: __esri.MapView;
  }
}

window.map = new Map({
  basemap: "topo-vector",
});

window.view = new MapView({
  map: window.map,
  center: [-120, 45],
  zoom: 3,
});

export default function LeftPanel() {
  const { orderBy, count, year } = useFilter();

  const { status, data } = useQuery(
    ["filter", orderBy, count, year],
    async () => {
      const featureLayer = new FeatureLayer({
        url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/US_National_Parks_Annual_Visitation/FeatureServer/0",
        outFields: ["*"],
        popupTemplate: {
          title: "{Park}",
          content: [
            {
              type: "fields",
              fieldInfos: [
                {
                  fieldName: "TOTAL",
                  label: "Total visits",
                  format: { digitSeparator: true },
                },
                {
                  fieldName: "F2018",
                  label: "2018",
                  format: { digitSeparator: true },
                },
                {
                  fieldName: "F2019",
                  label: "2019",
                  format: { digitSeparator: true },
                },
                {
                  fieldName: "F2020",
                  label: "2020",
                  format: { digitSeparator: true },
                },
              ],
            },
          ],
        },
      });
      window.map.add(featureLayer);

      const query = new TopFeaturesQuery({
        topFilter: new TopFilter({
          topCount: count,
          groupByFields: ["State"],
          orderByFields: [`${year} ${orderBy}`],
        }),
        orderByFields: [`${year} ${orderBy}`],
        outFields: ["State, TOTAL, F2018, F2019, F2020, Park"],
        returnGeometry: true,
        cacheHint: false,
      });

      const results = await featureLayer.queryTopFeatures(query);

      query.orderByFields = [""];
      const objectIds = await featureLayer.queryTopObjectIds(query);
      const featureLayerView = await window.view.whenLayerView(featureLayer);
      const filter = new FeatureFilter({
        objectIds: objectIds,
      });
      featureLayerView.filter = filter;
      return results.features;
    }
  );

  return (
    <Stack spacing={2}>
      <Paper
        sx={{
          p: 1,
        }}
      >
        <Typography>National Park Visitation</Typography>
      </Paper>
      <FilterPanel />
      <ResultPanel features={data} status={status} />
    </Stack>
  );
}
