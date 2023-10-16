import { ComponentType, useMemo, useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";
import Settings from "./settings/Settings";
import { Box } from "@mui/material";
import { NewCampaign } from "./views/adsManager/views/advanced/components/form/NewCampaign";
import { EditCampaign } from "./views/adsManager/views/advanced/components/form/EditCampaign";
import { CompletionForm } from "./views/adsManager/views/advanced/components/completionForm/CompletionForm";
import { AdvertiserAgreed } from "auth/components/AdvertiserAgreed";
import { useAdvertiser } from "auth/hooks/queries/useAdvertiser";
import { Navbar } from "components/Navigation/Navbar";
import { CampaignView } from "user/views/user/CampaignView";
import { CampaignReportView } from "user/views/user/CampaignReportView";
import { Profile } from "user/views/user/Profile";
import { IAdvertiser } from "auth/context/auth.interface";
import moment from "moment";
import { FilterContext } from "state/context";
import { AdvertiserAssets } from "components/Assets/AdvertiserAssets";
import { CreativeList } from "components/Creatives/CreativeList";
import { CreativeForm } from "components/Creatives/CreativeForm";

const buildApolloClient = () => {
  const httpLink = createHttpLink({
    uri: `${import.meta.env.REACT_APP_SERVER_ADDRESS}`.replace("v1", "graphql"),
    credentials: "include",
  });

  return new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
  });
};

export function User() {
  const client = useMemo(() => buildApolloClient(), []);
  const [fromDate, setFromDate] = useState<Date | null>(
    moment().subtract(6, "month").startOf("day").toDate(),
  );

  return (
    <ApolloProvider client={client}>
      <FilterContext.Provider
        value={{
          fromDate,
          setFromDate,
        }}
      >
        <Box display="flex" height="100vh" width="100vw" flexDirection="row">
          <Navbar />
          <Box
            flex={1}
            component="main"
            marginTop="64px"
            height="calc(100% - 64px)"
            overflow="auto"
            padding={1}
            // this is flexing vertically, so that screens that wish to be
            // exactly in viewport without scrollbars can set flex=1 on the
            // child they wish to fill the screen with
            display="flex"
            flexDirection="column"
            bgcolor="background.default"
          >
            <Switch>
              {/* /adsmanager */}
              <ProtectedRoute
                path="/user/main/adsmanager/advanced/new/:draftId"
                authedComponent={NewCampaign}
                validateAdvertiserProperty={(a) => a.selfServiceManageCampaign}
              />

              <ProtectedRoute
                path="/user/main/adsmanager/advanced/:campaignId"
                authedComponent={EditCampaign}
                validateAdvertiserProperty={(a) => a.selfServiceManageCampaign}
              />

              <ProtectedRoute
                path="/user/main/creative/:id"
                authedComponent={CreativeForm}
                validateAdvertiserProperty={(a) => a.selfServiceManageCampaign}
              />

              <ProtectedRoute
                path="/user/main/complete/:mode"
                authedComponent={CompletionForm}
              />

              {/* /campaigns/:campaignId/analytics - */}
              <ProtectedRoute
                path="/user/main/campaign/:campaignId"
                authedComponent={CampaignReportView}
              />

              <Route path="/user/main/settings" component={Settings} />

              <Route path="/user/main/profile" component={Profile} />

              <ProtectedRoute
                path="/user/main/campaign"
                authedComponent={CampaignView}
                unauthedComponent={AdvertiserAgreed}
              />

              <ProtectedRoute
                path="/user/main/assets"
                authedComponent={AdvertiserAssets}
              />

              <ProtectedRoute
                path="/user/main/creatives"
                authedComponent={CreativeList}
              />

              {/* default */}
              <Redirect to="/user/main/campaign" />
            </Switch>
          </Box>
        </Box>
      </FilterContext.Provider>
    </ApolloProvider>
  );
}

interface ProtectedProps {
  authedComponent?: ComponentType;
  unauthedComponent?: ComponentType;
  path?: string;
  validateAdvertiserProperty?: (a: IAdvertiser) => boolean;
}

const ProtectedRoute = ({
  authedComponent,
  unauthedComponent,
  path,
  validateAdvertiserProperty = () => true,
}: ProtectedProps) => {
  const { advertiser } = useAdvertiser();

  if (!advertiser.agreed && unauthedComponent === undefined) {
    return <Redirect to="/user/main" />;
  }

  if (!validateAdvertiserProperty(advertiser)) {
    return <Redirect to="/user/main" />;
  }

  return (
    <Route
      path={path}
      component={advertiser.agreed ? authedComponent : unauthedComponent}
    />
  );
};
