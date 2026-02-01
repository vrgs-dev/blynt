import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://blynt.app';
    const currentDate = new Date();

    return [
        {
            url: baseUrl,
            lastModified: currentDate,
            changeFrequency: 'weekly',
            priority: 1,
        },
        // Add more pages as they are created
        // {
        //   url: `${baseUrl}/pricing`,
        //   lastModified: currentDate,
        //   changeFrequency: 'monthly',
        //   priority: 0.8,
        // },
        // {
        //   url: `${baseUrl}/blog`,
        //   lastModified: currentDate,
        //   changeFrequency: 'daily',
        //   priority: 0.7,
        // },
    ];
}
