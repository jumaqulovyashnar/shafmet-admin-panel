export function getApiBaseUrl(): string {
    return import.meta.env.VITE_API_BASE_URL ?? ''
}

export function getAbsoluteImageUrl(url?: string): string {
    if (!url) return ''
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
        return url
    }
    const baseUrl = getApiBaseUrl() || 'http://45.92.173.35'
    const cleanBase = baseUrl.replace(/\/+$/, '')
    const cleanUrl = url.replace(/^\/+/, '')
    return `${cleanBase}/${cleanUrl}`
}
