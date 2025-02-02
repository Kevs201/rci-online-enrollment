import { apiSlice } from "../api/ipaSlice";

export const notificationsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllNotifications: builder.query({
      query: () => ({
        url: "get-all-notifications",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    updateNotifications: builder.mutation({
      query: (id) => ({
        url: `/update-notification/${id}`,
        method: "PUT",
        credentials: "include" as const,
      }),
    }),
  }),
});

export const { useGetAllNotificationsQuery, useUpdateNotificationsMutation } =
  notificationsApi;
