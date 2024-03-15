/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
                pathname: '**'
            },
            {
                protocol: 'https',
                hostname: 'aadarshguru-public.s3.amazonaws.com',
                pathname: '**'
            },
        ]
    }
}

module.exports = nextConfig
