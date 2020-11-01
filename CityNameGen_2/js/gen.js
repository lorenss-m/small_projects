var set = "c";

function generateName(){
  let ret = eval(`${set}sakumaZilbes`)[random(0, eval(`${set}sakumaZilbes`).length - 1)];
  for(i = 0; i < random(1, 2); i++) ret += eval(`${set}vidusZilbes`)[random(0, eval(`${set}vidusZilbes`).length - 1)];
  if((random(1, 3) == 1 || ret[ret.length - 1] == "u") && ret[ret.length - 1] != "i") ret += eval(`${set}beiguZilbes`)[random(0, eval(`${set}beiguZilbes`).length - 1)];
  if(ret[ret.length - 1] == "e" && ret[ret.length - 2] == "i") ret += "ms"
  return ret;
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function draw(){
    document.getElementById("print").innerHTML = "";
    for(o = 0; o < 10; o++){
      let name = generateName();
      let nameLevel = 1.2 - name.length/20 + random(-1, 1)/8;
      for(i of eval(`cbadName`)){
        if(name.toLowerCase().includes(i)) nameLevel -= 0.25;
      }
      if(name.includes("ciems")) nameLevel += 0.6;
      if(name[name.length - 1] == "ā" || name[name.length - 1] == "ē" || name[name.length - 1] == "o" || name[name.length - 1] == "ī" || name[name.length - 1] == "ū") nameLevel -= 0.25;
      if(realNames.has(name)) name += ` (<a href = 'https://www.google.com/search?q=${name}' style = 'color: white;' target="_blank">Eksistē</a>)`;
      if(random(0, 200) == 7){
        name = "Meža " + name;
      } else if (random(0, 200) == 17 && (name[name.length - 1] == "s")) {
        name += "u Muiža";
      } else if (random(0, 200) == 11 && (name[name.length - 1] == "i")) {
        name = "Jaunie " + name;
      }
      document.getElementById("print").innerHTML += `<span style = 'opacity: ${nameLevel}'>${name}</span><br>`;
    }
}

function chciemi(curr){
  document.getElementById("type").value = curr == "Ciemi" ? "Pilsētas" : "Ciemi";
  set = document.getElementById("type").value == "Ciemi" ? "c" : "p";
}

function updateTotal(){
  let vars = [
    new Set(eval(`${set}sakumaZilbes`)),
    new Set(eval(`${set}vidusZilbes`)),
    new Set(eval(`${set}beiguZilbes`))
  ]
  let val = vars[0].size * vars[1].size * vars[2].size + vars[0].size * vars[1].size + vars[0].size * vars[1].size * vars[1].size + vars[0].size * vars[1].size * vars[1].size * vars[2].size;
  document.getElementById("data").innerHTML = `Total possible names: ${val} (${val/(10 ** (String(val).length - 1))} * 10${String(String(val).length - 1).sup()})`;
}

console.log(realNames.size);
draw();
updateTotal();
