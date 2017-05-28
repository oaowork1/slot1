var Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    TextureCache = PIXI.utils.TextureCache,
    Texture = PIXI.Texture,
    Sprite = PIXI.Sprite,
    Text = PIXI.Text,
    Graphics = PIXI.Graphics;

var stage = new Container(), renderer = autoDetectRenderer(1140, 768);

renderer.backgroundColor = 0xFFFFFF;
document.body.appendChild(renderer.view);

loader
  .add("assets/slotParams.json")
  .load(setup);

//Definition
var id;
var bg, slotOverlay, blobs;
var items;
var itemsNum, itemsParam;
var btn;
var state;

var txtBtn;

var sx=50;
var sy=-138+10;
var ww=204;
var hh=178;

var listOfItems = [];
listOfItems.push("01.png");
listOfItems.push("02.png");
listOfItems.push("03.png");
listOfItems.push("04.png");
listOfItems.push("05.png");
listOfItems.push("06.png");
listOfItems.push("07.png");
listOfItems.push("08.png");
listOfItems.push("09.png");
listOfItems.push("10.png");
listOfItems.push("11.png");
listOfItems.push("12.png");
listOfItems.push("13.png");

var REELS = {
  NO : {value: 0, name: "no"}, 
  CLICK: {value: 1, name: "click"}, 
  STARTCYCLE: {value: 2, name: "startCycle"}, 
  LOOP : {value: 3, name: "loop"},
  STOPCYCLE: {value: 4, name: "stopCycle"}, 
  STOP: {value: 5, name: "stop"}
};

var reel = REELS.NO; 
var thing = new Graphics();

var loadGraph=false;
var loadSounds=false;

state = stateNO;

var audioPath = "assets/";
   
function handleLoadCompleteSound(event)
{
	loadSounds=true;
}

createjs.Sound.alternateExtensions = ["mp3"];
createjs.Sound.on("fileload", handleLoadCompleteSound);
createjs.Sound.registerSound({src:"Landing_1.mp3", id:"soundStopReel"}, audioPath);
createjs.Sound.registerSound({src:"Reel_Spin.mp3", id:"soundReel"}, audioPath);



gameLoop();


function gameLoop()
{
	requestAnimationFrame(gameLoop);
	if (loadGraph && loadSounds)
	{
		state();
	}
	renderer.render(stage);
  
}

function setup() 
{
  gameScene = new Container();
  stage.addChildAt(gameScene, 0);    
  id = resources["assets/slotParams.json"].textures;

  //bg
  bg = new Sprite(id["winningFrameBackground.png"]);
  bg.width=1060;
  bg.height=570;
  bg.position.set(28, 34);
  gameScene.addChildAt(bg, 0);

  items = [];
  itemsNum = [];
  itemsParam=386;
  
  //Make positions
  for (var i = 0; i < 5; i++) 
  {
	  itemsNum.push(0);
	  var row = [];
	  for (var j = 0; j < 4; j++)
	  {
		  var t=Math.round(Math.random()*listOfItems.length)-1;
		  if (t<0)
		  {
			  t=Math.round(0);
		  }
		  if (t>=listOfItems.length)
		  {
			  t=Math.round(listOfItems.length-1);
		  }
		  row.push(new Sprite(id[listOfItems[t]]));
		  row[row.length-1].x=sx+i*ww;
		  row[row.length-1].y=sy+j*hh;
		  row[row.length-1].vy=0;
		  row[row.length-1].ay=15*i;
		 
	  } 
	  items.push(row);
	  for (var j = 0; j < 4; j++)
	  {
		   gameScene.addChildAt(items[items.length-1][j],1);
	  }		
  }
   
  //slotOverlay
  slotOverlay = new Sprite(id["slotOverlay.png"]); 
  slotOverlay.position.set(2, 2);  
  gameScene.addChildAt(slotOverlay,21);
  
  btn = new Sprite(id["btn_spin_normal.png"]);
  gameScene.addChildAt(btn,22);
  btn.x=900;
  btn.y=610;
  btn.width=150;
  btn.height=150;
  btn.pic=0;
  
  txtBtn = new PIXI.Text(
	  "SPIN!", 
	  {font: "42px sans-serif", fill: "#442200"}
	);

	txtBtn.x = 922;
	txtBtn.y = 660;
	gameScene.addChildAt(txtBtn, 23);
   
   //thing.lineStyle(4, 0xFF3300, 1);
	thing.beginFill(0x66CCFF);
	thing.drawRect(32, 34, 1050, 568);
	thing.endFill();
	thing.x = 0;
	thing.y = 0;
	stage.addChild(thing);
	for (i=0; i<items.length; i++)
	{
		for (j=0; j<items[i].length; j++)
		{
			items[i][j].mask = thing;
		}
	}
	
	loadGraph=true;
}

var mouseEventClick = function(e)
{
	if (reel == REELS.NO)
	{
		var xx=event.clientX;
		var yy=event.clientY;
		if (collisionCircle(xx, yy, btn))
		{
			reel = REELS.CLICK;
			btn = new changeUiItem(22, btn, "btn_spin_disable.png");
			btn.pic=0;
			
			txtBtn = new changeTextItem(txtBtn, 23, "SPIN", "42px sans-serif", "#220000");
			createjs.Sound.play("soundReel");
		}
	}
}
var mouseEventMove = function(e)
{
	if (reel!=REELS.NO)
	{
		return;
	}
	var xx=event.clientX;
	var yy=event.clientY;
    if (collisionCircle(xx, yy, btn))
	{
		if (btn.pic==0)
		{			
			btn = new changeUiItem(22, btn, "btn_spin_hover.png");
			btn.pic=1;
			
			txtBtn = new changeTextItem(txtBtn, 23, "SPIN!", "42px sans-serif", "#662200");
		}	
	} else
	{
		if (btn.pic==1)
		{			
			btn = new changeUiItem(22, btn, "btn_spin_normal.png");
			btn.pic=0;
			
			txtBtn = new changeTextItem(txtBtn, 23, "SPIN!", "42px sans-serif", "#442200");
		}
	}
}
var mouseEventDown = function(e)
{
	if (reel!=REELS.NO)
	{
		return;
	}
	var xx=event.clientX;
	var yy=event.clientY;
	if (collisionCircle(xx, yy, btn))
	{
		var pic=btn.pic;
		btn = new changeUiItem(22, btn, "btn_spin_pressed.png");
		btn.pic=pic;
	}
}

stage.interactive = true;
stage.buttonMode = true;
stage.on("click", mouseEventClick);
stage.on("mousemove", mouseEventMove);
stage.on("mousedown", mouseEventDown);

function changeTextItem(obj, num, txt, fontIt, colourIt)
{	
	var x=obj.x;
	var y=obj.y;
	gameScene.removeChild(obj);
	obj = new PIXI.Text(
			  txt, 
			  {font: fontIt, fill: colourIt}
			);
	obj.x=x;
	obj.y=y;
	gameScene.addChildAt(obj, num);
	
	return obj;
}
function changeUiItem(num, obj, str)
{	
	var x=obj.x;
	var y=obj.y;
	var w=obj.width;
	var h=obj.height;
	gameScene.removeChild(obj);
	obj = new Sprite(id[str]);
	obj.x=x;
	obj.y=y;
	obj.width=w;
	obj.height=h;
	gameScene.addChildAt(obj,num);
	return obj;
}	
function changeItem(obj, str)
{
	var x=obj.x;
	var y=obj.y;
	var vy=obj.vy;
	var ay=obj.ay;
	var last=obj.last;
	gameScene.removeChild(obj);
	obj = new Sprite(id[str]);
	obj.x=x;
	obj.y=y;
	obj.vy=vy;
	obj.ay=ay;
	obj.last=last;
	gameScene.addChildAt(obj,1);
	obj.mask = thing;
	return obj;
}

function collisionCircle(xx, yy, obj)
{
	var dist = Math.sqrt( (xx-(obj.x+obj.width/2))*(xx-(obj.x+obj.width/2)) + (yy-(obj.y+obj.height/2))*(yy-(obj.y+obj.height/2)) );
	if (dist<=obj.width/2)
	{
		return true;
	} else
	{
		return false;
	}
}

function stateNO()
{
	if (reel == REELS.CLICK)
	{
		for (var i=0; i<items.length; i++)
		{
			for (var j=0; j<items[i].length; j++)
			{
				items[i][j].last=items[i][j].ay;
			}
		}
		reel = REELS.STARTCYCLE;
		state = stateStartCycle;		
	}
}
var timme=0;
function stateStartCycle()
{	
	itemsMotionGrow();
	if (items[items.length-1][0].vy>=20)
	{
		timme=0;
		state = stateLoop;
		reel = REELS.LOOP;
	}
}

function stateLoop()
{	
	itemsMotionGrow();
	if (timme<300)
	{
		timme++;
	} else
	{		
		for (i=0; i<items.length; i++)
		{
			for (j=0; j<items[i].length; j++)
			{
				items[i][j].last=items[i][j].ay;
			}
			itemsNum[i]=0;
		}
		stopper=0;
		state = stateStopCycle;
		reel = REELS.STOPCYCLE;
	}
}
var stopper;
function stateStopCycle() //останавливает вращение
{
	oneSpin();
	
	for (i=0; i<items.length; i++)
	{
		/*if (i>0 && itemsNum[i-1]==0) //выход из цикла, если не пришла пора текущего барабана
		{			
			break;
		}*/
		if (items[i][0].last>0)
		{
			items[i][0].last--;
			continue;
		}
		if (itemsNum[i]==0) //ищем, в нужных ли координатах текущий барабан
		{
			itemsNum[i]=analyzeStop(items[i][0].y);
		} 
		if (itemsNum[i]==1)
		{
			itemsMotionDecrease(i);
		}
		if (items[i][0].vy<0.1 && itemsNum[i]==1) //запускается откат барабана
		{
			if ((i>0 && itemsNum[i-1]>=2) || (i==0))
			{
				itemsNum[i]=2;
				for (j=0; j<items[i].length; j++)
				{
					items[i][j].vy=-1;
				}
			}
		}
		if (items[i][0].y==sy && itemsNum[i]==2)
		{	  
			itemsNum[i]=3;
			for (j=0; j<items[i].length; j++)
			{
				items[i][j].vy=0;
				createjs.Sound.play("soundStopReel");  
			}
			stopper++;
		}
				
		if (i==items.length-1 && stopper==items.length)
		{
			state = stateNO;
			reel = REELS.NO;
			btn = new changeUiItem(22, btn, "btn_spin_normal.png");
			txtBtn = new changeTextItem(txtBtn, 23, "SPIN!", "42px sans-serif", "#442200");
			btn.pic=0;
		}
	}
}

function oneSpin()
{
	for (i=0; i<items.length; i++)
	{
		for (j=0; j<items[i].length; j++)
		{
			moving(i, j);
			relocate(i, j);
			movingPart(i, j, 2);
			relocate(i, j);
		}
	}
}

function analyzeStop(obj)
{
	if ((obj>=(-120-15)) && (obj<=(-120+15)))
	{
		return 1;
	}
	return 0;
}

function itemsMotionGrow()
{
	for (i=0; i<items.length; i++)
	{
		for (j=0; j<items[i].length; j++)
		{
			if (items[i][j].last==0)
			{
				if (items[i][j].vy<20)
				{
					items[i][j].vy+=5;
				}
				moving(i, j);
				relocate(i, j);
				movingPart(i, j, 2);
				relocate(i, j);
			} else
			{
				items[i][j].last--;
			}
		}
	}
}
function itemsMotionDecrease(i)
{
	for (j=0; j<items[i].length; j++)
	{
		if (items[i][j].vy>0)
		{
			items[i][j].vy-=5;
		}
		if (items[i][j].vy<0)			
		{
			vy=0.0000001;
		}
	}
}

function moving(i, j)
{
	items[i][j].y+=Math.floor(items[i][j].vy);
}
function movingPart(i, j, n)
{
	items[i][j].y+=Math.floor(items[i][j].vy/n);
}
function relocate(i, j)
{
	if (items[i][j].y>=sy+4*hh)
	{
		items[i][j].y=(items[i][j].y-(sy+4*hh))+sy;
		
		var t=Math.round(Math.random()*listOfItems.length)-1;
		if (t<0)
		  {
			  t=Math.round(0);
		  }
		  if (t>=listOfItems.length)
		  {
			  t=Math.round(listOfItems.length-1);
		  }
		items[i][j] = new changeItem(items[i][j], listOfItems[t]);
	}
	if (items[i][j].y<sy)
	{
		items[i][j].y=sy+4*hh-1;
	}
}