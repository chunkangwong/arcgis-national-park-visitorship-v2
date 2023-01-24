import { Box, Drawer, useMediaQuery, useTheme } from "@mui/material";
import * as React from "react";
import { view } from "./arcgis";
import LeftPanel from "./components/LeftPanel";
import { setTempDrawerOpen } from "./features/layout/layoutSlice";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import ExpandButton from "./widgets/ExpandButton";

const drawerWidth = "240px";

function App() {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));
  const { tempDrawerOpen } = useAppSelector((state) => state.layout);

  const viewRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    view.container = viewRef.current as HTMLDivElement;
  }, []);

  React.useEffect(() => {
    view.when(() => {
      if (!matches) {
        ExpandButton.addEventListener("click", () => {
          dispatch(setTempDrawerOpen(true));
        });
        view.ui.add(ExpandButton, "top-left");
      } else {
        view.ui.remove(ExpandButton);
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
