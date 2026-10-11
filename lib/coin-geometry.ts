import * as THREE from 'three';

// Photo coordinates from slide 4. Model units are illustrative, never millimetres.
const FACES = [{x:207,y:405,limit:193},{x:614,y:411,limit:199}];
const SEGMENTS = 256;
const RINGS = 48;
const SCALE = 1.52 / 190;
const HALF_THICKNESS = .072;

export function buildPhotoCoin(image: HTMLImageElement) {
  const canvas = document.createElement('canvas');
  canvas.width = image.naturalWidth; canvas.height = image.naturalHeight;
  const context = canvas.getContext('2d', {willReadFrequently:true});
  if (!context) throw new Error('Фотосуретті оқу мүмкін болмады.');
  context.drawImage(image,0,0);
  const {data,width,height} = context.getImageData(0,0,canvas.width,canvas.height);
  const rgb = (x:number,y:number) => {
    const offset=(Math.max(0,Math.min(height-1,Math.round(y)))*width+Math.max(0,Math.min(width-1,Math.round(x))))*4;
    return [data[offset],data[offset+1],data[offset+2]];
  };
  const isCopper = (x:number,y:number) => {
    const [r,g,b]=rgb(x,y);
    return r<205 && g<190 && b<170 && r-b>13;
  };
  const faces = FACES.map((face,index)=>{
    const sign=index===0?1:-1;
    const raw=Array.from({length:SEGMENTS},(_,i)=>{
      const angle=i/SEGMENTS*Math.PI*2;
      for(let r=face.limit;r>100;r-=.7){
        const x=face.x+sign*Math.cos(angle)*r,y=face.y-Math.sin(angle)*r;
        if(isCopper(x,y)&&isCopper(face.x+sign*Math.cos(angle)*(r-2),face.y-Math.sin(angle)*(r-2)))return r-1.3;
      }
      return 155;
    });
    const radii=raw.map((r,i)=>(raw[(i+SEGMENTS-1)%SEGMENTS]+r*2+raw[(i+1)%SEGMENTS])/4);
    const positions:number[]=[],uvs:number[]=[],indices:number[]=[];
    const add=(angle:number,r:number,t:number)=>{
      const px=face.x+sign*Math.cos(angle)*r,py=face.y-Math.sin(angle)*r;
      const [red,green,blue]=rgb(px,py);
      // A very shallow tonal relief helps lighting; it is not measured depth.
      const tone=(red*.2126+green*.7152+blue*.0722)/255;
      const z=HALF_THICKNESS+.022*(1-t*t)+(tone-.3)*.018*Math.min(1,(1-t)*8);
      positions.push(Math.cos(angle)*r*SCALE,Math.sin(angle)*r*SCALE,sign*z);
      uvs.push(px/width,1-py/height);
    };
    add(0,0,0);
    for(let ring=1;ring<=RINGS;ring++)for(let i=0;i<SEGMENTS;i++)add(i/SEGMENTS*Math.PI*2,radii[i]*ring/RINGS,ring/RINGS);
    const tri=(a:number,b:number,c:number)=>{indices.push(...(index===0?[a,b,c]:[a,c,b]));};
    for(let i=0;i<SEGMENTS;i++)tri(0,1+i,1+(i+1)%SEGMENTS);
    for(let ring=1;ring<RINGS;ring++)for(let i=0;i<SEGMENTS;i++){
      const a=1+(ring-1)*SEGMENTS+i,b=1+(ring-1)*SEGMENTS+(i+1)%SEGMENTS;
      const c=1+ring*SEGMENTS+i,d=1+ring*SEGMENTS+(i+1)%SEGMENTS;
      tri(a,c,b);tri(b,c,d);
    }
    const geometry=new THREE.BufferGeometry();
    geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
    geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));
    geometry.setIndex(indices);geometry.computeVertexNormals();
    return {geometry,radii};
  });
  const positions:number[]=[],colors:number[]=[],indices:number[]=[];
  const edgeLayers=8;
  for(let layer=0;layer<=edgeLayers;layer++)for(let i=0;i<SEGMENTS;i++){
    const t=layer/edgeLayers,angle=i/SEGMENTS*Math.PI*2;
    const radius=THREE.MathUtils.lerp(faces[0].radii[i],faces[1].radii[i],t);
    const wear=Math.sin(i*1.73+layer*.82)*.0018*Math.sin(t*Math.PI);
    positions.push(Math.cos(angle)*(radius*SCALE+wear),Math.sin(angle)*(radius*SCALE+wear),THREE.MathUtils.lerp(HALF_THICKNESS,-HALF_THICKNESS,t));
    const color=new THREE.Color().setRGB(.095+.023*Math.sin(i*.27),.062+.015*Math.sin(i*.27),.028);
    colors.push(color.r,color.g,color.b);
  }
  for(let layer=0;layer<edgeLayers;layer++)for(let i=0;i<SEGMENTS;i++){
    const a=layer*SEGMENTS+i,b=layer*SEGMENTS+(i+1)%SEGMENTS,c=a+SEGMENTS,d=b+SEGMENTS;
    indices.push(a,c,b,b,c,d);
  }
  const edge=new THREE.BufferGeometry();
  edge.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
  edge.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));
  edge.setIndex(indices);edge.computeVertexNormals();
  return {front:faces[0].geometry,back:faces[1].geometry,edge};
}
