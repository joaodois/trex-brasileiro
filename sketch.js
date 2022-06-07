var JOGAR = 1;
var ENCERRAR = 0;
var estados = JOGAR;

var trex, trex_correndo, trex_colidiu;
var solo, soloinvisivel, imagemdosolo;
var imagemnuvem;

var obstaculo1, obstaculo2, obstaculo3, obstaculo4, obstaculo5, obstaculo6;

var pontuacao;

var grupoobstaculos, gruponuvens;
var fimdejogo, reiniciar, gameover, restart;
var somSalto, somMorte, checkPoint;

function preload(){
  //Carrega as imagens do trex
  trex_correndo =loadAnimation("trex1.png","trex2.png","trex3.png");
  trex_colidiu = loadImage("trex_collided.png");
  
  //Carrega as imagens do solo
  imagemdosolo = loadImage("ground2.png");
  
  //Carrega as imagens das nuvens
  imagemnuvem = loadImage("cloud2.png");
  
  //Carrega as imagens dos obstáculos
  obstaculo1 = loadImage("obstacle1.png");
  obstaculo2 = loadImage("obstacle2.png");
  obstaculo3 = loadImage("obstacle3.png");
  obstaculo4 = loadImage("obstacle4.png");
  obstaculo5 = loadImage("obstacle5.png");
  obstaculo6 = loadImage("obstacle6.png");
  
  //Carrega as imagens do fim de jogo e reiniciar
  gameover = loadImage("gameOver.png");
  restart = loadImage("restart.png");
  
  //Carrega os sons do jogo
  checkPoint = loadSound("checkpoint.mp3");
  somSalto = loadSound("jump.mp3");
  somMorte = loadSound("die.mp3");
  

}

function setup() {

  //cria a tela do jogo
  createCanvas(600,200);
  
  //criar um sprite do trex
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_correndo);
  trex.addAnimation("collided", trex_colidiu);
  trex.scale = 0.5;
  
  //criar um sprite do solo
  solo = createSprite(200,180,400,20);
  solo.addImage("ground",imagemdosolo);
  solo.x = solo.width /2;
  
  //cria sprite solo invisível
  soloinvisivel = createSprite(200,190,400,10);
  soloinvisivel.visible = false;
  
  //cria grupo de obstáculos e nuvens
  grupoobstaculos = new Group();
  gruponuvens = new Group();
  
  //criar pontuação inicial
  pontuacao = 0;
  
  //muda raio de colisão trex
  trex.debug = false;
  trex.setCollider("circle", 0, 0, 40);
  
  //cria sprite fim de jogo
  fimdejogo = createSprite(300,50);
  fimdejogo.addImage(gameover);
  fimdejogo.visible = false;
  fimdejogo.scale = 0.5;
  
  //cria sprite de reiniciar
  reiniciar = createSprite(300,100);
  reiniciar.addImage(restart);
  reiniciar.visible = false;
  reiniciar.scale = 0.5;
   
}

function draw() {
  
  //definir cor de fundo
  background(240);
  
  //mostra a pontuação na tela
   text("Pontuacao: "+ pontuacao, 500,20);
  
  //som para pontuação a cada 100 pontos
    if(pontuacao > 0 && pontuacao%100 == 0){

      checkPoint.play();
    }
  
  
   //impedir o trex de cair 
  trex.collide(soloinvisivel);
  
  //define estado inicial do jogo: jogar
  if(estados == JOGAR){
    
    //faz o solo de mover
    solo.velocityX = -(4+3*pontuacao/100);
    
    //atualiza a pontuação
    pontuacao = pontuacao + Math.round((frameRate()/60));
    
   
    
    // pular quando a tecla espaço é acionada
    if(keyDown("space")&& trex.y > 160) {
      trex.velocityY = -10;
      somSalto.play();
    }
    //gravidade do jogo
    trex.velocityY = trex.velocityY + 0.5;

    //solo infinito
    if (solo.x < 0){
      solo.x = solo.width/2;
    }
  
      //gerador de nuvens e obstáculos 
      GerarNuvens();
      GerarObstaculos();
    
    //Se trex tocar nos obstáculos encerra o jogo
      if(grupoobstaculos.isTouching(trex)){
        somMorte.play();
        estados = ENCERRAR;
       // somSalto.play();
       // trex.velocityY = -12;
      }
    
  }
  
  //define estado final do jogo: encerrar
  else if(estados == ENCERRAR){
    solo.velocityX = 0;
    grupoobstaculos.setVelocityXEach(0);
    gruponuvens.setVelocityXEach(0);
    
    trex.changeAnimation("collided");
    trex.velocityY = 0;
    
    //define o tempo de vida dos objetos do jogo após o fim
    grupoobstaculos.setLifetimeEach(-1);
    gruponuvens.setLifetimeEach(-1);
    
    fimdejogo.visible = true;
    reiniciar.visible = true;
    
    //define o reinício do jogo com botão reiniciar
    if(mousePressedOver(reiniciar)){
    
    reset();
    }
    
  }
  
 
  //desenha as sprites
  drawSprites();
  
}

function GerarNuvens(){
//cria nuvens a cada 60 frames
  if(frameCount % 60 == 0){
  var nuvem = createSprite(600,100,40,10);
  nuvem.velocityX = -3;
  nuvem.addImage(imagemnuvem);
  nuvem.scale = 0.6;
  nuvem.y = Math.round(random(10,100));
    
  nuvem.depth = trex.depth;
  trex.depth = trex.depth+1;
    
  nuvem.lifetime = 200;
    
    gruponuvens.add(nuvem);
  }
  
}

function GerarObstaculos(){
  //cria obstaculos a cada 60 frames
  if(frameCount %60 == 0){
    
    var obstaculo = createSprite(600,165,10,40);
    obstaculo.velocityX = -(6+ pontuacao/100);
    
    var rand = Math.round(random(1,6));
    
    switch(rand){
        case 1: obstaculo.addImage(obstaculo1);
                break;
        case 2: obstaculo.addImage(obstaculo2);
                break;
        case 3: obstaculo.addImage(obstaculo3);
                break;
        case 4: obstaculo.addImage(obstaculo4);
                break;
        case 5: obstaculo.addImage(obstaculo5);
                break;
        case 6: obstaculo.addImage(obstaculo6);
                break;
                default: break;
    }
    
    obstaculo.scale = 0.5;
    obstaculo.lifetime = 300;
    
    grupoobstaculos.add(obstaculo);
  }
  
}
function reset(){
  //define o estado de reiniciar o jogo
  estados = JOGAR;
  reiniciar.visible = false;
  fimdejogo.visible = false;
  grupoobstaculos.destroyEach();
  gruponuvens.destroyEach();
  trex.changeAnimation("running", trex_correndo);
  pontuacao =  0;
}


