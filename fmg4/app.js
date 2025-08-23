/* ===== 基本資訊 ===== */
document.getElementById('now').textContent = window.PAGE_INFO.updatedAt;

/* ===== 工具 & 全域狀態 ===== */
const $  = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

let currentSection = 'species';   // 目前分頁
let currentView    = 'bar';       // 目前視圖（table | bar | pie | line | tree）
let charts = {};                  // 圖表實例暫存（避免記憶體洩漏）
let fs = 16;                      // 字體大小（可被縮放）
let imgScale = 1;                 // 圖片縮放

/* ===== 頂欄高度（避免捲動被遮） ===== */
function setHeaderH(){
  const h = $('.topbar')?.offsetHeight || 72;
  document.documentElement.style.setProperty('--headerH', h + 'px');
}
window.addEventListener('resize', setHeaderH);
setHeaderH();

/* ===== 模式切換：手機 / 桌機 / 自動 ===== */
const body     = document.body;
const MODE_KEY = 'ui-mode'; // 'auto' | 'mobile' | 'desktop'
const modeIds  = { auto:'modeAuto', mobile:'modeMobile', desktop:'modeDesktop' };

function markActiveMode(mode){
  Object.values(modeIds).forEach(id => document.getElementById(id)?.classList.remove('active'));
  document.getElementById(modeIds[mode])?.classList.add('active');
}

function applyMode(mode,{silent=false}={}){
  body.classList.toggle('mode-mobile',  mode==='mobile');
  body.classList.toggle('mode-desktop', mode==='desktop');
  localStorage.setItem(MODE_KEY, mode);
  setHeaderH();                                 // 頂欄可能換行變高 → 重新量測
  markActiveMode(mode);
  if(!silent) window.scrollTo({ top:0, behavior:'smooth' });
}
function initMode(){
  const saved = localStorage.getItem(MODE_KEY) || 'auto';
  applyMode(saved,{silent:true});
}
['auto','mobile','desktop'].forEach(m=>{
  document.getElementById(modeIds[m])?.addEventListener('click', ()=>applyMode(m));
});
initMode();

/* ===== 頂欄：視圖切換 chips ===== */
function setView(view){
  $$('.view-dock .chip').forEach(x=>x.classList.remove('active'));
  document.querySelector(`.view-dock .chip[data-view="${view}"]`)?.classList.add('active');
  currentView = view;
  renderSection(currentSection);
  scrollToFirstViz();
}
$$('.view-dock .chip').forEach(btn=>{
  btn.addEventListener('click', ()=> setView(btn.dataset.view));
});
document.querySelector(`.view-dock .chip[data-view="${currentView}"]`)?.classList.add('active');

/* ===== 文字/圖片縮放 ===== */
function applyZoom(){
  document.documentElement.style.setProperty('--fs', fs + 'px');
  document.documentElement.style.setProperty('--imgScale', imgScale);
}
$('#fontInc').onclick=()=>{ fs=Math.min(22, fs+1); applyZoom(); };
$('#fontDec').onclick=()=>{ fs=Math.max(12, fs-1); applyZoom(); };
$('#imgInc').onclick =()=>{ imgScale=Math.min(1.5, +(imgScale+0.1).toFixed(2)); applyZoom(); };
$('#imgDec').onclick =()=>{ imgScale=Math.max(0.7, +(imgScale-0.1).toFixed(2)); applyZoom(); };
$('#resetAll').onclick=()=>{ fs=16; imgScale=1; applyZoom(); };

/* ===== 側欄分頁切換 ===== */
$$('.navlink').forEach(a=>{
  a.addEventListener('click', ()=>{
    $$('.navlink').forEach(x=>x.classList.remove('active'));
    a.classList.add('active');
    currentSection = a.dataset.section;
    renderSection(currentSection);
    // 捲到分頁頂端 & 對齊頂欄高度
    const p = $(`.panel[data-panel="${currentSection}"]`);
    if(p){
      const hh  = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--headerH')) || 72;
      const top = p.getBoundingClientRect().top + window.scrollY - hh;
      window.scrollTo({ top, behavior:'smooth' });
      scrollToFirstViz();
    }
  });
});
document.querySelector(`[data-section="${currentSection}"]`)?.classList.add('active');

/* ===== 手機左右滑換頁 ===== */
(function(){
  let startX=0, startY=0, active=false;
  const threshold=60, vertMax=50;
  const content=$('#content');
  content.addEventListener('pointerdown', e=>{ active=true; startX=e.clientX; startY=e.clientY; });
  content.addEventListener('pointerup',   e=>{
    if(!active) return; active=false;
    const dx=e.clientX-startX, dy=e.clientY-startY;
    if(Math.abs(dy)>vertMax) return;
    if(dx>threshold)  navPrev();
    if(dx<-threshold) navNext();
  });
})();
function navOrder(){ return $$('.navlink').map(a=>a.dataset.section); }
function navNext(){ const o=navOrder(), i=o.indexOf(currentSection); const n=o[Math.min(o.length-1,i+1)]; if(n && n!==currentSection){ $(`.navlink[data-section="${n}"]`).click(); } }
function navPrev(){ const o=navOrder(), i=o.indexOf(currentSection); const p=o[Math.max(0,i-1)];    if(p && p!==currentSection){ $(`.navlink[data-section="${p}"]`).click(); } }

/* ===== Chart.js & 外掛容錯註冊 ===== */
if (window.ChartDataLabels) {
  Chart.register(ChartDataLabels);
} else {
  console.warn('chartjs-plugin-datalabels not loaded; proceeding without datalabels.');
}

/* ===== Chart helpers ===== */
function clearCharts(){ Object.values(charts).forEach(ch=>{ try{ ch.destroy(); }catch{} }); charts={}; }

function makeBar(ctx, labels, values, label){
  return new Chart(ctx,{ type:'bar',
    data:{ labels, datasets:[{ label, data:values }]},
    options:{
      indexAxis:'y', responsive:true, maintainAspectRatio:false,
      plugins:{ legend:{ labels:{ color:'#cfd3ff' } },
        datalabels:{ color:'#cfd3ff', anchor:'end', align:'right', formatter:v=>v } },
      scales:{ x:{ ticks:{ color:'#cfd3ff' }, grid:{ color:'rgba(255,255,255,.08)' }, beginAtZero:true },
               y:{ ticks:{ color:'#cfd3ff' }, grid:{ color:'rgba(255,255,255,.08)' } } }
    }
  });
}
function makePie(ctx, labels, values){
  return new Chart(ctx,{ type:'pie',
    data:{ labels, datasets:[{ data:values }]},
    options:{ responsive:true, maintainAspectRatio:false,
      plugins:{ legend:{ position:'right', labels:{ color:'#cfd3ff' } },
        datalabels:{ formatter:(v,ctx)=>{
          const sum = ctx.chart.data.datasets[0].data.reduce((a,b)=>a+b,0);
          const p = sum? Math.round(v/sum*100):0;
          const lbl = ctx.chart.data.labels[ctx.dataIndex];
          return `${lbl}\n${p}%`;
        }, color:'#e9ebff' } }
    }
  });
}
function makeLine(ctx, labels, series){
  return new Chart(ctx,{ type:'line',
    data:{ labels, datasets: series.map(s=>({ label:s.name, data:s.data, tension:.35, fill:false })) },
    options:{ responsive:true, maintainAspectRatio:false,
      plugins:{ legend:{ labels:{ color:'#cfd3ff' } } },
      scales:{ x:{ ticks:{ color:'#cfd3ff' }, grid:{ color:'rgba(255,255,255,.08)' } },
               y:{ ticks:{ color:'#cfd3ff' }, grid:{ color:'rgba(255,255,255,.08)' }, beginAtZero:true, suggestedMax:100 } }
    }
  });
}
function renderTable(container, headers, rows){
  container.innerHTML = `<table><thead>${headers.map(h=>`<th>${h}</th>`).join('')}</thead>
    <tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
}

/* ===== 自動捲到本分頁第一個可見圖或表 ===== */
function scrollToFirstViz(){
  const panel = document.querySelector(`.panel[data-panel="${currentSection}"]`);
  if(!panel) return;
  const target = panel.querySelector('canvas[style*="display: block"], .table-wrap[style*="display: block"]')
             || panel.querySelector('canvas, .table-wrap');
  if(!target) return;
  const hh  = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--headerH')) || 72;
  const top = target.getBoundingClientRect().top + window.scrollY - hh;
  window.scrollTo({ top, behavior:'smooth' });
}

/* ====== 各分頁渲染 ====== */
function renderSpecies(){
  const bar = $('#chartSpeciesBar'), pie = $('#chartSpeciesPie'), tbl = $('#tableSpecies');
  bar.style.display = pie.style.display = tbl.style.display = 'none';

  // 樹狀
  const wrap = $('#treeWrap'); wrap.innerHTML='';
  const build = (obj)=>{
    const box = document.createElement('div');
    Object.entries(obj).forEach(([k,v])=>{
      const det = document.createElement('details'); det.open = true;
      const sum = document.createElement('summary'); sum.textContent = k; det.appendChild(sum);
      if(Array.isArray(v)){ const small = document.createElement('small'); small.textContent = v.join('、'); det.appendChild(small); }
      else det.appendChild(build(v));
      box.appendChild(det);
    });
    return box;
  };
  wrap.appendChild(build(window.SPECIES_TREE));

  const labels = window.SPECIES_COUNTS.map(x=>x.label);
  const values = window.SPECIES_COUNTS.map(x=>x.value);

  if(currentView==='bar'){ bar.style.display='block'; charts.sBar = makeBar(bar, labels, values, '品類下物種數（示範）'); }
  else if(currentView==='pie'){ pie.style.display='block'; charts.sPie = makePie(pie, labels, values); }
  else if(currentView==='table'){
    tbl.style.display='block';
    const rows=[];
    Object.entries(window.SPECIES_TREE).forEach(([cat, sub])=>{
      Object.entries(sub).forEach(([sp, sci])=> rows.push([cat, sp, sci.join('；')]));
    });
    renderTable(tbl, ['分類','代表物種','備註/學名'], rows);
  }
  else if(currentView==='line'){
    bar.style.display='block';
    charts.sLine = makeLine(bar, ['草食','肉食','節肢','魚類','雜食'], [{name:'相對熱度示例', data:[40,35,32,30,38]}]);
  }
}

function renderAdvantages(){
  const bar = $('#chartAdvBar'), tbl = $('#tableAdv');
  bar.style.display = tbl.style.display = 'none';
  const labels = window.ADVANTAGE_DATA.map(x=>x.label);

  if(currentView==='bar'){
    bar.style.display='block';
    charts.aBar = new Chart(bar,{ type:'bar',
      data:{ labels, datasets:[
        {label:'月支出（低好）', data:window.ADVANTAGE_DATA.map(x=>x.月支出)},
        {label:'餵食頻率（低好）', data:window.ADVANTAGE_DATA.map(x=>x.餵食頻率)},
        {label:'空間需求（低好）', data:window.ADVANTAGE_DATA.map(x=>x.空間需求)},
        {label:'氣味管理（低好）', data:window.ADVANTAGE_DATA.map(x=>x.氣味管理)}
      ]},
      options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ labels:{ color:'#cfd3ff' } } },
        scales:{ x:{ ticks:{ color:'#cfd3ff' }, grid:{ color:'rgba(255,255,255,.08)' } },
                 y:{ ticks:{ color:'#cfd3ff' }, grid:{ color:'rgba(255,255,255,.08)' }, beginAtZero:true, reverse:true, suggestedMax:5 } }
      }
    });
  } else if(currentView==='table'){
    tbl.style.display='block';
    renderTable(tbl,['物種','月支出','餵食頻率','空間需求','氣味管理'], window.ADVANTAGE_DATA.map(x=>[x.label,x.月支出,x.餵食頻率,x.空間需求,x.氣味管理]));
  } else if(currentView==='pie'){
    bar.style.display='block';
    charts.aPie = makePie(bar, labels, window.ADVANTAGE_DATA.map(x=>6-x.月支出));
  } else { // line / tree
    bar.style.display='block';
    const comp = window.ADVANTAGE_DATA.map(x=> 6 - ((x.月支出+x.餵食頻率+x.空間需求+x.氣味管理)/4));
    charts.aLine = makeLine(bar, labels, [{name:'省力綜合指數（示例）', data: comp }]);
  }
}

function renderCompare(){
  const bar = $('#chartCompareBar'), radar = $('#chartCompareRadar'), tbl = $('#tableCompare');
  bar.style.display = radar.style.display = tbl.style.display = 'none';
  const labels = window.COMPARE_DATA.map(x=>x.label);
  const dims=['月支出','時間成本','用品迭代','敏感體質風險'];

  if(currentView==='bar'){
    bar.style.display='block';
    charts.cBar = new Chart(bar,{ type:'bar',
      data:{ labels, datasets: dims.map(dim=>({label:dim,data:window.COMPARE_DATA.map(x=>x[dim])})) },
      options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ labels:{ color:'#cfd3ff' } } },
        scales:{ x:{ ticks:{ color:'#cfd3ff' }, grid:{ color:'rgba(255,255,255,.08)' } },
                 y:{ ticks:{ color:'#cfd3ff' }, grid:{ color:'rgba(255,255,255,.08)' }, beginAtZero:true, suggestedMax:5 } }
      }
    });
  } else if(currentView==='table'){
    tbl.style.display='block';
    renderTable(tbl, ['類別',...dims], window.COMPARE_DATA.map(x=>[x.label, ...dims.map(d=>x[d])]));
  } else if(currentView==='pie'){
    bar.style.display='block';
    const val = window.COMPARE_DATA.map(x=> 20 - (x.月支出 + x.時間成本));
    charts.cPie = makePie(bar, labels, val);
  } else { // line / tree → radar 示意
    radar.style.display='block';
    charts.cRadar = new Chart(radar,{ type:'radar',
      data:{ labels:dims, datasets: window.COMPARE_DATA.filter(x=>['狗','貓','守宮','鬆獅蜥','球蟒'].includes(x.label))
        .map(x=>({ label:x.label, data:dims.map(d=>x[d]) })) },
      options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ labels:{ color:'#cfd3ff' } } },
        scales:{ r:{ angleLines:{ color:'rgba(255,255,255,.08)' }, grid:{ color:'rgba(255,255,255,.08)' }, pointLabels:{ color:'#cfd3ff' }, ticks:{ display:false } } }
      }
    });
  }
}

function renderTrend(){
  const line=$('#chartTrendLine'), pie=$('#chartTrendPie'), bar=$('#chartTrendBar'), tbl=$('#tableTrend');
  line.style.display = pie.style.display = bar.style.display = tbl.style.display = 'none';
  const labels = window.TREND_SERIES.labels;
  const series = window.TREND_SERIES.series;

  if(currentView==='line'){ line.style.display='block'; charts.tLine = makeLine(line, labels, series); }
  else if(currentView==='pie'){ pie.style.display='block'; charts.tPie = makePie(pie, window.TREND_SHARE.map(x=>x.label), window.TREND_SHARE.map(x=>x.value)); }
  else if(currentView==='bar'){ bar.style.display='block'; charts.tBar = makeBar(bar, window.TREND_SHARE.map(x=>x.label), window.TREND_SHARE.map(x=>x.value), '物種份額（示例）'); }
  else if(currentView==='table'){
    tbl.style.display='block';
    const head = ['年份', ...series.map(s=>s.name)];
    const rows = labels.map((y,i)=>[y, ...series.map(s=>s.data[i])]);
    renderTable(tbl, head, rows);
  } else { // tree → 退回長條
    bar.style.display='block'; charts.tBar = makeBar(bar, window.TREND_SHARE.map(x=>x.label), window.TREND_SHARE.map(x=>x.value), '物種份額（示例）');
  }
}

function renderSources(){
  const tbl = $('#tableSources');
  renderTable(tbl, ['資料來源（文獻名稱）','網址','重點'], window.SOURCES.map(r=>[
    r[0], `<a href="${r[1]}" target="_blank" rel="noopener">${r[1]}</a>`, r[2]
  ]));
  $('#exportSources').onclick = ()=> {
    const rows = [['資料來源','網址','重點'],...window.SOURCES];
    const csv = rows.map(r=>r.map(x=>`"${String(x).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'}); const a=document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download='sources.csv'; a.click();
  };
}

function renderIdeation(){
  const ul = $('#ideaList');
  function paint(){
    ul.innerHTML = '';
    [...window.IDEA_POOL].sort(()=>Math.random()-0.5).slice(0,10)
      .forEach(txt=>{ const li=document.createElement('li'); li.textContent=txt; ul.appendChild(li); });
  }
  $('#ideaShuffle').onclick = paint; paint();
}

function renderSWOT(){
  const g = $('#swotGrid'); g.innerHTML='';
  const block = (title, arr) => {
    const d = document.createElement('div'); d.innerHTML = `<h3>${title}</h3><ul class="bullets">${arr.map(x=>`<li>${x}</li>`).join('')}</ul>`;
    return d;
  };
  g.appendChild(block('S｜優勢', window.SWOT.S));
  g.appendChild(block('W｜弱勢', window.SWOT.W));
  g.appendChild(block('O｜機會', window.SWOT.O));
  g.appendChild(block('T｜威脅', window.SWOT.T));
}

function renderSummary(){ /* 文本已在 HTML */ }

/* ====== 分頁渲染分發 ====== */
function renderSection(section){
  clearCharts();
  $$('.panel').forEach(p=>p.style.display = (p.dataset.panel===section?'block':'none'));
  // 開啟對應渲染
  if(section==='species')        renderSpecies();
  else if(section==='advantages') renderAdvantages();
  else if(section==='compare')    renderCompare();
  else if(section==='trend')      renderTrend();
  else if(section==='sources')    renderSources();
  else if(section==='ideation')   renderIdeation();
  else if(section==='swot')       renderSWOT();
  else if(section==='summary')    renderSummary();
}
renderSection(currentSection);
