import { useState } from 'react'
import type { Streaming } from '@/types/anime'

interface StreamingData {
    episodes?: number
    streaming: Streaming[]
}

export function useStreamingData() {
    const [streamingData, setStreamingData] = useState<Record<string, StreamingData>>({})
    const [isLoading, setIsLoading] = useState<Record<string, boolean>>({})
    const [error, setError] = useState<Record<string, string>>({})

    const fetchStreamingData = async (title: string) => {
        if (streamingData[title]) return

        setIsLoading(prev => ({ ...prev, [title]: true }))
        setError(prev => ({ ...prev, [title]: '' }))

        try {
            const response = await fetch('/api/anime/streaming', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    titles: [title],
                    season: 'current',
                    year: new Date().getFullYear()
                })
            })

            if (!response.ok) throw new Error('Failed to fetch streaming data')

            const data = await response.json()
            setStreamingData(prev => ({ ...prev, [title]: data[title] || { streaming: [] } }))
        } catch (err) {
            setError(prev => ({ ...prev, [title]: 'Failed to load streaming data' }))
        } finally {
            setIsLoading(prev => ({ ...prev, [title]: false }))
        }
    }

    return {
        streamingData,
        isLoading,
        error,
        fetchStreamingData
    }
}
