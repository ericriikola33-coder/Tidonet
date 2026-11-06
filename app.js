(function(){
  var $ = function(id){ return document.getElementById(id); };
  var SITE = 'https://tidonet.com/';
  var symbols = {USD:'$',EUR:'€',GBP:'£',SEK:'kr'};
  var params = new URLSearchParams(location.search);

  var cur = 'USD';
  try { cur = localStorage.getItem('tidonet-cur') || 'USD'; } catch(e){}
  if (params.get('c') && symbols[params.get('c')]) cur = params.get('c');

  function money(v){
    try { return new Intl.NumberFormat(cur==='SEK'?'sv-SE':'en-US',{style:'currency',currency:cur,maximumFractionDigits:0}).format(v); }
    catch(e){ return Math.round(v) + ' ' + cur; }
  }
  function n(v,d){ return new Intl.NumberFormat('en-US',{maximumFractionDigits:d||0}).format(v); }
  function hrs(h){ return n(h, h<10?1:0); }
  function dur(h){ return h<1 ? Math.round(h*60)+' minutes' : hrs(h)+' hours'; }
  function grow(start, monthly, years, rate){
    var r = rate/100/12, bal = start, pts=[start];
    for(var m=1;m<=years*12;m++){ bal = bal*(1+r) + monthly; if(m%12===0) pts.push(bal); }
    return {bal:bal, pts:pts};
  }

  // ---------- toast + share helpers ----------
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
    var full = text + ' ' + url;
    if (navigator.share) {
      navigator.share({ title:'Tidonet', text:text, url:url }).catch(function(){});
      return;
    }
    copyText(full, function(){ say('Link copied ✓ Paste it anywhere'); }, function(){ say('Could not copy – long-press to copy'); });
  }
  function q(obj){
    var p = new URLSearchParams();
    Object.keys(obj).forEach(function(k){ p.set(k, obj[k]); });
    return p.toString();
  }

  // ---------- main calculators (index) ----------
  if ($('v-work-hours')) {
    var num = function(id){ var v = parseFloat($(id).value); return isFinite(v) ? v : 0; };
    $('cur').value = cur;

    // fill from shared link
    var map = {p:'w-price', w:'w-wage', d:'w-day', s:'g-start', m:'g-month', y:'g-years', r:'g-rate', hd:'h-day', hy:'h-years', hr:'h-rate'};
    Object.keys(map).forEach(function(k){
      var v = params.get(k);
      if (v !== null && v !== '' && isFinite(parseFloat(v))) $(map[k]).value = parseFloat(v);
    });

    function work(){
      var price=num('w-price'), wage=num('w-wage'), day=num('w-day')||8;
      if(wage<=0){ $('w-out').textContent='–'; $('w-out2').textContent='Enter your hourly pay'; $('w-hook').textContent=''; return; }
      var h = price/wage, d = h/day;
      $('w-out').textContent = hrs(h) + ' hours';
      $('w-out2').textContent = 'That is ' + n(d,1) + ' full work days (' + n(d/5,1) + ' weeks)';
      $('w-hook').textContent = 'That ' + money(price) + ' purchase? If you earn ' + money(wage) + ' an hour, it costs you ' + hrs(h) + ' hours of your life. That is ' + n(d,1) + ' full work days. Still worth it?';
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

    // share links per calculator
    function shareUrl(view){
      var o = {c:cur};
      if (view==='work-hours') { o.p=num('w-price'); o.w=num('w-wage'); o.d=num('w-day'); }
      if (view==='grow') { o.s=num('g-start'); o.m=num('g-month'); o.y=$('g-years').value; o.r=$('g-rate').value; }
      if (view==='habit') { o.hd=num('h-day'); o.hy=$('h-years').value; o.hr=$('h-rate').value; }
      return SITE + '?' + q(o) + '#' + view;
    }
    var viewOf = {'w-hook':'work-hours','g-hook':'grow','h-hook':'habit'};
    document.querySelectorAll('button[data-share]').forEach(function(b){
      b.addEventListener('click', function(){
        var id=b.getAttribute('data-share');
        share($(id).textContent, shareUrl(viewOf[id]));
      });
    });
    document.querySelectorAll('button[data-copy]').forEach(function(b){
      b.addEventListener('click', function(){
        var el = $(b.getAttribute('data-copy'));
        copyText(el.textContent, function(){ say('Copied ✓'); }, function(){
          var r=document.createRange(); r.selectNodeContents(el);
          var s=getSelection(); s.removeAllRanges(); s.addRange(r); say('Text selected – tap Copy');
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
  }

  // ---------- mini calculator (hours pages) ----------
  var mini = $('mini');
  if (mini) {
    var unit = mini.getAttribute('data-unit');            // once | month | day | workday | week
    var name = mini.getAttribute('data-name');
    var Name = name.charAt(0).toUpperCase() + name.slice(1);
    var perYear = {once:0, month:12, day:365, workday:260, week:52}[unit];
    var unitWord = {month:'a month', day:'a day', workday:'a workday', week:'a week'}[unit] || '';
    var w = parseFloat(params.get('w'));
    if (isFinite(w) && w > 0) $('m-wage').value = w;
    var p = parseFloat(params.get('p'));
    if (isFinite(p) && p > 0) $('m-price').value = p;

    function calc(){
      var price=parseFloat($('m-price').value)||0, wage=parseFloat($('m-wage').value)||0;
      document.querySelectorAll('.cs').forEach(function(e){ e.textContent='$'; });
      if (wage<=0) { $('m-out').textContent='–'; $('m-out2').textContent='Enter your hourly pay'; return null; }
      var h=price/wage;
      if (!perYear) {
        if (h < 1) {
          $('m-out').textContent = Math.round(h*60) + ' minutes';
          $('m-out2').textContent = 'of work at your hourly pay';
          return Name + ' costs me ' + Math.round(h*60) + ' minutes of work 😳 How long is it for you?';
        }
        $('m-out').textContent = hrs(h) + ' hours';
        $('m-out2').textContent = 'That is ' + n(h/8,1) + ' work days of 8 hours';
        return Name + ' costs me ' + hrs(h) + ' hours of work 😳 How many hours is it for you?';
      }
      var yh = h*perYear;
      $('m-out').textContent = hrs(yh) + ' hours a year';
      $('m-out2').textContent = dur(h) + ' ' + unitWord + ' · about ' + n(yh/8,1) + ' work days a year';
      return Name + ' costs me ' + hrs(yh) + ' hours of work every year 😳 How many hours is it for you?';
    }
    var last = null;
    ['m-price','m-wage'].forEach(function(id){ $(id).addEventListener('input', function(){ last = calc(); }); });
    last = calc();
    $('m-share').addEventListener('click', function(){
      var url = SITE + mini.getAttribute('data-page') + '?' + q({w: $('m-wage').value});
      share(last || ('How many hours of work does ' + name + ' cost?'), url);
    });
  }
})();
