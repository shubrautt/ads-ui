import { ApolloError } from "@apollo/client";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  AlertTitle,
  Box,
  Typography,
} from "@mui/material";
import { MessageDescriptor } from "@lingui/core";
import { Trans } from "@lingui/macro";
import { Trans as TransWithId } from "@lingui/react";

interface Props {
  error?: any;
  additionalDetails?: MessageDescriptor;
}

export const ErrorDetail = ({ error, additionalDetails }: Props) => {
  if (!error) {
    return null;
  }

  // helpful shortcut - if it's a 401, you'll just need to login again
  if (
    error instanceof ApolloError &&
    error.networkError &&
    "statusCode" in error.networkError &&
    error.networkError.statusCode === 401
  ) {
    return (
      <Box mt={2}>
        <Alert severity="warning">
          <AlertTitle>401 Forbidden</AlertTitle>
          <Trans>
            A forbidden error was returned. You may need to log out and back in
            again.
          </Trans>
        </Alert>
      </Box>
    );
  }

  return (
    <Box mt={2}>
      <Alert severity="error">
        <AlertTitle>
          <Trans>Something went wrong.</Trans>
        </AlertTitle>
        <p>
          <Trans>An error has occurred while processing your request.</Trans>
        </p>
        <p>
          <Trans>
            Please try again, or contact our operations team for assistance.
          </Trans>
        </p>
      </Alert>

      {additionalDetails && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Additional Details</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <pre style={{ overflow: "scroll" }}>
              <TransWithId id={additionalDetails.id} />
            </pre>
          </AccordionDetails>
        </Accordion>
      )}
    </Box>
  );
};
