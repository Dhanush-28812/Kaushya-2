(function(){
var $=function(s){return document.querySelector(s)};
$('#yr').textContent=new Date().getFullYear();

// scroll progress
addEventListener('scroll',function(){var h=document.documentElement;$('#progress').style.width=(h.scrollTop/(h.scrollHeight-h.clientHeight)*100)+'%'},{passive:true});

// artwork
var NS='http://www.w3.org/2000/svg';
function el(p,t,a){var e=document.createElementNS(NS,t);for(var k in a)e.setAttribute(k,a[k]);p.appendChild(e);return e}
function hex(cx,cy,r){var p=[];for(var i=0;i<6;i++){var a=Math.PI/3*i+Math.PI/6;p.push((cx+r*Math.cos(a)).toFixed(1)+','+(cy+r*Math.sin(a)).toFixed(1))}return p.join(' ')}
var A=$('#art-aakar'),r=30,w=r*Math.sqrt(3);
for(var row=0;row<4;row++)for(var c=0;c<4;c++){var cx=48+c*w+(row%2?w/2:0),cy=45+row*r*1.5;el(A,'polygon',{points:hex(cx,cy,r-3),fill:(row+c)%3?'#e7eee4':'#f1d98a',stroke:'#5a2850','stroke-width':2})}
var N=$('#art-nivara');
for(var j=0;j<4;j++)for(var i=0;i<7;i++){var x=20+i*42,y=30+j*50,up=(i+j)%2;el(N,'polygon',{points:up?x+','+(y+44)+' '+(x+42)+','+(y+44)+' '+(x+21)+','+y:x+','+y+' '+(x+42)+','+y+' '+(x+21)+','+(y+44),fill:up?'#2c6a45':'#e7eee4',stroke:'#2c6a45','stroke-width':1.5})}
var V=$('#art-vidura');
el(V,'path',{d:'M110 20h100l-30 50h-40z',fill:'#2c6a45'});
el(V,'ellipse',{cx:160,cy:95,rx:14,ry:19,fill:'#f7f3e6',stroke:'#d8a42c','stroke-width':3});
[130,165,200].forEach(function(y,i){el(V,'rect',{x:60,y:y-14+(i?0:0),width:34,height:22,rx:5,fill:'#5a2850'});el(V,'line',{x1:94,y1:y-3,x2:140,y2:y-3,stroke:'#d8a42c','stroke-dasharray':'4 4'})});
el(V,'rect',{x:140,y:205,width:80,height:14,rx:3,fill:'#4b5d52'});
var t=el(V,'text',{x:228,y:216,'font-size':13,fill:'#4b5d52'});t.textContent='HX711';
el(V,'rect',{x:236,y:110,width:56,height:34,rx:6,fill:'#18271f'});
t=el(V,'text',{x:264,y:132,'font-size':13,'text-anchor':'middle',fill:'#fff'});t.textContent='ESP32';

// how it works tabs
var steps=[
['Mount with Aakar','The farmer places the folding honeycomb chandrika on its ridged frame. Silkworms spin inside the familiar hexagonal cells, aiming for cocoons of even size and shape.'],
['Harvest with Nivara','The chandrika stays still. A matching-triangle panel presses it down, a scraper plate pushes across, and the cocoons fall into a collection tray.'],
['Sort with Vidura','A hopper and air-lock gate release one cocoon at a time. Three colour sensors and a load cell read it, and the ESP32 sends it to the good or bad bin.']];
var tabs=document.querySelectorAll('.tabs button');
function show(i){tabs.forEach(function(b,k){b.setAttribute('aria-selected',k==i)});$('#panel').innerHTML='<b>'+steps[i][0]+'</b><p>'+steps[i][1]+'</p>'}
tabs.forEach(function(b){b.addEventListener('click',function(){show(+b.dataset.step)})});show(0);

// sorter simulation (illustrative values only)
var good=0,bad=0,busy=false,co=$('#cocoon');
$('#drop').addEventListener('click',function(){
  if(busy)return;busy=true;
  var wt=1.0+Math.random()*1.4,base=200+Math.random()*50,sens=[0,1,2].map(function(){return base+(Math.random()-.5)*(Math.random()<.35?70:20)});
  var spread=Math.max.apply(null,sens)-Math.min.apply(null,sens),ok=wt>=1.5&&spread<25;
  var why=[];if(wt<1.5)why.push('too light');if(spread>=25)why.push('colour uneven');
  co.className='cocoon go';
  setTimeout(function(){co.classList.add(ok?'l':'r')},50);
  $('#verdict').textContent='Reading…';
  setTimeout(function(){
    if(ok)good++;else bad++;
    $('#nGood').textContent=good;$('#nBad').textContent=bad;
    $('#verdict').textContent=ok?'Good cocoon':'Bad cocoon ('+why.join(', ')+')';
    $('#reads').innerHTML='<li>Weight: '+wt.toFixed(2)+' g (needs at least 1.50 g)</li><li>Colour sensors: '+sens.map(function(s){return s.toFixed(0)}).join(', ')+'</li><li>Colour spread: '+spread.toFixed(0)+' (needs under 25)</li>';
    setTimeout(function(){co.className='cocoon';busy=false},700);
  },1300);
});

// labour calculator
function calc(){var f=+$('#farmers').value,y=+$('#years').value;$('#oF').textContent=f;$('#oY').textContent=y;$('#total').textContent='₹'+(f*y*30000).toLocaleString('en-IN')}
$('#farmers').addEventListener('input',calc);$('#years').addEventListener('input',calc);calc();
})();
