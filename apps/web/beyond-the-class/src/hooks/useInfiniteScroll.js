import { useEffect, useRef, useCallback } from 'react';

const useInfiniteScroll = (hasNextPage, loading, loadMore) => {
  const loadMoreRef = useRef(null);
  const observerRef = useRef(null);

  const lastElementRef = useCallback((node) => {
    if (loading) return;
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !loading) {
        loadMore();
      }
    }, {
      threshold: 0.1,
      rootMargin: '100px'
    });
    
    if (node) observerRef.current.observe(node);
  }, [loading, hasNextPage, loadMore]);

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return { lastElementRef, loadMoreRef };
};

export default useInfiniteScroll; 