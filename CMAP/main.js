const scr = document.getElementById("screen");
const ui = document.getElementById("UI");

scr.width  = window.innerWidth;
scr.height = window.innerHeight;
ui.width  = window.innerWidth;
ui.height = window.innerHeight;

ui.requestPointerLock = ui.requestPointerLock || ui.mozRequestPointerLock;

document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;

const ctx = scr.getContext("2d");

let meshes = [];
let mover = [0, 0, 0];

let px = scr.width/2;
let py = scr.height/2;

let rdist = 4;
let chunkSize = 32;

let t;

class mesh{
    constructor(points, color, normal){
        this.points = points ? points : [];
        this.color = color;
        this.normal = normal;
    }
    add(point){
        this.points.push(point);
    }
}

class node{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}

class path extends mesh{
    constructor(points, color, normal){
        super(points, color, normal);
    }
}
class camera{
    constructor(x, y, z, rx, rz, sensitivity, focal, speed){
        this.x = x;
        this.y = y;
        this.z = z;
        this.rx = rx;
        this.rz = rz;
        this.sensitivity = sensitivity;
        this.focal = focal;
        this.speed = speed;
    }
    rotate(way){
        this.rx += way.z * this.sensitivity;
        this.rz += way.x * this.sensitivity;
    }
}

class point{
    constructor(x, y, z){
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

function house(x, y, z){
    let width = rand(30, 80);
    let length = rand(50, 150);
    let height = rand(20, 50);
    console.log(x, y, z);
    
    meshes.push(new mesh([new point(x - width/2, y - length/2, 0), new point(x + width/2, y - length/2, 0), new point(x + width/2, y - length/2, height), new point(x - width/2, y - length/2, height)], "#696969", 1),
                new mesh([new point(x - width/2, y - length/2, 0), new point(x - width/2, y + length/2, 0), new point(x - width/2, y + length/2, height), new point(x - width/2, y - length/2, height)], "#595959", -1),
                new mesh([new point(x + width/2, y - length/2, 0), new point(x + width/2, y + length/2, 0), new point(x + width/2, y + length/2, height), new point(x + width/2, y - length/2, height)], "grey", 1),
                new mesh([new point(x - width/2, y + length/2, 0), new point(x + width/2, y + length/2, 0), new point(x + width/2, y + length/2, height), new point(x - width/2, y + length/2, height)], "#969696", -1),
                new mesh([new point(x - width/2, y - length/2, height), new point(x + width/2, y - length/2, height), new point(x + width/2, y + length/2, height), new point(x - width/2, y + length/2, height)], "#a8a8a8", 1),
    );
    
}

//meshes.push(new mesh([new point(5, 5, 5, "orange"), new point(5, 8, 5, "orange"), new point(5, 5, 1, "orange")], "orange", 1));

let mainCam = new camera(-rdist * chunkSize * 1.8, rdist * chunkSize * 1.8, 100, -Math.PI / 2, Math.PI / 4, 0.5, 500, 0.36);

function draw(){
    ctx.clearRect(0, 0, scr.width, scr.height);
    mainCam.x += Math.sin(-mainCam.rz) * mover[1] * mainCam.speed + Math.cos(mainCam.rz) * mover[0] * mainCam.speed;
    mainCam.y += Math.sin(mainCam.rz) * mover[0] * mainCam.speed + Math.cos(-mainCam.rz) * mover[1] * mainCam.speed;
    mainCam.z += mover[2] * mainCam.speed;
    if(mainCam.z < 45){
        mainCam.z = 45;
    }
    ctx.lineWidth = 3;
    for(m of meshes){
        ctx.beginPath();
        for(i = 0; i < m.points.length; i++){
            let point = m.points[i];
            /*
            let d1 = multiply(delta, [[1, 0, 0], [0, Math.cos(mainCam.rx), -Math.sin(mainCam.rx)], [0, Math.sin(mainCam.rx), Math.cos(mainCam.rx)]]);
            console.log(d1);
            
            let d2 = multiply(d1, [[Math.cos(mainCam.ry), 0, Math.sin(mainCam.ry)], [0, 1, 0], [-Math.sin(mainCam.ry), 0, Math.cos(mainCam.ry)]]);

            let d3 = multiply(d2, [[Math.cos(mainCam.rz), -Math.sin(mainCam.rz), 0], [Math.sin(mainCam.rz), Math.cos(mainCam.rz), 0], [0, 0, 1]]);

            let f1 = multiply(d3, [[1, 0, 0], [0, 1, 0], [scr.width/(2*mainCam.focal), scr.height/(2*mainCam.focal), 1/mainCam.focal]]);

            bx = f1[0]/f1[2];
            by = f1[1]/f1[2];

            */
            let b = project(point.x, point.y, point.z);
            if(b){
                if(i == 0) ctx.moveTo(b[0], b[1]);
                else ctx.lineTo(b[0], b[1]);
            }

        }
        let dxs = [[m.points[1].x - m.points[0].x, m.points[1].y - m.points[0].y, m.points[1].z - m.points[0].z],
                    [m.points[2].x - m.points[0].x, m.points[2].y - m.points[0].y, m.points[2].z - m.points[0].z],
                    [mainCam.x - m.points[0].x, mainCam.y - m.points[0].y, mainCam.z - m.points[0].z]];
        let det = dxs[0][0]*dxs[1][1]*dxs[2][2] + dxs[0][1]*dxs[1][2]*dxs[2][0] + dxs[0][2]*dxs[1][0]*dxs[2][1] - dxs[0][2]*dxs[1][1]*dxs[2][0] - dxs[0][1]*dxs[1][0]*dxs[2][2] - dxs[0][0]*dxs[1][2]*dxs[2][1];

        if(det * m.normal > 0){
            ctx.fillStyle = m.color;
            ctx.fill();
            ctx.strokeStyle = m.color;
            ctx.stroke();
        }
        else{
            ctx.closePath();
        }
    }
    let sx = Math.tan(mainCam.rx) * mainCam.z * Math.sin(-mainCam.rz);
    let sy = Math.tan(mainCam.rx) * mainCam.z * Math.cos(-mainCam.rz);
    if(Math.sqrt(sx**2 + sy**2) < rdist * chunkSize * 5){
        sx += mainCam.x;
        sy += mainCam.y;
        snapped = false;
        for(n of nodes){
            let tr = project(n.x, n.y, 0);
            if(tr){
                ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
                ctx.beginPath();
                ctx.arc(tr[0], tr[1], 1400/mainCam.z, 0, Math.PI * 2);
                ctx.fill();
                if(Math.sqrt((n.x - sx)**2 + (n.y - sy)**2 < 16)){
                    sx = n.x;
                    sy = n.y;
                    snapped = true;
                }
            }
        }

        let pr = project(sx, sy, 0);
        if(pr){
            ctx.fillStyle = "white";
            ctx.beginPath();
            ctx.arc(pr[0], pr[1], 6, 0, Math.PI * 2);
            ctx.fill();
            if(t){
                let k = project(t.x, t.y, 0.2);
                if(k){
                    ctx.strokeStyle = (sx > 0 || sx < -rdist * chunkSize * 2 || sy < 0 || sy > rdist * chunkSize * 2) ? "rgba(255, 0, 0, 0.5)" : "rgba(0, 0, 0, 0.2)";
                    ctx.lineWidth = 1000/mainCam.z;
                    ctx.beginPath();
                    ctx.moveTo(k[0], k[1]);
                    ctx.lineTo(pr[0], pr[1]);
                    ctx.stroke();
                }
            }
        }
    }

    setTimeout(draw, 1000/144);
}

function startPath(cx, cy){
    t = {
        x: cx,
        y: cy,
        s: snapped
    };
}

function endPath(ex, ey){
    let alpha = -Math.atan2(ex - t.x, ey - t.y);
    let dx = Math.cos(alpha) * 2;
    let dy = Math.sin(alpha) * 2;
    let length = Math.sqrt((ex - t.x)**2 + (ey - t.y)**2);
    let chu = 30;
    let times = Math.ceil(length/chu);
    chu = length/times;
    for(i = 0; i < times; i++){
        meshes.push(new path([
            new point(t.x + dx + i * chu * Math.cos(Math.PI/2 + alpha), t.y + dy + i * chu * Math.sin(Math.PI/2 + alpha), 0.2), new point(t.x - dx + i * chu * Math.cos(Math.PI/2 + alpha), t.y - dy + i * chu * Math.sin(Math.PI/2 + alpha), 0.2),
            new point(t.x - dx + (i+1) * chu * Math.cos(Math.PI/2 + alpha), t.y - dy + (i+1) * chu * Math.sin(Math.PI/2 + alpha), 0.2), new point(t.x + dx + (i+1) * chu * Math.cos(Math.PI/2 + alpha), t.y + dy + (i+1) * chu * Math.sin(Math.PI/2 + alpha), 0.2)
        ], "gray", -1));
        if(i == 0){
            if(!t.s){
                nodes.push(new node(t.x + i * chu * Math.cos(Math.PI/2 + alpha), t.y + i * chu * Math.sin(Math.PI/2 + alpha)));
            }
            if(times == 1 && !snapped){
                nodes.push(new node(ex, ey));
            }
        }
        else if(i == times - 1){
            nodes.push(new node(t.x + i * chu * Math.cos(Math.PI/2 + alpha), t.y + i * chu * Math.sin(Math.PI/2 + alpha)));
            if(!snapped){
                nodes.push(new node(ex, ey));
            }
        }
        else nodes.push(new node(t.x + i * chu * Math.cos(Math.PI/2 + alpha), t.y + i * chu * Math.sin(Math.PI/2 + alpha)));
    }
    t = null;
}

function project(x, y, z){

    dx = mainCam.x - x;
    dy = mainCam.y - y;
    dz = mainCam.z - z;

    let gz = Math.cos(mainCam.rx) * dz - Math.sin(mainCam.rx) * (Math.cos(mainCam.rz) * dy - Math.sin(mainCam.rz) * dx);

    if(gz > 0){
        let gy = Math.sin(mainCam.rx) * dz + Math.cos(mainCam.rx) * (Math.cos(mainCam.rz) * dy - Math.sin(mainCam.rz) * dx);
        let gx = Math.sin(mainCam.rz) * dy + Math.cos(mainCam.rz) * dx;
        let bx = -mainCam.focal * gx / gz + px;
        let by = -mainCam.focal * gy / gz + py;
        return [bx, by];
    }
    else{
        return;
    }

}

function terrain(){
    let startX = - rdist * chunkSize * 2;
    let startY = - rdist * chunkSize * 2;
    for(i = 0; i < 2; i++){
        for(o = 0; o < 2; o++){
            for(x = 0; x < rdist*2; x++){
                for(y = 0; y < rdist*2; y++){
                    meshes.push(new mesh([new point(startX + x * chunkSize + i * rdist * chunkSize * 2, startY + y * chunkSize + o * rdist * chunkSize * 2, 0), new point(startX + x * chunkSize + chunkSize + i * rdist * chunkSize * 2, startY + y * chunkSize + o * rdist * chunkSize * 2, 0), new point(startX + x * chunkSize + chunkSize + i * rdist * chunkSize * 2, startY + y * chunkSize + chunkSize + o * rdist * chunkSize * 2, 0), new point(startX + x * chunkSize + i * rdist * chunkSize * 2, startY + y * chunkSize + chunkSize + o * rdist * chunkSize * 2, 0)],randomHSLwithrange((i * 2 + o)*90),1));
                    /*
                    let pointX = rand(chunkSize * 0.25, chunkSize * 0.75);
                    let pointY = rand(chunkSize * 0.25, chunkSize * 0.75);
                    let pointZ = rand(-35, 35);
                    meshes.push(new mesh([new point(startX + x * chunkSize, startY + y * chunkSize, 0), new point(startX + x * chunkSize + pointX, startY + y * chunkSize + pointY, pointZ), new point(startX + x * chunkSize + chunkSize, startY + y * chunkSize, 0)], randomHSLwithrange(), -1));
                    meshes.push(new mesh([new point(startX + x * chunkSize + chunkSize, startY + y * chunkSize, 0), new point(startX + x * chunkSize + pointX, startY + y * chunkSize + pointY, pointZ), new point(startX + x * chunkSize + chunkSize, startY + y * chunkSize + chunkSize, 0)], randomHSLwithrange(), -1));
                    meshes.push(new mesh([new point(startX + x * chunkSize + chunkSize, startY + y * chunkSize + chunkSize, 0), new point(startX + x * chunkSize + pointX, startY + y * chunkSize + pointY, pointZ), new point(startX + x * chunkSize, startY + y * chunkSize + chunkSize, 0)], randomHSLwithrange(), -1));
                    meshes.push(new mesh([new point(startX + x * chunkSize, startY + y * chunkSize + chunkSize, 0), new point(startX + x * chunkSize + pointX, startY + y * chunkSize + pointY, pointZ), new point(startX + x * chunkSize, startY + y * chunkSize, 0)], randomHSLwithrange(), -1));*/
                }
            }
        }
    }
}

function randomHSLwithrange(start) {
    var h = rand(start, start + 2);
    var l = rand(48.2, 49);
    return `hsl(${h}, 45%, ${l}%)`;
}

function rand(min, max) {
    return min + Math.random() * (max - min);
}

let nodes = [new node(-2 * rdist * chunkSize, rdist * chunkSize), new node(-rdist * chunkSize, rdist * chunkSize * 2),
    new node(0, rdist * chunkSize), new node(-rdist * chunkSize, 0)];

terrain();
draw();

window.addEventListener("keydown", (e) => {
    switch(e.key){
        case "a":
            mover[0] = -1;
        break;
        case "d":
            mover[0] = 1;
        break;
        case "s":
            mover[1] = 1;
        break;
        case "w":
            mover[1] = -1;
        break;
        case " ":
            mover[2] = 1;
        break;
        case "Shift":
            mover[2] = -1;
        break;
    }
})
window.addEventListener("keyup", (e) => {
    switch(e.key){
        case "a":
            mover[0] = 0;
        break;
        case "d":
            mover[0] = 0;
        break;
        case "s":
            mover[1] = 0;
        break;
        case "w":
            mover[1] = 0;
        break;
        case " ":
            mover[2] = 0;
        break;
        case "Shift":
            mover[2] = 0;
        break;
    }
})

let locked = false;

ui.onclick = (e) => {
    if(locked){
        let cx = Math.tan(mainCam.rx) * mainCam.z * Math.sin(-mainCam.rz);
        let cy = Math.tan(mainCam.rx) * mainCam.z * Math.cos(-mainCam.rz);
        if(e.button == 0){
            if(Math.sqrt(cx**2 + cy**2) < rdist * chunkSize * 2){
                if(!t){
                    cx += mainCam.x;
                    cy += mainCam.y;
                    for(n of nodes){
                        if(Math.sqrt((n.x - cx)**2 + (n.y - cy)**2 < 16)){
                            cx = n.x;
                            cy = n.y;
                            break;
                        }
                    }
                    startPath(cx, cy);
                }
                else{
                    cx += mainCam.x;
                    cy += mainCam.y;
                    for(n of nodes){
                        if(Math.sqrt((n.x - cx)**2 + (n.y - cy)**2 < 16)){
                            cx = n.x;
                            cy = n.y;
                            break;
                        }
                    }
                    if(cx <= 0 && cx >= -rdist * chunkSize * 2 && cy >= 0 && cy <= rdist * chunkSize * 2){
                        endPath(cx, cy);
                    }
                }
            }
        }
        else{
            t = undefined;
        }
    }
    else{
        ui.requestPointerLock();
    }

}

document.addEventListener('pointerlockchange', lockChangeAlert, false);
document.addEventListener('mozpointerlockchange', lockChangeAlert, false);

function lockChangeAlert() {
    if (document.pointerLockElement === ui ||
        document.mozPointerLockElement === ui) {
        locked = true; 
        document.addEventListener("mousemove", updatePosition, false);
    } 
    else {
        locked = false;
        document.removeEventListener("mousemove", updatePosition, false);
    }
}

let updatePosition = e => mainCam.rotate({x: e.movementX/400, z: e.movementY/400});

var scrollableElement = document.body; //document.getElementById('scrollableElement');

scrollableElement.addEventListener('wheel', checkScrollDirection);

function checkScrollDirection(event) {
  if (checkScrollDirectionIsUp(event) && mainCam.speed < 1) {
    mainCam.speed += 0.1;
  } else if (mainCam.speed > 0.16){
    mainCam.speed -= 0.1;
  }
}

function checkScrollDirectionIsUp(event) {
  if (event.wheelDelta) {
    return event.wheelDelta > 0;
  }
  return event.deltaY < 0;
}