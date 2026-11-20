/* Black Week discount: shows BELLA40 (−40 %) on the budget templates between 23 and 30 Nov 2026 (Stockholm time). */
(function(){
  var now=new Date(), start=new Date('2026-11-22T23:00:00Z'), end=new Date('2026-11-30T22:59:59Z');
  if(now<start||now>end) return;
  var sv=(document.documentElement.lang||'').indexOf('sv')===0;
  var links=document.querySelectorAll('a[href*="gumroad.com/l/budgetplanner"],a[href*="gumroad.com/l/Budgetmall"]');
  links.forEach(function(a){
    if(a.href.indexOf('BELLA40')<0) a.href=a.href.replace(/\/l\/(budgetplanner|Budgetmall)\/?$/,'/l/$1/BELLA40');
    if(a.classList.contains('shop')||a.id==='offer'){
      var k=a.querySelector('.k'); if(k) k.textContent=sv?'Black Week · −40 % med koden BELLA40':'Black Friday · −40% with code BELLA40';
    }
  });
  var bar=document.createElement('a');
  bar.href=sv?'https://riikola.gumroad.com/l/Budgetmall/BELLA40':'https://riikola.gumroad.com/l/budgetplanner/BELLA40';
  bar.rel='noopener';
  bar.textContent=sv?'🖤 Black Week: Bellas budgetmall −40 % med koden BELLA40 →':'🖤 Black Friday: Bella\'s Budget Planner −40% with code BELLA40 →';
  bar.style.cssText='display:block;background:#f5b544;color:#0f1420;text-align:center;font-weight:700;font-size:14px;padding:10px 12px;text-decoration:none';
  document.body.insertBefore(bar,document.body.firstChild);
})();
