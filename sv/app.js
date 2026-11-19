(function(){
  var $ = function(id){ return document.getElementById(id); };
  var SITE = 'https://tidonet.com/sv/';
  var symbols = {USD:'$',EUR:'€',GBP:'£',SEK:'kr'};
  var params = new URLSearchParams(location.search);

  var cur = 'SEK';
  try { cur = localStorage.getItem('tidonet-cur-sv') || 'SEK'; } catch(e){}
  if (params.get('c') && symbols[params.get('c')]) cur = params.get('c');

  function money(v){
    try { return new Intl.NumberFormat('sv-SE',{style:'currency',currency:cur,maximumFractionDigits:0}).format(v); }
    catch(e){ return Math.round(v) + ' ' + cur; }
  }
  function n(v,d){ return new Intl.NumberFormat('sv-SE',{maximumFractionDigits:d||0}).format(v); }
  function hrs(h){ return n(h, h<10?1:0); }
  function grow(start, monthly, years, rate){
    var r = rate/100/12, bal = start, pts=[start];
    for(var m=1;m<=years*12;m++){ bal = bal*(1+r) + monthly; if(m%12===0) pts.push(bal); }
    return {bal:bal, pts:pts};
  }

  var toast;
  function say(msg){
    if(!toast){ toast=document.createElement('div'); toast.className='toast'; document.body.appendChild(toast); }
    toast.textContent=msg; toast.classList.add('show');
    clearTimeout(toast._t); toast._t=setTimeout(function(){ toast.classList.remove('show'); },1800);
  }
  function copyText(t, onOk, onFail){
    try { navigator.clipboard.writeText(t).then(onOk, onFail); } catch(e){ onFail(); }
  }
  function share(text, url){
    if (navigator.share) { navigator.share({ title:'Tidonet', text:text, url:url }).catch(function(){}); return; }
    copyText(text + ' ' + url, function(){ say('Länken är kopierad ✓ Klistra in var du vill'); }, function(){ say('Kunde inte kopiera – håll inne för att kopiera'); });
  }
  function q(obj){
    var p = new URLSearchParams();
    Object.keys(obj).forEach(function(k){ p.set(k, obj[k]); });
    return p.toString();
  }

  if (!$('v-work-hours')) return;
  var num = function(id){ var v = parseFloat($(id).value); return isFinite(v) ? v : 0; };
  $('cur').value = cur;

  var map = {p:'w-price', w:'w-wage', d:'w-day', s:'g-start', m:'g-month', y:'g-years', r:'g-rate', hd:'h-day', hy:'h-years', hr:'h-rate'};
  Object.keys(map).forEach(function(k){
    var v = params.get(k);
    if (v !== null && v !== '' && isFinite(parseFloat(v))) $(map[k]).value = parseFloat(v);
  });

  function work(){
    var price=num('w-price'), wage=num('w-wage'), day=num('w-day')||8;
    if(wage<=0){ $('w-out').textContent='–'; $('w-out2').textContent='Fyll i din timlön'; $('w-hook').textContent=''; return; }
    var h = price/wage, d = h/day;
    $('w-out').textContent = hrs(h) + ' timmar';
    $('w-out2').textContent = 'Det är ' + n(d,1) + ' hela arbetsdagar (' + n(d/5,1) + ' veckor)';
    $('w-hook').textContent = 'Köpet för ' + money(price) + '? Om du tjänar ' + money(wage) + ' i timmen kostar det dig ' + hrs(h) + ' timmar av ditt liv. Det är ' + n(d,1) + ' hela arbetsdagar. Fortfarande värt det?';
  }

  function growView(){
    var s=num('g-start'), m=num('g-month'), y=+$('g-years').value, r=+$('g-rate').value;
    $('g-yl').textContent=y; $('g-yk').textContent=y; $('g-rl').textContent=n(r,1);
    var g = grow(s,m,y,r), bal=g.bal, pts=g.pts;
    var put = s + m*12*y;
    $('g-out').textContent = money(bal);
    $('g-in').textContent = money(put);
    $('g-gain').textContent = money(Math.max(0,bal-put));
    var H=150, W=300, max=Math.max(bal,1), bw=W/pts.length, svg='';
    pts.forEach(function(v,i){
      var inv = s + m*12*i;
      var hT = v/max*(H-8), hI = Math.min(inv,v)/max*(H-8);
      var x=i*bw+bw*0.15, w=bw*0.7;
      svg += '<rect x="'+x+'" y="'+(H-hT)+'" width="'+w+'" height="'+hT+'" rx="1.5" fill="#f5b544"/>';
      svg += '<rect x="'+x+'" y="'+(H-hI)+'" width="'+w+'" height="'+hI+'" rx="1.5" fill="#6b7a9e"/>';
    });
    $('g-chart').innerHTML = svg;
    var lead = s>0 ? 'Börja med ' + money(s) + ' och spara ' + money(m) + ' i månaden.' : 'Spara bara ' + money(m) + ' i månaden.';
    $('g-hook').textContent = lead + ' På ' + y + ' år, med ' + n(r,1) + ' % per år, kan du ha ' + money(bal) + '. Du satte bara in ' + money(put) + '. Resten? Det är tiden som jobbar åt dig.';
  }

  function habit(){
    var d=num('h-day'), y=+$('h-years').value, r=+$('h-rate').value;
    $('h-yl').textContent=y; $('h-rl').textContent=n(r,1);
    var spent = d*365*y;
    var bal = grow(0, d*365/12, y, r).bal;
    $('h-out').textContent = money(bal);
    $('h-out2').textContent = 'Du skulle spendera ' + money(spent) + ' totalt';
    $('h-hook').textContent = 'Din vana för ' + money(d) + ' om dagen känns liten. Men på ' + y + ' år blir det ' + money(spent) + '. Investerat med ' + n(r,1) + ' % per år i stället kunde det ha växt till ' + money(bal) + '.';
  }

  function all(){
    document.querySelectorAll('.cs').forEach(function(e){ e.textContent=symbols[cur]; });
    work(); growView(); habit();
  }

  document.querySelectorAll('.card input').forEach(function(i){ i.addEventListener('input', all); });
  $('cur').addEventListener('change', function(e){ cur=e.target.value; try{localStorage.setItem('tidonet-cur-sv',cur);}catch(err){} all(); });

  function shareUrl(view){
    var o = {c:cur};
    if (view==='work-hours') { o.p=num('w-price'); o.w=num('w-wage'); o.d=num('w-day'); }
    if (view==='grow') { o.s=num('g-start'); o.m=num('g-month'); o.y=$('g-years').value; o.r=$('g-rate').value; }
    if (view==='habit') { o.hd=num('h-day'); o.hy=$('h-years').value; o.hr=$('h-rate').value; }
    return SITE + '?' + q(o) + '#' + view;
  }
  var viewOf = {'w-hook':'work-hours','g-hook':'grow','h-hook':'habit'};
  document.querySelectorAll('button[data-share]').forEach(function(b){
    b.addEventListener('click', function(){ var id=b.getAttribute('data-share'); share($(id).textContent, shareUrl(viewOf[id])); });
  });
  document.querySelectorAll('button[data-copy]').forEach(function(b){
    b.addEventListener('click', function(){
      var el = $(b.getAttribute('data-copy'));
      copyText(el.textContent, function(){ say('Kopierat ✓'); }, function(){
        var r=document.createRange(); r.selectNodeContents(el);
        var s=getSelection(); s.removeAllRanges(); s.addRange(r); say('Texten är markerad – tryck Kopiera');
      });
    });
  });

  var views=['work-hours','grow','habit'];
  function route(){
    var h = location.hash.slice(1), v = views.indexOf(h)>-1 ? h : 'work-hours';
    views.forEach(function(x){ $('v-'+x).classList.toggle('on', x===v); });
    document.querySelectorAll('.tabs a').forEach(function(a){ a.classList.toggle('on', a.dataset.v===v); });
  }
  window.addEventListener('hashchange', route);
  route(); all();
})();
