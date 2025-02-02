import { apiSlice } from "../api/ipaSlice";

export const ordersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getALLOrders: builder.query({
      query: () => ({
        url: `get-orders`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: "create-order", // Assuming the backend endpoint for creating an order is 'create-order'
        method: "POST",
        body: orderData, // Send the whole order data object (including the new fields)
        credentials: "include" as const,
      }),
    }),
    deleteOrder: builder.mutation({
      query: (orderId) => ({
        url: `delete-order/${orderId}`, // Assuming the backend endpoint for deleting an order is 'delete-order/:id'
        method: "DELETE",
        credentials: "include" as const,
      }),
    }),
    getSingleOrder: builder.query({
      query: (orderId) => ({
        url: `get-order/${orderId}`,  // Dynamic order ID parameter
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    // Add the updateOrderStatus mutation
    updateOrderStatus: builder.mutation({
      query: ({ orderId, status, cancellationReason }) => ({
        url: `update-order-status/${orderId}`, // Dynamic orderId in the URL
        method: "PUT",
        body: { status, cancellationReason }, // Send status and cancellation reason in the body
        credentials: "include" as const,
      }),
    }),
  }),
});

export const { 
  useGetALLOrdersQuery, 
  useCreateOrderMutation, 
  useDeleteOrderMutation, 
  useGetSingleOrderQuery, 
  useUpdateOrderStatusMutation // Export the hook for updateOrderStatus
} = ordersApi;
