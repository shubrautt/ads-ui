import { object, string } from "yup";
import {
  HttpsRegex,
  NoSpacesRegex,
  PrivateCdnRegex,
  SimpleUrlRegexp,
} from "validation/regex";
import _ from "lodash";
import * as Yup from "yup";

const validTargetUrl = (label: string) =>
  Yup.string()
    .label(label)
    .required("Target URL is a required field")
    .matches(NoSpacesRegex, `URL must not contain any whitespace`)
    .matches(HttpsRegex, `URL must start with https://`)
    .matches(
      SimpleUrlRegexp,
      `Please enter a valid URL, for example https://brave.com`,
    );

export const CreativeSchema = object().shape({
  name: string().label("Ad name").required(),
  type: object().shape({
    code: string()
      .oneOf(["notification_all_v1", "inline_content_all_v1"])
      .label("Ad type")
      .required("Ad type is required"),
    name: string(),
  }),
  state: string()
    .oneOf([
      "draft",
      "active",
      "suspended",
      "under_review",
      "deleted",
      "paused",
    ])
    .label("State")
    .required()
    .default("draft"),
  targetUrlValid: string().test({
    test: (value) => _.isEmpty(value),
    message: ({ value }) => value,
  }),
  payloadNotification: object()
    .nullable()
    .when("type.code", {
      is: "notification_all_v1",
      then: (schema) =>
        schema.required().shape({
          body: string().label("Body").required().max(60),
          targetUrl: validTargetUrl("Target URL"),
          title: string().label("Title").required().max(30),
        }),
    }),
  payloadInlineContent: object()
    .nullable()
    .when("type.code", {
      is: "inline_content_all_v1",
      then: (schema) =>
        schema.required().shape({
          ctaText: string().label("Call to Action text").max(15).required(),
          description: string().label("Description").required(),
          dimensions: string().label("Image Dimensions").required(),
          imageUrl: string()
            .label("Image URL")
            .url()
            .required()
            .matches(PrivateCdnRegex, "URL must be hosted on our private CDN"),
          targetUrl: validTargetUrl("Target URL"),
          title: string().label("Title").max(90).required(),
        }),
    }),
});
