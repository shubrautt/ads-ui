import { Box, Stack } from "@mui/material";
import { FormikTextField } from "form/FormikHelpers";
import { CountryPicker } from "components/Country/CountryPicker";
import { PropsWithChildren } from "react";
import { useLingui } from "@lingui/react";
import { msg } from "@lingui/macro";

export function AddressField() {
  const { _ } = useLingui();

  return (
    <Box flexGrow={1} width={{ xs: 350, md: 600 }}>
      <FormikTextField
        name="advertiser.name"
        label={_(msg`Business name`)}
        margin="dense"
      />

      <FormikTextField
        name="advertiser.url"
        label={_(msg`Business website`)}
        autoComplete="url"
        margin="dense"
      />

      <FormikTextField
        name="address.street1"
        label={_(msg`Street address`)}
        autoComplete="address-line1"
        margin="dense"
      />

      <FormikTextField
        name="address.street2"
        label={_(msg`Street address line 2`)}
        autoComplete="address-line2"
        margin="dense"
      />

      <StackedFields>
        <FormikTextField
          name="address.city"
          label={_(msg`City`)}
          autoComplete="address-level2"
          margin="dense"
        />

        <FormikTextField
          name="address.state"
          label={_(msg`State / Province`)}
          autoComplete="address-level1"
          margin="dense"
        />
      </StackedFields>

      <Stack direction={{ xs: "column", md: "row" }} spacing={{ xs: 0, md: 1 }}>
        <CountryPicker name="address.country" />

        <FormikTextField
          name="address.zipcode"
          label={_(msg`Zip / Postal Code`)}
          autoComplete="postal-code"
          margin="dense"
          sx={{ width: "100%" }}
        />
      </Stack>
    </Box>
  );
}

function StackedFields(props: PropsWithChildren) {
  return (
    <Stack direction={{ xs: "column", md: "row" }} spacing={{ xs: 0, md: 1 }}>
      {props.children}
    </Stack>
  );
}
