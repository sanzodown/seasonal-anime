import { useEffect, useRef } from 'react'

interface UseInfiniteScrollOptions {
    onLoadMore: () => void
    isLoading: boolean
    hasNextPage: boolean
    threshold?: number
    rootMargin?: string
}

export function useInfiniteScroll({
    onLoadMore,
    isLoading,
    hasNextPage,
    threshold = 0.5,
    rootMargin = '100px'
}: UseInfiniteScrollOptions) {
    const observerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const currentObserver = observerRef.current
        if (!currentObserver || isLoading || !hasNextPage) return

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isLoading) {
                    onLoadMore()
                }
            },
            {
                threshold,
                rootMargin,
            }
        )

        observer.observe(currentObserver)

        return () => {
            if (currentObserver) {
                observer.unobserve(currentObserver)
            }
        }
    }, [onLoadMore, isLoading, hasNextPage, threshold, rootMargin])

    return observerRef
}
