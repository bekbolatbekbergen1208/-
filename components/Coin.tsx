'use client';
import {Canvas,useFrame,useThree} from '@react-three/fiber';
import {OrbitControls,useTexture} from '@react-three/drei';
import {Component,Suspense,useEffect,useMemo,useRef,useState,type ReactNode} from 'react';
import {useReducedMotion} from 'motion/react';
import Image from 'next/image';
import * as THREE from 'three';
import {RotateCcw,Expand,ZoomIn,ZoomOut,Pause,Play,ScanEye} from 'lucide-react';
import {buildPhotoCoin} from '@/lib/coin-geometry';

function PhotoModel({back,auto,highlight}:{back:boolean;auto:boolean;highlight:boolean}){
  const original=useTexture('/images/coin-reference.jpg');
  const texture=useMemo(()=>{const t=original.clone();t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;t.needsUpdate=true;return t},[original]);
  const geometry=useMemo(()=>buildPhotoCoin(original.image as HTMLImageElement),[original]);
  const group=useRef<THREE.Group>(null);
  useEffect(()=>()=>{texture.dispose();geometry.front.dispose();geometry.back.dispose();geometry.edge.dispose()},[texture,geometry]);
  useFrame((_,dt)=>{if(group.current&&auto)group.current.rotation.y+=dt*.12});
  return <group ref={group} rotation={[0,back?Math.PI:0,0]}>
    <mesh geometry={geometry.front}><meshStandardMaterial map={texture} roughness={.94} metalness={.12} bumpMap={texture} bumpScale={.009}/></mesh>
    <mesh geometry={geometry.back}><meshStandardMaterial map={texture} roughness={.94} metalness={.12} bumpMap={texture} bumpScale={.009}/></mesh>
    <mesh geometry={geometry.edge}><meshStandardMaterial vertexColors roughness={.92} metalness={.16}/></mesh>
    {highlight&&<group position={back?[0,0,-.11]:[-.05,-.04,.12]} rotation={[0,back?Math.PI:0,0]}><mesh><ringGeometry args={[.46,.475,80]}/><meshBasicMaterial color="#e7cc8a" transparent opacity={.85}/></mesh></group>}
  </group>
}
function CameraDistance({distance}:{distance:number}){const {camera}=useThree();useEffect(()=>{camera.position.normalize().multiplyScalar(distance);camera.updateProjectionMatrix()},[camera,distance]);return null}
function PhotoFallback(){return <div className="coin-photo-fallback"><Image src="/images/coin-reference.jpg" width={826} height={823} alt="Презентациядағы мыс тиынның екі беті"/><p>Тиынның түпнұсқа фотосуреті. Бұл құрылғыда 3D көрініс қолжетімсіз.</p></div>}
class ViewerBoundary extends Component<{children:ReactNode},{failed:boolean}>{state={failed:false};static getDerivedStateFromError(){return {failed:true}}render(){return this.state.failed?<PhotoFallback/>:this.props.children}}

export default function Coin({compact=false}:{compact?:boolean}){
  const reduced=useReducedMotion();
  const [back,setBack]=useState(false),[reset,setReset]=useState(0),[zoom,setZoom]=useState(5.2),[detail,setDetail]=useState(false),[rotating,setRotating]=useState(compact),[fullscreenError,setFullscreenError]=useState('');
  const box=useRef<HTMLDivElement>(null);
  function face(value:boolean){setBack(value);setRotating(false);setReset(r=>r+1)}
  async function fullscreen(){try{if(document.fullscreenElement)await document.exitFullscreen();else await box.current?.requestFullscreen()}catch{setFullscreenError('Толық экран бұл браузерде қолжетімсіз.')}}
  return <div ref={box} className={`coin-view photo-coin ${compact?'compact':''}`}>
    {!compact&&<div className="coin-view-heading"><span>ЖӘДІГЕР № 01</span><span>ФОТОСУРЕТ НЕГІЗІНДЕГІ 3D</span></div>}
    <ViewerBoundary><Canvas key={reset} dpr={[1,2]} camera={{position:[0,0,zoom],fov:42}} gl={{antialias:true,alpha:true}} fallback={<PhotoFallback/>}>
      <ambientLight intensity={1.55}/><directionalLight position={[-3,4,5]} intensity={1.6} color="#fff5e6"/><directionalLight position={[3,-1,-4]} intensity={1.1} color="#dae2e6"/>
      {/* Keep DOM labels outside Canvas: nested Html roots race with Suspense and route unmounts. */}
      <Suspense fallback={null}><PhotoModel back={back} auto={rotating&&!reduced} highlight={detail}/></Suspense>
      <CameraDistance distance={zoom}/><OrbitControls enablePan={false} minDistance={3.1} maxDistance={8} enableDamping dampingFactor={.08} onStart={()=>setRotating(false)} zoomSpeed={.65}/>
    </Canvas></ViewerBoundary>
    {!compact&&<><div className="viewer-controls"><button aria-pressed={!back} onClick={()=>face(false)}>Зебу беті</button><button aria-pressed={back} onClick={()=>face(true)}>Таңба беті</button><button aria-label="Жақындату" onClick={()=>setZoom(z=>Math.max(3.1,z-.6))}><ZoomIn size={18}/></button><button aria-label="Алыстату" onClick={()=>setZoom(z=>Math.min(8,z+.6))}><ZoomOut size={18}/></button><button aria-label="Көріністі қалпына келтіру" onClick={()=>{setZoom(5.2);setBack(false);setRotating(false);setDetail(false);setReset(r=>r+1)}}><RotateCcw size={18}/></button><button aria-label={rotating?'Айналдыруды тоқтату':'Автоматты айналдыру'} aria-pressed={rotating} onClick={()=>setRotating(!rotating)}>{rotating?<Pause size={17}/>:<Play size={17}/>}</button><button aria-label="Толық экран" onClick={fullscreen}><Expand size={18}/></button></div><button className="hotspot" onClick={()=>{setDetail(!detail);setRotating(false)}} aria-expanded={detail}><ScanEye size={16}/> Бедерді қарау</button>{detail&&<span className="coin-marker viewer-marker">{back?'Таңба':'Зебу бейнесі'}</span>}{detail&&<p className="detail">{back?'Презентацияның 4-бетіндегі таңбаның фотобейнесі. Таңбаның кескіні мен тотыққан беті сақталған.':'Презентацияда жатқан зебу деп сипатталған бедер. Көріністе тиынның өз фотосуреті қолданылған.'}</p>}<p className="caption">Фотосуретке негізделген реконструкция. Қалыңдығы мен бедер тереңдігі шартты; дәл 3D скан емес.</p>{fullscreenError&&<p className="viewer-error" role="status">{fullscreenError}</p>}</>}
  </div>
}
