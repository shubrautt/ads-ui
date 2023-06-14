import { Form, FormikValues, useFormikContext } from "formik";
import { Box, Button, Stack, Tab, Tabs } from "@mui/material";
import { CampaignFields } from "../../campaign/CampaignFields";
import { AdSetFields } from "../../adSet/AdSetFields";
import { AdField } from "../../ads/AdField";
import { Review } from "../../review/Review";
import React, { useState } from "react";
import { CampaignForm } from "../../../../../types";
import { DeleteDraft } from "./DeleteDraft";
import { DashboardIconButton } from "components/Button/DashboardIconButton";

interface Props {
  isEdit: boolean;
  draftId?: string;
}

export function BaseForm({ isEdit, draftId }: Props) {
  const { values } = useFormikContext<CampaignForm>();
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const showCard = (values: FormikValues) => {
    return value > 0 && value !== values.adSets.length + 1;
  };

  return (
    <Form>
      <Stack alignItems="center" direction="row" justifyContent="space-between">
        <Stack alignItems="center" direction="row">
          <DashboardIconButton />
          <Tabs value={value} onChange={handleChange}>
            <Tab label="Campaign" value={0} />
            {values.adSets.map((a, index) => (
              <Tab
                key={`adset-${index}`}
                label={`Ad Set ${index + 1}`}
                value={index + 1}
              />
            ))}
            <Tab label="Review" value={values.adSets.length + 1} />
          </Tabs>
        </Stack>
        {draftId && !isEdit && <DeleteDraft draftId={draftId} />}
      </Stack>

      <Box>
        {value === 0 && (
          <CampaignFields onNext={() => setValue(value + 1)} isEdit={isEdit} />
        )}

        {showCard(values) && (
          <>
            <AdSetFields
              tabValue={value}
              onRemove={() => setValue(value - 1)}
              onCreate={() => setValue(value + 1)}
              isEdit={isEdit}
            />
            <AdField index={value - 1} isEdit={isEdit} />
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => setValue(values.adSets.length + 1)}
              >
                Next
              </Button>
            </Box>
          </>
        )}
      </Box>

      {value === values.adSets.length + 1 && <Review isEdit={isEdit} />}
    </Form>
  );
}
