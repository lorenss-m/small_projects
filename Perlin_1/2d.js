let ctx = plane.getContext("2d");

plane.width = window.innerWidth;
plane.height = window.innerHeight;

let resolution = 1;
let gridMod = 80;
let gridMod2 = 3;

let weight = 0;

let gridAngles = [];

function noiser(){
    for(x = 0; x < plane.width; x+=resolution){
        for(y = 0; y < plane.height; y+=resolution){
            let perlinVal = interpolate(perlin(x, y, resolution*gridMod, gridAngles), perlin(x, y, resolution*gridMod*gridMod2, gridAngles), weight);
            //ctx.fillStyle = `hsl(${perlin(x, y, resolution*gridMod, gridAngles)*500%50}, 50%, ${perlin(x, y, resolution*gridMod, gridAngles)*30 + 25}%)`;
            ctx.fillStyle = `hsl(${perlin(x, y, resolution*gridMod, gridAngles)*1980%200 + 70}, 50%, ${perlin(x, y, resolution*gridMod, gridAngles)*30 + 25}%)`;
            //ctx.fillStyle = `hsl(${Math.sin(perlin(x, y, resolution*gridMod, gridAngles)*12)*50 + 220}, 50%, ${perlin(x, y, resolution*gridMod, gridAngles)*30 + 25}%)`;
            //ctx.fillStyle = `rgba(0, 0, 0, ${perlinVal})`;
            /*let b1 = perlin(x, y, resolution*gridMod*gridMod2, gridAngles)*360;
            let b2 = perlin(x, y, resolution*gridMod, gridAngles);
            if(b2 > 0.65){
                ctx.fillStyle = `hsl(${b2*30 + 50 + b1}, 50%, ${(b2-0.65)*400 + 40}%)`;
            }
            else if(b2 > 0.5){
                ctx.fillStyle = `hsl(${b2*40 - 90 + b1}, 50%, ${(b2-0.5)*80 + 35}%)`;
            }
            else{
                ctx.fillStyle = `hsl(${b2*30 - 40 + b1}, 50%, ${b2*100 + 5}%)`;
            }*/
            //ctx.fillStyle = `hsl(${perlin(x, y, resolution*gridMod, gridAngles)*30 - 20}, 50%, ${}%)`;

            //console.log(perlin(x/plane.width, y/plane.height));

            ctx.fillRect(x, y, resolution, resolution);
            //if(x % gridMod == 0 && y % gridMod == 0) ctx.fillRect(x, y, 5, 5);
        }
    }
    for(x = 0; x < plane.width/(resolution*gridMod) + 1; x++){
        for(y = 0; y < plane.height/(resolution*gridMod) + 1; y++){
            gridAngles[x][y] += Math.random()*Math.PI/10;
        }
    }
    //setTimeout(noiser, 10);
}

function computeGridAngles(){
    for(x = 0; x < plane.width/(resolution*gridMod) + 1; x++){
        gridAngles.push([]);
        for(y = 0; y < plane.height/(resolution*gridMod) + 1; y++){
            gridAngles[x].push(Math.random() * 2 * Math.PI);
        }
    }
    //console.log(gridAngles);
}

computeGridAngles();
noiser();
