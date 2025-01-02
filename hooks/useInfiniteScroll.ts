import { useEffect, useRef, useCallback } from 'react'

interface UseInfiniteScrollOptions {
    onLoadMore: () => void
    isLoading: boolean
    hasNextPage: boolean
    threshold?: number
    rootMargin?: string
    debounceMs?: number
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
    threshold = 0.1,
    rootMargin = '400px',
    debounceMs = 100
}: UseInfiniteScrollOptions): UseInfiniteScrollResult {
    const observerRef = useRef<HTMLDivElement>(null)
    const lastCallTime = useRef(0)
    const observer = useRef<IntersectionObserver | null>(null)
    const isNearEndRef = useRef(false)
    const loadingQueueRef = useRef<NodeJS.Timeout | null>(null)

    const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
        const entry = entries[0]
        const wasNearEnd = isNearEndRef.current
        isNearEndRef.current = entry.isIntersecting

        if (loadingQueueRef.current) {
            clearTimeout(loadingQueueRef.current)
            loadingQueueRef.current = null
        }

        if (isLoading || !hasNextPage) return

        const now = Date.now()
        const timeSinceLastCall = now - lastCallTime.current

        if (entry.isIntersecting && timeSinceLastCall >= debounceMs) {
            lastCallTime.current = now
            onLoadMore()
        }
        else if (entry.isIntersecting && !wasNearEnd) {
            loadingQueueRef.current = setTimeout(() => {
                if (isNearEndRef.current) {
                    lastCallTime.current = Date.now()
                    onLoadMore()
                }
            }, Math.max(0, debounceMs - timeSinceLastCall))
        }
    }, [onLoadMore, isLoading, hasNextPage, debounceMs])

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
            if (loadingQueueRef.current) {
                clearTimeout(loadingQueueRef.current)
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
