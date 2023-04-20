import * as React from "react";
import CampaignIcon from "@mui/icons-material/Campaign";
import DatasetIcon from "@mui/icons-material/Dataset";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import {
  Box,
  CssBaseline,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { useHistory } from "react-router-dom";
import { Navbar } from "../navbar/Navbar";
import { useAdvertiser } from "../../../auth/hooks/queries/useAdvertiser";

const drawerWidth = 240;

export function Sidebar() {
  const { advertiser } = useAdvertiser();
  const history = useHistory();

  const routes = [
    { path: "campaigns", label: "Campaigns", icon: <CampaignIcon /> },
    { path: "adSets", label: "Ad Sets", icon: <DatasetIcon /> },
    { path: "ads", label: "Ads", icon: <LibraryBooksIcon /> },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Navbar canCreate={advertiser.selfServiceCreate} />
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <List sx={{ mt: 7 }}>
          {routes.map((r) => (
            <ListItemButton
              selected={history.location.pathname === `/user/main/${r.path}`}
              onClick={() => {
                history.push(`/user/main/${r.path}`);
              }}
              sx={{ mt: 1 }}
              key={r.path}
            >
              <ListItemText disableTypography>
                <Typography variant="h6">{r.label}</Typography>
              </ListItemText>
              <ListItemIcon>{r.icon}</ListItemIcon>
            </ListItemButton>
          ))}
        </List>
      </Drawer>
    </Box>
  );
}
