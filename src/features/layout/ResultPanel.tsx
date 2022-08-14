import Graphic from "@arcgis/core/Graphic";
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
import { setTempDrawerOpen } from "../layout/layoutSlice";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";

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
  const dispatch = useDispatch();
  const { features, status } = useSelector((state: RootState) => state.filter);
  const { view } = useSelector((state: RootState) => state.arcgis);
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
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <List>
          {features.map((feature, index) => (
            <ListItemButton
              key={index}
              onClick={() => handleResultClick(feature, index)}
            >
              <ListItemText
                primary={feature.attributes.Park}
                secondary={`${feature.attributes.TOTAL.toLocaleString()} visitors`}
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
