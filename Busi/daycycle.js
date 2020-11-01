var localTime = 150; //time in seconds
var day = 0;
var pod = "Vakars"; //part of day
var calhours;
var calminutes;
var dayLength = 1200; //day length - seconds
var updateCount = 50; //determines bus speed
var day4=dayLength/4;
var day34=day4*3;
var day2=dayLength/2;
var temporary_2;
var temporary_3;
var updateCount;
var instantu=false;
function updateTime(){
  //1200 secs
  if(localTime < dayLength){
    let partOfDay = 24*localTime/dayLength; //hours
    let minutes = Math.floor((partOfDay%1)*60);
    calminutes=minutes;
    minutes = String(minutes).length == 2 ? minutes : "0" + minutes;
    let hours = Math.floor(partOfDay);
    calhours=hours;
    hours = String(hours).length == 2 ? hours : "0" + hours;
    timeDisplay.innerHTML = hours + ":" + minutes;//sets time
    dayDisplay.innerHTML = "  Diena: " + day;//sets day

    if(localTime >= day34 && pod == "Diena"){
      lvfilter = "brightness(20%)";
      body.style.backgroundColor = "#510a5e";
      //imageContainer.style.opacity = "1";
      pod = "Vakars";
      cBusColor = "#7aacff";
      redraw();
    }
    else if(localTime >= day2 && pod == "Rīts"){
      lvfilter = "brightness(90%)";
      body.style.backgroundColor = "#901FBA";
      //imageContainer.style.opacity = "0";
      pod = "Diena";
      cBusColor = "#0e4877";
      redraw();
    }
    else if(localTime >= day4 && pod == "Nakts"){
      lvfilter = "brightness(85%)";
      body.style.backgroundColor = "#a11faf";
      //imageContainer.style.opacity = "0";
      pod = "Rīts";
      cBusColor = "#0e4877";
      redraw();
    }
    else if(localTime >= 0 && localTime < day4 && pod == "Vakars"){
      lvfilter = "brightness(10%)";
      body.style.backgroundColor = "#220430";
      //imageContainer.style.opacity = "1";
      pod = "Nakts";
      cBusColor = "#7aacff";
      redraw();
      dense.forEach(function(a){
        let ko=a.density;
        let ceil=1000;
        if(ko>ceil)ko=ceil;
        dtx.fillStyle="rgba("+Math.round(66+ko/ceil*115)+","+Math.round(244-ko/ceil*179)+",244,"+(1-0.985+ko/ceil*0.965)+")";
        dtx.fillRect(a.x*CanvasD.zoom/100+CanvasD.x,a.y*CanvasD.zoom/100+CanvasD.y,0.0016*actw*CanvasD.zoom/100,0.0016*actw*CanvasD.zoom/100);
      });
    }

    podDisplay.innerHTML = "DD: " + pod;//sets Dienas Dala
    localTime += 0.05;
    instantu=false;
  }
  else{
    day++;
    localTime = 0;
    instantu=true;
  }
  busses.forEach(function(a,index){
    temporary_2=a.times;
    temporary_3=a.route;
    if(!a.going){//sets bus to go if ready
      if(temporary_2[0][0]==calhours && temporary_2[0][1]==calminutes){
        a.going=true;
        let extra = "";
        switch(temporary_3[0].name){
          case "Lubāna":
            let tempRand = random(0, 3);
            switch(tempRand){
              case 0:
                extra = ". Uzmanību, nedaudz mitrs!";
              break;
              case 1:
                extra = ". Brīdinājums: paklāji var slīdēt!";
              break;
              case 2:
                extra = ". Sargies zivju!";
              break;
              case 3:
                extra = ". Uzmanību - dēles!";
              break;
            }
          break;
        }
        let hours = String(temporary_2[temporary_2.length-1][0]).length == 1 ? "0" + temporary_2[temporary_2.length-1][0] : String(temporary_2[temporary_2.length-1][0]);
        let mins = String(temporary_2[temporary_2.length-1][1]).length == 1 ? "0" + temporary_2[temporary_2.length-1][1] : String(temporary_2[temporary_2.length-1][1]);
        Console.log("Autobuss no " + temporary_3[0].name + " ir izbraucis, galapunktā " + temporary_3[temporary_3.length-1].name + " būs " + String(hours + ":" + mins).replace("24:","00:") + extra);
      }
    }else{//16 updates in one in-game minute
      var sw=false;
      if(a.x==temporary_3[a.place].x && a.y==temporary_3[a.place].y){
        if(a.waited==a.passengerCool){//bus stop waiting time
          a.waited=0;
          a.place++;
          if(a.place==temporary_3.length){//parbauda vai ir galamerki sasniedzis
            a.going=false;
            a.place=0;
            a.x=temporary_3[a.place].x;
            a.y=temporary_3[a.place].y;
            return;
          }
          if(((temporary_2[a.place][0]*60+temporary_2[a.place][1])-(temporary_2[a.place-1][0]*60+temporary_2[a.place-1][1]))<0){
            if(temporary_2[a.place][0]%24==temporary_2[a.place-1][0]%24){
              temporary_2[a.place][0]+=1;
            }else{
              temporary_2[a.place][0]+=24;
            }
          }
          var framec=16*((temporary_2[a.place][0]*60+temporary_2[a.place][1])-(temporary_2[a.place-1][0]*60+temporary_2[a.place-1][1]));
          if(framec==0)framec=1;
          a.frame=framec;
          a.delta[0]=(temporary_3[a.place].x-temporary_3[a.place-1].x)/framec;
          a.delta[1]=(temporary_3[a.place].y-temporary_3[a.place-1].y)/framec;
          sw=true;
        }else{
          a.waited++;
        }
      }
      if(a.waited==0){//moving
        a.x+=a.delta[0];
        a.y+=a.delta[1];
        a.count++;
        if(a.count==a.frame && !sw){
          a.count=0;
          a.x=temporary_3[a.place].x;
          a.y=temporary_3[a.place].y;
        }
      }

    }
  });
  setTimeout(updateTime, instantu ? 0 : updateCount);
}
timeSlider.addEventListener("change",
function(){//changes day cycle speed
  updateCount = 60-timeSlider.value;
});
