import {
  AppBar,
  Box,
  Button,
  CssBaseline,
  Divider,
  Link,
  LinkProps,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import ads from "../../../branding.svg";
import { Link as RouterLink, useRouteMatch } from "react-router-dom";
import { useIsAuthenticated } from "auth/hooks/queries/useIsAuthenticated";
import { useSignOut } from "auth/hooks/mutations/useSignOut";
import { SupportMenu } from "components/Drawer/MiniSideBar";

export function LandingPageAppBar() {
  const match = useRouteMatch();
  const isAuthenticated = useIsAuthenticated();

  const links = [
    {
      component: isAuthenticated ? null : (
        <RouterLink to={"/register"} style={{ textDecoration: "none" }}>
          <Typography variant="subtitle1" color="text.primary">
            Get started
          </Typography>
        </RouterLink>
      ),
    },
    {
      component: (
        <HelpLink
          label="Learn"
          props={{
            href: "https://brave.com/brave-ads",
            target: "_blank",
          }}
        />
      ),
    },
    {
      component: <SupportMenu usePlainLink />,
    },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          bgcolor: "rgba(252, 252, 253, 0.65)",
          boxShadow: "none",
          height: "74px",
          justifyContent: "center",
        }}
      >
        <Toolbar>
          <Stack direction="row" alignItems="center" spacing={3}>
            <RouterLink to="/" style={{ marginTop: 5 }}>
              <img src={ads} alt="Ads" height="31px" width="180px" />
            </RouterLink>
            <Divider orientation="vertical" flexItem sx={{ marginRight: 3 }} />
            {links.map((l) => l.component)}
          </Stack>
          <div style={{ flexGrow: 1 }} />
          {!match.url.includes("auth") && (
            <AuthedButton isAuthenticated={isAuthenticated} />
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}

interface HelpProps {
  label: string;
  props: LinkProps;
}

function HelpLink({ label, props }: HelpProps) {
  return (
    <Link variant="subtitle1" underline="none" color="text.primary" {...props}>
      {label}
    </Link>
  );
}

function AuthedButton(props: { isAuthenticated?: boolean }) {
  const { signOut } = useSignOut();

  return (
    <Button
      variant="outlined"
      size="large"
      component={RouterLink}
      to={!props.isAuthenticated ? "/auth/link" : "/"}
      onClick={props.isAuthenticated ? () => signOut() : undefined}
    >
      {props.isAuthenticated ? "Sign out" : "Log in"}
    </Button>
  );
}