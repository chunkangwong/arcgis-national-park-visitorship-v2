import RefreshIcon from "@mui/icons-material/Refresh";
import {
  Card,
  CardActions,
  Collapse,
  Divider,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  Slider,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import {
  filterItems,
  resetDefault,
  setCount,
  setOrderBy,
  setYear,
  OrderBy,
  Year,
} from "./filterSlice";

const marks = [
  {
    value: 1,
    label: "1",
  },
  {
    value: 2,
    label: "2",
  },
  {
    value: 3,
    label: "3",
  },
  {
    value: 4,
    label: "4",
  },
  {
    value: 5,
    label: "5",
  },
];

function valuetext(value: number) {
  return `${value + 1}`;
}

export default function FilterPanel() {
  const dispatch = useDispatch();
  const { orderBy, count, year, status } = useSelector(
    (state: RootState) => state.filter
  );
  const { layerView, featureLayer } = useSelector(
    (state: RootState) => state.arcgis
  );
  const [expanded, setExpanded] = React.useState(true);

  React.useEffect(() => {
    if (status === "idle") {
      dispatch(
        filterItems({
          orderBy,
          count,
          year,
          layerView,
          featureLayer,
        }) as any
      );
    }
  }, [status, dispatch, layerView]);

  function handleOrderByChange(event: React.MouseEvent<HTMLElement>) {
    const target = event.target as HTMLButtonElement;
    dispatch(setOrderBy(target.value as OrderBy));
    dispatch(
      filterItems({
        orderBy,
        count,
        year,
        layerView,
        featureLayer,
      }) as any
    );
  }

  function handleYearChange(event: SelectChangeEvent) {
    dispatch(setYear(event.target.value as Year));
    dispatch(
      filterItems({
        orderBy,
        count,
        year,
        layerView,
        featureLayer,
      }) as any
    );
  }

  function handleCountChange(
    event: React.SyntheticEvent | Event,
    value: number | number[]
  ) {
    dispatch(setCount(value as number));
  }

  function handleCountChangeCommitted(
    event: React.SyntheticEvent | Event,
    value: number | number[]
  ) {
    dispatch(setCount(value as number));
    dispatch(
      filterItems({
        orderBy,
        count,
        year,
        layerView,
        featureLayer,
      }) as any
    );
  }

  function handleResetDefault() {
    dispatch(resetDefault());
    dispatch(
      filterItems({
        orderBy,
        count,
        year,
        layerView,
        featureLayer,
      }) as any
    );
  }

  return (
    <Card>
      <CardActions disableSpacing>
        <Typography>Filters</Typography>
        <IconButton
          aria-label="reset"
          color="primary"
          onClick={handleResetDefault}
          sx={{ marginLeft: "auto" }}
          disabled={orderBy === "ASC" && year === "TOTAL" && count === 1}
        >
          <RefreshIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Stack
          direction="column"
          spacing={2}
          m={2}
          divider={<Divider orientation="horizontal" flexItem />}
        >
          <div>
            <Typography>Data type, per state</Typography>
            <ToggleButtonGroup
              color="primary"
              value={orderBy}
              exclusive
              onChange={handleOrderByChange}
              size="small"
              fullWidth
            >
              <ToggleButton value="ASC">Most visited</ToggleButton>
              <ToggleButton value="DESC">Least visited</ToggleButton>
            </ToggleButtonGroup>
          </div>
          <div>
            <Typography>Year data to display</Typography>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={year}
              onChange={handleYearChange}
              fullWidth
              inputProps={{ "aria-label": "Without label" }}
            >
              <MenuItem value="TOTAL">Total of all time</MenuItem>
              <MenuItem value="F2018">2018</MenuItem>
              <MenuItem value="F2019">2019</MenuItem>
              <MenuItem value="F2020">2020</MenuItem>
            </Select>
          </div>
          <div>
            <Typography>Max parks per state</Typography>
            <Slider
              aria-label="Always visible"
              defaultValue={1}
              step={1}
              marks={marks}
              getAriaValueText={valuetext}
              valueLabelDisplay="off"
              min={1}
              max={5}
              onChange={handleCountChange}
              onChangeCommitted={handleCountChangeCommitted}
              value={count}
            />
          </div>
        </Stack>
      </Collapse>
    </Card>
  );
}
