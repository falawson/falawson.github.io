/*
 * File: GhostClicker.js
 * --------------------------
 * The JavaScript code to run the Ghost Clicker browser game
 */
 
"use strict";

const GHOST_ARR	= ["Spook Ghost", "Spirit Orbs", "Zombie Hand", "Skullothy", "Grimm", "Imp", "Twinky", "Will o' Wisp"];
const SPIN_COST = 50;

let ROLLED_INDEXES =[];

// When the user clicks on the open button, open the modal
function openModal(id){
	// Get the modal
	var modal = document.getElementById(id);
	modal.style.display = "block";
	
	if (id === "shopModal"){
		let test = document.getElementById("closeShop");

		if (parseInt(document.getElementById("balance").innerHTML) >= SPIN_COST){
			test.setAttribute('onclick',"closeModal('shopModal')");
		} else{
			test.setAttribute('onclick',null);
		}
		
		
	}
}

// When the user clicks spin button, close the modal
function closeModal(id){
	var modal = document.getElementById(id);
	modal.style.display = "none";
	
	
	
	if (id !== "resultModal"){
		if (id === "shopModal"){
			if (parseInt(document.getElementById("balance").innerHTML) >= SPIN_COST){
				document.getElementById("balance").innerHTML = parseInt(document.getElementById("balance").innerHTML) - SPIN_COST;
			}
			else{
				
				return;
			}
		}
		rollChar();
	}
	
	
}

function rollChar(){
	let index = Math.floor(Math.random() * 8);
	let result = GHOST_ARR[index]
	let graves = document.getElementById("Graves");
	
	let modal = document.getElementById("resultModal");
	let para = modal.firstElementChild.firstElementChild;
	para.innerHTML = "You got </br>" + result;
	
	new Headstone(index);
	openModal("resultModal");
	
	
	
	
}



class Headstone{
	
	constructor(index) {
		let h = this;
		this.index = index;
		this.graves = document.getElementById("Graves");
		
		let btn = document.createElement('button');
		btn.innerHTML = GHOST_ARR[index];
		btn.addEventListener("click", clickCallback);
		//this.btn = btn;
		
		this.graves.appendChild(btn);
			
		function clickCallback() {
			h.clickAction();
			
		}
	}
	
	clickAction(){
		balance = document.getElementById("balance");
		balance.innerHTML = parseInt(balance.innerHTML) + 1;
		
	}
	
}

class Ghost{
	
	constructor(index) {
		
		
		
	}
	
}
