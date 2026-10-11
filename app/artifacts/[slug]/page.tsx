import {exhibits,sourceNote} from '@/lib/content';
import {notFound} from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import PhotoGallery from '@/components/PhotoGallery';
import {photos,exhibitPhotos} from '@/lib/photos';
import {Passport} from '@/components/Archive';
import {Coin} from '@/components/Interactive';
export function generateStaticParams(){return exhibits.map(e=>({slug:e.slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const e=exhibits.find(e=>e.slug===slug);return {title:e?.title,description:e?.description}}
export default async function Detail({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const e=exhibits.find(e=>e.slug===slug);if(!e)notFound();return <article className="page"><div className="page-heading"><Link href="/artifacts" className="eyebrow">← ЖӘДІГЕРЛЕР АРХИВІ</Link><h1>{e.title}</h1><span className="tag">{e.status}</span></div>{slug==='copper-coin'?<Coin/>:<div className="exhibit-image detail-image photographic"><Image src={photos[exhibitPhotos[slug][0]].src} fill sizes="90vw" alt={photos[exhibitPhotos[slug][0]].title} priority/><small>ДЕРЕК: ЖОБА ПРЕЗЕНТАЦИЯСЫ</small></div>}<div className="two-col"><section className="panel"><h2>Цифрлық паспорт</h2><dl><dt>Санат</dt><dd>{e.category}</dd><dt>Орны</dt><dd>Маңғыстау, Түпқараған. Нақты табылған орны расталмаған.</dd><dt>Материалы</dt><dd>{e.material}</dd><dt>Кезеңі</dt><dd>{e.period}</dd><dt>Зерттеу мәртебесі</dt><dd>{e.status}</dd></dl></section><section className="panel"><h2>Тарихи контекст</h2><p>{e.description}</p><p>{e.context}</p><p className="notice">Фотосуреттер жоба презентациясынан алынған. Түсірілім авторлары мен күндері көрсетілмеген. 3D модель фотосуретке негізделген, дәл скан емес.</p></section></div><PhotoGallery items={exhibitPhotos[slug]}/><Passport slug={slug}/><p className="source-note">{sourceNote}</p><h2>Байланысты материалдар</h2><div className="related">{exhibits.filter(a=>a.slug!==slug).slice(0,3).map(a=><Link key={a.slug} href={`/artifacts/${a.slug}`}>{a.title} ↗</Link>)}</div></article>}
