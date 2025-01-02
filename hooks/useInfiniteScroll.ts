import { useEffect, useRef, useCallback } from 'react'

interface UseInfiniteScrollOptions {
    onLoadMore: () => void
    isLoading: boolean
    hasNextPage: boolean
    threshold?: number
    rootMargin?: string
}

interface UseInfiniteScrollResult {
    ref: React.RefObject<HTMLDivElement | null>
    isNearEnd: boolean
    hasMore: boolean
    isLoadingMore: boolean
}

export function useInfiniteScroll({
    onLoadMore,
    isLoading,
    hasNextPage,
    threshold = 0,
    rootMargin = '500px',
}: UseInfiniteScrollOptions): UseInfiniteScrollResult {
    const observerRef = useRef<HTMLDivElement>(null)
    const observer = useRef<IntersectionObserver | null>(null)
    const isNearEndRef = useRef(false)

    const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
        const entry = entries[0]
        isNearEndRef.current = entry.isIntersecting

        if (entry.isIntersecting && !isLoading && hasNextPage) {
            onLoadMore()
        }
    }, [onLoadMore, isLoading, hasNextPage])

    useEffect(() => {
        const currentElement = observerRef.current
        if (!currentElement) return

        if (observer.current) {
            observer.current.disconnect()
        }

        observer.current = new IntersectionObserver(handleIntersection, {
            threshold,
            rootMargin,
        })

        observer.current.observe(currentElement)

        return () => {
            if (observer.current) {
                observer.current.disconnect()
            }
        }
    }, [handleIntersection, threshold, rootMargin])

    return {
        ref: observerRef,
        isNearEnd: isNearEndRef.current,
        hasMore: hasNextPage,
        isLoadingMore: isLoading
    }
}
