const dynasties = [
  { id:'qin', name:'秦', image:'assets/images/qin.png' }, { id:'han', name:'漢', image:'assets/images/han.png' },
  { id:'tang', name:'唐', image:'assets/images/tang.png' }, { id:'song', name:'宋', image:'assets/images/song.png' },
  { id:'ming', name:'明', image:'assets/images/ming.png' }, { id:'qing', name:'清', image:'assets/images/qing.png' }
];
const events = [
  ['qin','秦始皇統一中國，建立中央集權制度'], ['qin','修築萬里長城，兵馬俑守護陵墓'],
  ['han','張騫通西域，開啟絲路交流'], ['han','漢武帝推行儒學教育'],
  ['tang','唐詩興盛，李白、杜甫等詩人輩出'], ['tang','長安成為繁榮的國際大都市'],
  ['song','活字印刷術推動知識傳播'], ['song','宋代書院發達，重視讀書與理學'],
  ['ming','鄭和率領寶船多次下西洋'], ['ming','修築今日所見的大量明長城'],
  ['qing','康熙、乾隆時期國力強盛'], ['qing','清末面對西方衝擊，展開洋務運動']
].map(([dynasty,text],i)=>({dynasty,text,id:`event-${i}`}));

const grid=document.querySelector('#dynastyGrid'), pile=document.querySelector('#eventPile'), score=document.querySelector('#score');
const tip=document.querySelector('#selectionTip'), toast=document.querySelector('#toast'), modal=document.querySelector('#winModal');
let selected=null, completed=0, timer;
const shuffle=list=>[...list].sort(()=>Math.random()-.5);
function showToast(message,error=false){ clearTimeout(timer); toast.textContent=message; toast.className=`toast show${error?' error':''}`; timer=setTimeout(()=>toast.className='toast',2100); }
function render(){
  completed=0; selected=null; score.textContent='0'; tip.textContent='請挑一張卷軸開始！'; grid.innerHTML=''; pile.innerHTML='';
  dynasties.forEach(d=>{
    const card=document.createElement('article'); card.className='dynasty-card'; card.dataset.dynasty=d.id; card.style.backgroundImage=`url("${d.image}")`;
    card.innerHTML=`<h3 class="dynasty-label">${d.name}</h3><div class="drop-zone" aria-label="放入${d.name}代事件"></div>`;
    card.addEventListener('dragover',e=>{e.preventDefault();card.classList.add('drag-over')}); card.addEventListener('dragleave',()=>card.classList.remove('drag-over'));
    card.addEventListener('drop',e=>{e.preventDefault();card.classList.remove('drag-over'); const el=document.getElementById(e.dataTransfer.getData('text/plain')); if(el) attempt(el, d.id);});
    card.addEventListener('click',()=>{ if(selected) attempt(selected,d.id); }); grid.append(card);
  });
  shuffle(events).forEach(event=>{
    const el=document.createElement('button'); el.type='button'; el.className='scroll'; el.id=event.id; el.draggable=true; el.dataset.dynasty=event.dynasty; el.textContent=event.text;
    el.addEventListener('dragstart',e=>{ selected=el; e.dataTransfer.setData('text/plain',el.id); e.dataTransfer.effectAllowed='move'; });
    el.addEventListener('click',()=>select(el)); pile.append(el);
  });
}
function select(el){ if(el.classList.contains('placed'))return; document.querySelectorAll('.scroll.selected').forEach(x=>x.classList.remove('selected')); selected=el; el.classList.add('selected'); tip.textContent='已選取卷軸：請點選正確的朝代卡。'; }
function attempt(el,target){
  if(el.classList.contains('placed')) return;
  if(el.dataset.dynasty!==target){ showToast('再想一想！這張卷軸退回原處。',true); el.classList.remove('selected'); selected=null; tip.textContent='提示：想想這件事發生在哪個朝代？'; return; }
  const card=document.querySelector(`.dynasty-card[data-dynasty="${target}"]`); el.classList.remove('selected'); el.classList.add('placed'); el.draggable=false; card.querySelector('.drop-zone').append(el); selected=null; completed++; score.textContent=completed; tip.textContent='配對成功！再挑一張卷軸。';
  if(!card.querySelector('.card-seal')) { const seal=document.createElement('span'); seal.className='seal card-seal'; seal.textContent='正確'; card.append(seal); }
  showToast('配對正確！蓋上通關印章。'); if(completed===events.length) setTimeout(()=>{modal.classList.add('open');modal.setAttribute('aria-hidden','false')},500);
}
document.querySelector('#restart').addEventListener('click',render); document.querySelector('#playAgain').addEventListener('click',()=>{modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); render();}); render();
