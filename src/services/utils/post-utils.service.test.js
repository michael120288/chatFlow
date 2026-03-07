import { server } from '@mocks/server';
import { BASE_ENDPOINT } from '@services/axios';
import { rest } from 'msw';
import { PostUtils } from '@services/utils/post-utils.service';

const BASE_URL = `${BASE_ENDPOINT}/api/v1`;

describe('PostUtils', () => {
  describe('selectBackground', () => {
    it('sets bgColor on postData and calls both setters', () => {
      const postData = { bgColor: '' };
      const setTextAreaBackground = jest.fn();
      const setPostData = jest.fn();

      PostUtils.selectBackground('#ff0000', postData, setTextAreaBackground, setPostData);

      expect(postData.bgColor).toBe('#ff0000');
      expect(setTextAreaBackground).toHaveBeenCalledWith('#ff0000');
      expect(setPostData).toHaveBeenCalledWith(postData);
    });
  });

  describe('postInputEditable', () => {
    it('sets post text on postData and calls setPostData', () => {
      const postData = { post: '' };
      const setPostData = jest.fn();

      PostUtils.postInputEditable('Hello world', postData, setPostData);

      expect(postData.post).toBe('Hello world');
      expect(setPostData).toHaveBeenCalledWith(postData);
    });
  });

  describe('checkPrivacy', () => {
    const profile = { _id: 'user1' };
    const following = [{ _id: 'creator1' }, { _id: 'creator2' }];

    it('returns true for a Private post owned by the current user', () => {
      const post = { privacy: 'Private', userId: 'user1' };
      expect(PostUtils.checkPrivacy(post, profile, following)).toBe(true);
    });

    it('returns false for a Private post owned by someone else', () => {
      const post = { privacy: 'Private', userId: 'other' };
      expect(PostUtils.checkPrivacy(post, profile, following)).toBe(false);
    });

    it('returns true for a Public post regardless of ownership', () => {
      const post = { privacy: 'Public', userId: 'anyone' };
      expect(PostUtils.checkPrivacy(post, profile, following)).toBe(true);
    });

    it('returns true for a Followers post when user follows the creator', () => {
      const post = { privacy: 'Followers', userId: 'creator1' };
      // checkIfUserIsFollowed uses some() which requires a non-empty list element to match
      expect(PostUtils.checkPrivacy(post, profile, following)).toBe(true);
    });

    it('returns false for a Followers post when user does not follow the creator', () => {
      const post = { privacy: 'Followers', userId: 'unknownCreator' };
      expect(PostUtils.checkPrivacy(post, profile, [])).toBe(false);
    });
  });

  describe('updateSinglePost', () => {
    it('replaces the matching post and calls setPosts', () => {
      const posts = [
        { _id: 'p1', post: 'original', commentsCount: 0 },
        { _id: 'p2', post: 'other' }
      ];
      const updatedPost = { _id: 'p1', post: 'updated', commentsCount: 5 };
      const setPosts = jest.fn();

      PostUtils.updateSinglePost(posts, updatedPost, setPosts);

      expect(setPosts).toHaveBeenCalledTimes(1);
      const result = setPosts.mock.calls[0][0];
      expect(result.find((p) => p._id === 'p1').post).toBe('updated');
      expect(result.find((p) => p._id === 'p1').commentsCount).toBe(5);
    });

    it('does not call setPosts when post is not found', () => {
      const posts = [{ _id: 'p1', post: 'original' }];
      const setPosts = jest.fn();

      PostUtils.updateSinglePost(posts, { _id: 'no-match' }, setPosts);

      expect(setPosts).not.toHaveBeenCalled();
    });

    it('does not mutate the original posts array', () => {
      const posts = [{ _id: 'p1', post: 'original' }];
      const setPosts = jest.fn();

      PostUtils.updateSinglePost(posts, { _id: 'p1', post: 'updated' }, setPosts);

      expect(posts[0].post).toBe('original');
    });
  });

  describe('dispatchNotification', () => {
    it('calls setApiResponse and setLoading and dispatches notification', () => {
      const setApiResponse = jest.fn();
      const setLoading = jest.fn();
      const dispatch = jest.fn();

      PostUtils.dispatchNotification('Something went wrong', 'error', setApiResponse, setLoading, dispatch);

      expect(setApiResponse).toHaveBeenCalledWith('error');
      expect(setLoading).toHaveBeenCalledWith(false);
      expect(dispatch).toHaveBeenCalled();
    });
  });

  describe('closePostModal', () => {
    it('dispatches closeModal and clearPost', () => {
      const dispatch = jest.fn();
      PostUtils.closePostModal(dispatch);
      expect(dispatch).toHaveBeenCalledTimes(2);
    });
  });

  describe('sendPostWithFileRequest', () => {
    it('sets apiResponse to success on image post success', async () => {
      server.use(
        rest.post(`${BASE_URL}/post/image/post`, (req, res, ctx) =>
          res(ctx.json({ message: 'Image post created' }))
        )
      );
      const setApiResponse = jest.fn();
      const setLoading = jest.fn();
      const dispatch = jest.fn();
      const imageInputRef = { current: { textContent: '' } };

      await PostUtils.sendPostWithFileRequest('image', { post: 'hello' }, imageInputRef, setApiResponse, setLoading, dispatch);

      expect(setApiResponse).toHaveBeenCalledWith('success');
      expect(setLoading).toHaveBeenCalledWith(false);
    });

    it('dispatches error notification on image post failure', async () => {
      server.use(
        rest.post(`${BASE_URL}/post/image/post`, (req, res, ctx) =>
          res(ctx.status(400), ctx.json({ message: 'Image upload failed' }))
        )
      );
      const setApiResponse = jest.fn();
      const setLoading = jest.fn();
      const dispatch = jest.fn();

      await PostUtils.sendPostWithFileRequest('image', { post: 'hello' }, null, setApiResponse, setLoading, dispatch);

      expect(setApiResponse).toHaveBeenCalledWith('error');
    });
  });

  describe('sendUpdatePostRequest', () => {
    it('dispatches success notification and closes modal on success', async () => {
      server.use(
        rest.put(`${BASE_URL}/post/post-id-123`, (req, res, ctx) =>
          res(ctx.json({ message: 'Post updated successfully' }))
        )
      );
      const setApiResponse = jest.fn();
      const setLoading = jest.fn();
      const dispatch = jest.fn();

      await PostUtils.sendUpdatePostRequest('post-id-123', { post: 'updated' }, setApiResponse, setLoading, dispatch);

      expect(dispatch).toHaveBeenCalled();
    });
  });

  describe('sendUpdatePostWithFileRequest', () => {
    it('dispatches success and closes modal when image update succeeds', async () => {
      server.use(
        rest.put(`${BASE_URL}/post/image/img-post-id`, (req, res, ctx) =>
          res(ctx.json({ message: 'Image post updated' }))
        )
      );
      const setApiResponse = jest.fn();
      const setLoading = jest.fn();
      const dispatch = jest.fn();

      await PostUtils.sendUpdatePostWithFileRequest('image', 'img-post-id', { post: 'updated' }, setApiResponse, setLoading, dispatch);

      expect(dispatch).toHaveBeenCalled();
    });

    it('dispatches error notification on image update failure', async () => {
      server.use(
        rest.put(`${BASE_URL}/post/image/bad-img-id`, (req, res, ctx) =>
          res(ctx.status(400), ctx.json({ message: 'Upload failed' }))
        )
      );
      const setApiResponse = jest.fn();
      const setLoading = jest.fn();
      const dispatch = jest.fn();

      await PostUtils.sendUpdatePostWithFileRequest('image', 'bad-img-id', { post: 'x' }, setApiResponse, setLoading, dispatch);

      expect(setApiResponse).toHaveBeenCalledWith('error');
    });
  });
});
