import { api } from "./index";

export const blogApi = api.injectEndpoints({
  endpoints: (build) => ({
    getBlogs: build.query({
      query: (params) => ({
        url: "/api/blogs",
        params,
      }),
      providesTags: ["Blog"],
    }),
    createBlog: build.mutation({
      query: (body) => ({
        url: "/api/create/blogs",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Blog"],
    }),
    getBlogsBySearch: build.query({
      query: (params) => ({
        url: "api/blogs/search",
        params,
      }),
      providesTags: ["Blog"],
    }),
  }),
});

export const {
  useGetBlogsBySearchQuery,
  useGetBlogsQuery,
  useCreateBlogMutation,
} = blogApi;
