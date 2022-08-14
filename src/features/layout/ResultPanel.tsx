import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Avatar,
  Card,
  CardActions,
  Collapse,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import * as React from "react";
import { useSelector } from "react-redux";
import { ExpandMore } from "../../components/ExpandMore";
import { RootState } from "../../store/store";

export default function ResultPanel() {
  const { features } = useSelector((state: RootState) => state.filter);
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card>
      <CardActions disableSpacing>
        <Typography>Results</Typography>
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
            <ListItem key={index}>
              <ListItemText
                primary={feature.attributes.Park}
                secondary={`${feature.attributes.TOTAL.toLocaleString()} visitors`}
              />
              <ListItemAvatar>
                <Avatar>{feature.attributes.State}</Avatar>
              </ListItemAvatar>
            </ListItem>
          ))}
        </List>
      </Collapse>
    </Card>
  );
}
