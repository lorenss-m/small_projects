function DensityKm(x,y,d){
  let l=-280;
  let t=474;
  let w=5.76;
  let h=w;
  this.x=(Number(x)+l)*w/2923.689497716895*actw;
  this.y=(-Number(y)+t)*h/1936*acth;
  this.density=Number(d);
}
