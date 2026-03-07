import { getPosts } from '@redux/api/posts';
import reducer, { addToPosts, updatePostCommentCount } from '@redux/reducers/post/posts.reducer';

const initialState = {
  posts: [],
  totalPostsCount: 0,
  isLoading: false
};
const postData = {
  _id: '1234',
  post: 'This is a post',
  bgColor: 'red',
  privacy: 'Public',
  feelings: 'love',
  gifUrl: 'https://place-hold.it',
  profilePicture: 'https://place-hold.it',
  image: 'https://place-hold.it',
  userId: '234567',
  username: 'Manny',
  email: 'manny@test.com',
  avatarColor: 'blue',
  commentsCount: '1',
  reactions: [],
  imgVersion: '1233445',
  imgId: '123445',
  createdAt: '2022-06-15'
};

describe('posts reducer', () => {
  beforeEach(() => {
    initialState.posts = [];
    initialState.totalPostsCount = 0;
    initialState.isLoading = false;
  });

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should posts to list', () => {
    expect(reducer(initialState, addToPosts([postData, postData]))).toEqual({
      posts: [postData, postData],
      totalPostsCount: 0,
      isLoading: false
    });
  });

  describe('updatePostCommentCount', () => {
    it('should update commentsCount for a matching post', () => {
      const stateWithPost = { ...initialState, posts: [{ ...postData }] };
      const result = reducer(stateWithPost, updatePostCommentCount({ postId: '1234', commentCount: 5 }));
      expect(result.posts[0].commentsCount).toBe(5);
    });

    it('should not change state when postId does not match', () => {
      const stateWithPost = { ...initialState, posts: [{ ...postData }] };
      const result = reducer(stateWithPost, updatePostCommentCount({ postId: 'no-match', commentCount: 99 }));
      expect(result.posts[0].commentsCount).toBe('1');
    });
  });

  describe('getPosts async thunk', () => {
    it('should set isLoading true on pending', () => {
      const result = reducer(initialState, getPosts.pending('req-1'));
      expect(result).toEqual({ posts: [], totalPostsCount: 0, isLoading: true });
    });

    it('should populate posts and clear isLoading on fulfilled', () => {
      const result = reducer(
        { ...initialState, isLoading: true },
        getPosts.fulfilled({ posts: [postData], totalPosts: 10 }, 'req-1')
      );
      expect(result).toEqual({ posts: [postData], totalPostsCount: 10, isLoading: false });
    });

    it('should clear isLoading on rejected', () => {
      const result = reducer({ ...initialState, isLoading: true }, getPosts.rejected(null, 'req-1'));
      expect(result).toEqual({ posts: [], totalPostsCount: 0, isLoading: false });
    });
  });
});
