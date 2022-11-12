import { useLayout } from "@/store/layoutStore";
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

interface ResultPanel {
  features?: Graphic[];
  status: "loading" | "error" | "success";
}

export default function ResultPanel({ features, status }: ResultPanel) {
  const theme = useTheme();
  const [expanded, setExpanded] = React.useState(true);
  const matches = useMediaQuery(theme.breakpoints.up("sm"));
  const setTempDrawerOpen = useLayout((state) => state.setTempDrawerOpen);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  function handleResultClick(feature: Graphic, index: number) {
    const popup = features && features[index];
    if (popup) {
      if (!matches) {
        setTempDrawerOpen(false);
      }
      window.view.popup.open({
        features: [popup],
        location: popup.geometry,
      });
      window.view.goTo(
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
          Results {status === "success" ? `(${features?.length})` : "(...)"}
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
          {features?.map((feature, index) => (
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
