import PropTypes from 'prop-types';
import '@components/posts/Posts.scss';
import { useSelector } from 'react-redux';
import { Utils } from '@services/utils/utils.service';
import Post from '@components/posts/post/Post';
import { PostUtils } from '@services/utils/post-utils.service';
import PostSkeleton from '@components/posts/post/PostSkeleton';

const Posts = ({ allPosts, userFollowing, postsLoading }) => {
  const { profile } = useSelector((state) => state.user);

  return (
    <div className="posts-container" data-testid="posts">
      {!postsLoading &&
        allPosts.length > 0 &&
        allPosts.map((post) => (
          <div key={post?._id} data-testid="posts-item">
            {(!Utils.checkIfUserIsBlocked(profile?.blockedBy, post?.userId) || post?.userId === profile?._id) && (
              <>
                {PostUtils.checkPrivacy(post, profile, userFollowing) && (
                  <>
                    <Post post={post} showIcons={post.userId === profile?._id} />
                  </>
                )}
              </>
            )}
          </div>
        ))}

      {postsLoading &&
        [1, 2, 3, 4, 5, 6].map((index) => (
          <div key={index}>
            <PostSkeleton />
          </div>
        ))}
    </div>
  );
};
Posts.propTypes = {
  allPosts: PropTypes.array.isRequired,
  userFollowing: PropTypes.array.isRequired,
  postsLoading: PropTypes.bool
};
export default Posts;
