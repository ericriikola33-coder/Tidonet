/* Money Wrapped: turns a few monthly numbers into 7 shareable 1080x1920 story slides. Everything runs in the browser; nothing is sent anywhere. */
(function(){
  var W=1080,H=1920,F='"Space Grotesk", Inter, sans-serif',NAVY='#0f1420';
  function rr(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath();}
  function fit(c,s,x,y,max,size,weight,color){var f=size;do{c.font=weight+' '+f+'px '+F;f-=2;}while(c.measureText(s).width>max&&f>22);c.fillStyle=color;c.fillText(s,x,y);}
  function wrap(c,s,x,y,max,size,weight,color,lh){c.font=weight+' '+size+'px '+F;c.fillStyle=color;var words=s.split(' '),line='',yy=y;words.forEach(function(w){var t=line?line+' '+w:w;if(c.measureText(t).width>max&&line){c.fillText(line,x,yy);line=w;yy+=lh;}else line=t;});if(line)c.fillText(line,x,yy);return yy;}
  function svgImage(id){return new Promise(function(res,rej){var t=document.getElementById(id);if(!t)return res(null);var svg=t.content.querySelector('svg').cloneNode(true);svg.setAttribute('xmlns','http://www.w3.org/2000/svg');svg.setAttribute('width','800');svg.setAttribute('height','700');var img=new Image();img.onload=function(){res(img);};img.onerror=function(){res(null);};img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(new XMLSerializer().serializeToString(svg));});}
  function bg(c,a,b,deco){var g=c.createLinearGradient(0,0,W,H);g.addColorStop(0,a);g.addColorStop(1,b);c.fillStyle=g;c.fillRect(0,0,W,H);
    c.save();c.globalAlpha=.16;c.fillStyle='#fff';
    if(deco===0){c.beginPath();c.arc(900,260,300,0,7);c.fill();c.beginPath();c.arc(120,1650,360,0,7);c.fill();}
    if(deco===1){for(var i=0;i<6;i++){c.save();c.translate(540,960);c.rotate(i*Math.PI/3+.3);c.fillRect(-40,-1400,80,1400);c.restore();}}
    if(deco===2){for(var j=0;j<9;j++){c.beginPath();c.arc(120*j,1800-j*40,90+j*12,0,7);c.fill();}}
    if(deco===3){c.lineWidth=40;c.strokeStyle='#fff';for(var k=0;k<5;k++){c.beginPath();c.arc(540,960,200+k*170,0,7);c.stroke();}}
    c.restore();}
  function header(c,L,n,col){c.textAlign='left';c.textBaseline='middle';c.font='700 34px '+F;c.fillStyle=col||'rgba(15,20,32,.75)';c.fillText(L.brand+' '+L.year,70,120);c.textAlign='right';c.fillText(n+'/7',W-70,120);c.textAlign='center';}
  function footer(c,L,col){c.textAlign='center';c.font='700 38px '+F;c.fillStyle=col||NAVY;c.fillText(L.url,W/2,1830);}
  function big(c,s,y,size,col,max){fit(c,s,W/2,y,max||960,size,'700',col);}
  function pill(c,s,x,y,size,bgc,fg){c.font='700 '+size+'px '+F;var w=c.measureText(s).width+size*1.4,h=size*1.9;rr(c,x-w/2,y-h/2,w,h,h/2);c.fillStyle=bgc;c.fill();c.fillStyle=fg;c.fillText(s,x,y+2);}
  function emoji(c,e,x,y,s){c.font=s+'px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';c.fillText(e,x,y);}

  window.MoneyWrapped={
    calc:function(v){var m={take:v.take*12,coffee:v.coffee*12,subs:v.subs*12,shop:v.shop*12,save:v.save*12};var leaks=m.take+m.coffee+m.subs+m.shop;
      var hrs=function(x){return v.wage>0?x/v.wage:0;};var pct=(m.save+leaks)>0?Math.round(m.save/(m.save+leaks)*100):50;
      var r=.07/12,n=120,fv=v.save>0?v.save*(Math.pow(1+r,n)-1)/r:0;
      var cats=[['take',m.take],['coffee',m.coffee],['subs',m.subs],['shop',m.shop]].sort(function(a,b){return b[1]-a[1];});
      return {m:m,leaks:leaks,hrs:hrs,pct:pct,fv:fv,cats:cats,month:v.month};},
    render:function(v,L){var R=this.calc(v);var money=L.money;
      return Promise.all([(document.fonts&&document.fonts.ready)||Promise.resolve(),svgImage('larrySvg'),svgImage('bellaSvg')]).then(function(a){var LA=a[1],BE=a[2];
        var slides=[];function mk(fn){var cv=document.createElement('canvas');cv.width=W;cv.height=H;var c=cv.getContext('2d');c.textAlign='center';c.textBaseline='middle';fn(c);slides.push(cv);}
        var H1=function(x){return Math.round(R.hrs(x));},D1=function(x){return Math.round(R.hrs(x)/8);};
        // 1 intro
        mk(function(c){bg(c,'#7b2ff7','#f107a3',0);header(c,L,1,'rgba(255,255,255,.85)');
          big(c,L.introTop,520,70,'#fff');big(c,L.introBig,700,190,'#FFD84D');big(c,String(L.year),880,170,'#fff');
          if(LA)c.drawImage(LA,140,1050,400,350);if(BE)c.drawImage(BE,540,1050,400,350);
          wrap(c,L.introSub,W/2,1520,880,44,'500','rgba(255,255,255,.92)',60);footer(c,L,'#fff');});
        // 2 takeaway
        mk(function(c){bg(c,'#ff7a18','#ff3d54',1);header(c,L,2,'rgba(255,255,255,.85)');c.font='170px sans-serif';emoji(c,'🍔',W/2,430,190);
          big(c,L.takeTop,640,64,'#fff');big(c,money(R.m.take),810,170,'#fff');big(c,L.eq+' '+H1(R.m.take)+' '+L.hours,990,92,'#FFE15D');
          wrap(c,L.workdays(D1(R.m.take)),W/2,1150,880,50,'700','#fff',66);if(LA)c.drawImage(LA,340,1320,400,350);footer(c,L,'#fff');});
        // 3 coffee
        mk(function(c){bg(c,'#f6e7d3','#d9a066',2);header(c,L,3);emoji(c,'☕',W/2,430,190);
          big(c,L.coffeeTop,640,64,NAVY);big(c,money(R.m.coffee),810,170,'#5a2e0e');big(c,L.eq+' '+H1(R.m.coffee)+' '+L.hours,990,92,NAVY);
          wrap(c,L.coffeeSub(money(Math.round(R.m.coffee/52))),W/2,1150,880,48,'600','#3b2410',64);if(BE)c.drawImage(BE,340,1320,400,350);footer(c,L);});
        // 4 subscriptions
        mk(function(c){bg(c,'#00c6ff','#0072ff',3);header(c,L,4,'rgba(255,255,255,.85)');emoji(c,'📺',W/2,430,190);
          big(c,L.subsTop,640,64,'#fff');big(c,money(R.m.subs),810,170,'#fff');big(c,L.eq+' '+H1(R.m.subs)+' '+L.hours,990,92,'#FFE15D');
          wrap(c,L.subsSub,W/2,1150,880,48,'600','#fff',64);if(LA)c.drawImage(LA,340,1320,400,350);footer(c,L,'#fff');});
        // 5 top leaks ranking
        mk(function(c){bg(c,'#ffe259','#ffa751',0);header(c,L,5);big(c,L.leaksTop,330,70,NAVY);
          var mx=Math.max(1,R.cats[0][1]);R.cats.forEach(function(k,i){var y=520+i*230,w=Math.max(80,760*k[1]/mx);c.textAlign='left';c.font='700 52px '+F;c.fillStyle=NAVY;c.fillText((i+1)+'. '+L.cat[k[0]],120,y);
            rr(c,120,y+50,w,64,32);c.fillStyle=i===0?'#ef4b5a':'rgba(15,20,32,.75)';c.fill();c.textAlign='right';c.font='700 46px '+F;c.fillStyle=NAVY;c.fillText(money(k[1]),960,y);c.textAlign='center';});
          rr(c,90,1460,900,230,40);c.fillStyle=NAVY;c.fill();big(c,L.larryMonth,1530,46,'#FFD84D',820);big(c,L.months[R.month],1620,80,'#fff');footer(c,L);});
        // 6 savings
        mk(function(c){bg(c,'#11998e','#38ef7d',1);header(c,L,6,'rgba(15,20,32,.8)');emoji(c,'🌱',W/2,400,180);
          big(c,L.saveTop,600,64,NAVY);big(c,money(R.m.save),770,170,'#fff');
          wrap(c,L.saveSub(money(Math.round(R.fv/100)*100)),W/2,960,880,54,'700',NAVY,72);
          if(BE)c.drawImage(BE,340,1240,400,350);c.font='500 30px Inter, sans-serif';c.fillStyle='rgba(15,20,32,.7)';c.fillText(L.saveNote,W/2,1650);footer(c,L);});
        // 7 summary
        mk(function(c){var pct=R.pct,col=pct>=65?'#34d27b':pct>=35?'#f5b544':'#c9d6ce';var g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,'#0b0f1c');g.addColorStop(1,'#1b2440');c.fillStyle=g;c.fillRect(0,0,W,H);
          header(c,L,7,'rgba(255,255,255,.7)');big(c,L.sumTop,300,64,'#fff');
          c.save();c.shadowColor=col;c.shadowBlur=60;big(c,L.pctLine(pct),470,150,col);c.restore();
          var img=pct>=50?BE:LA;if(img)c.drawImage(img,290,560,500,437);
          rr(c,90,1060,900,520,40);c.fillStyle='rgba(255,255,255,.07)';c.fill();
          var rows=[[L.sumLeaks,money(R.leaks)],[L.sumHours,H1(R.leaks)+' '+L.hours],[L.sumDays,D1(R.leaks)+' '+L.days],[L.sumSaved,money(R.m.save)]];
          rows.forEach(function(r,i){var y=1140+i*118;c.textAlign='left';c.font='600 42px Inter, sans-serif';c.fillStyle='#c9d1e4';c.fillText(r[0],140,y);c.textAlign='right';c.font='700 50px '+F;c.fillStyle=i===3?'#34d27b':'#fff';c.fillText(r[1],940,y);});
          c.textAlign='center';pill(c,L.cta,W/2,1680,40,'#f5b544',NAVY);footer(c,L,'#fff');});
        return Promise.all(slides.map(function(cv){return new Promise(function(res){cv.toBlob(res,'image/png');});}));
      });}
  };
})();
