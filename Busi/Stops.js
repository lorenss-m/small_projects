function Stop(name, E, N,Id){
    this.name=name;
    this.degE=E;
    this.degN=N;
    this.Id=Id;
    IDstop.push([this.Id, this]);
}
function findById(Id){
  for(var i=0;i<IDstop.length;i++){
    if(Number(IDstop[i][0])==Number(Id)){
      return IDstop[i][1];
    }
  }
  throw Id;
}
var IDstop=[];
