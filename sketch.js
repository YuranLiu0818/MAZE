let balls=[];
let c=[];
let b=[];
let bB=[];
let p=[
  [0, 250, 265, 25, 40], // 0
  [4, 175, 190, 100, 115], // 1
  [1, 250, 265, 100, 115], // 2
  [2, 325, 340, 175, 190], // 3
  [3, 400, 415, 175, 190], // 4
  [1, 475, 490, 175, 190], // 5
  [2, 25, 40, 250, 265], //6
  [0, 175, 190, 250, 265], //7
  [0, 250, 265, 250, 265], //8
  [3, 325, 340, 250, 265], //9
  [2, 25, 40, 325, 340], //10
  [2, 250, 265, 325, 340], //11
  [0, 25, 40, 400, 415],//12
  [3, 250, 265, 400, 415], //13
  [0, 475, 490, 400, 415],//14
  [2, 100, 115, 100, 115], //15
  [2, 325, 340, 100, 115], //16
  [4, 400, 415, 100, 115], //17
  [4, 400, 415, 250, 265],  //18
  [1, 175, 190, 325, 340],//19
  [1, 400, 415, 325, 340], //20
  [2,25,40,25,40],
  [4,475,490,25,40],
  [3,25,40,475,490],
  [1,475,490,475,490]
];
let dead1,dead2;
let escape1,escape2,escape3;
let e=[[0],[0],[0]];
let d=[[0],[0]];
let time;
let bg,img,b0,b1,b2,lg,rg,ug,dg;
let smin=2; let smax=7; let lmin=100; let lmax=500;

function preload(){
  bg=loadImage("bg.jpg")
  img=loadImage("building.png");
  b0=loadImage("b0.png");
  b1=loadImage("b1.png");
  b2=loadImage("b2.png");
  lg=loadImage("left-green.png");
  rg=loadImage("right-green.png");
  ug=loadImage("up-green.png");
  dg=loadImage("down-green.png");
}
function setup() {
  createCanvas(1600,800);// put setup code here
  frameRate(15);
  dead1=0; dead2=0;
  escape1=0; escape2=0; escape3=0;

  time=10;
  for(let i=0;i<10;i++){
    balls.push(new Ball());
  }
  for(let i=0;i<25;i++){
    c.push(new Cross(p[i][0], p[i][1], p[i][2], p[i][3], p[i][4]));
    if(i<15){
      b.push(new Clickable());
      b[i].locate(p[i][1]-5,p[i][3]-5);
      b[i].resize(25,25);
      b[i].onPress=function(){
        if(p[i][0]===0){
          if(!(c[i].l1||c[i].l2)) c[i].l2=true;
          else if((!c[i].l1)&&c[i].l2) c[i].l1=true;
          else if(c[i].l1&&c[i].l2) c[i].l2=false;
          else if(c[i].l1&&(!c[i].l2)) c[i].l1=false;
        }else{
          if (c[i].l1)  c[i].l1=false;
          else c[i].l1=true;
        }
      }
    }
  }
  for(let m=0;m<3;m++){
    bB.push(new Clickable(83+150*m,550,1));
    bB[m].onPress=function(){
      for(let n=0;n<5;n++){
        let i=m+n*3;
        b[i].onPress();
      }
    }
  }
}

function draw() {
  //background("#f9d5bb");// put drawing code her
  image(bg,0,0);
  image(img,0,0,515,515);
  //build();
  for(let button of b){
    button.draw();
  }
  for(let x=0;x<15;x++){
    c[x].light();
  }
  for (let i=0; i<balls.length; i++) {
    for (let j=0; j<c.length; j++) {
      if ((balls[i].x<c[j].xmax)&&(balls[i].x>c[j].xmin)&&(balls[i].y<c[j].ymax)&&(balls[i].y>c[j].ymin)) {
        turn(balls[i], c[j]);
      }
    }
    balls[i].display();
    balls[i].move();
    if (balls[i].esc==0) {
      if (balls[i].die) {
        textSize(random(25,35));
        text(String.fromCodePoint(128165),balls[i].x,balls[i].y);
        balls.splice(i,1);
      }
    }else if(balls[i].esc==1){
      escape1++;
      text(String.fromCodePoint(127881),balls[i].x,balls[i].y);
      balls.splice(i,1);
    }else if(balls[i].esc==2){
      escape2++;
      text(String.fromCodePoint(127881),balls[i].x,balls[i].y);
      balls.splice(i,1);
    }else if(balls[i].esc==3){
      escape3++;
      textSize(random(25,35));
      text(String.fromCodePoint(127881),balls[i].x,balls[i].y);
      balls.splice(i,1);
    }

  }
  if(balls.length<=500){
     balls.push(new Ball());
  }
  if(time<0){
    e[0].push(escape1); e[1].push(escape2); e[2].push(escape3);
    d[0].push(dead1); d[1].push(dead2);
    time=10;
  }
  dead1=constrain(dead1,0,875); dead2=constrain(dead2,0,875);
  escape1=constrain(escape1,0,875); escape2=constrain(escape2,0,875); escape3=constrain(escape3,0,875);
  chart();
  panel();
  for(let button of bB){
    button.draw();
  }
  time--;
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
class Ball {
  constructor() {
    this.dir=int(random(4));
    //this.c=platte[int(random(0,4))];
    this.seed=random(1);
    if(this.seed<0.2) this.birth=1;
    else if(this.seed<0.4) this.birth=4;
    else if(this.seed<0.6) this.birth=7;
    else if(this.seed<0.8) this.birth=8;
    else this.birth=13;
    this.x=floor(random(p[this.birth][1]+3, p[this.birth][2]-3));
    this.y=floor(random(p[this.birth][3]+3, p[this.birth][4]-3));
    this.radius=random(5,7);
    this.speed=int(random(smin,smax));
    this.esc=0;
    this.die=false;
    this.life=int(random(lmin,lmax));
    this.emojiCode=floor(random(128512,128586));
    this.emoji=String.fromCodePoint(this.emojiCode);

    // if (get(this.x, this.y)==get(60, 60)) {
    //   this.x=int(random(30, 485));
    //   this.y=int(random(30, 485));
    // }
  }
  move() {
    if (this.dir==0) this.y-=this.speed;//up
    else if (this.dir==1) this.x+=this.speed;//right
    else if (this.dir==2) this.x-=this.speed;//left
    else if (this.dir==3) this.y+=this.speed;//down
    if(this.y<2) this.esc=1;
    if(this.x<2) this.esc=2;
    if(this.x>513) this.esc=3;
    this.life--;
    //this.x=constrain(this.x, 0, 515);
    //this.y=constrain(this.y, 0, 515);
  }
  display() {
    if (this.esc==0) {
      if (this.life==0){
        this.die=true;
        dead1++;
      }else if(this.x<120&&this.x>95&&this.y>195&&this.y<245) {
        this.die=true;
        dead2++;
      }else{
        textSize(this.radius*2);
        textAlign(CENTER, CENTER);
        text(this.emoji,this.x,this.y);
      }
    }
  }
}
class Cross {
  constructor(t,xs,xl,ys,yl) {
    this.type=t;
    this.xmin=xs;
    this.xmax=xl;
    this.ymin=ys;
    this.ymax=yl;
    this.l1=false;
    this.l2=false;
    this.c1=green;
    this.c2=red;
  }
  light(){
    noStroke();
    if(this.type==0){
      if(this.l1&&this.l2){
        image(ug,this.xmax-10,this.ymin-40,15,40);
        image(lg,this.xmax,this.ymin-5,40,15);
        image(ug,this.xmin-5,this.ymin-40,15,40);
        image(rg,this.xmin-40,this.ymin-5,40,15);
      }else if(this.l1&&(!this.l2)){
        image(dg,this.xmax-10,this.ymin-40,15,40);
        image(rg,this.xmax,this.ymin-5,40,15);
        image(ug,this.xmax-10,this.ymax,15,40);
        image(rg,this.xmax,this.ymax-10,40,15);
      }else if((!this.l1)&&this.l2){
        image(dg,this.xmax-10,this.ymax,15,40);
        image(lg,this.xmax,this.ymax-10,40,15);
        image(rg,this.xmin-40,this.ymax-10,40,15);
        image(dg,this.xmin-5,this.ymax,15,40);
      }else{
        image(dg,this.xmin-5,this.ymin-40,15,40);
        image(lg,this.xmin-40,this.ymin-5,40,15);
        image(lg,this.xmin-40,this.ymax-10,40,15);
        image(ug,this.xmin-5,this.ymax,15,40);
      }
      // if(this.l1){
      //   this.c1=green;
      //   this.c2=red;
      //   fill(this.c1);
      //   rect(this.xmax,this.ymin-20,5,20);
      //   rect(this.xmax,this.ymin-5,20,5);
      //   fill(this.c2);
      //   rect(this.xmin-5,this.ymax,5,20);
      //   rect(this.xmin-20,this.ymax,20,5);
      //   if(!this.l2){
      //     this.c1=red;
      //     this.c2=green;
      //   }
      //   fill(this.c1)
      //   rect(this.xmin-5,this.ymin-20,5,20);
      //   rect(this.xmin-20,this.ymin-5,20,5);
      //   fill(this.c2)
      //   rect(this.xmax,this.ymax,5,20);
      //   rect(this.xmax,this.ymax,20,5);
      // }else{
      //   this.c1=red;
      //   this.c2=green;
      //   fill(this.c1);
      //   rect(this.xmax,this.ymin-20,5,20);
      //   rect(this.xmax,this.ymin-5,20,5);
      //   fill(this.c2);
      //   rect(this.xmin-5,this.ymax,5,20);
      //   rect(this.xmin-20,this.ymax,20,5);
      //   if(!this.l2){
      //     this.c1=green;
      //     this.c2=red;
      //   }
      //   fill(this.c1)
      //   rect(this.xmin-5,this.ymin-20,5,20);
      //   rect(this.xmin-20,this.ymin-5,20,5);
      //   fill(this.c2)
      //   rect(this.xmax,this.ymax,5,20);
      //   rect(this.xmax,this.ymax,20,5);
      // }
    }else{
      push();
      translate((this.xmin+this.xmax)/2,(this.ymin+this.ymax)/2);
      if(this.type==2){
        rotate(PI);
      }else if(this.type==3){
        rotate(PI/2);
      }else if(this.type==4){
        rotate(3*PI/2);
      }
      if(this.l1){
        image(rg,-48,-3,40,15);
        image(dg,-13,8,15,40);
        image(ug,0,8,15,40);
      }else{
        image(rg,-48,-13,40,15);
        image(ug,-13,-48,15,40);
        image(dg,0,-48,15,40);
      }
      // if(this.l1){
      //   this.c1=green;
      //   this.c2=red;
      // }else{
      //   this.c1=red;
      //   this.c2=green;
      // }
      // fill(this.c1);
      // rect(-28,8,20,5);
      // rect(-13,8,5,20);
      // rect(8,8,5,20);
      // fill(this.c2);
      // rect(-28,-13,20,5);
      // rect(-13,-28,5,20);
      // rect(8,-28,5,20);
      pop();
    }
  }
}
function turn(b, c) {
  //println("hhhhhhhh");
  if (c.type==0) {//+
    if (!(c.l1||c.l2)) {
      if (b.dir==0||b.dir==3) b.dir=2;
    } else if ((!c.l1)&&c.l2) {
      if (b.dir==1||b.dir==2) b.dir=3;
    } else if (c.l1&&(!c.l2)) {
      if (b.dir==0||b.dir==3) b.dir=1;
    } else if (c.l1&&c.l2) {
      if (b.dir==1||b.dir==2) b.dir=0;
    }
  }else if ((c.type==1)&&(!c.l1)||(c.type==3)&&c.l1) {//1:-|;2:|-;3:_|_;4:-|-
    if (b.dir==1) b.dir=0;
    else if (b.dir==3) b.dir=2;
  }else if ((c.type==1)&&c.l1||(c.type==4)&&(!c.l1)) {
    if (b.dir==0) b.dir=2;
    else if (b.dir==1) b.dir=3;
  }else if ((c.type==2)&&(!c.l1)||(c.type==4)&&c.l1) {
    if (b.dir==0) b.dir=1;
    else if (b.dir==2) b.dir=3;
  }else if ((c.type==2)&&c.l1||(c.type==3)&&(!c.l1)) {
    if (b.dir==3) b.dir=1;
    else if (b.dir==2) b.dir=0;
  }
}

function chart(){
  // fill(255,100,100,150);
  // strokeWeight(3);
  // stroke(60,61,71,100);
  // rect(550,0,950,515);
  // for(let m=95;m<950;m+=95){
  //   line(m+550,0,m+550,515);
  // }
  // for(let n=51.5;n<515;n+=51.5){
  //   line(550,n,1500,n);
  // }
  for(let i=0;i<3;i++){
    noFill();
    beginShape();
    for(let j=0;j<e[i].length;j++){
      // for(let k=0;k<5;k++){
      //   stroke(220-55*i,55*i+10,55*i+50,3+k*k*k/8);
      //   strokeWeight(12-k*k*k/8);
      //   point(550+j,360-0.4*e[i][j]);
      // }
      stroke(220-55*i,55*i+10,55*i+50);
      strokeWeight(2);
      vertex(550+j*10,360-0.4*e[i][j]);

      if(j==e[i].length-1){
        textSize(15);
        textAlign(RIGHT);
        text("Escape"+i,550+j*10,360-0.4*e[i][j]);
      }
    }
    endShape();
    if(e[i].length>95){
      e[i].splice(0,1);
    }
  }
  for(let i=0;i<2;i++){
    beginShape();
    for(let j=0;j<d[i].length;j++){
      // for(let k=0;k<5;k++){
      //   stroke(220-100*i,100*i+100,100*i+100,3+k*k*k/8);
      //   strokeWeight(12-k*k*k/8);
      //   vertex(550+j*10,380+0.4*d[i][j]);
      // }
      stroke(220-100*i,100*i+100,100*i+100);
      strokeWeight(2);
      vertex(550+j*10,380+0.4*d[i][j]);
      if(j==e[i].length-1){
        textSize(15);
        textAlign(RIGHT);
        if(i==0) text("Old to die",550+j*10,380+0.4*d[i][j]);
        else text("Hit to die",550+j*10,380+0.4*d[i][j]);
      }
    }
    endShape();
    if(d[i].length>95){
      d[i].splice(0,1);
    }
  }
}
function panel(){
  push();
  translate(20,535);
  stroke(0);
  strokeWeight(3);
  fill(100,100);
  rect(0,0,475,200);

  textAlign(LEFT);
  text("Traffic Light",10,15);
  text("Speed Range",10,90);
  text("MIN :",10,110);
  text("MAX :",237,110);
  text("Life Span",10,140);
  text("MIN :",10,160);
  text("MAX :",237,160);
  smin=slider(55,110,0.5,5,smin);
  smax=slider(287,110,5,12,smax);
  lmin=slider(55,160,10,100,lmin);
  lmax=slider(287,160,101,650,lmax);
  pop();
}
function slider(x,y,min,max,value){
  strokeWeight(20);
  stroke(100,100,200,150);
  fill(230,98,94);
  line(x,y,x+150,y);
  this.sx=map(value,min,max,x,x+150);
  this.mx=this.sx;
  if((mouseX-20)>x&&(mouseX-20)<(x+150)&&(mouseY-535)>(y-10)&&(mouseY-535)<(y+10)){
    if(mouseIsPressed){
      this.mx=mouseX-20;
      this.mx=constrain(this.mx,x,x+150);
    }
  }
  value=map(this.mx,x,x+150,min,max);
  this.sx=this.mx;
  noStroke();
  text(value,x,y);
  ellipse(this.sx,y,20,20);
  return value;
}

function build() {
  let margin = 20 ;
  let pathWidth = 25 ;
  let blockWidth = 50;
  noStroke();
  fill("#543864");
  rect(0,0,19*pathWidth+2*margin,19*pathWidth+2*margin);
  fill("#f9d5bb");
  // o
  rect(margin,margin,pathWidth,6*blockWidth+6*pathWidth);
  rect(margin+pathWidth,margin,6*blockWidth+6*pathWidth,pathWidth);
  rect(margin,margin+6*blockWidth+6*pathWidth,6*blockWidth+6*pathWidth,pathWidth);
  rect(margin+6*blockWidth+6*pathWidth,margin+pathWidth,pathWidth,6*blockWidth+6*pathWidth);
  // |
  rect(margin+pathWidth+blockWidth,margin+pathWidth+blockWidth,pathWidth,2*blockWidth);
  rect(margin+2*pathWidth+2*blockWidth,margin+pathWidth+blockWidth,pathWidth,3*pathWidth+3*blockWidth);
  rect(margin+3*pathWidth+3*blockWidth,0,pathWidth,5*pathWidth+5*blockWidth+margin);
  rect(margin+4*pathWidth+4*blockWidth,margin+pathWidth+blockWidth,pathWidth,3*pathWidth+2*blockWidth);
  rect(margin+5*pathWidth+5*blockWidth,margin+pathWidth+blockWidth,pathWidth,pathWidth+blockWidth);
  rect(margin+5*pathWidth+5*blockWidth,margin+4*pathWidth+3*blockWidth,pathWidth,blockWidth);
  // —��1�7�1�7
  rect(margin+pathWidth+blockWidth,margin+pathWidth+blockWidth,2*pathWidth+2*blockWidth,pathWidth);
  rect(margin+4*pathWidth+4*blockWidth,margin+pathWidth+blockWidth,2*pathWidth+blockWidth,pathWidth);
  rect(margin+5*pathWidth+4*blockWidth,margin+2*pathWidth+2*blockWidth,pathWidth+2*blockWidth,pathWidth);
  rect(margin+pathWidth,margin+3*pathWidth+3*blockWidth,5*pathWidth+5*blockWidth,pathWidth);
  rect(margin+pathWidth,margin+4*pathWidth+4*blockWidth,2*pathWidth+2*blockWidth,pathWidth);
  rect(margin+4*pathWidth+3*blockWidth,margin+4*pathWidth+4*blockWidth,2*pathWidth+2*blockWidth,pathWidth);
  rect(0,margin+5*pathWidth+5*blockWidth,7*pathWidth+6*blockWidth+margin*2,pathWidth);

  fill("#2a1a5e");
  // |
  rect(margin+pathWidth,margin+pathWidth+blockWidth,blockWidth,2*pathWidth+blockWidth);
  rect(margin+2*pathWidth+blockWidth,margin+2*pathWidth+blockWidth,blockWidth,pathWidth+blockWidth);
  rect(margin+3*pathWidth+2*blockWidth,margin+2*pathWidth+blockWidth,blockWidth,pathWidth+2*blockWidth);
  rect(margin+4*pathWidth+3*blockWidth,margin+pathWidth+blockWidth,blockWidth,2*pathWidth+2*blockWidth);
  rect(margin+5*pathWidth+4*blockWidth,margin+2*pathWidth+blockWidth,blockWidth,blockWidth);
  rect(margin+6*pathWidth+5*blockWidth,margin+pathWidth+blockWidth,blockWidth,pathWidth+blockWidth);
  rect(margin+3*pathWidth+2*blockWidth,margin+4*pathWidth+3*blockWidth,blockWidth,pathWidth+2*blockWidth);
  rect(margin+6*pathWidth+5*blockWidth,margin+3*pathWidth+3*blockWidth,blockWidth,2*pathWidth+2*blockWidth);
  //—��1�7�1�7
  rect(margin+pathWidth,margin+pathWidth,2*pathWidth+3*blockWidth,blockWidth);
  rect(margin+4*pathWidth+3*blockWidth,margin+pathWidth,2*pathWidth+3*blockWidth,blockWidth);
  rect(margin+4*pathWidth+3*blockWidth,margin+pathWidth,2*pathWidth+3*blockWidth,blockWidth);
  rect(margin+pathWidth,margin+3*pathWidth+2*blockWidth,pathWidth+2*blockWidth,blockWidth);
  rect(margin+5*pathWidth+4*blockWidth,margin+3*pathWidth+2*blockWidth,pathWidth+2*blockWidth,blockWidth);
  rect(margin+pathWidth,margin+4*pathWidth+3*blockWidth,pathWidth+2*blockWidth,blockWidth);
  rect(margin+4*pathWidth+3*blockWidth,margin+4*pathWidth+3*blockWidth,pathWidth+2*blockWidth,blockWidth);
  rect(margin+pathWidth,margin+5*pathWidth+4*blockWidth,2*pathWidth+2*blockWidth,blockWidth);
  rect(margin+4*pathWidth+3*blockWidth,margin+5*pathWidth+4*blockWidth,2*pathWidth+2*blockWidth,blockWidth);
  rect(margin+pathWidth,margin+6*pathWidth+5*blockWidth,5*pathWidth+6*blockWidth,blockWidth);
}
