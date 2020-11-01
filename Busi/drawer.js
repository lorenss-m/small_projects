function resize(e){//resize, move canvas - zoom, draw
  if(Math.sign((e.deltaY)?e.deltaY:e.detail) == -1 || CanvasD.zoom > 100){
    CanvasClear();
    prX = e.clientX;
    prY = e.clientY;
    let tem=CanvasD.zoom;
    if(CanvasD.zoom > 100 && Math.sign((e.deltaY)?e.deltaY:e.detail)==1){
      CanvasD.zoom/=1.1;
    }else if(CanvasD.zoom<1000 && Math.sign((e.deltaY)?e.deltaY:e.detail)==-1){
      CanvasD.zoom*=1.1;
    }
    pr=e.deltaY;
    CanvasD.x=prX-((prX-CanvasD.x)/(tem/100)*(CanvasD.zoom/100));
    CanvasD.y=prY-((prY-CanvasD.y)/(tem/100)*(CanvasD.zoom/100));
    redraw();
  }
}
function togo(){
  if(done){
    switch(densee.style.opacity){
      case"1":
        densee.style.opacity = "0";
        Togg.innerHTML = "Ieslēgt blīvuma karti";
      break;
      case"0":
        densee.style.opacity = "1";
        Togg.innerHTML = "Izslēgt blīvuma karti";
      break;
    }
  }
}
function CanvasClear(){
  stx.clearRect(CanvasD.x,CanvasD.y,actw*CanvasD.zoom/100,acth*CanvasD.zoom/100);
  mtx.clearRect(CanvasD.x,CanvasD.y,actw*CanvasD.zoom/100,acth*CanvasD.zoom/100);
  ttx.clearRect(CanvasD.x,CanvasD.y,actw*CanvasD.zoom/100,acth*CanvasD.zoom/100);
  btx.clearRect(CanvasD.x,CanvasD.y,actw*CanvasD.zoom/100,acth*CanvasD.zoom/100);
  otx.clearRect(CanvasD.x,CanvasD.y,actw*CanvasD.zoom/100,acth*CanvasD.zoom/100);
  dtx.clearRect(CanvasD.x,CanvasD.y,actw*CanvasD.zoom/100,acth*CanvasD.zoom/100);
}
function redraw(){//clear and draw everything
  CanvasClear();
  stx.lineWidth = 0.5;
  stx.strokeStyle = "rgba(110, 110, 110, 0.04)";
  busses.forEach(TrackUpdate);
  stx.strokeStyle="black";
  temporary_1=actw*(CanvasD.zoom/100)*0.00015;
  stops.forEach(StopDraw);
  middle.style.filter = lvfilter;
  mtx.drawImage(latv,CanvasD.x,CanvasD.y,middle.width*CanvasD.zoom/100,middle.height*CanvasD.zoom/100);
  if(densee.style.opacity == "1"){
    dense.forEach(function(a){
      let ko=a.density;
      let ceil=1000;
      if(ko>ceil)ko=ceil;
      dtx.fillStyle="rgba("+Math.round(66+ko/ceil*115)+","+Math.round(244-ko/ceil*179)+",244,"+(1-0.985+ko/ceil*0.965)+")";
      dtx.fillRect(a.x*CanvasD.zoom/100+CanvasD.x,a.y*CanvasD.zoom/100+CanvasD.y,0.0016*actw*CanvasD.zoom/100,0.0016*actw*CanvasD.zoom/100);
    });
  }

  //btx.drawImage(orangeLayer,-middle.width,-middle.height,middle.width*2,middle.height*2);
}
function TrackUpdate(Ob){//all routes draw
  stx.beginPath();
  stx.moveTo(CanvasD.x+(Ob.route[0].x)*CanvasD.zoom/100,CanvasD.y+(Ob.route[0].y)*CanvasD.zoom/100);
  Ob.route.forEach(function(A){
    stx.lineTo(CanvasD.x+(A.x)*CanvasD.zoom/100,CanvasD.y+(A.y)*CanvasD.zoom/100);
  });
  stx.stroke();
}
function StopDraw(Ob){//bus stop draw
  stx.beginPath();
  stx.arc(CanvasD.x+(Ob.x)*CanvasD.zoom/100,CanvasD.y+(Ob.y)*CanvasD.zoom/100,temporary_1, 0, pi2);
  stx.stroke();
}
function coorToCanvas(E,N){//coordinates to canvas coordinates
  var x=(E-left)*mwdw;
  var y=((ttop-N)*mhdh);
  return [x,y];
}
var prX=0;
var prY=0;
var hoverX=0;
var hoverY=0;
var stopDrawDone = false;
var highDone = false;
function move(e){
  if(down){//map drag
    var x = e.clientX;
    var y = e.clientY;
    var dex=(x-prX);
    var dey=(y-prY);
    prX=x;
    prY=y;
    CanvasClear();
    CanvasD.x+=dex;
    CanvasD.y+=dey;
    redraw();
    //console.log([dex,dey]);
  }else{
    stopDrawDone = false;
    if(!highDone) otx.clearRect(CanvasD.x,CanvasD.y,actw*CanvasD.zoom/100,acth*CanvasD.zoom/100);
    prX = e.clientX;
    prY = e.clientY;
    hoverX = ((e.clientX - CanvasD.x)*100)/CanvasD.zoom;
    hoverY = ((e.clientY - CanvasD.y)*100)/CanvasD.zoom;
    if(CanvasD.zoom > 450){
      stops.forEach(StopHover);
    }
  }
}
function click(){
  highDone = false;
  busses.forEach(BusHover);
}
function StopHover(Ob){
  if(stopDrawDone || highDone) return;
  if(hoverX <= Ob.x + CanvasD.zoom/1500 && hoverX >= Ob.x - CanvasD.zoom/1500 && hoverY >= Ob.y - CanvasD.zoom/1500 && hoverY <= Ob.y + CanvasD.zoom/1500){
    stopDrawDone = true;
    popup(CanvasD.x+(Ob.x)*CanvasD.zoom/100, CanvasD.y+(Ob.y)*CanvasD.zoom/100);
    otx.fillStyle = "black";
    otx.font = (CanvasD.zoom/(5.25*Ob.name.length) - 30/Ob.name.length) + "px Space Mono";
    otx.fillText(Ob.name.replace(/\s+$/g, ""), CanvasD.x+(Ob.x)*CanvasD.zoom/100 - CanvasD.zoom/20 + 1, CanvasD.y+(Ob.y)*CanvasD.zoom/100 - CanvasD.zoom/44 - Ob.name.length + 4);
  }
}
function BusHover(Ob){
  if(highDone) return;
  Ob.highlighted = false;
  if(Ob.going && hoverX < Ob.x + CanvasD.zoom/1000 && hoverX > Ob.x - CanvasD.zoom/1000 && hoverY > Ob.y - CanvasD.zoom/1000 && hoverY < Ob.y + CanvasD.zoom/1000){
    otx.clearRect(CanvasD.x,CanvasD.y,actw*CanvasD.zoom/100,acth*CanvasD.zoom/100);
    Ob.highlighted = true;
    console.log(Ob);
    highDone = true;
    Ob.route.forEach(function (A){
      popup(CanvasD.x+(A.x)*CanvasD.zoom/100, CanvasD.y+(A.y)*CanvasD.zoom/100);
      otx.fillStyle = "black";
      otx.font = (CanvasD.zoom/(5.25*A.name.length) - 30/A.name.length) + "px Space Mono";
      otx.fillText(A.name.replace(/\s+$/g, ""), CanvasD.x+(A.x)*CanvasD.zoom/100 - CanvasD.zoom/20 + 1, CanvasD.y+(A.y)*CanvasD.zoom/100 - CanvasD.zoom/44 - A.name.length + 4);
    });
  }
}
function CanvasD(){
  this.x=0;
  this.y=0;
  this.zoom=100;
}
var CanvasD=new CanvasD();
var temporary_1;
var pi2=Math.PI*2;
