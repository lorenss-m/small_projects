var cBusColor = "#f4ee42";
function Bus(route,filename){
  this.filename=filename;
  this.route=[];
  this.times=[];
  for(var i=0;i<route.length;i++){
    try{
      this.route.push(findById(route[i][0]));
    }catch(e){
      console.log(this);
      console.log("Šis man neiet cauri.");
    }
    if(route[i][1]){
      this.times.push([Number(route[i][1].substring(0,2)),Number(route[i][1].substring(3,5))]);
    }else{
      this.times.push([0,0]);
    }
  }
  this.place=0;
  this.x=route[0].x;
  this.y=route[0].y;
  this.passengerCool=8;
  this.waited=0;
  this.highlighted=false;
  this.going=false;
  this.delta=[];
  this.count=0;
  this.frame=0;

}
function BusUpdate(Ob){if(Ob.going){
  var destindex=Ob.place;
  var dest=Ob.route[destindex];
  var dx=dest.x-Ob.x;
  var dy=dest.y-Ob.y;
  if(dx==0 && dy==0 && Ob.place!=Ob.route.length-1){
    dest=Ob.route[destindex+1];
    dx=dest.x-Ob.x;
    dy=dest.y-Ob.y;
  }
  var distance=Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2));
  ttx.strokeStyle = "black";
  ttx.lineWidth = actw*0.00015;

  //rotate and draw bus
  ttx.translate(CanvasD.x+Ob.x*CanvasD.zoom/100,CanvasD.y+Ob.y*CanvasD.zoom/100);
  ttx.rotate(Math.atan2(dy,dx));
  drawBus(0, 0, CanvasD.zoom/60, cBusColor, Ob.highlighted);
  ttx.rotate(-Math.atan2(dy,dx));
  ttx.translate(-(CanvasD.x+Ob.x*CanvasD.zoom/100),-(CanvasD.y+Ob.y*CanvasD.zoom/100));
}}
function coorInit(Ob){
  Ob.x=Ob.route[0].x;
  Ob.y=Ob.route[0].y;
}
function drawBus(x, y, scale, color, high){//bus design
    ttx.lineWidth = scale/3;
    ttx.strokeStyle = "white";
    if(high){
      ttx.strokeRect(x, y - scale/6, scale/2, scale/3);
      ttx.strokeRect(x - scale/2, y - scale/5, scale/1.1, scale*2/5);
      popup(x, y);
    }
    ttx.strokeStyle = "black";
    ttx.lineWidth = scale/5;
    ttx.fillStyle = color;
    ttx.strokeRect(x, y - scale/6, scale/2, scale/3);
    ttx.strokeRect(x - scale/2, y - scale/5, scale/1.1, scale*2/5);
    ttx.fillRect(x - scale/2, y - scale/5, scale/1.1, scale*2/5);
    ttx.fillRect(x, y - scale/6, scale/2, scale/3);
    ttx.beginPath();
    for(i = -3; i < 3; i++){
        ttx.moveTo(x + scale*i/7 + scale/20, y - scale/8);
        ttx.lineTo(x + scale*i/7 + scale/20, y + scale/8);
    }
    ttx.lineWidth = scale/60;
    ttx.stroke();
}
function popup(tx, ty){
  otx.fillStyle = "black";
  otx.fillRect(tx - CanvasD.zoom/20 - 1, ty - CanvasD.zoom/16 - 1, CanvasD.zoom/10 + 2, CanvasD.zoom/22 + 2);
  otx.beginPath();
  otx.moveTo(tx, ty);
  otx.lineTo(tx - CanvasD.zoom/80, ty - CanvasD.zoom/44);
  otx.lineTo(tx + CanvasD.zoom/80, ty - CanvasD.zoom/44);
  otx.closePath();
  otx.stroke();
  otx.fillStyle = "#e9acf9";
  otx.fillRect(tx - CanvasD.zoom/20, ty - CanvasD.zoom/16, CanvasD.zoom/10, CanvasD.zoom/22);
  otx.beginPath();
  otx.moveTo(tx, ty);
  otx.lineTo(tx - CanvasD.zoom/80, ty - CanvasD.zoom/44);
  otx.lineTo(tx + CanvasD.zoom/80, ty - CanvasD.zoom/44);
  otx.closePath();
  otx.fill();
}
