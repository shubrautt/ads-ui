import {
  CampaignFormat,
  CreateCampaignInput,
  UpdateCampaignInput,
} from "graphql/types";
import { CampaignFragment } from "graphql/campaign.generated";
import { AdFragment, AdSetFragment } from "graphql/ad-set.generated";
import {
  AdSetForm,
  Billing,
  CampaignForm,
  Conversion,
  Creative,
  initialCreative,
  Segment,
} from "user/views/adsManager/types";
import _ from "lodash";
import BigNumber from "bignumber.js";
import { CreativeFragment } from "graphql/creative.generated";
import moment from "moment";

const TYPE_CODE_LOOKUP: Record<string, string> = {
  notification_all_v1: "Notification",
  new_tab_page_all_v1: "New tab takeover",
  inline_content_all_v1: "Newsfeed",
  search_all_v1: "Search keyword",
  search_homepage_all_v1: "Search homepage",
};

export function transformNewForm(
  form: CampaignForm,
  userId?: string,
): CreateCampaignInput {
  return {
    currency: form.currency,
    externalId: "",
    dailyCap: dailyLimit(form.format),
    endAt: form.endAt,
    geoTargets: form.geoTargets.map((g) => ({ code: g.code, name: g.name })),
    name: form.name,
    advertiserId: form.advertiserId,
    format: form.format,
    userId: userId,
    source: "self_serve",
    startAt: form.startAt,
    state: form.state,
    budget: form.budget,
    adSets: form.adSets.map((a) => ({
      ...transformAdSet(a, form),
      conversions: transformConversion(a.conversions),
      ads: a.creatives
        .filter(
          (c) =>
            c.included &&
            isCreativeTypeApplicableToCampaignFormat(c.type, form.format),
        )
        .map((ad) => ({ creativeId: ad.id })),
    })),
    paymentType: form.paymentType,
  };
}

export const transformPrice = (
  f: Pick<CampaignForm, "price" | "billingType">,
) => {
  const price = BigNumber(f.price);
  return f.billingType === "cpm"
    ? price.dividedBy(1000).toString()
    : price.toString();
};

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

export function editCampaignValues(
  campaign: CampaignFragment,
  advertiserId: string,
): CampaignForm {
  const sort = (a: AdSetFragment, b: AdSetFragment) =>
    moment(a.createdAt).valueOf() - moment(b.createdAt).valueOf();
  const ads: AdFragment[] = _.flatMap(campaign.adSets, "ads");

  const billingType = (_.head(campaign.adSets)?.billingType ??
    "cpm") as Billing;
  const rawPrice = BigNumber(_.head(campaign.adSets)?.price ?? ".006");
  const price = billingType === "cpm" ? rawPrice.multipliedBy(1000) : rawPrice;

  return {
    id: campaign.id,
    adSets: [...campaign.adSets].sort(sort).map((adSet) => {
      const seg = adSet.segments ?? ([] as Segment[]);

      return {
        id: adSet.id,
        state: adSet.state,
        conversions: (adSet.conversions ?? []).map((c) => ({
          id: c.id,
          type: c.type,
          observationWindow: c.observationWindow,
          urlPattern: c.urlPattern,
        })),
        oses: (adSet.oses ?? []).map((o) => ({ name: o.name, code: o.code })),
        segments: (adSet.segments ?? []).map((o) => ({
          name: o.name,
          code: o.code,
        })),
        isNotTargeting: seg.length === 1 && seg[0].code === "Svp7l-zGN",
        name: adSet.name || adSet.id.split("-")[0],
        creatives: creativeList(advertiserId, adSet.ads, ads),
      } as AdSetForm;
    }),
    isCreating: false,
    advertiserId,
    newCreative: initialCreative,
    currency: campaign.currency,
    price: price.toString(),
    billingType: billingType,
    validateStart: false,
    budget: campaign.budget,
    endAt: campaign.endAt,
    format: campaign.format,
    geoTargets: (campaign.geoTargets ?? []).map((g) => ({
      code: g.code,
      name: g.name,
    })),
    name: campaign.name,
    startAt: campaign.startAt,
    state: campaign.state,
    paymentType: campaign.paymentType,
  };
}

function creativeList(
  advertiserId: string,
  adSetAds?: AdFragment[] | null,
  allAds?: AdFragment[] | null,
): Creative[] {
  const filterAds = (a?: AdFragment[] | null, included?: boolean) => {
    return (a ?? [])
      .filter((ad) => ad.creative !== null && ad.state !== "deleted")
      .map((ad) => {
        const c = ad.creative;
        return {
          ...validCreativeFields(c, advertiserId, included),
          createdAt: c.createdAt,
          creativeInstanceId: included ? ad.id : undefined,
        };
      });
  };

  return _.uniqBy(
    [...filterAds(adSetAds, true), ...filterAds(allAds, false)],
    "id",
  );
}

type GenericCreative = Omit<
  CreativeFragment,
  | "createdAt"
  | "modifiedAt"
  | "payloadSearchHomepage"
  | "payloadSearch"
  | "payloadNewTabPage"
>;
export function validCreativeFields<T extends GenericCreative>(
  c: T,
  advertiserId: string,
  included?: boolean,
) {
  return {
    advertiserId,
    id: c.id,
    included: included ?? false,
    name: c.name,
    targetUrlValid: "",
    state: c.state,
    type: { code: c.type.code },
    payloadNotification: c.payloadNotification
      ? {
          title: c.payloadNotification.title,
          body: c.payloadNotification.body,
          targetUrl: c.payloadNotification.targetUrl,
        }
      : undefined,
    payloadInlineContent: c.payloadInlineContent
      ? {
          ctaText: c.payloadInlineContent.ctaText,
          description: c.payloadInlineContent.description,
          dimensions: "900x750",
          imageUrl: c.payloadInlineContent.imageUrl,
          targetUrl: c.payloadInlineContent.targetUrl,
          title: c.payloadInlineContent.title,
        }
      : undefined,
  };
}

export function transformEditForm(
  form: CampaignForm,
  id: string,
): UpdateCampaignInput {
  return {
    budget: form.budget,
    endAt: form.endAt,
    id,
    name: form.name,
    startAt: form.startAt,
    state: form.state,
    paymentType: form.paymentType,
    adSets: form.adSets.map((adSet) => ({
      id: adSet.id,
      ...transformAdSet(adSet, form),
      ads: adSet.creatives
        .filter((c) => c.included)
        .map((ad) => ({
          id: ad.creativeInstanceId,
          creativeId: ad.id,
          creativeSetId: adSet.id,
        })),
    })),
  };
}

function transformAdSet(
  adSet: AdSetForm,
  campaign: Pick<CampaignForm, "format" | "billingType" | "price">,
) {
  return {
    name: adSet.name,
    price: transformPrice(campaign),
    billingType: campaign.billingType,
    perDay: dailyLimit(campaign.format),
    segments: adSet.segments.map((s) => ({ code: s.code, name: s.name })),
    oses: adSet.oses.map((s) => ({ code: s.code, name: s.name })),
    totalMax: campaign.format === CampaignFormat.PushNotification ? 28 : 60,
  };
}

function dailyLimit(format: CampaignFormat) {
  return format === CampaignFormat.NewsDisplayAd ? 6 : 4;
}

export function uiTextForCreativeType(creativeType: string): string {
  return TYPE_CODE_LOOKUP[creativeType] ?? creativeType;
}

export function uiTextForCreativeTypeCode(creativeTypeCode: {
  code: string;
}): string {
  return uiTextForCreativeType(creativeTypeCode.code);
}

export function isCreativeTypeApplicableToCampaignFormat(
  creativeTypeCode: {
    code: string;
  },
  format: CampaignFormat,
): boolean {
  const { code } = creativeTypeCode;
  switch (code) {
    case "notification_all_v1":
      return format === CampaignFormat.PushNotification;
    case "new_tab_page_all_v1":
      return format === CampaignFormat.NtpSi;
    case "inline_content_all_v1":
      return format === CampaignFormat.NewsDisplayAd;
    case "search_all_v1":
      return format === CampaignFormat.Search;
    case "search_homepage_all_v1":
      return format === CampaignFormat.SearchHomepage;
    default:
      return false;
  }
}
