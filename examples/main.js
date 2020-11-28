/*
DONE:
Monsters
Functional Shop
Basic Player Model
More than 5 blocks
TODO:
Add more blocks
Add more animations
Add more shop items
Add ladders
IDEAS:
Traps
Weapons
better game designer
*/
var screen = 0;
var player = {x:200,y:200,pastX:200,pastY:200,godMode:false,coins:0,level:0          ,coinMult:1,jackhammer:0,dynamite:0,goldrush:0,timer:-1,oldCoins:0,coinsCollected:0};
var blocks = [];
var light = [];
var mons = [];
var animTimer = 0;
var blockData = [["Stone",color(107, 95, 107)],["Lava",color(255, 89, 0)],["Wall",color(70,70,70)],["Coin",color(107, 95, 107)],["Chest",color(107, 95, 107)],["Hole",color(0,0,0)]];
var mouseIsReleased = false;

var genMap = function(){
    if(blocks!==[]){
        light=[];
        for(var i = 0;i<400;i++){
            if(blocks[i]===blockData[5]){
                light.push([i%20*20-20,floor(i/20)*20-20]);
            }
        }
    }
    blocks=[];
    for(var i = 0;i<400;i++){
        if(round(random(0,1))===1 && i!==0){
            blocks.push(blocks[i-1]);
            if(blocks[i]===blockData[3]){
                blocks[i]=blockData[0];
            }
            if(blocks[i]===blockData[4]){
                blocks[i]=blockData[0];
            }
            if(blocks[i]===blockData[5]){
                blocks[i]=blockData[0];
            }
            if(blocks[i]===blockData[2] && blocks[i-1]===blockData[2] && blocks[i-2]===blockData[2]){
                blocks[i]=blockData[0];
            }
        }else{
            blocks.push(blockData[floor(random(0,blockData.length))]);
            if(blocks[i]===blockData[4] && floor(random(0,10))<9){
                blocks[i]=blockData[0];
            }
            if(blocks[i]===blockData[5] && floor(random(0,20))<18){
                blocks[i]=blockData[0];
            }
        }
        if(player.x===i%20*20 && player.y===floor(i/20)*20){
            blocks[i]=blockData[0];
        }
    }
    mons=[];
    for(var i = 0;i<player.level+1;i++){
        mons.push([floor(random(0,19))*20,floor(random(0,19))*20,0,0,100]);
        if(mons[mons.length-1][0]===player.x && mons[mons.length-1][1]===player.y){
            mons.splice(i,1);
        }
    }
}; 

var drawPlayer = function(){
    fill(0, 208, 255);
    rect(player.x+5,player.y+10,10,10);
    fill(255, 166, 0);
    rect(player.x+5,player.y,10,10);
    stroke(0);
    line(player.x+7,player.y+2,player.x+7,player.y+7);
    line(player.x+12,player.y+2,player.x+12,player.y+7);
    fill(255, 255, 255);
    text("Coins: "+player.coins,2,10);
    text("Level: "+player.level,2,22);
    text("Coin Multiplier: "+player.coinMult+"x",2,34);
    if(player.coins>player.oldCoins){
        player.coinsCollected+=player.coins-player.oldCoins;
    }
    player.oldCoins=player.coins;
    if(player.jackhammer>0){
        text("Jackhammer: "+player.jackhammer,2,46);
    }
    if(player.goldrush>0){
        text("Gold Rush: "+player.goldrush,2,58);
    }
    if(player.timer>0){
        text("Gold Rush: "+player.timer,2,70);
    }
    if(player.dynamite>0){
        text("Dynamite: "+player.dynamite,2,82);
    }
    if(player.coinsCollected>0){
        textSize(15);
        fill(255, 221, 0);
        text("+"+ceil(player.coinsCollected),player.x+5,player.y+10);
        player.coinsCollected-=0.1;
        textSize(12);
    }
    player.pastX=player.x;
    player.pastY=player.y;
    if(player.x>380){
        player.x=0;
    }
    if(player.y>380){
        player.y=0;
    }
    if(player.x<0){
        player.x=380;
    }
    if(player.y<0){
        player.y=380;
    }
    noStroke();
    player.timer--;
    if(player.timer===0){
        player.coinMult=sqrt(player.coinMult);
    }
};
var drawBlocks = function(){
    for(var i = 0;i<400;i++){
        fill(blocks[i][1]);
        rect(i%20*20,floor(i/20)*20,30,26);
        if(blocks[i][0]==="Coin"){
            if(player.timer<=0){
                stroke(194, 168, 0);
                fill(255, 221, 0);
            }else{
                stroke(random(0,255), random(0,255), random(0,255));
                fill(random(0,255), random(0,255), random(0,255));
            }
            ellipse(i%20*20+10,floor(i/20)*20+10,map(animTimer,0,100,-10,10),10);
        }
        if(blocks[i][0]==="Chest"){
            fill(130, 33, 0);
            rect(i%20*20+5,floor(i/20)*20+5,10,10);
            noFill();
            stroke(255, 221, 0);
            rect(i%20*20+8,floor(i/20)*20+8,3,5);
        }
        if(player.x===i%20*20 && player.y===floor(i/20)*20){
            if(!player.godMode){
                if(blocks[i][0]==="Lava"){
                    screen=0;
                    blocks=[];
                    player.x=200;
                    player.y=200;
                    player.pastX=200;
                    player.pastY=200;
                    player.coins+=player.level*10;
                    player.level=0;
                    genMap();
                }
                if(blocks[i][0]==="Wall"){
                    player.x=player.pastX;
                    player.y=player.pastY;
                }
            }
            if(blocks[i][0]==="Coin"){
                blocks[i]=blockData[0];
                player.coins+=player.coinMult;
            }
            if(blocks[i][0]==="Hole"){
                genMap();
                player.level++;
            }
            if(blocks[i][0]==="Chest"){
                blocks[i]=blockData[0];
                if(round(random(0,10))===1){
                    if(round(random(0,1))===0){
                        player.dynamite++;
                    }else{
                        player.jackhammer++;
                    }
                }else{
                    player.coins+=round(random(2,5))*player.coinMult;
                }
            }
        }
        noStroke();
        strokeWeight(1);
    }
};
var drawMonsters = function(){
    for(var i = 0;i<mons.length;i++){
        fill(158, 9, 9);
        rect(mons[i][0],mons[i][1],20,20,20);
        mons[i][2]=mons[i][0];
        mons[i][3]=mons[i][1];
        if(mons[i][0]<0){
            mons[i][0]=390;
        }
        if(mons[i][0]>390){
            mons[i][0]=0;
        }
        if(mons[i][1]<0){
            mons[i][0]=390;
        }
        if(mons[i][1]>390){
            mons[i][0]=0;
        }
        if(frameCount%mons[i][4]===0){
            if(player.x>mons[i][0]){
                mons[i][0]+=20;
            }else if(player.x<mons[i][0]){
                mons[i][0]-=20;
            }
            if(player.y>mons[i][1]){
                mons[i][1]+=20;
            }else if(player.y<mons[i][1]){
                mons[i][1]-=20;
            }
        }
        if(blocks[(floor(mons[i][0]/20))+(floor(mons[i][1]/20)*20)][0]==="Wall"){
            mons[i][0]=mons[i][2];
            mons[i][1]=mons[i][3];
        }
        if(mons[i][0]===player.x && mons[i][1]===player.y && !player.godMode){
            screen=0;
            blocks=[];
            player.x=200;
            player.y=200;
            player.pastX=200;
            player.pastY=200;
            player.coins+=player.level*10;
            player.level=0;
            genMap();
        }
    }
    for(var i = 0;i<mons.length;i++){
        if(blocks[(floor(mons[i][0]/20))+(floor(mons[i][1]/20)*20)][0]==="Lava" || blocks[(floor(mons[i][0]/20))+(floor(mons[i][1]/20)*20)][0]==="Hole"){
            mons.splice(i,1);
        }
    }
};
var drawLights = function(){
    for(var i = 0;i<light.length;i++){
        fill(255, 255, 255,50);
        rect(light[i][0],light[i][1],60,60);
    }
};

genMap();

draw = function() {
    noStroke();
    background(0);
    drawBlocks();
    if(screen===0){
        fill(204, 204, 204);
        textSize(50);
        text("Dungeon Crawler",5,89);
        textSize(25);
        text("play",200-(textWidth("play")/2),193);
        text("store",200-(textWidth("store")/2),231);
        text("help",200-(textWidth("help")/2),269);
        textSize(12);
        if(mouseIsReleased){
            mouseIsReleased=false;
            if(mouseX>200-textWidth("play") && mouseX<246-textWidth("play")){
                if(mouseY>174 && mouseY<199){
                    screen=1;
                }
            }
            if(mouseX>200-textWidth("store") && mouseX<255-textWidth("store")){
                if(mouseY>214 && mouseY<232){
                    screen=2;
                }
            }
            if(mouseX>200-textWidth("help") && mouseX<246-textWidth("help")){
                if(mouseY>250 && mouseY<274){
                    screen=3;
                }
            }
        }
    }
    if(screen===1){
        drawPlayer();
        drawMonsters();
        drawLights();
    }
    if(screen===2){
        textSize(20);
        fill(255, 255, 255);
        text("Coins: "+player.coins,4,23);
        text("Coin multiplier: "+player.coinMult+"\n100 coins\n       x2",4,62);
        stroke(194, 168, 0);
        fill(255, 221, 0);
        strokeWeight(2);
        ellipse(28,101,map(animTimer,0,100,-10,10)*2,20);
        noStroke();
        strokeWeight(1);
        fill(255, 255, 255);
        text("Jackhammer(1 use): "+player.jackhammer+"\n100 coins\n     x2",4,129);
        fill(0, 0, 0);
        rect(16,161,2,15);
        triangle(16,161,18,161,17,187);
        fill(0, 0, 0);
        rect(12,161,10,5);
        fill(255, 255, 255);
        text("Goldrush(1 use): "+player.goldrush+"\n1000 coins\n     ^2",4,196);
        fill(255, 221, 0);
        strokeWeight(2);
        ellipse(21,234,map(animTimer,0,100,-10,10)*2,20);
        noStroke();
        strokeWeight(1);
        if(mouseIsReleased){
            if(mouseX>4 && mouseX<153){
                if(mouseY>46 && mouseY<113 && player.coins-100>=0){
                    player.coinMult++;
                    player.coins-=100;
                }
            }if(mouseX>4 && mouseX<205){
                if(mouseY>114 && mouseY<177 && player.coins-100>=0){
                    player.jackhammer++;
                    player.coins-=100;
                }
            }if(mouseX>4 && mouseX<169){
                if(mouseY>181 && mouseY<244 && player.coins-1000>=0){
                    player.goldrush++;
                    player.coins-=1000;
                }
            }else{
            screen=0;
            mouseIsReleased=false;
            }
        }
    }
    if(screen===3){
        fill(255, 255, 255);
        text("The game mechanics are pretty simple. The human looking guy is you,\nthe player. The orange blocks are lava, if you fall in it, it will bring you back\nto the title screen. It will erase all of your progress downwards but will\nkeep the coin count so you can spend it in the store. Dark grey blocks are\nwalls. Simple enough. Coins and chest looking things will give you coin(s).\nLastly, the black blocks are holes and bring you down to the next level.\nNOTE: Every time you go down a hole they light up the layer below a bit.\nPower Ups: To activate the jackhammer just press space. To activate the\ngold rush press r",7,52);
        if(mouseIsReleased){
            screen=0;
            mouseIsReleased=false;
        }
    }
    animTimer++;
    if(animTimer>=100){
        animTimer=0;
    }
    mouseIsReleased=false;
};

keyReleased = function(){
    if(screen===1){
        if(keyCode===UP || key.code===119){
            player.y-=20;
        }else if(keyCode===DOWN || key.code===115){
            player.y+=20;
        }
        if(keyCode===LEFT || key.code===97){
            player.x-=20;
        }else if(keyCode===RIGHT || key.code===100){
            player.x+=20;
        }
        if(key.code===32){
            if(player.jackhammer>0){
                blocks[(player.x/20)+player.y]=blockData[5];
                player.jackhammer--;
            }
        }
        if(key.code===103){
            player.godMode=!player.godMode;
        }
        if(key.code===114){
            if(player.goldrush>0 && player.timer<=0){
                player.goldrush--;
                player.timer=1000;
                player.coinMult=player.coinMult*player.coinMult;
            }
        }
        if(key.code===98){
            for(var x = 0;x<3;x++){
                for(var y = 0;y<3;y++){
                    blocks[((player.x-20)/20)+x+(player.y-20+(y*20))]=blockData[0];
                }
            }
            for(var i = 0;i<mons.length;i++){
                if(mons[i][0]>=player.x-20 && mons[i][0]<=player.x+20){
                    if(mons[i][1]>=player.y-20 && mons[i][1]<=player.y+20){
                        mons.splice(i,1);
                    }
                }
            }
            player.dynamite--;
        }
    }
};

mouseReleased = function(){
    mouseIsReleased=true;
};
