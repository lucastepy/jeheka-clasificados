import { MetadataRoute } from 'next';
import { db } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://jeheka.com.py';

  // Static routes
  const staticRoutes = [
    '',
    '/contacto',
    '/sobre-nosotros',
    '/politicas',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic routes (Public Avisos)
  let dynamicRoutes: MetadataRoute.Sitemap = [];
  try {
    const result = await db.query(
      "SELECT avi_id FROM avisos WHERE avi_estado = 'activo' ORDER BY avi_created_at DESC LIMIT 1000"
    );
    
    dynamicRoutes = result.rows.map((row: any) => ({
      url: `${baseUrl}/avisos/${row.avi_id}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.6,
    }));
  } catch (error) {
    console.error('Error generating dynamic sitemap routes:', error);
  }

  return [...staticRoutes, ...dynamicRoutes];
}
