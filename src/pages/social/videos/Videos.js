import '@pages/social/videos/Videos.scss';
import Dialog from '@components/dialog/Dialog';
import useEffectOnce from '@hooks/useEffectOnce';
import { followerService } from '@services/api/followers/follower.service';
import { postService } from '@services/api/post/post.service';
import { PostUtils } from '@services/utils/post-utils.service';
import { Utils } from '@services/utils/utils.service';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

const Videos = () => {
  const { profile } = useSelector((state) => state.user);
  const [posts, setPosts] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogPost, setDeleteDialogPost] = useState(null);
  const dispatch = useDispatch();

  const getPostsWithVideos = async () => {
    try {
      const response = await postService.getPostsWithVideos(1);
      setPosts(response.data.posts);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    }
  };

  const getUserFollowing = async () => {
    try {
      const response = await followerService.getUserFollowing();
      setFollowing(response.data.following);
    } catch (error) {
      Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    }
  };

  const emptyPost = (post) => {
    return (
      Utils.checkIfUserIsBlocked(profile?.blockedBy, post?.userId) || PostUtils.checkPrivacy(post, profile, following)
    );
  };

  const deletePost = async (post) => {
    try {
      await postService.deletePost(post._id);
      setPosts((prev) => prev.filter((p) => p._id !== post._id));
      Utils.dispatchNotification('Post deleted', 'success', dispatch);
    } catch (error) {
      Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    }
  };

  const removeVideoFromPost = async (post) => {
    try {
      await postService.updatePost(post._id, {
        post: post.post,
        bgColor: post.bgColor,
        feelings: post.feelings,
        privacy: post.privacy,
        gifUrl: '',
        profilePicture: post.profilePicture,
        imgId: '',
        imgVersion: '',
        videoId: '',
        videoVersion: ''
      });
      setPosts((prev) => prev.filter((p) => p._id !== post._id));
      Utils.dispatchNotification('Video removed from post', 'success', dispatch);
    } catch (error) {
      Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    }
  };

  useEffectOnce(() => {
    getPostsWithVideos();
    getUserFollowing();
  });

  return (
    <>
      <div className="videos-container">
        {deleteDialogPost && (
          <Dialog
            title="What would you like to do?"
            firstButtonText="Delete Post"
            secondButtonText="Cancel"
            thirdButtonText="Remove Video Only"
            firstBtnHandler={() => {
              deletePost(deleteDialogPost);
              setDeleteDialogPost(null);
            }}
            secondBtnHandler={() => setDeleteDialogPost(null)}
            thirdBtnHandler={() => {
              removeVideoFromPost(deleteDialogPost);
              setDeleteDialogPost(null);
            }}
          />
        )}
        <div className="videos">Videos</div>
        {posts.length > 0 && (
          <div className="gallery-videos">
            {posts.map((post) => (
              <div
                key={Utils.generateString(10)}
                className={`${!emptyPost(post) ? 'empty-post-div' : ''}`}
                data-testid="gallery-videos"
              >
                {(!Utils.checkIfUserIsBlocked(profile?.blockedBy, post?.userId) || post?.userId === profile?._id) && (
                  <>
                    {PostUtils.checkPrivacy(post, profile, following) && (
                      <figure data-testid="video" className="video-figure">
                        <div className="video">
                          <video
                            width="350px"
                            height="200px"
                            autoPlay={true}
                            controls
                            src={`${Utils.getVideo(post?.videoId, post?.videoVersion)}`}
                          />
                        </div>
                        {post.userId === profile?._id && (
                          <button className="video-delete-btn" onClick={() => setDeleteDialogPost(post)} title="Delete">
                            &#10005;
                          </button>
                        )}
                      </figure>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {loading && !posts.length && <div className="card-element" style={{ height: '350px' }}></div>}

        {!loading && !posts.length && (
          <div className="empty-page" data-testid="empty-page">
            There are no videos to display
          </div>
        )}
      </div>
    </>
  );
};

export default Videos;
