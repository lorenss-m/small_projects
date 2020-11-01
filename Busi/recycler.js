
var str;//Busstop data string
var IDs;//Busstop ID string
var reA=[];//returned array
var done=false;
var i=0;
var troute;
var errs=[];
var dense;
function daritajs(){
  //split the stops
  var bigA=str.split("\n");
  var IDSaf=[];
  reA=[];
  bigA.forEach(
    function(a,i){
      bigA[i]=a.split("\t");
      if(!IDSaf.includes(bigA[i][3])){
        IDSaf.push(bigA[i][3]);
        reA.push(new Stop(bigA[i][0],bigA[i][2],bigA[i][1],bigA[i][3]));
      }
    }
  );
  //split the routes
  troute=troute.split("\n");
  troute.forEach(function(a){
    if(!a)return;
    var te=a.split(" ");
    var ti=[];
    for(var i=2;i<te.length;i+=2){
      ti.push([te[i],te[i+1]]);
    }
    busses.push(new Bus(ti,te[1]));
  });
  busses.forEach(function(a, index){
    var k=true;
    for(var i=0;i<a.times.length;i++){
      if(a.times[i][0]!=0 || a.times[i][1]!=0)k=false;
    }
    if(k){
      errs.push(index);
    }
  });
  for(var i=errs.length-1;i>=0;i--){
    busses.splice(errs[i],1);
  }
  //split the density
  dense=dense.split("\n");
  dense.forEach(function(a,i){
    dense[i]=a.split("\t");
    dense[i]=new DensityKm(dense[i][0],dense[i][1],dense[i][2]);
  });
  done=true;
}

function recycle(){
  var fileURL = "Stop_Data";
  var xhr = new XMLHttpRequest();
  xhr.open('GET', fileURL);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      str=xhr.responseText;
      daritajs1();
    }
  }
  xhr.send();
}
function daritajs1(){
  var fileURL = "timetable.txt";
  var xhr = new XMLHttpRequest();
  xhr.open('GET', fileURL);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      troute=xhr.responseText;
      daritajs2();
    }
  }
  xhr.send();
}
function daritajs2(){
  var fileURL = "blivums.data";
  var xhr = new XMLHttpRequest();
  xhr.open('GET', fileURL);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      dense=xhr.responseText;
      daritajs();
    }
  }
  xhr.send();
}
