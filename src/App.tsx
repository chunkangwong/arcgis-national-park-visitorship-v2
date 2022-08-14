import { Box, Drawer, Grid, useMediaQuery, useTheme } from "@mui/material";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import { setLayerView } from "./features/arcgis/arcgisSlice";
import { setTempDrawerOpen } from "./features/layout/layoutSlice";
import LeftPanel from "./features/layout/LeftPanel";
import { RootState } from "./store/store";
import Button from "./widgets/Button";

function App() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));
  const { view, featureLayer } = useSelector(
    (state: RootState) => state.arcgis
  );
  const { tempDrawerOpen } = useSelector((state: RootState) => state.layout);

  const viewRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    view.container = viewRef.current as HTMLDivElement;

    view.whenLayerView(featureLayer).then((layerView) => {
      dispatch(setLayerView(layerView));
    });
  }, []);

  React.useEffect(() => {
    view.when(() => {
      if (!matches) {
        Button.addEventListener("click", () => {
          dispatch(setTempDrawerOpen(true));
        });
        view.ui.add(Button, "top-left");
      } else {
        view.ui.remove(Button);
      }
    });
  }, [view, matches]);

  function handleTempDrawerClose() {
    dispatch(setTempDrawerOpen(false));
  }

  return (
    <Grid container className="App" component={Box}>
      <Grid
        item
        xs={0}
        sm={2}
        component={Box}
        display={{
          xs: "none",
          sm: "block",
        }}
      >
        <Drawer
          PaperProps={{
            sx: {
              width: "240px",
            },
          }}
          anchor="left"
          variant={matches ? "persistent" : "temporary"}
          open={matches ? true : tempDrawerOpen}
          onClose={handleTempDrawerClose}
        >
          <LeftPanel />
        </Drawer>
      </Grid>
      <Grid
        item
        sm={10}
        xs={12}
        style={{
          height: "100%",
        }}
      >
        <div id="viewDiv" ref={viewRef}></div>
      </Grid>
    </Grid>
  );
}

export default App;
