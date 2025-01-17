import {
  AnyObject,
  array,
  boolean,
  date,
  number,
  object,
  ref,
  string,
  StringSchema,
} from "yup";
import { differenceInHours, startOfDay } from "date-fns";
import { twoDaysOut } from "form/DateFieldHelpers";
import {
  HttpsRegex,
  NoSpacesRegex,
  SimpleUrlRegexp,
  TrailingAsteriskRegex,
} from "validation/regex";
import { CreativeSchema } from "validation/CreativeSchema";
import { CampaignFormat } from "graphql/types";
import BigNumber from "bignumber.js";
import { AdvertiserPrice } from "user/hooks/useAdvertiserWithPrices";
import { Billing } from "user/views/adsManager/types";
import { uiLabelsForCampaignFormat } from "util/campaign";

export const MIN_PER_DAY = 33;
export const MIN_PER_CAMPAIGN = 500;

export const CampaignSchema = (prices: AdvertiserPrice[]) =>
  object().shape({
    name: string().label("Campaign Name").required(),
    format: string()
      .label("Campaign Format")
      .oneOf([CampaignFormat.NewsDisplayAd, CampaignFormat.PushNotification])
      .required(),
    budget: number()
      .label("Lifetime Budget")
      .required()
      .min(
        MIN_PER_CAMPAIGN,
        `Lifetime budget must be $${MIN_PER_CAMPAIGN} or more`,
      )
      .when(["startAt", "endAt"], ([startAt, endAt], schema) => {
        const campaignRuntime = Math.floor(
          differenceInHours(new Date(endAt), new Date(startAt)) / 24,
        );
        const hasRuntime = campaignRuntime > 0;

        return schema.test(
          "is-valid-budget",
          `Lifetime budget must be higher for date range provided. Minimum $${MIN_PER_DAY * campaignRuntime}.`,
          (value) =>
            hasRuntime
              ? BigNumber(value).div(campaignRuntime).gte(MIN_PER_DAY)
              : true,
        );
      }),
    newCreative: object().when("isCreating", {
      is: true,
      then: () => CreativeSchema,
    }),
    validateStart: boolean(),
    startAt: date()
      .label("Start Date")
      .when("validateStart", {
        is: true,
        then: (schema) =>
          schema
            .min(
              startOfDay(twoDaysOut()),
              "Start Date must be minimum of 2 days from today",
            )
            .required(),
      }),
    endAt: date()
      .label("End Date")
      .required()
      .min(ref("startAt"), "End date must be after Start date"),
    geoTargets: array()
      .label("Locations")
      .of(
        object().shape({
          code: string().required(),
          name: string().required(),
        }),
      )
      .min(1, "At least one country must be targeted")
      .default([]),
    price: string()
      .label("Price")
      .when(["billingType", "format"], ([billingType, format], schema) => {
        return validatePriceByBillingTypeAndFormat(
          prices,
          format,
          billingType,
          schema,
        );
      })
      .required("Price is a required field"),
    billingType: string()
      .label("Pricing Type")
      .oneOf(["cpm", "cpc", "cpsv"])
      .required("Pricing type is a required field"),
    adSets: array()
      .min(1)
      .of(
        object().shape({
          name: string().label("Ad set Name").optional(),
          segments: array()
            .label("Audiences")
            .of(
              object().shape({
                code: string().required(),
                name: string().required(),
              }),
            )
            .min(1, "At least one audience must be targeted")
            .default([]),
          oses: array()
            .label("Platforms")
            .of(
              object().shape({
                code: string().required(),
                name: string().required(),
              }),
            )
            .min(1, "At least one platform must be targeted")
            .default([]),
          conversions: array()
            .label("Conversions")
            .min(0)
            .max(1)
            .of(
              object().shape({
                urlPattern: string()
                  .required("Conversion URL required.")
                  .matches(
                    NoSpacesRegex,
                    `Conversion URL must not contain any whitespace`,
                  )
                  .matches(
                    HttpsRegex,
                    `Conversion URL must start with https://`,
                  )
                  .matches(
                    SimpleUrlRegexp,
                    `Please enter a valid URL, for example https://brave.com/product/*`,
                  )
                  .matches(
                    TrailingAsteriskRegex,
                    "Conversion URL must end in trailing asterisk (*)",
                  ),
                observationWindow: number()
                  .oneOf(
                    [1, 7, 30],
                    "Observation Window must be 1, 7, or 30 days.",
                  )
                  .required("Observation Window required."),
                type: string()
                  .oneOf(
                    ["postclick", "postview"],
                    "Conversion type must be Post Click or Post View",
                  )
                  .required("Conversion Type required."),
              }),
            ),
          creatives: array().test(
            "min-length",
            "Ad sets must have at least one ad",
            (value) => (value ?? []).filter((c) => c.included).length > 0,
          ),
        }),
      ),
  });

export function validatePriceByBillingTypeAndFormat(
  prices: AdvertiserPrice[],
  format: CampaignFormat,
  billingType: Billing,
  schema: StringSchema<string | undefined, AnyObject, undefined, "">,
) {
  const found = prices.find(
    (p) => p.format === format && p.billingType === billingType,
  );

  if (!found) {
    return schema.test(
      "is-defined",
      `No ${billingType} pricing available for ${uiLabelsForCampaignFormat(
        format,
      )}, contact selfserve@brave.com for help`,
      () => false,
    );
  }

  const price = BigNumber(found.billingModelPrice);
  return schema.test(
    "is-lte-price",
    `${billingType} price must be ${price} or higher`,
    (value) => (value ? price.isLessThanOrEqualTo(value) : true),
  );
}
