/*
 * File: GhostClicker.js
 * --------------------------
 * The JavaScript code to run the Ghost Clicker browser game
 */
 
"use strict";

const GHOST_ARR	= ["Spook Ghost", "Spirit Orbs", "Zombie Hand", "Skullothy", "Grimm", "Imp", "Twinky", "Will o' Wisp"];
const INFO_ARR	= ["This little guy is the most run-of-the-mill, totally normal, utterly unremarkable ghost that could ever grace your cemetery. He likes long walks on the beach and haunting under the moonlight.", "Spirit Orbs", "Zombie Hand", "Skullothy", "Grimm", "Imp", "Twinky", "Will o' Wisp"];


let SPIN_COST = 50;
setCookie("spinCost", SPIN_COST);

const SQUARE_SIZE = 8; 
const SPRITE_WIDTH = 5 * SQUARE_SIZE;
const SPRITE_HEIGHT = 8 * SQUARE_SIZE;
const BORDER_WIDTH = 1;
const SPACING_WIDTH = 0;
const SPRITE_COL = 8
const SPRITE_ROW = 0;
const moveTime = 600; // influences the speed at which a sprite changes direction

// When the user clicks on the open button, open the modal
function openModal(id){
	// Get the modal
	var modal = document.getElementById(id);
	modal.style.display = "block";
	console.log(document.cookie);
	
	if (id === "shopModal"){
		let test = document.getElementById("closeShop");
		let spinCookie = getCookie("spinCost");
		
		if (parseInt(document.getElementById("cashBalance").innerHTML) >= spinCookie){
			test.setAttribute('onclick',"closeModal('shopModal')");
		} else{
			test.setAttribute('onclick',null);
		}
		
		
	}
}

// When the user clicks spin button, close the modal
function closeModal(id){
	let modal = document.getElementById(id);
	switch(id) {
		case "shopModal":
			let spinCookie = getCookie("spinCost");
			if (parseInt(document.getElementById("cashBalance").innerHTML) >= spinCookie){
				modal.style.display = "none";

				
				document.getElementById("cashBalance").innerHTML = parseInt(document.getElementById("cashBalance").innerHTML) - spinCookie;
				spinCookie += spinCookie/2;
				setCookie("spinCost", spinCookie);
				
				
				document.getElementById("closeShop").innerHTML = "Give me my ghost! ($" + spinCookie + ")";
				
				let yard = document.getElementById("Graveyard");
				yard.setAttribute("roll", "1");
			}
			break;
		
		case "shopModalx":
			modal = document.getElementById("shopModal");
			modal.style.display = "none";
		
			break;
		
		case "welcomeModal":
			modal.style.display = "none";
			let yard = document.getElementById("Graveyard");
			yard.setAttribute("roll", "1");
			
			
			break;
			
		default:
			
			modal.style.display = "none";
			break;
	} 

	
}

/* This section of the code works with cookies*/
function setCookie(name,value,days = 30) { //Creates a new cookie with a set name, value, and expiration date which defaults to 30 days from creation
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name) { //returns the value of a specified cookie
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for(let i=0;i < ca.length;i++) {
        let c = ca[i];
        while (c.charAt(0)==' '){
            c = c.substring(1,c.length);
        } 
        if (c.indexOf(nameEQ) == 0){
            return c.substring(nameEQ.length,c.length);
        } 
    }
    return "";
}


class Graveyard {
	constructor(id){
		let y = this;
		this.ghostArr = [];
		this.graveArr = [];

		for(let i = 0; i < GHOST_ARR.length; i++){
			let ghostCookie = getCookie("ghostArr" + i);
			let graveCookie = getCookie("graveArr" + i);
			if(ghostCookie !== ""){
				this.ghostArr[i] = JSON.parse(ghostCookie);
			}
			if(graveCookie !== ""){
				this.graveArr[i] = JSON.parse(graveCookie);
			}
		}
		
		this.yard = document.getElementById("Graveyard");
		this.yard.setAttribute("roll", "0"); //roll = true initially
		
		this.canvas = document.getElementById(id);
		
		this.balance = document.getElementById("cashBalance");

		//setCookie("balance", this.balance.innerHTML);
		let balanceCookie = getCookie("balance");
		console.log("Balance Cookie: "+balanceCookie)
		if(balanceCookie !== ""){
			this.balance.innerHTML = balanceCookie;
		}
		
		this.infoTabHeader = document.getElementById("infoTabHeader");
		this.infoTabText = document.getElementById("infoTabText");
		
    
		this.ctx = this.canvas.getContext("2d");
		let sheetURL = "sheet1.png";
		let img = new Image();
		img.src = sheetURL;
		this.img = img;
		
		this.vx = 0.05; //velocity
		this.vy = 0.05; //velocity
		this.lastTimestamp = 0;
		window.requestAnimationFrame(stepCallback); 
		
		function stepCallback(timestamp) {
			y.step(timestamp);
			
		}
		
	}
	
	rollChar(){
		let index = Math.floor(Math.random() * 8);
		let result = GHOST_ARR[index]
		
		if(this.isDuplicate(index)){
			let modal = document.getElementById("resultModalDuplicate");
			let para = modal.firstElementChild.firstElementChild;
			para.innerHTML = "You got </br>" + result;
			
			openModal("resultModalDuplicate");
			
			
		} else {
			let modal = document.getElementById("resultModalNew");
			let para = modal.firstElementChild.firstElementChild;
			para.innerHTML = "You got </br>" + result;
			
			
			let i = this.ghostArr.length;
		
			let ghost = new Ghost(index);
			this.ghostArr[i] = ghost;
			setCookie("ghostArr" + i, JSON.stringify(this.ghostArr[i]));
			
			this.generateInfoModal(i);
			
			let headstone = new Headstone(index, i);
			this.graveArr[i] = headstone;
			setCookie("graveArr" + i, JSON.stringify(this.graveArr[i]));
			openModal("resultModalNew");
		}
		
		
	}
	
	isDuplicate(index){
		for(let i = 0; i < this.ghostArr.length; i++){
			if(this.ghostArr[i].index === index){
				this.graveArr[i].level += 1;
				switch (this.graveArr[i].level){
					case 3:
						
							this.graveArr[i].spriteData.position = this.positionSprite(1, 1);
							break;
							
					case 5:
						
							this.graveArr[i].spriteData.position = this.positionSprite(1, 2);
							break;
				}
				setCookie("graveArr" + i, JSON.stringify(this.graveArr[i]));					
				return true;
			} 
			
		} 
		
		return false;
		
	}
	
	positionSprite(row,col){ /* returns the x,y on the spritesheet of the sprite at row,col */
		return {
			x: (
				BORDER_WIDTH +
				col * (SPACING_WIDTH + SPRITE_WIDTH)
			),
			y: (
				BORDER_WIDTH +
				row * (SPACING_WIDTH + SPRITE_HEIGHT)
			)
		}
	}
	
	generateInfoModal(index){
		
		this.infoTabHeader.innerHTML = this.ghostArr[index].label;
		this.infoTabText.innerHTML = this.ghostArr[index].desc;
		
		
		
		
	}
	
	step(timestamp) { /*animation loop*/
	
		if (this.yard.getAttribute("roll") === "1") {			
			this.rollChar();
			this.yard.setAttribute("roll", "0");
			
		}
	
        let dt = timestamp - this.lastTimestamp;   //here         
        if (this.lastTimestamp === 0) {
            dt = 0;
        }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for(let i = 0; i < this.ghostArr.length; i++){ /* This loop exists only to animate multiple sprites at once */
            let currentSprite = this.ghostArr[i];
			let currentGrave = this.graveArr[i];
			
			this.collisionTest(currentSprite.spriteData.x, currentSprite.spriteData.y);
			
	
            this.ctx.drawImage(
                this.img, currentSprite.spriteData.position.x, currentSprite.spriteData.position.y, SPRITE_WIDTH, SPRITE_HEIGHT, currentSprite.spriteData.x, currentSprite.spriteData.y, SPRITE_WIDTH, SPRITE_HEIGHT
            );
			
			this.ctx.drawImage(
                this.img, currentGrave.spriteData.position.x, currentGrave.spriteData.position.y, SPRITE_WIDTH, SPRITE_HEIGHT, currentGrave.spriteData.x, currentGrave.spriteData.y, SPRITE_WIDTH, SPRITE_HEIGHT
            );
         
            let tx = currentSprite.spriteData.fx - currentSprite.spriteData.x;
            let ty = currentSprite.spriteData.fy - currentSprite.spriteData.y;
            let dist = Math.sqrt(tx*tx + ty*ty);
            currentSprite.spriteData.x += dt * (tx/dist) * this.vx;
            currentSprite.spriteData.y += dt * (ty/dist) * this.vy;
			if(currentSprite.index === 2 || currentSprite.index ===5){ /* Speeds up movement of Hand (2) and Imp (5) */
				currentSprite.spriteData.moveTick -=15;
			}
			else{
				currentSprite.spriteData.moveTick -= 1;
			}

           if( Math.floor(currentSprite.spriteData.x) === currentSprite.spriteData.fx || Math.floor(currentSprite.spriteData.y) === currentSprite.spriteData.fy || currentSprite.spriteData.moveTick === 0){
               if(currentSprite.index === 6){ /* Movement pattern for Twinky (6) */

                        if( Math.floor(currentSprite.spriteData.x) === currentSprite.spriteData.fx){
                            currentSprite.spriteData.fx = Math.floor(Math.random()*(this.canvas.width - SPRITE_WIDTH*2) + SPRITE_WIDTH);
                        }
                        else{
                            currentSprite.spriteData.fy = Math.floor(Math.random() * (this.canvas.height - SPRITE_HEIGHT*2) + SPRITE_HEIGHT)
                        }
                }
                else{
                    currentSprite.spriteData.fx = Math.floor(Math.random()*(this.canvas.width - SPRITE_WIDTH*2) + SPRITE_WIDTH);
                    currentSprite.spriteData.fy = Math.floor(Math.random() * (this.canvas.height - SPRITE_HEIGHT*2) + SPRITE_HEIGHT);
                }
               currentSprite.spriteData.moveTick = moveTime;
           }
		}
        
        

        this.lastTimestamp = timestamp;
        window.requestAnimationFrame(this.step.bind(this));
    }
	
	collisionTest(x, y){
		
		let gx = x + Math.floor(SPRITE_WIDTH/2);
		let gy = y + Math.floor(SPRITE_HEIGHT/2);
		
		for(let i = 0; i < this.ghostArr.length; i++){
			
			let hx1 = this.graveArr[i].spriteData.x
			let hy1 = this.graveArr[i].spriteData.y
			
			let hx2 = hx1 + SPRITE_WIDTH;
			let hy2 = hy1 + SPRITE_HEIGHT;
			
			if( gx > hx1 && gx < hx2 && gy > hy1 && gy < hy2){
				this.balance.innerHTML = parseInt(this.balance.innerHTML) + this.graveArr[i].level;
				setCookie("balance", this.balance.innerHTML);
			}
		
		}
		
	}
	
	
}



class Headstone{
	
	constructor(index, count) {
		let h = this;
		this.index = index;
		this.count = count;
		this.graves = document.getElementById("Graveyard");
		
		let canvas = document.getElementById("spriteDisplay");
		this.canvas = canvas;
		
		this.level = 1;
		
		let btn = document.createElement('button');
		//btn.innerHTML = GHOST_ARR[index];
		btn.className = "headstone";
		
		let bx = startX(); //starting x
        let by = startY(); //starting y
		
		btn.style.left = "" + (bx + 50) + "px";
		btn.style.top = "" + (by + 50) + "px";
		btn.addEventListener("click", clickCallback);
		btn.addEventListener("contextmenu", clickCallback);
		this.graves.appendChild(btn);
		
		let position = positionSprite(1,0); //spritesheet location
		
		let spriteData = {x: bx, y: by, position: position}; //stores sprite specific data
		
		this.spriteData = spriteData;
		
		this.balance = document.getElementById("cashBalance");
		
		
			
		function clickCallback() {
			h.clickAction();
			
		}
		
		function startX() {
			
			
			if(count < 4){
				
				return Math.floor((canvas.width / 5)*(count+1) - SPRITE_WIDTH/2);
				
			} else if(count => 4 && count < 8 ){
				
				return Math.floor((canvas.width / 5)* ((count)%4 + 1) - SPRITE_WIDTH/2 - (canvas.width / 10));
				
			} else {
				throw new Error("Too many graves D:");
			}
			
		}
		
		function startY(){
			if(count < 4){
				return 150;
			} else if(count => 4 && count < 8 ){
				return 350;
			} else {
				throw new Error("Too many graves D:");
			}
		}
		
		function positionSprite(row,col){ /* returns the x,y on the spritesheet of the sprite at row,col */
			return {
				x: (
					BORDER_WIDTH +
					col * (SPACING_WIDTH + SPRITE_WIDTH)
				),
				y: (
					BORDER_WIDTH +
					row * (SPACING_WIDTH + SPRITE_HEIGHT)
				)
			}
		}
	}
	
	clickAction(){
		
		this.balance.innerHTML = parseInt(this.balance.innerHTML) + this.level;
		setCookie("balance", this.balance.innerHTML);
		
	}
	
}

class Ghost{
	
	constructor(index) {
		let g = this;
		this.index = index;
		this.canvas = document.getElementById("spriteDisplay");
		
		this.label = GHOST_ARR[index];
		this.desc = INFO_ARR[index];
		
		let bx = Math.floor(Math.random()*(this.canvas.width - SPRITE_WIDTH*2) + SPRITE_WIDTH); //starting x
        let by = Math.floor(Math.random()*(this.canvas.height - SPRITE_HEIGHT*2) + SPRITE_HEIGHT); //starting y
		
        let fx = Math.floor(Math.random()*(this.canvas.width - SPRITE_WIDTH*2) + SPRITE_WIDTH); //final x
        let fy = Math.floor(Math.random() * (this.canvas.height - SPRITE_HEIGHT*2)+ SPRITE_HEIGHT); //final y
		
        let position = positionSprite(0,index); //spritesheet location
		
        let moveTick = moveTime; //controls how often a specific sprite changes directions regardless of whether or not it reachs fx,fy
        
		let spriteData = {x: bx, y: by, fx: fx, fy: fy, position: position, moveTick: moveTick}; //stores sprite specific data
		
		this.spriteData = spriteData;
		
		
		function positionSprite(row,col){ /* returns the x,y on the spritesheet of the sprite at row,col */
			return {
				x: (
					BORDER_WIDTH +
					col * (SPACING_WIDTH + SPRITE_WIDTH)
				),
				y: (
					BORDER_WIDTH +
					row * (SPACING_WIDTH + SPRITE_HEIGHT)
				)
			}
		}
		
		this.movementCallback = function() {
            g.generateMove();
        }
		
	}
	
	generateMove() {
		
		
	}
	
	
	
}

