/* Builds a shareable 1080x1920 result image for the Larry or Bella quiz. */
(function(){
  function svgImage(tplId){
    return new Promise(function(res,rej){
      var svg=document.getElementById(tplId).content.querySelector('svg').cloneNode(true);
      svg.setAttribute('xmlns','http://www.w3.org/2000/svg');svg.setAttribute('width','800');svg.setAttribute('height','700');
      var img=new Image();img.onload=function(){res(img);};img.onerror=rej;
      img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(new XMLSerializer().serializeToString(svg));
    });
  }
  function rr(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath();}
  function fitText(c,s,x,y,max,size,weight,color){var f=size;do{c.font=weight+' '+f+'px "Space Grotesk", Inter, sans-serif';f-=2;}while(c.measureText(s).width>max&&f>20);c.fillStyle=color;c.fillText(s,x,y);}
  window.makeResultCard=function(o){
    var W=1080,H=1920,cv=document.createElement('canvas');cv.width=W;cv.height=H;var c=cv.getContext('2d');
    var ready=(document.fonts&&document.fonts.ready)?document.fonts.ready:Promise.resolve();
    return ready.then(function(){return svgImage(o.key==='larry'?'larrySvg':'bellaSvg');}).then(function(img){
      var g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,'#0f1420');g.addColorStop(1,'#1b2440');c.fillStyle=g;c.fillRect(0,0,W,H);
      c.textAlign='center';c.textBaseline='middle';
      c.fillStyle='rgba(52,210,123,.06)';c.font='700 90px "Space Grotesk", sans-serif';
      [[120,300],[960,420],[180,1300],[930,1500],[540,120],[90,880],[1000,980]].forEach(function(p){c.fillText('$',p[0],p[1]);});
      // top pill
      c.font='700 40px "Space Grotesk", sans-serif';var pw=c.measureText(o.top).width+80;rr(c,W/2-pw/2,170,pw,80,40);c.fillStyle='#ffffff';c.fill();c.fillStyle='#0f1420';c.fillText(o.top,W/2,212);
      // glow + character
      var col=o.key==='larry'?'rgba(142,165,150,.35)':'rgba(52,210,123,.45)';var rg=c.createRadialGradient(W/2,640,40,W/2,640,460);rg.addColorStop(0,col);rg.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=rg;c.fillRect(0,200,W,900);
      c.drawImage(img,W/2-400,300,800,700);
      // title
      fitText(c,o.title,W/2,1090,960,88,'700','#ffffff');
      // meter
      var mx=120,mw=840,my=1210;var mg=c.createLinearGradient(mx,0,mx+mw,0);mg.addColorStop(0,'#8ea596');mg.addColorStop(1,'#34d27b');rr(c,mx,my,mw,28,14);c.fillStyle=mg;c.fill();
      var px=mx+mw*Math.max(0,Math.min(100,o.pct))/100;c.beginPath();c.arc(px,my+14,30,0,7);c.fillStyle='#ffffff';c.fill();c.lineWidth=8;c.strokeStyle='#0f1420';c.stroke();
      c.font='600 38px Inter, sans-serif';c.fillStyle='#9aa4bd';c.textAlign='left';c.fillText('Larry',mx,my+90);c.textAlign='right';c.fillText('Bella',mx+mw,my+90);c.textAlign='center';
      fitText(c,o.pctText,W/2,1390,900,110,'700','#f5b544');
      fitText(c,o.cta,W/2,1540,940,64,'700','#ffffff');
      c.font='700 46px "Space Grotesk", sans-serif';var uw=c.measureText(o.url).width+100;rr(c,W/2-uw/2,1620,uw,100,50);c.fillStyle='#34d27b';c.fill();c.fillStyle='#0f1420';c.fillText(o.url,W/2,1672);
      c.font='500 30px Inter, sans-serif';c.fillStyle='rgba(255,255,255,.55)';c.fillText('Larry & Bella · by Nostalgicme',W/2,1820);
      return new Promise(function(res){cv.toBlob(res,'image/png');});
    });
  };
  window.shareResultCard=function(o,labels){
    return makeResultCard(o).then(function(blob){
      var file=null;try{file=new File([blob],'larry-or-bella-result.png',{type:'image/png'});}catch(e){}
      if(file&&navigator.canShare&&navigator.canShare({files:[file]})){return navigator.share({files:[file],text:labels.text}).catch(function(){});}
      var url=URL.createObjectURL(blob);var ov=document.createElement('div');
      ov.style.cssText='position:fixed;inset:0;background:rgba(5,8,18,.94);z-index:99;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:18px;gap:12px';
      ov.innerHTML='<img src="'+url+'" alt="" style="max-height:72vh;max-width:100%;border-radius:16px">'+
        '<p style="color:#fff;margin:0;text-align:center">'+labels.hold+'</p>'+
        '<a href="'+url+'" download="larry-or-bella-result.png" style="color:#34d27b;font-weight:700">'+labels.download+'</a>'+
        '<button class="ghost" style="max-width:240px">'+labels.close+'</button>';
      ov.querySelector('button').onclick=function(){ov.remove();URL.revokeObjectURL(url);};
      document.body.appendChild(ov);
    });
  };
})();
