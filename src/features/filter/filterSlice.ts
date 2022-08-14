import Graphic from "@arcgis/core/Graphic";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import TopFeaturesQuery from "@arcgis/core/rest/support/TopFeaturesQuery";
import TopFilter from "@arcgis/core/rest/support/TopFilter";
import LayerView from "@arcgis/core/views/layers/LayerView";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FilterPanelState {
  orderBy: "DESC" | "ASC";
  year: "TOTAL" | "F2018" | "F2019" | "F2020";
  count: number;
}

interface FilterState extends FilterPanelState {
  status: "idle" | "loading" | "succeeded" | "failed";
  error?: string;
  features: Graphic[];
}

interface ResultFilterProps extends FilterPanelState {
  featureLayer: FeatureLayer;
  layerView?: LayerView;
}

const initialState: FilterState = {
  orderBy: "ASC",
  year: "TOTAL",
  count: 1,
  status: "idle",
  features: [],
};

export const filterItems = createAsyncThunk(
  "filter/filterItems",
  async ({
    count,
    year,
    orderBy,
    layerView,
    featureLayer,
  }: ResultFilterProps) => {
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
    if (layerView) {
      layerView.filter = { objectIds };
    }
    return results.features;
  }
);

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setCount: (state, action: PayloadAction<number>) => {
      state.count = action.payload;
    },
    setOrderBy: (state, action: PayloadAction<"DESC" | "ASC">) => {
      state.orderBy = action.payload;
    },
    setYear: (
      state,
      action: PayloadAction<"TOTAL" | "F2018" | "F2019" | "F2020">
    ) => {
      state.year = action.payload;
    },
    resetDefault(state) {
      state.orderBy = "ASC";
      state.year = "TOTAL";
      state.count = 1;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(filterItems.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(filterItems.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.features = action.payload;
      })
      .addCase(filterItems.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { setCount, setOrderBy, setYear, resetDefault } =
  filterSlice.actions;

export default filterSlice.reducer;
