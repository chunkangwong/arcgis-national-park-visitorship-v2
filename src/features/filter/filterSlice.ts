import { RootState } from "@/store/store";
import Graphic from "@arcgis/core/Graphic";
import FeatureFilter from "@arcgis/core/layers/support/FeatureFilter";
import TopFeaturesQuery from "@arcgis/core/rest/support/TopFeaturesQuery";
import TopFilter from "@arcgis/core/rest/support/TopFilter";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export type OrderBy = "ASC" | "DESC";
export type Year = "TOTAL" | "F2018" | "F2019" | "F2020";

interface FilterPanelState {
  orderBy: OrderBy;
  year: Year;
  count: number;
}

interface FilterState extends FilterPanelState {
  status: "idle" | "loading" | "succeeded" | "failed";
  error?: string;
  features: Graphic[];
}

const initialState: FilterState = {
  orderBy: "DESC",
  year: "TOTAL",
  count: 1,
  status: "idle",
  features: [],
};

export const filterItems = createAsyncThunk(
  "filter/filterItems",
  async (_, { getState }) => {
    const {
      filter: { count, year, orderBy },
      arcgis: { layerView, featureLayer },
    } = getState() as RootState;
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
      const filter = new FeatureFilter({
        objectIds: objectIds,
      });
      layerView.filter = filter;
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
    setOrderBy: (state, action: PayloadAction<OrderBy>) => {
      state.orderBy = action.payload;
    },
    setYear: (state, action: PayloadAction<Year>) => {
      state.year = action.payload;
    },
    resetDefault(state) {
      state.orderBy = "DESC";
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
