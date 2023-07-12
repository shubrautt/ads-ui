import {
  AdvertiserCampaignFilter,
  CampaignFormat,
  CreateAdInput,
  CreateAdSetInput,
  CreateCampaignInput,
  CreateNotificationCreativeInput,
  GeocodeInput,
  UpdateAdSetInput,
  UpdateCampaignInput,
  UpdateNotificationCreativeInput,
} from "graphql/types";
import axios from "axios";
import { DocumentNode, print } from "graphql";
import { CampaignFragment } from "graphql/campaign.generated";
import { AdFragment, CreateAdDocument } from "graphql/ad-set.generated";
import {
  CreateNotificationCreativeDocument,
  UpdateNotificationCreativeDocument,
} from "graphql/creative.generated";
import {
  Billing,
  CampaignForm,
  Conversion,
  Creative,
  initialCreative,
  OS,
  Segment,
} from "user/views/adsManager/types";
import _ from "lodash";
import { renderStatsCell } from "user/analytics/renderers";
import { ColumnDescriptor } from "components/EnhancedTable";
import { AdDetails } from "user/ads/AdList";
import { EngagementFragment } from "graphql/analytics-overview.generated";
import { StatsMetric } from "user/analytics/analyticsOverview/types";

const TYPE_CODE_LOOKUP: Record<string, string> = {
  notification_all_v1: "Push Notification",
  new_tab_page_all_v1: "New Tab Takeover",
  inline_content_all_v1: "News Display Ad",
  search_all_v1: "Search SERP",
  search_homepage_all_v1: "Search Homepage",
};

export function transformNewForm(
  form: CampaignForm,
  userId?: string,
): CreateCampaignInput {
  return {
    currency: form.currency,
    dailyCap: form.dailyCap,
    dailyBudget: form.dailyBudget,
    endAt: form.endAt,
    pacingStrategy: form.pacingStrategy,
    geoTargets: form.geoTargets.map((g) => ({ code: g.code, name: g.name })),
    name: form.name,
    advertiserId: form.advertiserId,
    externalId: "",
    format: form.format,
    userId: userId,
    source: "self_serve",
    startAt: form.startAt,
    state: form.state,
    type: form.type,
    budget: form.budget,
    adSets: form.adSets.map((adSet) => ({
      name: adSet.name,
      billingType: form.billingType,
      execution: "per_click",
      perDay: 1,
      segments: adSet.segments.map((s) => ({ code: s.code, name: s.name })),
      oses: adSet.oses,
      totalMax: 10,
      conversions: transformConversion(adSet.conversions),
      ads: adSet.creatives.map((ad) => transformCreative(ad, form)),
    })),
    paymentType: form.paymentType,
  };
}

function transformConversion(conv: Conversion[]) {
  if (conv.length <= 0) {
    return [];
  }

  return conv.map((c) => ({
    observationWindow: c.observationWindow * 1.0,
    urlPattern: c.urlPattern,
    type: c.type,
  }));
}

function transformCreative(
  creative: Creative,
  campaign: CampaignForm,
): CreateAdInput {
  return {
    webhooks: [],
    creativeId: creative.id!,
    prices: [
      {
        amount: campaign.price,
        type: campaign.billingType === "cpc" ? "click" : "view",
      },
    ],
  };
}

export function creativeInput(
  advertiserId: string,
  creative: Creative,
  userId?: string,
): CreateNotificationCreativeInput | UpdateNotificationCreativeInput {
  const baseNotification = {
    advertiserId,
    userId,
    name: creative.name,
    payload: {
      title: creative.title,
      body: creative.body,
      targetUrl: creative.targetUrl,
    },
    state: creative.state,
  };

  if (creative.id) {
    return {
      ...baseNotification,
      creativeId: creative.id,
    };
  }

  return {
    ...baseNotification,
    type: {
      code: "notification_all_v1",
    },
  };
}

export function editCampaignValues(
  campaign: CampaignFragment,
  advertiserId: string,
): CampaignForm {
  const ads: AdFragment[] = _.flatMap(campaign.adSets, "ads");

  return {
    adSets: campaign.adSets.map((adSet) => {
      const seg = adSet.segments ?? ([] as Segment[]);

      return {
        ...adSet,
        id: adSet.id,
        conversions: adSet.conversions ?? [],
        oses: adSet.oses ?? ([] as OS[]),
        segments: adSet.segments ?? ([] as Segment[]),
        isNotTargeting: seg.length === 1 && seg[0].code === "Svp7l-zGN",
        name: adSet.name || adSet.id.split("-")[0],
        creatives: creativeList(adSet.ads),
      };
    }),
    advertiserId,
    creatives: creativeList(ads).map((a) => a.id!),
    newCreative: initialCreative,
    isCreating: false,
    price: campaign.adSets[0].ads?.[0].prices[0].amount ?? 6,
    billingType: (campaign.adSets[0].billingType ?? "cpm") as Billing,
    validateStart: false,
    budget: campaign.budget,
    currency: campaign.currency,
    dailyBudget: campaign.dailyBudget,
    dailyCap: campaign.dailyCap,
    endAt: campaign.endAt,
    format: campaign.format,
    geoTargets: campaign.geoTargets ?? ([] as GeocodeInput[]),
    name: campaign.name,
    pacingStrategy: campaign.pacingStrategy,
    startAt: campaign.startAt,
    state: campaign.state,
    type: "paid",
    stripePaymentId: campaign.stripePaymentId,
    paymentType: campaign.paymentType,
  };
}

function creativeList(ads?: AdFragment[] | null): Creative[] {
  return _.uniqBy(
    (ads ?? [])
      .filter((ad) => ad.creative != null && ad.state !== "deleted")
      .map((ad) => {
        const c = ad.creative;
        return {
          creativeInstanceId: ad.id,
          id: c.id,
          name: c.name,
          targetUrl: c.payloadNotification!.targetUrl,
          title: c.payloadNotification!.title,
          body: c.payloadNotification!.body,
          targetUrlValidationResult: "",
          state: c.state,
        };
      }),
    "id",
  );
}

export function transformEditForm(
  form: CampaignForm,
  id: string,
): UpdateCampaignInput {
  return {
    budget: form.budget,
    currency: form.currency,
    dailyBudget: form.dailyBudget,
    dailyCap: form.dailyCap,
    endAt: form.endAt,
    id,
    name: form.name,
    startAt: form.startAt,
    state: form.state,
    type: form.type,
    adSets: form.adSets.map((adSet) => ({
      id: adSet.id,
      segments: adSet.segments.map((v) => ({ code: v.code, name: v.name })),
      oses: adSet.oses.map((v) => ({ code: v.code, name: v.name })),
      ads: adSet.creatives.map((ad) => ({
        ...transformCreative(ad, form),
        id: ad.creativeInstanceId,
        creativeSetId: adSet.id,
      })),
    })),
  };
}

export function uiTextForCreativeType(creativeType: string): string {
  return TYPE_CODE_LOOKUP[creativeType] ?? creativeType;
}

export const CAMPAIGN_FORMATS = [
  { value: CampaignFormat.PushNotification, label: "Push Notification" },
  { value: CampaignFormat.NtpSi, label: "New Tab Takeover" },
  { value: CampaignFormat.NewsDisplayAd, label: "News Display" },
  { value: CampaignFormat.Search, label: "Search SERP" },
  { value: CampaignFormat.SearchHomepage, label: "Search Homepage" },
];

export function uiTextForCampaignFormat(format: CampaignFormat): string {
  return CAMPAIGN_FORMATS.find((f) => f.value === format)?.label ?? format;
}

export function uiTextForCreativeTypeCode(creativeTypeCode: {
  code: string;
}): string {
  return uiTextForCreativeType(creativeTypeCode.code);
}
