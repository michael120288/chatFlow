import { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '@pages/social/streams/Streams.scss';
import Suggestions from '@components/suggestions/Suggestions';
import { getUserSuggestions } from '@redux/api/suggestion';
import useEffectOnce from '@hooks/useEffectOnce';
import PostForm from '@components/posts/post-form/PostForm';
import Posts from '@components/posts/Posts';
import { Utils } from '@services/utils/utils.service';
import { postService } from '@services/api/post/post.service';
import { getPosts } from '@redux/api/posts';

import useInfiniteScroll from '@hooks/useInfiniteScroll';
import { PostUtils } from '@services/utils/post-utils.service';
import useLocalStorage from '@hooks/useLocalStorage';
import { addReactions } from '@redux/reducers/post/user-post-reaction.reducer';
import { followerService } from '@services/api/followers/follower.service';

const Streams = () => {
  const allPosts = useSelector((state) => state.allPosts);
  const [posts, setPosts] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPostsCount, setTotalPostsCount] = useState(0);
  const bodyRef = useRef(null);
  const bottomLineRef = useRef();
  const dispatch = useDispatch();
  const storedUsername = useLocalStorage('username', 'get');
  const [deleteSelectedPostId] = useLocalStorage('selectedPostId', 'delete');
  useInfiniteScroll(bodyRef, bottomLineRef, fetchPostData);
  const PAGE_SIZE = 8;

  function fetchPostData() {
    let pageNum = currentPage;
    if (currentPage <= Math.round(totalPostsCount / PAGE_SIZE)) {
      pageNum += 1;
      setCurrentPage(pageNum);
      getAllPosts();
    }
  }

  const getAllPosts = async () => {
    try {
      const response = await postService.getAllPosts(currentPage);
      if (response.data.posts.length > 0) {
        setPosts((prev) => {
          const merged = [
            ...new Map([...prev, ...response.data.posts].filter((x) => x?._id).map((x) => [String(x._id), x])).values()
          ];
          return [...merged].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        });
      }
      setLoading(false);
    } catch (error) {
      Utils.dispatchNotification(error?.response?.data?.message || 'Failed to load posts', 'error', dispatch);
    }
  };

  const getUserFollowing = async () => {
    try {
      const response = await followerService.getUserFollowing();
      setFollowing(response.data.following);
    } catch (error) {
      Utils.dispatchNotification(error?.response?.data?.message || 'Failed to load following', 'error', dispatch);
    }
  };

  const getReactionsByUsername = async () => {
    try {
      const response = await postService.getReactionsByUsername(storedUsername);
      dispatch(addReactions(response.data.reactions));
    } catch (error) {
      Utils.dispatchNotification(error?.response?.data?.message || 'Failed to load reactions', 'error', dispatch);
    }
  };

  useEffectOnce(() => {
    getUserFollowing();
    getReactionsByUsername();
    deleteSelectedPostId();
    dispatch(getPosts());
    dispatch(getUserSuggestions());
  });

  useEffect(() => {
    setLoading(allPosts?.isLoading);
    const apiPosts = [...(allPosts?.posts || [])].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setPosts((prev) => {
      const merged = [...new Map([...apiPosts, ...prev].filter((x) => x?._id).map((x) => [String(x._id), x])).values()];
      return [...merged].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    });
    setTotalPostsCount(allPosts?.totalPostsCount);
  }, [allPosts]);

  useEffect(() => {
    const cleanup = PostUtils.socketIOPost(setPosts);
    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- setPosts is a stable state setter; socket listeners registered once on mount
  }, []);

  return (
    <div className="streams" data-testid="streams">
      <div className="streams-content">
        <div className="streams-post" ref={bodyRef}>
          <PostForm />
          <Posts allPosts={posts} postsLoading={loading} userFollowing={following} />
          <div ref={bottomLineRef} className="streams-sentinel"></div>
        </div>
        <div className="streams-suggestions">
          <Suggestions />
        </div>
      </div>
    </div>
  );
};

export default Streams;
