import { useEffect } from 'react';

const useInfiniteScroll = (bodyRef, bottomLineRef, callback) => {
  useEffect(() => {
    const bottomEl = bottomLineRef?.current;
    if (!bottomEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          callback();
        }
      },
      { root: bodyRef?.current ?? null, threshold: 0.1 }
    );

    observer.observe(bottomEl);
    return () => observer.disconnect();
  }, [bodyRef, bottomLineRef, callback]);
};

export default useInfiniteScroll;
