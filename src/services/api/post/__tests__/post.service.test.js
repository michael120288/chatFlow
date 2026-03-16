import axios from '@services/axios';
import { postService } from '../post.service';

jest.mock('@services/axios');

describe('postService', () => {
  beforeEach(() => jest.clearAllMocks());

  it('getAllPosts GETs /post/all/:page', async () => {
    axios.get.mockResolvedValueOnce({ data: {} });
    await postService.getAllPosts(1);
    expect(axios.get).toHaveBeenCalledWith('/post/all/1');
  });

  it('createPost POSTs to /post', async () => {
    axios.post.mockResolvedValueOnce({ data: {} });
    const body = { post: 'Hello' };
    await postService.createPost(body);
    expect(axios.post).toHaveBeenCalledWith('/post', body);
  });

  it('createPostWithImage POSTs to /post/image/post', async () => {
    axios.post.mockResolvedValueOnce({ data: {} });
    const body = { post: 'Hi', image: 'base64' };
    await postService.createPostWithImage(body);
    expect(axios.post).toHaveBeenCalledWith('/post/image/post', body);
  });

  it('createPostWithVideo POSTs to /post/video/post', async () => {
    axios.post.mockResolvedValueOnce({ data: {} });
    await postService.createPostWithVideo({ video: 'url' });
    expect(axios.post).toHaveBeenCalledWith('/post/video/post', { video: 'url' });
  });

  it('updatePostWithImage PUTs to /post/image/:postId', async () => {
    axios.put.mockResolvedValueOnce({ data: {} });
    await postService.updatePostWithImage('p1', { image: 'new' });
    expect(axios.put).toHaveBeenCalledWith('/post/image/p1', { image: 'new' });
  });

  it('updatePostWithVideo PUTs to /post/video/:postId', async () => {
    axios.put.mockResolvedValueOnce({ data: {} });
    await postService.updatePostWithVideo('p1', { video: 'new' });
    expect(axios.put).toHaveBeenCalledWith('/post/video/p1', { video: 'new' });
  });

  it('updatePost PUTs to /post/:postId', async () => {
    axios.put.mockResolvedValueOnce({ data: {} });
    await postService.updatePost('p1', { post: 'edited' });
    expect(axios.put).toHaveBeenCalledWith('/post/p1', { post: 'edited' });
  });

  it('getReactionsByUsername GETs /post/reactions/username/:username', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    await postService.getReactionsByUsername('Alice');
    expect(axios.get).toHaveBeenCalledWith('/post/reactions/username/Alice');
  });

  it('getPostReactions GETs /post/reactions/:postId', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    await postService.getPostReactions('p1');
    expect(axios.get).toHaveBeenCalledWith('/post/reactions/p1');
  });

  it('getSinglePostReactionByUsername GETs correct URL', async () => {
    axios.get.mockResolvedValueOnce({ data: {} });
    await postService.getSinglePostReactionByUsername('p1', 'Alice');
    expect(axios.get).toHaveBeenCalledWith('/post/single/reaction/username/Alice/p1');
  });

  it('getPostCommentsNames GETs /post/commentsnames/:postId', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    await postService.getPostCommentsNames('p1');
    expect(axios.get).toHaveBeenCalledWith('/post/commentsnames/p1');
  });

  it('getPostComments GETs /post/comments/:postId', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    await postService.getPostComments('p1');
    expect(axios.get).toHaveBeenCalledWith('/post/comments/p1');
  });

  it('getPostsWithImages GETs /post/images/:page', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    await postService.getPostsWithImages(3);
    expect(axios.get).toHaveBeenCalledWith('/post/images/3');
  });

  it('getPostsWithVideos GETs /post/videos/:page', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    await postService.getPostsWithVideos(2);
    expect(axios.get).toHaveBeenCalledWith('/post/videos/2');
  });

  it('addReaction POSTs to /post/reaction', async () => {
    axios.post.mockResolvedValueOnce({ data: {} });
    const body = { postId: 'p1', type: 'like' };
    await postService.addReaction(body);
    expect(axios.post).toHaveBeenCalledWith('/post/reaction', body);
  });

  it('removeReaction DELETEs with postId, previousReaction, and serialised reactions', async () => {
    axios.delete.mockResolvedValueOnce({ data: {} });
    const reactions = { like: 5 };
    await postService.removeReaction('p1', 'like', reactions);
    expect(axios.delete).toHaveBeenCalledWith(
      `/post/reaction/p1/like/${JSON.stringify(reactions)}`
    );
  });

  it('addComment POSTs to /post/comment', async () => {
    axios.post.mockResolvedValueOnce({ data: {} });
    await postService.addComment({ postId: 'p1', comment: 'Nice!' });
    expect(axios.post).toHaveBeenCalledWith('/post/comment', { postId: 'p1', comment: 'Nice!' });
  });

  it('deleteComment DELETEs /post/comment/:postId/:commentId', async () => {
    axios.delete.mockResolvedValueOnce({ data: {} });
    await postService.deleteComment('p1', 'c1');
    expect(axios.delete).toHaveBeenCalledWith('/post/comment/p1/c1');
  });

  it('deletePost DELETEs /post/:postId', async () => {
    axios.delete.mockResolvedValueOnce({ data: {} });
    await postService.deletePost('p1');
    expect(axios.delete).toHaveBeenCalledWith('/post/p1');
  });
});
