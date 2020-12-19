var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var jump,die,checkPoint;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score,gameOver,restart,gameOver1,restart1;

var gamestate = "play";


function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  gameOver1 = loadImage("gameOver.png");
  restart1 = loadImage("restart.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  die = loadSound("die.mp3");
  jump = loadSound("jump.mp3");
  checkPoint = loadSound("checkPoint.mp3");
}

function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(50,180,20,50);
  trex.setCollider("circle",0,0,30);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("lose", trex_collided);
  trex.scale = 0.5;
  
  gameOver = createSprite(300,80);
  restart = createSprite(300,120);
  gameOver.addImage("gameOver",gameOver1);
  gameOver.scale = 0.5;
  restart.addImage("restart",restart1);
  restart.scale = 0.5;
  gameOver.visible = false;
  restart.visible = false;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  invisibleGround = createSprite(200,190,999999999999,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  background(180);
  camera.position.x = trex.position.x + 250;
  if (gamestate == "play"){
    trex.velocityX = 8;
    score = score + Math.round(getFrameRate()/60);
    if(keyDown("space") && trex.y > 161 ) {
      trex.velocityY = -10;
      jump.play();
    }

    trex.velocityY = trex.velocityY + 0.8
    
    if (score%100 == 0 && score > 0){
        checkPoint.play();
    }
    
    touch();
    spawnClouds();
    spawnObstacles();
    } else if (gamestate == "end"){
        if(mousePressedOver(restart)) {
          reset();
        }   
    }
  
  
    if (ground.x < trex.position.x-50){
      ground.x = trex.position.x + ground.width/2;
  }
  
  text("Score: "+ score, trex.position.x + 450,50);
  
  trex.collide(invisibleGround);
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(trex.position.x + 550,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    
    //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(trex.position.x + 550,170,10,40);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function touch(){
  if (gamestate == "play" && trex.isTouching(obstaclesGroup)){
    die.play();
    trex.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    trex.changeAnimation("lose",trex_collided);
    gameOver.visible = true;
    restart.visible = true;
    gameOver.position.x = trex.position.x + 250;
    restart.position.x = trex.position.x + 250;
    
    gamestate = "end";
  }
}

function reset(){
  
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running", trex_running);
  trex.velocityX = -8;
  trex.position.x = 50;

  score = 0;
  
  gamestate = "play";
}