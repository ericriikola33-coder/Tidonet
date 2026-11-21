/* Money Card: 8 money types, 5 money stats and a collectible result card for the Larry or Bella quiz. */
(function(){
  // which stat each question feeds (question order in the quiz)
  var DIMQ=[0,4,3,2,4,1,0,3,1,2];
  var C={sleepy:'#8ea596',impulse:'#ef4b5a',surfer:'#4fb3ff',hunter:'#f5b544',spirit:'#b57cff',almost:'#ffd166',steady:'#34d27b',investor:'#2ee6c8'};
  var E={sleepy:'😴',impulse:'🛍️',surfer:'🏄',hunter:'🏷️',spirit:'🎈',almost:'😅',steady:'✨',investor:'📈'};
  var ORDER=['sleepy','impulse','surfer','hunter','spirit','almost','steady','investor'];
  var L={
    en:{dims:['SAVE','PLAN','CALM','DEBT-FREE','MONEY IQ'],stats:'Your money stats',step:'Your first step',typeOf:'Money type',
      card:'MY MONEY CARD',series:'SERIES 1',cta:'Can you beat me? 👀',url:'tidonet.com/larry',strong:'Strongest',weak:'Weakest',
      T:{sleepy:['The Sleepy Larry',"Your money naps. Prices don't.",'Move a small amount to savings on payday, before you spend anything.'],
        impulse:['The Impulse Larry','A countdown timer is your kryptonite.','Wait 24 hours before any buy over $30. Most "deals" come back.'],
        surfer:['The Paycheck Surfer','You ride every payday wave… until it\'s gone.','Set up an automatic transfer to savings the day your pay arrives.'],
        hunter:['The Deal Hunter','"50% off" makes you feel rich. It isn\'t.','Only buy deals that were already on your list. Check the price history first.'],
        spirit:['The Free Spirit','Good habits, zero plan. Freedom needs a budget.','Write a one-page budget this week. Just income, bills and one savings goal.'],
        almost:['The Almost-Bella','One habit away from full Bella.','Fix your weakest stat below. That is the fastest way to Bella.'],
        steady:['The Steady Bella','Saves first, buys later, sleeps well.','Raise your monthly saving by 1% every time you get a raise.'],
        investor:['The Investor Bella','Your money works night shifts for you.','Keep fees low and keep investing every month. Time does the heavy lifting.']}},
    sv:{dims:['SPARA','PLANERA','LUGN','SKULDFRI','PENG-IQ'],stats:'Din pengastatistik',step:'Ditt första steg',typeOf:'Pengatyp',
      card:'MITT PENGAKORT',series:'SERIE 1',cta:'Kan du slå mig? 👀',url:'tidonet.com/sv/larry',strong:'Starkast',weak:'Svagast',
      T:{sleepy:['Sömniga Larry','Dina pengar sover. Priserna gör det inte.','Flytta en liten summa till sparandet på lönedagen, innan du spenderar något.'],
        impulse:['Impuls-Larry','En nedräkning är din kryptonit.','Vänta 24 timmar innan varje köp över 300 kr. De flesta "fynd" kommer tillbaka.'],
        surfer:['Lönesurfaren','Du surfar på varje lönevåg… tills den är slut.','Lägg in en automatisk överföring till sparandet samma dag som lönen kommer.'],
        hunter:['Fyndjägaren','"50 % rabatt" känns som att tjäna pengar. Det är det inte.','Köp bara fynd som redan stod på din lista. Kolla prishistoriken först.'],
        spirit:['Frisjälen','Bra vanor, noll plan. Frihet behöver en budget.','Gör en budget på en sida den här veckan. Bara inkomst, räkningar och ett sparmål.'],
        almost:['Nästan-Bella','En vana från full Bella.','Jobba på din svagaste stat här nedanför. Det är snabbaste vägen till Bella.'],
        steady:['Stabila Bella','Sparar först, köper sen, sover gott.','Höj ditt månadssparande med 1 % varje gång du får löneförhöjning.'],
        investor:['Investerar-Bella','Dina pengar jobbar nattskift åt dig.','Håll avgifterna låga och fortsätt spara varje månad. Tiden gör jobbet.']}}
  };
  function dims(ans){var v=[0,0,0,0,0];ans.forEach(function(k,i){v[DIMQ[i]]+=k;});return v.map(function(x){return Math.round(x/4*100);});}
  function argmin(d){var m=0;d.forEach(function(x,i){if(x<d[m])m=i;});return m;}
  function argmax(d){var m=0;d.forEach(function(x,i){if(x>d[m])m=i;});return m;}
  function typeOf(pct,d){var lo=argmin(d);
    if(pct<40)return (lo===2||lo===3)?'impulse':'sleepy';
    if(pct<70){if(lo===0)return 'surfer';if(lo===2)return 'hunter';if(lo===1)return 'spirit';return 'almost';}
    return d[4]>=75&&d[4]>=d[0]?'investor':'steady';}
  function radar(d,col,labels,size){var s=size||220,c=s/2,r=s*.34,n=5,pt=function(i,f){var a=-Math.PI/2+i*2*Math.PI/n;return [c+Math.cos(a)*r*f,c+Math.sin(a)*r*f];};
    var g='';[.25,.5,.75,1].forEach(function(f){g+='<polygon points="'+[0,1,2,3,4].map(function(i){return pt(i,f).join(',');}).join(' ')+'" fill="none" stroke="rgba(255,255,255,.12)" stroke-width="1"/>';});
    [0,1,2,3,4].forEach(function(i){var p=pt(i,1);g+='<line x1="'+c+'" y1="'+c+'" x2="'+p[0]+'" y2="'+p[1]+'" stroke="rgba(255,255,255,.1)"/>';var q=pt(i,1.28);g+='<text x="'+q[0]+'" y="'+(q[1]+3)+'" fill="#9aa4bd" font-size="9.5" font-weight="700" text-anchor="middle" font-family="Inter,sans-serif">'+labels[i]+'</text>';});
    var poly=[0,1,2,3,4].map(function(i){return pt(i,Math.max(.06,d[i]/100)).join(',');}).join(' ');
    g+='<polygon points="'+poly+'" fill="'+col+'" fill-opacity=".28" stroke="'+col+'" stroke-width="2.5"/>';
    [0,1,2,3,4].forEach(function(i){var p=pt(i,Math.max(.06,d[i]/100));g+='<circle cx="'+p[0]+'" cy="'+p[1]+'" r="3.5" fill="'+col+'"/>';});
    return '<svg viewBox="-30 -6 '+(s+60)+' '+(s+12)+'" width="100%" style="max-width:'+(s+60)+'px;display:block;margin:0 auto" role="img" aria-label="Radar chart">'+g+'</svg>';}
  function cardNo(){return String(1+Math.floor(Math.random()*9999)).padStart(4,'0');}
  window.MC={L:L,C:C,E:E,ORDER:ORDER,dims:dims,typeOf:typeOf,
    chips:function(el,lang){var t=L[lang].T;el.innerHTML=ORDER.map(function(k){return '<span class="mcchip" style="border-color:'+C[k]+'55"><i>'+E[k]+'</i>'+t[k][0]+'</span>';}).join('');},
    render:function(el,ans,pct,lang){
      var l=L[lang],d=dims(ans),k=typeOf(pct,d),t=l.T[k],col=C[k],no=cardNo(),lo=argmin(d),hi=argmax(d);
      var bars=d.map(function(v,i){return '<div class="mcbar"><span>'+l.dims[i]+'</span><b><i style="width:'+Math.max(4,v)+'%;background:'+col+'"></i></b><em>'+v+'</em></div>';}).join('');
      el.innerHTML='<div class="mccard" style="--c:'+col+'"><div class="mchead"><span>🃏 '+l.card+'</span><small>'+l.series+' · #'+no+'</small></div>'+
        '<p class="mcline">“'+t[1]+'”</p><h3>'+l.stats+'</h3><div class="mcgrid"><div>'+radar(d,col,l.dims)+'</div><div>'+bars+
        '<p class="mcsw">💪 '+l.strong+': <b>'+l.dims[hi]+'</b><br>🩹 '+l.weak+': <b>'+l.dims[lo]+'</b></p></div></div>'+
        '<div class="mcstep"><span>'+l.step+'</span>'+t[2]+'</div></div>';
      return {key:k,name:t[0],emoji:E[k],line:t[1],color:col,dims:d,no:no,lang:lang,pct:pct};
    }};
  var css='.mcchips{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin:6px 0 16px}.mcchip{display:inline-flex;align-items:center;gap:6px;border:1px solid var(--line);background:var(--card2);border-radius:999px;padding:7px 12px;font-size:13.5px;font-weight:600}.mcchip i{font-style:normal}'+
    '.mccard{margin:16px 0 4px;border:2px solid var(--c);border-radius:18px;overflow:hidden;background:linear-gradient(180deg,#141b2e,#0f1420);box-shadow:0 0 24px color-mix(in srgb,var(--c) 30%,transparent)}'+
    '.mchead{display:flex;justify-content:space-between;align-items:center;gap:8px;background:var(--c);color:#0f1420;padding:11px 14px;font-family:"Space Grotesk",sans-serif;font-weight:700;font-size:17px}.mchead small{font-size:11.5px;opacity:.75;white-space:nowrap}'+
    '.mcline{text-align:center;color:#d6dbe7;font-style:italic;margin:12px 14px 2px}.mccard h3{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);text-align:center;margin:12px 0 2px}'+
    '.mcgrid{display:grid;grid-template-columns:1fr 1fr;gap:6px;align-items:center;padding:0 12px}@media(max-width:380px){.mcgrid{grid-template-columns:1fr}}'+
    '.mcbar{display:grid;grid-template-columns:74px 1fr 26px;align-items:center;gap:6px;margin:6px 0;font-size:11px;font-weight:700;color:#9aa4bd}.mcbar b{height:7px;background:rgba(255,255,255,.08);border-radius:9px;overflow:hidden}.mcbar b i{display:block;height:100%;border-radius:9px}.mcbar em{font-style:normal;color:#fff;text-align:right}'+
    '.mcsw{font-size:12.5px;color:#d6dbe7;margin:8px 0 0}.mcstep{margin:12px;background:rgba(255,255,255,.05);border-radius:12px;padding:11px 13px;font-size:14.5px}.mcstep span{display:block;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--c);font-weight:800;margin-bottom:3px}';
  var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
})();
