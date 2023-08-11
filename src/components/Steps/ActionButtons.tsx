import { Button, Stack } from "@mui/material";
import { useContext } from "react";
import { DraftContext } from "state/context";
import { useHistory } from "react-router-dom";
import { useFormikContext } from "formik";
import { CampaignForm } from "user/views/adsManager/types";

export function ActionButtons() {
  const history = useHistory();
  const { values } = useFormikContext<CampaignForm>();
  const { setDrafts } = useContext(DraftContext);

  return (
    <Stack mt={3} spacing={2} mr={1}>
      <Button size="small" onClick={() => history.push("/user/main")}>
        Return to dashboard
      </Button>
      {values.draftId !== undefined && (
        <Button
          size="small"
          color="error"
          sx={{ mr: 1 }}
          onClick={() => {
            localStorage.removeItem(values.draftId!);
            setDrafts();
            history.push("/user/main");
          }}
        >
          Discard campaign
        </Button>
      )}
    </Stack>
  );
}
