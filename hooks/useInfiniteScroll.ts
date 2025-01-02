import { useEffect, useRef, useCallback } from 'react'

interface UseInfiniteScrollOptions {
    onLoadMore: () => void
    isLoading: boolean
    hasNextPage: boolean
    threshold?: number
    rootMargin?: string
    debounceMs?: number
}

export function useInfiniteScroll({
    onLoadMore,
    isLoading,
    hasNextPage,
    threshold = 0.1,
    rootMargin = '200px',
    debounceMs = 200
}: UseInfiniteScrollOptions) {
    const observerRef = useRef<HTMLDivElement>(null)
    const lastCallTime = useRef(0)
    const observer = useRef<IntersectionObserver | null>(null)

    const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
        const entry = entries[0]
        if (!entry.isIntersecting || isLoading || !hasNextPage) return

        const now = Date.now()
        if (now - lastCallTime.current >= debounceMs) {
            lastCallTime.current = now
            onLoadMore()
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
        }
    }, [handleIntersection, threshold, rootMargin])

    return observerRef
}
