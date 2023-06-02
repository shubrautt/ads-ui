import { Container, LinearProgress } from "@mui/material";
import { Formik } from "formik";
import React from "react";
import { CampaignForm } from "../../../../types";
import { CampaignSchema } from "validation/CampaignSchema";
import { editCampaignValues, transformEditForm } from "user/library";
import {
  useLoadCampaignQuery,
  useUpdateCampaignMutation,
} from "graphql/campaign.generated";
import { useHistory, useParams } from "react-router-dom";
import { BaseForm } from "./components/BaseForm";
import { useAdvertiser } from "auth/hooks/queries/useAdvertiser";
import { useUser } from "auth/hooks/queries/useUser";
import { ErrorDetail } from "components/Error/ErrorDetail";

interface Params {
  campaignId: string;
}

export function EditCampaign() {
  const { advertiser } = useAdvertiser();
  const { userId } = useUser();
  const history = useHistory();
  const params = useParams<Params>();

  const { data, loading, error } = useLoadCampaignQuery({
    variables: { id: params.campaignId },
    fetchPolicy: "cache-and-network",
  });

  const [mutation] = useUpdateCampaignMutation({
    onCompleted() {
      history.push("/user/main/complete/edit");
    },
    onError() {
      alert("Unable to Update Campaign.");
    },
  });

  if (error) {
    return (
      <ErrorDetail
        error={error}
        additionalDetails="Campaign does not exist, or cannot be edited. Please try again later."
      />
    );
  }

  if (!data || !data.campaign || loading) {
    return <LinearProgress />;
  }

  const initialValues = editCampaignValues(data.campaign);

  return (
    <Container maxWidth="xl">
      <Formik
        initialValues={initialValues}
        onSubmit={async (v: CampaignForm, { setSubmitting }) => {
          setSubmitting(true);
          let editForm;
          try {
            editForm = await transformEditForm(
              v,
              params.campaignId,
              advertiser.id,
              userId
            );
          } catch (e) {
            alert("Unable to Update Campaign.");
          }

          if (editForm) {
            await mutation({ variables: { input: editForm } });
          }
          setSubmitting(false);
        }}
        validationSchema={CampaignSchema}
      >
        <BaseForm isEdit={true} />
      </Formik>
    </Container>
  );
}
