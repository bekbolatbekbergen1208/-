export type HeritagePhoto = {src:string;title:string;caption:string;page:number;width:number;height:number};
export const photos: Record<string,HeritagePhoto> = {
 site:{src:'/images/qaraqabaq-site.jpg',title:'Қарақабақ: қоныс көрінісі',caption:'Презентацияда Қарақабақ қалашығы ретінде берілген фотосурет.',page:3,width:1280,height:853},
 coin:{src:'/images/coin-reference.jpg',title:'Көне мыс тиынның екі беті',caption:'Зебу бейнесі мен таңба. 3D модельге негіз болған фотосурет.',page:4,width:826,height:823},
 landscape:{src:'/images/settlement-landscape.jpg',title:'Қоныс және қоршаған ландшафт',caption:'«Бір тиыннан — әлемге» бөліміндегі фотосурет.',page:5,width:820,height:461},
 excavation:{src:'/images/excavation.jpg',title:'Тас қабырғалар мен қазба көрінісі',caption:'Презентацияның тарихи байланыстар бөліміндегі фотосурет.',page:5,width:768,height:432},
 caspian:{src:'/images/caspian.jpg',title:'Каспий жағалауы',caption:'Каспий өңірінің географиялық ортасын түсіндіру үшін берілген фотосурет.',page:5,width:768,height:401},
 aerial:{src:'/images/settlement-aerial.jpg',title:'Археологиялық орынның жалпы көрінісі',caption:'Мұраны сақтау бөліміндегі иллюстрация. Нақты түсірілген орны қосымша тексеруді қажет етеді.',page:6,width:600,height:400},
 walls:{src:'/images/stone-walls.jpg',title:'Қазбадағы тас құрылымдар',caption:'Қорытынды бөліміндегі фотосурет. Түсірілім күні мен авторы көрсетілмеген.',page:7,width:610,height:475},
};
export const exhibitPhotos:Record<string,string[]>={
 'copper-coin':['coin'],qaraqabaq:['site','excavation','landscape'],trade:['landscape','coin'],caspian:['caspian','landscape'],preservation:['aerial','walls','site']
};
