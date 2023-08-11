import * as Types from "./types";

import * as Apollo from "@apollo/client";
import { gql } from "@apollo/client";

const defaultOptions = {} as const;
export type CreativeFragment = {
  __typename?: "Creative";
  id: string;
  createdAt: any;
  modifiedAt: any;
  name: string;
  state: string;
  type: { __typename?: "CreativeType"; code: string };
  payloadNotification?: {
    __typename?: "NotificationPayload";
    body: string;
    title: string;
    targetUrl: string;
  } | null;
};

export type AdvertiserCreativesQueryVariables = Types.Exact<{
  advertiserId: Types.Scalars["String"];
}>;

export type AdvertiserCreativesQuery = {
  __typename?: "Query";
  advertiser?: {
    __typename?: "Advertiser";
    id: string;
    creatives: Array<{
      __typename?: "Creative";
      id: string;
      createdAt: any;
      modifiedAt: any;
      name: string;
      state: string;
      type: { __typename?: "CreativeType"; code: string };
      payloadNotification?: {
        __typename?: "NotificationPayload";
        body: string;
        title: string;
        targetUrl: string;
      } | null;
    }>;
  } | null;
};

export type CreateNotificationCreativeMutationVariables = Types.Exact<{
  input: Types.CreateNotificationCreativeInput;
}>;

export type CreateNotificationCreativeMutation = {
  __typename?: "Mutation";
  createNotificationCreative: {
    __typename?: "Creative";
    id: string;
    payloadNotification?: {
      __typename?: "NotificationPayload";
      body: string;
      title: string;
      targetUrl: string;
    } | null;
  };
};

export type UpdateNotificationCreativeMutationVariables = Types.Exact<{
  input: Types.UpdateNotificationCreativeInput;
}>;

export type UpdateNotificationCreativeMutation = {
  __typename?: "Mutation";
  updateNotificationCreative: { __typename?: "Creative"; id: string };
};

export const CreativeFragmentDoc = gql`
  fragment Creative on Creative {
    id
    createdAt
    modifiedAt
    name
    state
    type {
      code
    }
    payloadNotification {
      body
      title
      targetUrl
    }
  }
`;
export const AdvertiserCreativesDocument = gql`
  query advertiserCreatives($advertiserId: String!) {
    advertiser(id: $advertiserId) {
      id
      creatives {
        ...Creative
      }
    }
  }
  ${CreativeFragmentDoc}
`;

/**
 * __useAdvertiserCreativesQuery__
 *
 * To run a query within a React component, call `useAdvertiserCreativesQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdvertiserCreativesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdvertiserCreativesQuery({
 *   variables: {
 *      advertiserId: // value for 'advertiserId'
 *   },
 * });
 */
export function useAdvertiserCreativesQuery(
  baseOptions: Apollo.QueryHookOptions<
    AdvertiserCreativesQuery,
    AdvertiserCreativesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    AdvertiserCreativesQuery,
    AdvertiserCreativesQueryVariables
  >(AdvertiserCreativesDocument, options);
}
export function useAdvertiserCreativesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    AdvertiserCreativesQuery,
    AdvertiserCreativesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    AdvertiserCreativesQuery,
    AdvertiserCreativesQueryVariables
  >(AdvertiserCreativesDocument, options);
}
export type AdvertiserCreativesQueryHookResult = ReturnType<
  typeof useAdvertiserCreativesQuery
>;
export type AdvertiserCreativesLazyQueryHookResult = ReturnType<
  typeof useAdvertiserCreativesLazyQuery
>;
export type AdvertiserCreativesQueryResult = Apollo.QueryResult<
  AdvertiserCreativesQuery,
  AdvertiserCreativesQueryVariables
>;
export function refetchAdvertiserCreativesQuery(
  variables: AdvertiserCreativesQueryVariables,
) {
  return { query: AdvertiserCreativesDocument, variables: variables };
}
export const CreateNotificationCreativeDocument = gql`
  mutation createNotificationCreative(
    $input: CreateNotificationCreativeInput!
  ) {
    createNotificationCreative(createNotificationCreativeInput: $input) {
      id
      payloadNotification {
        body
        title
        targetUrl
      }
    }
  }
`;
export type CreateNotificationCreativeMutationFn = Apollo.MutationFunction<
  CreateNotificationCreativeMutation,
  CreateNotificationCreativeMutationVariables
>;

/**
 * __useCreateNotificationCreativeMutation__
 *
 * To run a mutation, you first call `useCreateNotificationCreativeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateNotificationCreativeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createNotificationCreativeMutation, { data, loading, error }] = useCreateNotificationCreativeMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateNotificationCreativeMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateNotificationCreativeMutation,
    CreateNotificationCreativeMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CreateNotificationCreativeMutation,
    CreateNotificationCreativeMutationVariables
  >(CreateNotificationCreativeDocument, options);
}
export type CreateNotificationCreativeMutationHookResult = ReturnType<
  typeof useCreateNotificationCreativeMutation
>;
export type CreateNotificationCreativeMutationResult =
  Apollo.MutationResult<CreateNotificationCreativeMutation>;
export type CreateNotificationCreativeMutationOptions =
  Apollo.BaseMutationOptions<
    CreateNotificationCreativeMutation,
    CreateNotificationCreativeMutationVariables
  >;
export const UpdateNotificationCreativeDocument = gql`
  mutation updateNotificationCreative(
    $input: UpdateNotificationCreativeInput!
  ) {
    updateNotificationCreative(updateNotificationCreativeInput: $input) {
      id
    }
  }
`;
export type UpdateNotificationCreativeMutationFn = Apollo.MutationFunction<
  UpdateNotificationCreativeMutation,
  UpdateNotificationCreativeMutationVariables
>;

/**
 * __useUpdateNotificationCreativeMutation__
 *
 * To run a mutation, you first call `useUpdateNotificationCreativeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateNotificationCreativeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateNotificationCreativeMutation, { data, loading, error }] = useUpdateNotificationCreativeMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateNotificationCreativeMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateNotificationCreativeMutation,
    UpdateNotificationCreativeMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UpdateNotificationCreativeMutation,
    UpdateNotificationCreativeMutationVariables
  >(UpdateNotificationCreativeDocument, options);
}
export type UpdateNotificationCreativeMutationHookResult = ReturnType<
  typeof useUpdateNotificationCreativeMutation
>;
export type UpdateNotificationCreativeMutationResult =
  Apollo.MutationResult<UpdateNotificationCreativeMutation>;
export type UpdateNotificationCreativeMutationOptions =
  Apollo.BaseMutationOptions<
    UpdateNotificationCreativeMutation,
    UpdateNotificationCreativeMutationVariables
  >;
