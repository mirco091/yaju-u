const cfg = window.YAJU_CONFIG || {};
const $ = (s)=>document.querySelector(s);
const cards = Array.from({length:9},(_,i)=>({
  id:i+1,
  name:`YAJU&U MOMENT #00${i+1}`,
  image:`assets/cards/card-${i+1}.png`,
  phrase:'やりますねぇ',
  rarity: i===0?'GOD': i<3?'SSR': i<6?'SR': i<8?'R':'N',
  supply: i===0?1:i<3?114:i<6?514:1145,
  price: [11.4514,2.4514,1.14514,.514,.364,.245,.145,.114,.081][i]
}));
let owned = JSON.parse(localStorage.getItem('yajuOwned')||'[]');
let wallet = localStorage.getItem('yajuWallet')||'';

function save(){localStorage.setItem('yajuOwned',JSON.stringify(owned)); updateMetrics();}
function rarityClass(r){return r.toLowerCase();}
function showModal(t,txt){$('#modalTitle').textContent=t;$('#modalText').textContent=txt;$('#modal').classList.add('show');}
function flash(){ $('#flash').classList.add('on'); setTimeout(()=>$('#flash').classList.remove('on'),450); if(navigator.vibrate) navigator.vibrate(60); }
function weighted(){ const roll=Math.random()*100; if(roll<1) return cards[0]; if(roll<8) return cards[Math.floor(Math.random()*2)+1]; if(roll<28) return cards[Math.floor(Math.random()*3)+3]; if(roll<65) return cards[Math.floor(Math.random()*2)+6]; return cards[8]; }
function cardEl(c, ownedCard=false){
 const div=document.createElement('div'); div.className=`marketCard ${rarityClass(c.rarity)}`;
 div.innerHTML=`<span class="badge">${c.rarity}</span><img src="${c.image}" alt="${c.name}"><div class="marketInfo"><h3>${c.phrase}</h3><p>${c.name} / ${c.supply} supply</p><div class="price"><span>${c.price} SOL</span><small>${ownedCard?'OWNED':'BUY'}</small></div></div>`;
 div.onclick=()=> showModal(ownedCard?'NFT Detail':'Buy NFT', ownedCard?`${c.name} を保有中。実装時はここから出品・送付・Discord認証へ接続します。`:`${c.name} を ${c.price} SOL で購入するデモです。実装時はEscrow/Marketplace Programに接続します。`);
 return div;
}
function renderMarket(){
 const grid=$('#marketGrid'); grid.innerHTML=''; const q=$('#search').value.toLowerCase(); const f=$('#rarityFilter').value;
 cards.filter(c=>(f==='ALL'||c.rarity===f)&&(`${c.name} ${c.rarity} ${c.phrase}`.toLowerCase().includes(q))).forEach(c=>grid.appendChild(cardEl(c,false)));
}
function updateMetrics(){
 const unique=new Set(owned.map(c=>c.id)).size;
 const ssr=owned.filter(c=>['SSR','GOD'].includes(c.rarity)).length;
 const val=owned.reduce((a,c)=>a+(Number(c.price)||0),0);
 if($('#collectionRate')) $('#collectionRate').textContent=Math.round(unique/9*100)+'%';
 if($('#ssrCount')) $('#ssrCount').textContent=ssr;
 if($('#floorPrice')) $('#floorPrice').textContent=val.toFixed(3)+' SOL';
 if($('#drawerWallet')) $('#drawerWallet').textContent=wallet? (wallet.startsWith('DEMO')?'DEMO WALLET':wallet.slice(0,4)+'...'+wallet.slice(-4)):'NOT CONNECTED';
}
function renderOwned(){
 $('#ownedCount').textContent=owned.length; updateMetrics();
 const wrap=$('#myCollection');
 if(!owned.length){wrap.className='collectionEmpty';wrap.textContent='まだカードがありません。ガチャを回すとここに追加されます。';return;}
 wrap.className='ownedList'; wrap.innerHTML=''; owned.forEach((c,i)=>{ const el=cardEl(c,true); el.style.animationDelay=`${i*40}ms`; wrap.appendChild(el); });
}
function connectWallet(){
 if(window.solana?.isPhantom){
   window.solana.connect().then(res=>{wallet=res.publicKey.toString(); localStorage.setItem('yajuWallet',wallet); $('#walletBtn').textContent=wallet.slice(0,4)+'...'+wallet.slice(-4); updateMetrics(); showModal('Wallet Connected','Phantom接続完了。次は実NFTの保有確認、Mint、出品機能に接続できます。');}).catch(()=>{});
 } else { wallet='DEMO'+Math.random().toString(36).slice(2,8).toUpperCase(); localStorage.setItem('yajuWallet',wallet); $('#walletBtn').textContent='Demo Wallet'; updateMetrics(); showModal('Demo Wallet','Phantom未検出なのでデモウォレットで接続しました。'); }
}
async function runGacha(times=10){
 $('#resultGrid').innerHTML=''; const overlay=$('#overlay'), cd=$('#countdown'), burst=$('#rareBurst'); overlay.classList.add('show');
 for(const n of ['3','2','1','PUSH']){ cd.textContent=n; await new Promise(r=>setTimeout(r,520)); }
 const results=Array.from({length:times}, weighted); const best=results.some(c=>c.rarity==='GOD')?'GOD':results.some(c=>c.rarity==='SSR')?'SSR':results.some(c=>c.rarity==='SR')?'SR':'R';
 burst.textContent=best; burst.classList.add('go'); flash(); await new Promise(r=>setTimeout(r,1150)); burst.classList.remove('go'); overlay.classList.remove('show');
 const grid=$('#resultGrid');
 for(const c of results){ await new Promise(r=>setTimeout(r,260)); const p=document.createElement('div'); p.className=`pullCard ${rarityClass(c.rarity)}`; p.innerHTML=`<span class="badge">${c.rarity}</span><img src="${c.image}"><div class="price"><span>${c.phrase}</span><small>MINT</small></div>`; p.onclick=()=>mintCard(c); grid.appendChild(p); flash(); }
}
function mintCard(c){ owned.unshift({...c, mintedAt:new Date().toISOString(), serial:Math.floor(Math.random()*c.supply)+1}); save(); renderOwned(); showModal('NFT Mint Demo',`${c.name} をMintした想定でMy Collectionに追加しました。実装時はMetaplex Candy Machineに接続します。`); }
function init(){
 $('#caText').textContent=cfg.ca||'COMING_SOON'; if(wallet) $('#walletBtn').textContent=wallet.startsWith('DEMO')?'Demo Wallet':wallet.slice(0,4)+'...'+wallet.slice(-4);
 renderMarket(); renderOwned();
 $('#walletBtn').onclick=connectWallet; $('#gachaBtn').onclick=()=>runGacha(10); $('#tenBtn').onclick=()=>runGacha(10); $('#pushLever').onclick=()=>runGacha(10); $('#singleBtn').onclick=()=>runGacha(1); $('#openMarket').onclick=()=>location.hash='market';
 $('#search').oninput=renderMarket; $('#rarityFilter').onchange=renderMarket;
 $('#externalBtn').onclick=()=>window.open(cfg.magicEden||'#','_blank'); $('#discordBtn').onclick=()=>window.open(cfg.discord||'#','_blank');
 $('#copyCa').onclick=()=>navigator.clipboard?.writeText(cfg.ca||'').then(()=>showModal('Copied','CAをコピーしました。'));
 $('#syncBtn').onclick=()=>showModal('Holder Check','実装時はHelius/Tensor/Metaplex APIでウォレット内NFTを確認して保有カードを同期します。');
 $('#mintBtn').onclick=()=>showModal('Mint Scaffold',`Mint price: ${cfg.mintPriceSol} SOL。Candy Machine IDをconfig.jsに入れて接続します。`);
 $('#listDemo').onclick=()=>showModal('List NFT Demo','My Collectionからカードを選び、価格を入力してマーケットに出品する導線です。');
 $('#buyDemo').onclick=()=>showModal('Buy NFT Demo','購入時はPhantom署名 → SOL支払い → NFT受け取りの流れにします。');
 $('#closeModal').onclick=()=>$('#modal').classList.remove('show'); $('#modalOk').onclick=()=>$('#modal').classList.remove('show');
 $('#menuBtn').onclick=()=>$('#drawer').classList.add('open'); $('#closeDrawer').onclick=()=>$('#drawer').classList.remove('open'); document.querySelectorAll('#drawer a').forEach(a=>a.onclick=()=>$('#drawer').classList.remove('open'));
 const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('on')}),{threshold:.12}); document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
}
init();
