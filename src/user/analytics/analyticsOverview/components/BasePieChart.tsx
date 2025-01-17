import { Box, Tab, Tabs } from "@mui/material";
import { Options, SeriesOptionsType } from "highcharts";
import { Option } from "../types";
import { HighchartsWrapper } from "user/analytics/analyticsOverview/components/HighchartsWrapper";

interface Props {
  series: SeriesOptionsType[];
  onSetType: (t: string) => void;
  extraOptions?: Option[];
  type: string;
}

export function BasePieChart({ series, onSetType, extraOptions, type }: Props) {
  const options: Options = {
    chart: {
      animation: false,
      type: "pie",
    },
    title: {
      text: undefined,
    },
    tooltip: {
      pointFormat: "{point.options.custom.count}",
    },
    accessibility: {
      point: {
        valueSuffix: "%",
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b>: {point.percentage:.1f} %",
        },
      },
    },
    series,
  };

  const tabs: Option[] = [
    { value: "view", label: "Impressions" },
    { value: "conversion", label: "Conversions" },
    { value: "click", label: "Clicks" },
    { value: "landed", label: "Site visits" },
    ...(extraOptions ?? []),
  ];

  return (
    <Box border="1px solid #ededed" borderRadius="4px">
      <Box
        height="50px"
        bgcolor="white"
        borderBottom="1px solid #ededed"
        display="flex"
        justifyContent="left"
      >
        <Tabs
          value={type}
          onChange={(e, v) => {
            onSetType(v);
          }}
          variant="scrollable"
          scrollButtons="auto"
        >
          {tabs.map((t) => (
            <Tab key={t.label} value={t.value} label={t.label} />
          ))}
        </Tabs>
      </Box>
      <HighchartsWrapper options={options} />
    </Box>
  );
}
