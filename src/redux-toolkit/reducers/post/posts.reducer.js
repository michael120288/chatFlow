import { getPosts } from '@redux/api/posts';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  posts: [],
  totalPostsCount: 0,
  isLoading: false
};

const postsSlice = createSlice({
  name: 'allPosts',
  initialState,
  reducers: {
    addToPosts: (state, action) => {
      state.posts = [...action.payload];
    },
    updatePostCommentCount: (state, action) => {
      const { postId, commentCount } = action.payload;
      const postIndex = state.posts.findIndex((post) => post._id === postId);
      if (postIndex !== -1) {
        state.posts[postIndex].commentsCount = commentCount;
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getPosts.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getPosts.fulfilled, (state, action) => {
      state.isLoading = false;
      const { posts, totalPosts } = action.payload;
      state.posts = [...posts];
      state.totalPostsCount = totalPosts;
    });
    builder.addCase(getPosts.rejected, (state) => {
      state.isLoading = false;
    });
  }
});

export const { addToPosts, updatePostCommentCount } = postsSlice.actions;
export default postsSlice.reducer;
