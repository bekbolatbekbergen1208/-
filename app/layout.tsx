import type {Metadata} from 'next';
import './globals.css';
import Shell from '@/components/Shell';
export const metadata:Metadata={metadataBase:new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),title:{default:'Тиынның ізімен: Қарақабақтан әлемге',template:'%s | Қарақабақ'},description:'Бір тиын — екі мыңжылдық тарих. Қарақабақтың цифрлық музейі және қазақ тіліндегі зерттеу платформасы.',openGraph:{title:'Тиынның ізімен: Қарақабақтан әлемге',description:'Қарақабақтың цифрлық мұрасы',locale:'kk_KZ',type:'website'}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="kk"><body><Shell>{children}</Shell></body></html>}
