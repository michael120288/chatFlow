import { server } from '@mocks/server';
import { postService } from '@services/api/post/post.service';
import { BASE_ENDPOINT } from '@services/axios';
import { rest } from 'msw';

const BASE_URL = `${BASE_ENDPOINT}/api/v1`;

describe('PostService', () => {
  it('getAllPosts returns posts list', async () => {
    const response = await postService.getAllPosts(1);
    expect(response.data.posts).toBeDefined();
  });

  it('createPost returns success message', async () => {
    const response = await postService.createPost({ post: 'hello' });
    expect(response.data.message).toBe('Post created successfully');
  });

  it('createPostWithImage sends to image post endpoint', async () => {
    server.use(rest.post(`${BASE_URL}/post/image/post`, (req, res, ctx) => res(ctx.json({ message: 'Image post created' }))));
    const response = await postService.createPostWithImage({ post: 'img post' });
    expect(response.data.message).toBe('Image post created');
  });

  it('createPostWithVideo sends to video post endpoint', async () => {
    server.use(rest.post(`${BASE_URL}/post/video/post`, (req, res, ctx) => res(ctx.json({ message: 'Video post created' }))));
    const response = await postService.createPostWithVideo({ post: 'vid post' });
    expect(response.data.message).toBe('Video post created');
  });

  it('updatePost returns updated message', async () => {
    const response = await postService.updatePost('6027f77087c9d9ccb1555269', { post: 'updated' });
    expect(response.data.message).toBe('Post updated successfully');
  });

  it('updatePostWithImage sends to image update endpoint', async () => {
    server.use(rest.put(`${BASE_URL}/post/image/:postId`, (req, res, ctx) => res(ctx.json({ message: 'Image post updated' }))));
    const response = await postService.updatePostWithImage('p123', { post: 'img updated' });
    expect(response.data.message).toBe('Image post updated');
  });

  it('updatePostWithVideo sends to video update endpoint', async () => {
    server.use(rest.put(`${BASE_URL}/post/video/:postId`, (req, res, ctx) => res(ctx.json({ message: 'Video post updated' }))));
    const response = await postService.updatePostWithVideo('p123', { post: 'vid updated' });
    expect(response.data.message).toBe('Video post updated');
  });

  it('getReactionsByUsername returns reactions', async () => {
    server.use(rest.get(`${BASE_URL}/post/reactions/username/:username`, (req, res, ctx) => res(ctx.json({ message: 'Reactions', reactions: [] }))));
    const response = await postService.getReactionsByUsername('manny');
    expect(response.data.reactions).toEqual([]);
  });

  it('getPostReactions returns reactions for a post', async () => {
    server.use(rest.get(`${BASE_URL}/post/reactions/:postId`, (req, res, ctx) => res(ctx.json({ message: 'Post reactions', reactions: [] }))));
    const response = await postService.getPostReactions('p123');
    expect(response.data.reactions).toEqual([]);
  });

  it('getSinglePostReactionByUsername returns single reaction', async () => {
    server.use(
      rest.get(`${BASE_URL}/post/single/reaction/username/:username/:postId`, (req, res, ctx) =>
        res(ctx.json({ message: 'Single reaction', reactions: null }))
      )
    );
    const response = await postService.getSinglePostReactionByUsername('p123', 'manny');
    expect(response.data.reactions).toBeNull();
  });

  it('getPostCommentsNames returns comment author names', async () => {
    const response = await postService.getPostCommentsNames('6027f77087c9d9ccb1555268');
    expect(response.data.comments).toBeDefined();
  });

  it('getPostComments returns comments array', async () => {
    const response = await postService.getPostComments('6027f77087c9d9ccb1555268');
    expect(response.data.comments).toBeDefined();
  });

  it('getPostsWithImages returns image posts', async () => {
    const response = await postService.getPostsWithImages(1);
    expect(response.data.posts).toBeDefined();
  });

  it('getPostsWithVideos returns video posts', async () => {
    server.use(rest.get(`${BASE_URL}/post/videos/:page`, (req, res, ctx) => res(ctx.json({ message: 'Posts with videos', posts: [] }))));
    const response = await postService.getPostsWithVideos(1);
    expect(response.data.posts).toEqual([]);
  });

  it('addReaction sends the reaction body', async () => {
    server.use(rest.post(`${BASE_URL}/post/reaction`, (req, res, ctx) => res(ctx.json({ message: 'Reaction added' }))));
    const response = await postService.addReaction({ reaction: 'like', postId: 'p1' });
    expect(response.data.message).toBe('Reaction added');
  });

  it('removeReaction deletes the reaction', async () => {
    server.use(
      rest.delete(`${BASE_URL}/post/reaction/:postId/:previousReaction/:postReactions`, (req, res, ctx) =>
        res(ctx.json({ message: 'Reaction removed' }))
      )
    );
    const response = await postService.removeReaction('p123', 'like', {});
    expect(response.data.message).toBe('Reaction removed');
  });

  it('addComment adds a comment', async () => {
    server.use(rest.post(`${BASE_URL}/post/comment`, (req, res, ctx) => res(ctx.json({ message: 'Comment added' }))));
    const response = await postService.addComment({ comment: 'nice post' });
    expect(response.data.message).toBe('Comment added');
  });

  it('deleteComment removes a comment', async () => {
    server.use(
      rest.delete(`${BASE_URL}/post/comment/:postId/:commentId`, (req, res, ctx) =>
        res(ctx.json({ message: 'Comment deleted' }))
      )
    );
    const response = await postService.deleteComment('p123', 'c123');
    expect(response.data.message).toBe('Comment deleted');
  });

  it('deletePost removes the post', async () => {
    server.use(rest.delete(`${BASE_URL}/post/:postId`, (req, res, ctx) => res(ctx.json({ message: 'Post deleted' }))));
    const response = await postService.deletePost('p123');
    expect(response.data.message).toBe('Post deleted');
  });
});
