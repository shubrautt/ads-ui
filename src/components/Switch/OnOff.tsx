import { isPast, parseISO } from "date-fns";
import { Switch, Tooltip, Typography } from "@mui/material";
import { CampaignSource } from "graphql/types";

interface Props {
  onChange: (s: string) => void;
  loading: boolean;
  state: string;
  end: string;
  type: string;
  source: CampaignSource;
  isInline?: boolean;
}

export function OnOff({
  state,
  loading,
  end,
  onChange,
  type,
  source,
  isInline,
}: Props) {
  const isAfterEnd = isPast(parseISO(end));
  const enabled =
    source === CampaignSource.SelfServe &&
    (state === "active" || state === "paused") &&
    !isAfterEnd;

  const DisabledDisplay = () =>
    isInline ? null : (
      <Typography sx={{ textAlign: "center", p: 0 }}>-</Typography>
    );
  const tooltip = state === "paused" ? "Pause" : "Activate";

  return (
    <Tooltip
      title={
        enabled ? `${tooltip} ${type}` : `${type} status cannot be updated`
      }
    >
      <span>
        {enabled ? (
          <Switch
            onChange={(e) => {
              const theState = e.target.checked ? "active" : "paused";
              onChange(theState);
            }}
            checked={state === "active"}
            disabled={loading}
          />
        ) : (
          <DisabledDisplay />
        )}
      </span>
    </Tooltip>
  );
}
