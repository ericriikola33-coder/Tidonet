/* Builds a shareable 1080x1920 Money Card image for the Larry or Bella quiz. */
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
  function hexA(h,a){var n=parseInt(h.slice(1),16);return 'rgba('+(n>>16)+','+((n>>8)&255)+','+(n&255)+','+a+')';}
  window.makeResultCard=function(o){
    var W=1080,H=1920,cv=document.createElement('canvas');cv.width=W;cv.height=H;var c=cv.getContext('2d');
    var col=o.color||'#34d27b',F='"Space Grotesk", Inter, sans-serif';
    var ready=(document.fonts&&document.fonts.ready)?document.fonts.ready:Promise.resolve();
    return ready.then(function(){return svgImage(o.pct<55?'larrySvg':'bellaSvg');}).then(function(img){
      var g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,'#0b0f1c');g.addColorStop(1,'#1b2440');c.fillStyle=g;c.fillRect(0,0,W,H);
      c.textAlign='center';c.textBaseline='middle';
      c.fillStyle='rgba(255,255,255,.04)';c.font='700 90px '+F;[[80,260],[1000,380],[60,1500],[1010,1620],[980,120]].forEach(function(p){c.fillText('$',p[0],p[1]);});
      // top pill
      c.font='700 38px '+F;var pw=c.measureText(o.top).width+80;rr(c,W/2-pw/2,90,pw,76,38);c.fillStyle='#fff';c.fill();c.fillStyle='#0f1420';c.fillText(o.top,W/2,130);
      // card frame
      var X=80,Y=200,CW=920,CH=1350;
      c.save();c.shadowColor=hexA(col,.55);c.shadowBlur=70;rr(c,X,Y,CW,CH,40);c.fillStyle='#10162a';c.fill();c.restore();
      c.save();rr(c,X,Y,CW,CH,40);c.clip();
      var bg=c.createRadialGradient(W/2,Y+470,40,W/2,Y+470,700);bg.addColorStop(0,hexA(col,.22));bg.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=bg;c.fillRect(X,Y,CW,CH);
      c.strokeStyle='rgba(255,255,255,.035)';c.lineWidth=2;for(var yy=Y;yy<Y+CH;yy+=8){c.beginPath();c.moveTo(X,yy);c.lineTo(X+CW,yy);c.stroke();}
      // header band
      var hg=c.createLinearGradient(X,0,X+CW,0);hg.addColorStop(0,col);hg.addColorStop(1,hexA(col,.7));c.fillStyle=hg;c.fillRect(X,Y,CW,140);
      c.fillStyle='#0f1420';c.beginPath();c.arc(X+80,Y+70,46,0,7);c.fill();c.font='60px sans-serif';c.fillText(o.emoji,X+80,Y+74);
      c.textAlign='left';var nm=o.name.toUpperCase(),f=62;do{c.font='700 '+f+'px '+F;f-=2;}while(c.measureText(nm).width>CW-250&&f>30);c.fillStyle='#0f1420';c.fillText(nm,X+150,Y+64);
      c.font='700 24px '+F;c.fillStyle='rgba(15,20,32,.65)';c.textAlign='right';c.fillText(o.series,X+CW-30,Y+112);c.textAlign='center';
      // badge
      c.font='700 32px '+F;var bt='⚡ '+o.pctText,bw=c.measureText(bt).width+60;rr(c,X+CW-bw-30,Y+170,bw,64,32);c.fillStyle='rgba(0,0,0,.45)';c.fill();c.lineWidth=3;c.strokeStyle=col;c.stroke();c.fillStyle='#fff';c.fillText(bt,X+CW-30-bw/2,Y+203);
      // portrait ring
      var cx=W/2,cy=Y+520,R=250;var rg=c.createConicGradient?c.createConicGradient(0,cx,cy):null;
      if(rg){['#ef4b5a','#f5b544','#34d27b','#4fb3ff','#b57cff','#ef4b5a'].forEach(function(k,i){rg.addColorStop(i/5,k);});c.strokeStyle=rg;}else c.strokeStyle=col;
      c.lineWidth=16;c.beginPath();c.arc(cx,cy,R,0,7);c.stroke();c.fillStyle='#0b0f1c';c.beginPath();c.arc(cx,cy,R-8,0,7);c.fill();
      var ig=c.createRadialGradient(cx,cy,10,cx,cy,R);ig.addColorStop(0,hexA(col,.35));ig.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=ig;c.beginPath();c.arc(cx,cy,R-8,0,7);c.fill();
      c.drawImage(img,cx-235,cy-215,470,411);
      // tagline
      fitText(c,'“'+o.line+'”',W/2,Y+830,CW-80,42,'italic 600','#e6e9f2');
      // radar
      var rx=X+230,ry=Y+1095,rR=125,n=5,pt=function(i,fr){var a=-Math.PI/2+i*2*Math.PI/n;return [rx+Math.cos(a)*rR*fr,ry+Math.sin(a)*rR*fr];};
      c.strokeStyle='rgba(255,255,255,.14)';c.lineWidth=2;[.33,.66,1].forEach(function(fr){c.beginPath();for(var i=0;i<n;i++){var p=pt(i,fr);i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]);}c.closePath();c.stroke();});
      c.beginPath();for(var i=0;i<n;i++){var p=pt(i,Math.max(.06,o.dims[i]/100));i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]);}c.closePath();c.fillStyle=hexA(col,.35);c.fill();c.lineWidth=5;c.strokeStyle=col;c.stroke();
      c.font='700 21px Inter, sans-serif';c.fillStyle='#9aa4bd';for(i=0;i<n;i++){p=pt(i,1.3);c.fillText(o.labels[i],p[0],p[1]);}
      // bars
      var bx=X+470,bw2=300;o.dims.forEach(function(v,i){var y=Y+945+i*58;c.textAlign='left';c.font='700 24px Inter, sans-serif';c.fillStyle='#9aa4bd';c.fillText(o.labels[i],bx,y);
        rr(c,bx,y+18,bw2,12,6);c.fillStyle='rgba(255,255,255,.1)';c.fill();rr(c,bx,y+18,Math.max(12,bw2*v/100),12,6);c.fillStyle=col;c.fill();
        c.textAlign='right';c.font='700 30px '+F;c.fillStyle='#fff';c.fillText(String(v),bx+bw2+90,y+18);});
      c.textAlign='center';
      // footer band
      c.fillStyle=col;c.fillRect(X,Y+CH-100,CW,100);c.fillStyle='#0f1420';c.textAlign='left';c.font='700 40px '+F;c.fillText('LARRY & BELLA',X+40,Y+CH-50);c.textAlign='right';c.fillStyle='rgba(15,20,32,.7)';c.fillText('#'+o.no,X+CW-40,Y+CH-50);c.textAlign='center';
      c.restore();
      fitText(c,o.cta,W/2,1625,940,64,'700','#ffffff');
      c.font='700 46px '+F;var uw=c.measureText(o.url).width+100;rr(c,W/2-uw/2,1705,uw,100,50);c.fillStyle=col;c.fill();c.fillStyle='#0f1420';c.fillText(o.url,W/2,1757);
      c.font='500 30px Inter, sans-serif';c.fillStyle='rgba(255,255,255,.55)';c.fillText('Larry & Bella · by Nostalgicme',W/2,1862);
      return new Promise(function(res){cv.toBlob(res,'image/png');});
    });
  };

  function overlay(url,labels,saved){
    var ov=document.createElement('div');
    ov.style.cssText='position:fixed;inset:0;background:rgba(5,8,18,.94);z-index:99;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:18px;gap:12px';
    ov.innerHTML=(saved?'<p style="color:#34d27b;font-weight:700;margin:0">'+saved+'</p>':'')+'<img src="'+url+'" alt="" style="max-height:68vh;max-width:100%;border-radius:16px">'+
      '<p style="color:#fff;margin:0;text-align:center">'+labels.hold+'</p>'+
      '<button class="ghost" style="max-width:240px">'+labels.close+'</button>';
    ov.querySelector('button').onclick=function(){ov.remove();};
    document.body.appendChild(ov);
  }
  /* Save button: download the PNG straight to the phone and show it (long-press works too). */
  window.saveResultCard=function(o,labels){
    return makeResultCard(o).then(function(blob){
      var url=URL.createObjectURL(blob);
      try{var a=document.createElement('a');a.href=url;a.download='my-money-card.png';document.body.appendChild(a);a.click();a.remove();}catch(e){}
      overlay(url,labels,labels.saved);
    });
  };
  /* Share button: share the card image (so Instagram Stories shows up) plus the text and link. */
  window.shareCardWithText=function(o,title,text,url){
    return makeResultCard(o).then(function(blob){
      var f=null;try{f=new File([blob],'my-money-card.png',{type:'image/png'});}catch(e){}
      if(f&&navigator.canShare&&navigator.canShare({files:[f]}))return navigator.share({files:[f],text:text+' '+url}).catch(function(){});
      return navigator.share({title:title,text:text,url:url}).catch(function(){});
    });
  };
  window.shareResultCard=function(o,labels){
    return makeResultCard(o).then(function(blob){
      var file=null;try{file=new File([blob],'my-money-card.png',{type:'image/png'});}catch(e){}
      if(file&&navigator.canShare&&navigator.canShare({files:[file]})){return navigator.share({files:[file],text:labels.text}).catch(function(){});}
      var url=URL.createObjectURL(blob);var ov=document.createElement('div');
      ov.style.cssText='position:fixed;inset:0;background:rgba(5,8,18,.94);z-index:99;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:18px;gap:12px';
      ov.innerHTML='<img src="'+url+'" alt="" style="max-height:72vh;max-width:100%;border-radius:16px">'+
        '<p style="color:#fff;margin:0;text-align:center">'+labels.hold+'</p>'+
        '<a href="'+url+'" download="my-money-card.png" style="color:#34d27b;font-weight:700">'+labels.download+'</a>'+
        '<button class="ghost" style="max-width:240px">'+labels.close+'</button>';
      ov.querySelector('button').onclick=function(){ov.remove();URL.revokeObjectURL(url);};
      document.body.appendChild(ov);
    });
  };
})();
