/*
 * File: loadSpriteSheet.js
 * ---------------------------
 * This program tests displaying and animating sprites from a sprite sheet
 */

const SQUARE_SIZE = 8; 
const SPRITE_WIDTH = 5 * SQUARE_SIZE;
const SPRITE_HEIGHT = 8 * SQUARE_SIZE;
const BORDER_WIDTH = 1;
const SPACING_WIDTH = 0;
const SPRITE_COL = 8
const SPRITE_ROW = 0;
const moveTime = 600; // influences the speed at which a sprite changes direction



function loadSpriteSheet(){
    let canvas = document.getElementById("spriteDisplay");
    
    let ctx = canvas.getContext("2d");
    let sheetURL = "sheet1.png";
    let img = new Image();
    img.src = sheetURL;

    let spriteList = []

    for(let i = 0; i < SPRITE_COL; i++){ /* creates a list of all the sprites from the first row of the spritesheet */
        let bx = Math.floor(Math.random()*(canvas.width - SPRITE_WIDTH*2) + SPRITE_WIDTH); //starting x
        let by = Math.floor(Math.random()*(canvas.height - SPRITE_HEIGHT*2) + SPRITE_HEIGHT); //starting y
        let fx = Math.floor(Math.random()*(canvas.width - SPRITE_WIDTH*2) + SPRITE_WIDTH); //final x
        let fy = Math.floor(Math.random() * (canvas.height - SPRITE_HEIGHT*2)+ SPRITE_HEIGHT); //final y
        let position = positionSprite(0,i);
        let moveTick = moveTime; //controls how often a specific sprite changes directions regardless of whether or not it reachs fx,fy
        let sprite = {x: bx, y: by, fx: fx, fy: fy, position: position, moveTick: moveTick}; //stores sprite specific data

        spriteList[i] = sprite;
    }
    
    
    let vx = 0.05; //velocity
    let vy = 0.05; //velocity
    let lastTimestamp = 0;
    window.requestAnimationFrame(step); 



    function step(timestamp) { /*animation loop*/
        let dt = timestamp - lastTimestamp;            
        if (lastTimestamp === 0) {
            dt = 0;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // ctx.fillStyle = "DarkSlateGrey";
        // ctx.fillRect(0,0,canvas.width,canvas.height);

        for(let i = 0; i < spriteList.length; i++){ /* This loop exists only to animate multiple sprites at once */
            currentSprite = spriteList[i];
            ctx.drawImage(
                img,currentSprite.position.x, currentSprite.position.y, SPRITE_WIDTH, SPRITE_HEIGHT, currentSprite.x, currentSprite.y, SPRITE_WIDTH, SPRITE_HEIGHT
            );
         
            let tx = currentSprite.fx - currentSprite.x;
            let ty = currentSprite.fy - currentSprite.y;
            let dist = Math.sqrt(tx*tx + ty*ty);
            currentSprite.x += dt * (tx/dist) * vx;
            currentSprite.y += dt * (ty/dist) * vy;
           if(i === 2 || i ===5){ /* Speeds up movement of Hand (2) and Imp (5) */
               currentSprite.moveTick -=15;
           }
           else{
               currentSprite.moveTick -= 1;
           }

           if( Math.floor(currentSprite.x) === currentSprite.fx || Math.floor(currentSprite.y) === currentSprite.fy || currentSprite.moveTick === 0){
               if(i === 6){ /* Movement pattern for Twinky (6) */

                        if( Math.floor(currentSprite.x) === currentSprite.fx){
                            currentSprite.fx = Math.floor(Math.random()*(canvas.width - SPRITE_WIDTH*2) + SPRITE_WIDTH);
                        }
                        else{
                            currentSprite.fy = Math.floor(Math.random() * (canvas.height - SPRITE_HEIGHT*2) + SPRITE_HEIGHT)
                        }
                }
                else{
                    currentSprite.fx = Math.floor(Math.random()*(canvas.width - SPRITE_WIDTH*2) + SPRITE_WIDTH);
                    currentSprite.fy = Math.floor(Math.random() * (canvas.height - SPRITE_HEIGHT*2) + SPRITE_HEIGHT);
                }
               currentSprite.moveTick = moveTime;
           }


            



            /* Below is the old way to animate the sprites without using moveTick */
            
            // if( Math.floor(currentSprite.x) === currentSprite.fx || Math.floor(currentSprite.y) === currentSprite.fy){
            //     if(i !== 2 && i!== 5 && i!== 6){ /* General movement pattern excluding Hand (2), Imp (5), and Twinky (6) */
            //         currentSprite.fx = Math.floor(Math.random()*(canvas.width - SPRITE_WIDTH*2) + SPRITE_WIDTH);
            //         currentSprite.fy = Math.floor(Math.random() * (canvas.height - SPRITE_HEIGHT*2) + SPRITE_HEIGHT);
            //     }
            //     else if(i===2 || i === 5){ /* Movement pattern for Hand and Imp */

            //         /* There is probably a better way to do this, but for now this sets a min and max X w/in the canvas 
            //             w/ relation to the current x and sets a min and max Y w/in the canvas w/ relation to the current y */

            //         let spriteMinX = Math.floor(Math.random()*(currentSprite.x - Math.ceil(SPRITE_WIDTH) + 1) + Math.ceil(SPRITE_WIDTH));
            //         let spriteMaxX = Math.floor(Math.random()*(canvas.width - SPRITE_WIDTH - Math.ceil(currentSprite.x)) + Math.ceil(currentSprite.x));

            //         let spriteMinY = Math.floor(Math.random()*(currentSprite.y  - Math.ceil(SPRITE_HEIGHT) + 1) + Math.ceil(SPRITE_HEIGHT));
            //         let spriteMaxY = Math.floor(Math.random()*(canvas.height - SPRITE_HEIGHT - Math.ceil(currentSprite.y)) + Math.ceil(currentSprite.y ));
                    
            //         currentSprite.fx = Math.floor(Math.random()*(spriteMaxX - spriteMinX) + spriteMinX);
            //         currentSprite.fy = Math.floor(Math.random()*(spriteMaxY - spriteMinY) + spriteMinY);



            //     }
            //     else if(i === 6){ /* Movement pattern for Twinky */

            //         // if(Math.floor(Math.random()*(2))% 2 === 0){ 
            //         //     currentSprite.fx = Math.floor(Math.random()*(canvas.width - SPRITE_WIDTH*2) + SPRITE_WIDTH);
            //         // }
            //         // else{
            //         //     currentSprite.fy = Math.floor(Math.random() * (canvas.height - SPRITE_HEIGHT*2) + SPRITE_HEIGHT)
            //         // }

            //         if( Math.floor(currentSprite.x) === currentSprite.fx){
            //             currentSprite.fx = Math.floor(Math.random()*(canvas.width - SPRITE_WIDTH*2) + SPRITE_WIDTH);
            //         }
            //         else{
            //             currentSprite.fy = Math.floor(Math.random() * (canvas.height - SPRITE_HEIGHT*2) + SPRITE_HEIGHT)
            //         }

            //     }
            // }
        }
        
        

        lastTimestamp = timestamp;
        window.requestAnimationFrame(step);
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
