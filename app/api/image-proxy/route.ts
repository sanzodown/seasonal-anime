import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const imageUrl = searchParams.get('url')

        if (!imageUrl) {
            return new NextResponse('Image URL is required', { status: 400 })
        }

        const response = await fetch(imageUrl, {
            headers: {
                'Referer': 'https://myanimelist.net',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        })

        if (!response.ok) {
            return new NextResponse('Failed to fetch image', { status: response.status })
        }

        const buffer = await response.arrayBuffer()
        const headers = new Headers(response.headers)
        headers.set('Cache-Control', 'public, max-age=31536000, immutable')

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': headers.get('Content-Type') || 'image/jpeg',
                'Cache-Control': headers.get('Cache-Control') || 'public, max-age=31536000, immutable'
            }
        })
    } catch (error) {
        console.error('Image proxy error:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}
