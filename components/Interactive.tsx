'use client';
import dynamic from 'next/dynamic';
export const Coin=dynamic(()=>import('./Coin'),{ssr:false,loading:()=> <div className="loading">3D модель жүктелуде…</div>});
export const Map=dynamic(()=>import('./Map'),{ssr:false,loading:()=> <div className="loading">Карта жүктелуде…</div>});
