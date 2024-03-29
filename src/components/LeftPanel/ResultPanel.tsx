import { view } from "@/arcgis";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import Graphic from "@arcgis/core/Graphic";
import { setTempDrawerOpen } from "@features/layout/layoutSlice";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Avatar,
  Card,
  CardActions,
  Collapse,
  IconButton,
  IconButtonProps,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/system";
import * as React from "react";

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

export const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function ResultPanel() {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { features, status, year } = useAppSelector((state) => state.filter);
  const [expanded, setExpanded] = React.useState(true);
  const matches = useMediaQuery(theme.breakpoints.up("sm"));

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  function handleResultClick(feature: Graphic, index: number) {
    const popup = features && features[index];
    if (popup) {
      if (!matches) {
        dispatch(setTempDrawerOpen(false));
      }
      view.popup.open({
        features: [popup],
        location: popup.geometry,
      });
      view.goTo(
        {
          center: [
            (feature.geometry as __esri.Point).longitude,
            (feature.geometry as __esri.Point).latitude,
          ],
          zoom: 4,
        },
        { duration: 400 }
      );
    }
  }

  return (
    <Card>
      <CardActions disableSpacing>
        <Typography>
          Results {status === "succeeded" ? `(${features.length})` : "(...)"}
        </Typography>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse
        in={status === "loading" ? false : expanded}
        timeout="auto"
        unmountOnExit
      >
        <List>
          {features.map((feature, index) => (
            <ListItemButton
              key={index}
              onClick={() => handleResultClick(feature, index)}
            >
              <ListItemText
                primary={feature.attributes.Park}
                secondary={
                  feature.attributes[year]
                    ? `${feature.attributes[year].toLocaleString()} visitors`
                    : ""
                }
              />
              <ListItemAvatar>
                <Avatar>{feature.attributes.State}</Avatar>
              </ListItemAvatar>
            </ListItemButton>
          ))}
        </List>
      </Collapse>
    </Card>
  );
}
