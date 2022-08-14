import { Box, Drawer, useMediaQuery, useTheme } from "@mui/material";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLayerView } from "./features/arcgis/arcgisSlice";
import { setTempDrawerOpen } from "./features/layout/layoutSlice";
import LeftPanel from "./features/layout/LeftPanel";
import { RootState } from "./store/store";
import Button from "./widgets/Button";

const drawerWidth = "240px";

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
    <Box
      sx={{
        display: "flex",
        height: "100%",
      }}
    >
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          PaperProps={{
            sx: {
              width: drawerWidth,
            },
          }}
          anchor="left"
          variant={matches ? "persistent" : "temporary"}
          open={matches ? true : tempDrawerOpen}
          onClose={handleTempDrawerClose}
        >
          <LeftPanel />
        </Drawer>
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          height: "100%",
        }}
        ref={viewRef}
      ></Box>
    </Box>
  );
}

export default App;
