import { Box, Drawer, useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useRef } from "react";
import { useArcgis } from "./store/arcgisStore";
import LeftPanel from "./components/LeftPanel";
import { useLayout } from "./store/layoutStore";
import ExpandButton from "./widgets/ExpandButton";

const drawerWidth = "240px";

function App() {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));
  const mapView = useArcgis((state) => state.mapView);
  const { tempDrawerOpen, setTempDrawerOpen } = useLayout();

  const viewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mapView.container = viewRef.current as HTMLDivElement;
  }, []);

  useEffect(() => {
    mapView.when(() => {
      if (!matches) {
        ExpandButton.addEventListener("click", () => {
          setTempDrawerOpen(true);
        });
        mapView.ui.add(ExpandButton, "top-left");
      } else {
        mapView.ui.remove(ExpandButton);
      }
    });
  }, [mapView, matches]);

  function handleTempDrawerClose() {
    setTempDrawerOpen(false);
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
