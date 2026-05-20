const cfg = window.YAJU_CONFIG || {};
document.querySelectorAll('[data-link]').forEach(el=>{el.addEventListener('click',()=>{const url=cfg[el.dataset.link]; if(url && url !== '#') location.href=url;});});
const ca=document.getElementById('ca'); if(ca) ca.textContent=cfg.CONTRACT_ADDRESS || 'Coming Soon...';
const bgm=document.getElementById('bgm'); const musicBtn=document.getElementById('musicBtn'); if(bgm) bgm.src=cfg.BGM_SRC || '';
musicBtn?.addEventListener('click',async()=>{try{if(bgm.paused){await bgm.play();musicBtn.textContent='♪ BGM STOP'}else{bgm.pause();musicBtn.textContent='♪ BGM PLAY'}}catch(e){alert('assets/bgm.mp3 を追加するとBGMが再生できます')}});
const cardData=[
 {n:1,name:'やりますねぇ',rarity:'LEGENDARY',img:'assets/card-1.png'},
 {n:2,name:'センセンシャル！',rarity:'EPIC',img:'assets/card-2.png'},
 {n:3,name:'ほならね、',rarity:'EPIC',img:'assets/gacha-grid.png'},
 {n:4,name:'ファッ！？',rarity:'RARE',img:'assets/gacha-grid.png'},
 {n:5,name:'イグゾオラァ！',rarity:'LEGENDARY',img:'assets/gacha-grid.png'},
 {n:6,name:'ナイスぅ！',rarity:'RARE',img:'assets/gacha-grid.png'},
 {n:7,name:'多勢に無勢',rarity:'EPIC',img:'assets/gacha-grid.png'},
 {n:8,name:'お前さぁ…',rarity:'RARE',img:'assets/gacha-grid.png'},
 {n:9,name:'背中で語る',rarity:'LEGENDARY',img:'assets/gacha-grid.png'}
];
let owned=0; const cards=document.getElementById('cards');
function render(){cards.innerHTML=cardData.map(c=>`<div class="card"><img src="${c.img}" alt="${c.name}"><div class="num">${c.n}</div><div class="name">${c.name}</div><div class="rarity">${c.rarity}</div></div>`).join('');}
render();
function roll(times){owned+=times; document.getElementById('count').textContent=owned; const pick=cardData[Math.floor(Math.random()*cardData.length)]; document.getElementById('result').textContent=`${times}回ガチャ結果：${pick.rarity}「${pick.name}」を獲得！ やりますねぇ！`;}
document.getElementById('rollOne')?.addEventListener('click',()=>roll(1)); document.getElementById('rollTen')?.addEventListener('click',()=>roll(10));
