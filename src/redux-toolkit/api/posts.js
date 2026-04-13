import { createAsyncThunk } from '@reduxjs/toolkit';
import { postService } from '@services/api/post/post.service';
import { Utils } from '@services/utils/utils.service';

const getPosts = createAsyncThunk('post/getPosts', async (name, { dispatch, rejectWithValue }) => {
  try {
    const response = await postService.getAllPosts(1);
    return response.data;
  } catch (error) {
    const message = error?.response?.data?.message || 'Failed to load posts';
    Utils.dispatchNotification(message, 'error', dispatch);
    return rejectWithValue(message);
  }
});

export { getPosts };
