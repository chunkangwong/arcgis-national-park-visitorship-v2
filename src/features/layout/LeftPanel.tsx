import { Paper, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import FilterPanel from "../filter/FilterPanel";
import ResultPanel from "../layout/ResultPanel";

export default function LeftPanel() {
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
      <ResultPanel />
    </Stack>
  );
}
