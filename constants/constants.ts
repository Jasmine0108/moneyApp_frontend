const API_URL = process.env.EXPO_PUBLIC_API_URL as string
if (API_URL == '') throw new Error('API_URL is not set')

export const env = {
  API_URL: API_URL,
}
