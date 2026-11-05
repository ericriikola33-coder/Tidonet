(function(){
  var $ = function(id){ return document.getElementById(id); };
  if(!$('v-work-hours')) return; // only on the calculator page

  var num = function(id){ var v = parseFloat($(id).value); return isFinite(v) ? v : 0; };
  var cur = 'USD';
  try { cur = localStorage.getItem('tidonet-cur') || 'USD'; } catch(e){}
  $('cur').value = cur;

  var symbols = {USD:'$',EUR:'€',GBP:'£',SEK:'kr'};
  function money(v){
    try { return new Intl.NumberFormat(cur==='SEK'?'sv-SE':'en-US',{style:'currency',currency:cur,maximumFractionDigits:0}).format(v); }
    catch(e){ return Math.round(v) + ' ' + cur; }
  }
  function n(v,d){ return new Intl.NumberFormat('en-US',{maximumFractionDigits:d||0}).format(v); }

  function grow(start, monthly, years, rate){
    var r = rate/100/12, bal = start, pts=[start];
    for(var m=1;m<=years*12;m++){ bal = bal*(1+r) + monthly; if(m%12===0) pts.push(bal); }
    return {bal:bal, pts:pts};
  }

  function work(){
    var price=num('w-price'), wage=num('w-wage'), day=num('w-day')||8;
    if(wage<=0){ $('w-out').textContent='–'; $('w-out2').textContent='Enter your hourly pay'; $('w-hook').textContent=''; return; }
    var h = price/wage, d = h/day;
    $('w-out').textContent = n(h, h<10?1:0) + ' hours';
    $('w-out2').textContent = 'That is ' + n(d,1) + ' full work days (' + n(d/5,1) + ' weeks)';
    $('w-hook').textContent = 'That ' + money(price) + ' purchase? If you earn ' + money(wage) + ' an hour, it costs you ' + n(h, h<10?1:0) + ' hours of your life. That is ' + n(d,1) + ' full work days. Still worth it?';
  }

  function growView(){
    var s=num('g-start'), m=num('g-month'), y=+$('g-years').value, r=+$('g-rate').value;
    $('g-yl').textContent=y; $('g-yk').textContent=y; $('g-rl').textContent=r;
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
    var lead = s>0 ? 'Start with ' + money(s) + ' and invest ' + money(m) + ' a month.' : 'Invest just ' + money(m) + ' a month.';
    $('g-hook').textContent = lead + ' In ' + y + ' years at ' + r + '% a year, you could have ' + money(bal) + '. You only put in ' + money(put) + '. The rest? That is time working for you.';
  }

  function habit(){
    var d=num('h-day'), y=+$('h-years').value, r=+$('h-rate').value;
    $('h-yl').textContent=y; $('h-rl').textContent=r;
    var spent = d*365*y;
    var bal = grow(0, d*365/12, y, r).bal;
    $('h-out').textContent = money(bal);
    $('h-out2').textContent = 'You would spend ' + money(spent) + ' in total';
    $('h-hook').textContent = 'Your ' + money(d) + ' a day habit feels small. But in ' + y + ' years that is ' + money(spent) + '. Invested at ' + r + '% a year instead, it could grow to ' + money(bal) + '.';
  }

  function all(){
    document.querySelectorAll('.cs').forEach(function(e){ e.textContent=symbols[cur]; });
    work(); growView(); habit();
  }

  document.querySelectorAll('.card input').forEach(function(i){ i.addEventListener('input', all); });
  $('cur').addEventListener('change', function(e){ cur=e.target.value; try{localStorage.setItem('tidonet-cur',cur);}catch(err){} all(); });

  document.querySelectorAll('button[data-copy]').forEach(function(b){
    b.addEventListener('click', function(){
      var el = $(b.dataset.copy), t = el.textContent;
      var ok = function(){ b.textContent='Copied ✓'; b.classList.add('done'); setTimeout(function(){ b.textContent='Copy text'; b.classList.remove('done'); },1600); };
      var fallback = function(){
        var r=document.createRange(); r.selectNodeContents(el);
        var s=getSelection(); s.removeAllRanges(); s.addRange(r);
        b.textContent='Text selected – tap Copy';
      };
      try { navigator.clipboard.writeText(t).then(ok, fallback); } catch(e){ fallback(); }
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
