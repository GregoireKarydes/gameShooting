const canvas =  document.querySelector('canvas');
const ctx = canvas.getContext('2d');


canvas.width = innerWidth;
canvas.height = innerHeight;

const scoreHtml = document.getElementById('score');
const scoreMenu = document.getElementById('scoreMenu');


class Player {
    constructor(x,y,radius,color){
        this.x = x,
        this.y = y,
        this.radius = radius,
        this.color = color
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius,0, Math.PI*2, false);
        ctx.fillStyle = this.color;
        ctx.fill()
    }
}

class Projectile {
    constructor(x,y,radius,color,velocity) {
        this.x = x,
        this.y =y,
        this.radius = radius,
        this.color = color,
        this.velocity = velocity
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius,0, Math.PI*2, false);
        ctx.fillStyle = this.color;
        ctx.fill()
    }

    update()  {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }   
        
}
const friction = 0.99;
class Particule {
    constructor(x,y,radius,color,velocity) {
        this.x = x,
        this.y =y,
        this.radius = radius,
        this.color = color,
        this.velocity = velocity,
        this.alpha = 1
    }

    draw() {
        ctx.save()
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius,0, Math.PI*2, false);
        ctx.fillStyle = this.color;
        ctx.fill()
        ctx.restore()
    }

    update()  {
        this.draw();
        this.velocity.x *= friction;
        this.velocity.y *= friction;
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
        this.alpha -=0.01;
    }   
        
}

class Mechant {
    constructor(x,y,radius,color,velocity) {
        this.x = x,
        this.y =y,
        this.radius = radius,
        this.color = color,
        this.velocity = velocity
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius,0, Math.PI*2, false);
        ctx.fillStyle = this.color;
        ctx.fill()
    }

    update()  {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }   
        
}

function spawnMechant() {
    setInterval(() => {
        const radius = (Math.random()*30)+5;

        let x;
        let y;

        if(Math.random()<0.5){
             x = Math.random() < 0.5 ? 0 -radius : canvas.width + radius;
             y = Math.random() * canvas.height;
        } else {
            x = Math.random() * canvas.width;
             y = Math.random() < 0.5 ? 0 -radius : canvas.height + radius;
        }



        const color = `hsl(${Math.random()*360},50%,50%)`;
        const angle = Math.atan2(canvas.height/2 - y, canvas.width/2 - x);
    
        const velocity = {
        x: Math.cos(angle),
        y : Math.sin(angle)}

        mechants.push(new Mechant(x, y, radius, color, velocity))
    }, 1000);
}

spawnMechant();

const x = canvas.width/2;
const y = canvas.height/2;

const player = new Player(x,y, 10, "white");


const projectiles = [];
const mechants = [];
const particules = [];

let animationId;
let score =0;

function  animate() {
    animationId = requestAnimationFrame(animate);
    scoreHtml.innerHTML = score;
    ctx.fillStyle ='rgba(0,0,0,0.1)';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    particules.forEach((particule, index) =>{
        
        if(particule.alpha <=0) {
            particules.splice(index,1)
        } else{particule.update()}
        })
    player.draw();
    projectiles.forEach((projectile, index) =>{projectile.update();
    //remove projectil from the edege
        if (projectile.x- projectile.radius <0 || projectile.x- projectile.radius> canvas.width || projectile.y - projectile.radius > canvas.height || projectile.y -projectile.radius <0) {
        setTimeout(() => {
            projectiles.splice(index,1)
        },0)
    }
    
    });


    mechants.forEach((mechant, index) => {
        mechant.update();

        //game over
        const dist = Math.hypot(player.x - mechant.x, player.y - mechant.y);
        if( dist - mechant.radius - player.radius<1) {
            cancelAnimationFrame(animationId);
            scoreMenu.innerHTML = score;
            gsap.to(".endMenu", { display : "initial"});
        }

        projectiles.forEach((projectile, projectileIndex) => {
            const dist = Math.hypot(projectile.x - mechant.x, projectile.y - mechant.y);
        
            //projectile touche mechant
        if( dist - mechant.radius - projectile.radius<1) {

            score += 100;


            for (let i =0;i< mechant.radius ; i++) {
                particules.push(new Particule(projectile.x, projectile.y, Math.random()*2, mechant.color, {x :  Math.random()-0.5 *(Math.random()*6), y :  Math.random()-0.5 *(Math.random()*6), }))
            }


            if(mechant.radius - 10 >5){
                gsap.to(mechant, {
                    radius:mechant.radius-10
                })
                setTimeout(() => {
                    projectiles.splice(projectileIndex, 1);
                },0)
            } else {
            setTimeout(() => {
                mechants.splice(index, 1);
                projectiles.splice(projectileIndex, 1);
            },0)}  
        } 
    })
    })
}

addEventListener('click', (event) => {

    const angle = Math.atan2(event.clientY - canvas.height/2,event.clientX - canvas.width/2);
    const velocity = {
        x: Math.cos(angle) * 5,
        y : Math.sin(angle) * 5
    }



    projectiles.push(new Projectile(canvas.width/2, canvas.height/2, 5, "white", velocity))
})

animate();
