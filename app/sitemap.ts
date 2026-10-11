import type {MetadataRoute} from 'next';
import {exhibits} from '@/lib/content';
export default function sitemap():MetadataRoute.Sitemap{const base=process.env.NEXT_PUBLIC_SITE_URL||'http://localhost:3000';return ['','history','coin','museum','map','expedition','tour','timeline','artifacts','games','research','sources','about',...exhibits.map(e=>`artifacts/${e.slug}`)].map(p=>({url:`${base}/${p}`,changeFrequency:'monthly',priority:p===''?1:.7}))}
