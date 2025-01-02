import { useEffect, useRef } from 'react'

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
    rootMargin = '400px',
    debounceMs = 500
}: UseInfiniteScrollOptions) {
    const observerRef = useRef<HTMLDivElement>(null)
    const lastCallTime = useRef(0)
    const isScrolling = useRef(false)

    useEffect(() => {
        const currentObserver = observerRef.current
        if (!currentObserver || isLoading || !hasNextPage) return

        let scrollTimer: number | undefined

        const handleIntersection = (entries: IntersectionObserverEntry[]) => {
            if (entries[0].isIntersecting && !isScrolling.current) {
                isScrolling.current = true

                if (scrollTimer) {
                    clearTimeout(scrollTimer)
                }

                scrollTimer = setTimeout(() => {
                    const now = Date.now()
                    if (now - lastCallTime.current >= debounceMs) {
                        lastCallTime.current = now
                        onLoadMore()
                    }
                    isScrolling.current = false
                }, 150) as unknown as number
            }
        }

        const observer = new IntersectionObserver(handleIntersection, {
            threshold,
            rootMargin,
        })

        observer.observe(currentObserver)

        return () => {
            if (currentObserver) {
                observer.unobserve(currentObserver)
            }
            if (scrollTimer) {
                clearTimeout(scrollTimer)
            }
        }
    }, [onLoadMore, isLoading, hasNextPage, threshold, rootMargin, debounceMs])

    return observerRef
}
