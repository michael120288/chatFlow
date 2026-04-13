import { closeModal } from '@redux/reducers/modal/modal.reducer';
import { clearPost, updatePostItem } from '@redux/reducers/post/post.reducer';
import { postService } from '@services/api/post/post.service';
import { socketService } from '@services/socket/socket.service';
import { Utils } from '@services/utils/utils.service';

export class PostUtils {
  static selectBackground(bgColor, postData, setTextAreaBackground, setPostData) {
    postData.bgColor = bgColor;
    setTextAreaBackground(bgColor);
    setPostData(postData);
  }

  static postInputEditable(textContent, postData, setPostData) {
    postData.post = textContent;
    setPostData(postData);
  }

  static closePostModal(dispatch) {
    dispatch(closeModal());
    dispatch(clearPost());
  }

  static clearImage(postData, post, inputRef, dispatch, setSelectedPostImage, setPostImage, setPostData) {
    postData.gifUrl = '';
    postData.image = '';
    postData.video = '';
    setSelectedPostImage(null);
    setPostImage('');
    setTimeout(() => {
      if (inputRef?.current) {
        inputRef.current.textContent = !post ? postData?.post : post;
        if (post) {
          postData.post = post;
        }
        setPostData(postData);
      }
      PostUtils.positionCursor('editable');
    });
    dispatch(
      updatePostItem({ gifUrl: '', image: '', imgId: '', imgVersion: '', video: '', videoId: '', videoVersion: '' })
    );
  }

  static postInputData(imageInputRef, postData, post, setPostData) {
    setTimeout(() => {
      if (imageInputRef?.current) {
        imageInputRef.current.textContent = !post ? postData?.post : post;
        if (post) {
          postData.post = post;
        }
        setPostData(postData);
        PostUtils.positionCursor('editable');
      }
    });
  }

  static dispatchNotification(message, type, setApiResponse, setLoading, dispatch) {
    setApiResponse(type);
    setLoading(false);
    Utils.dispatchNotification(message, type, dispatch);
  }

  static async sendPostWithFileRequest(
    type,
    postData,
    imageInputRef,
    setApiResponse,
    setLoading,
    setDisable,
    dispatch
  ) {
    try {
      if (imageInputRef?.current) {
        imageInputRef.current.textContent = postData.post;
      }
      const response =
        type === 'image'
          ? await postService.createPostWithImage(postData)
          : await postService.createPostWithVideo(postData);
      if (response) {
        setApiResponse('success');
        setLoading(false);
        setDisable(false);
      }
    } catch (error) {
      PostUtils.dispatchNotification(error.response.data.message, 'error', setApiResponse, setLoading, dispatch);
    }
  }

  static async sendUpdatePostWithFileRequest(type, postId, postData, setApiResponse, setLoading, dispatch) {
    try {
      const response =
        type === 'image'
          ? await postService.updatePostWithImage(postId, postData)
          : await postService.updatePostWithVideo(postId, postData);
      if (response) {
        PostUtils.dispatchNotification(response.data.message, 'success', setApiResponse, setLoading, dispatch);
        setTimeout(() => {
          setApiResponse('success');
          setLoading(false);
        }, 3000);
        PostUtils.closePostModal(dispatch);
      }
    } catch (error) {
      PostUtils.dispatchNotification(error.response.data.message, 'error', setApiResponse, setLoading, dispatch);
    }
  }

  static async sendUpdatePostRequest(postId, postData, setApiResponse, setLoading, dispatch) {
    const response = await postService.updatePost(postId, postData);
    if (response) {
      PostUtils.dispatchNotification(response.data.message, 'success', setApiResponse, setLoading, dispatch);
      setTimeout(() => {
        setApiResponse('success');
        setLoading(false);
      }, 3000);
      PostUtils.closePostModal(dispatch);
    }
  }

  static checkPrivacy(post, profile, following) {
    const isPrivate = post?.privacy === 'Private' && post?.userId === profile?._id;
    const isPublic = post?.privacy === 'Public';
    const isFollower =
      post?.privacy === 'Followers' && Utils.checkIfUserIsFollowed(following, post?.userId, profile?._id);
    return isPrivate || isPublic || isFollower;
  }

  static positionCursor(elementId) {
    const element = document.getElementById(`${elementId}`);
    const selection = window.getSelection();
    const range = document.createRange();
    selection.removeAllRanges();
    range.selectNodeContents(element);
    range.collapse(false);
    selection.addRange(range);
    element.focus();
  }

  static socketIOPost(setPosts) {
    const onAddPost = (post) => {
      setPosts((prev) => [post, ...prev]);
    };

    const onUpdatePost = (post) => {
      setPosts((prev) => {
        const posts = structuredClone(prev);
        const index = posts.findIndex((p) => p._id === post?._id);
        if (index > -1) {
          posts.splice(index, 1, post);
        }
        return posts;
      });
    };

    const onDeletePost = (postId) => {
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    };

    const onUpdateLike = (reactionData) => {
      setPosts((prev) => {
        const posts = structuredClone(prev);
        const postData = posts.find((post) => post._id === reactionData?.postId);
        if (postData) {
          postData.reactions = reactionData.postReactions;
          const index = posts.findIndex((p) => p._id === postData._id);
          if (index > -1) posts.splice(index, 1, postData);
        }
        return posts;
      });
    };

    const onUpdateComment = (commentData) => {
      setPosts((prev) => {
        const posts = structuredClone(prev);
        const postData = posts.find((post) => post._id === commentData?.postId);
        if (postData) {
          postData.commentsCount = commentData.commentsCount;
          const index = posts.findIndex((p) => p._id === postData._id);
          if (index > -1) posts.splice(index, 1, postData);
        }
        return posts;
      });
    };

    socketService?.socket?.on('add post', onAddPost);
    socketService?.socket?.on('update post', onUpdatePost);
    socketService?.socket?.on('delete post', onDeletePost);
    socketService?.socket?.on('update like', onUpdateLike);
    socketService?.socket?.on('update comment', onUpdateComment);

    return () => {
      socketService?.socket?.off('add post', onAddPost);
      socketService?.socket?.off('update post', onUpdatePost);
      socketService?.socket?.off('delete post', onDeletePost);
      socketService?.socket?.off('update like', onUpdateLike);
      socketService?.socket?.off('update comment', onUpdateComment);
    };
  }

  static updateSinglePost(posts, post, setPosts) {
    posts = structuredClone(posts);
    const index = posts.findIndex((p) => p._id === post?._id);
    if (index > -1) {
      posts.splice(index, 1, post);
      setPosts(posts);
    }
  }
}
