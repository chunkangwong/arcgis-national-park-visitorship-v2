import { useArcgis } from "@/store/arcgisStore";
import { useFilter } from "@/store/filterStore";
import FeatureFilter from "@arcgis/core/layers/support/FeatureFilter";
import TopFeaturesQuery from "@arcgis/core/rest/support/TopFeaturesQuery";
import TopFilter from "@arcgis/core/rest/support/TopFilter";
import { Paper, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import FilterPanel from "./FilterPanel";
import ResultPanel from "./ResultPanel";

export default function LeftPanel() {
  const { orderBy, count, year } = useFilter();
  const { mapView, featureLayer } = useArcgis();

  const { status, data, refetch } = useQuery(["filter"], async () => {
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
    const featureLayerView = await mapView.whenLayerView(featureLayer);
    const filter = new FeatureFilter({
      objectIds: objectIds,
    });
    featureLayerView.filter = filter;
    return results.features;
  });

  useEffect(() => {
    refetch();
  }, [orderBy, count, year]);

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
