let canvas = document.getElementById('space_box');
let c = canvas.getContext('2d');

let innerWidth = window.innerWidth,
    innerHeight = window.innerHeight,
    radius = 0.5,
    starsIndex = 0,
    stars = [],
    TWO_PI = Math.PI * 2,
    centerX = innerWidth / 2,
    centerY = innerHeight / 2,
    focalLength = 700,
    starRadius = null,
    starX = null,
    starY = null,
    numStars = 4000,
    starX_dir = 0,
    starY_dir = 0;

canvas.width = innerWidth;
canvas.height = innerHeight;

	
// Function for create new star
function Star(x,y,z){
  this.x = x;
	this.y = y;
	this.z = z;
	this.radius = radius;
	this.color = "#fff";
	starsIndex++;
	stars[starsIndex] = this;
	this.id = starsIndex;
	
	// Animate Stars
	this.update = function(){
	  starX = (this.x - centerX) * (focalLength / this.z);
	  starX += centerX;
	  
	  starY = (this.y - centerY) * (focalLength / this.z);
	  starY += centerY;
	  
	  starRadius = radius * (focalLength / this.z);
	  
	  starX += starX_dir;
	  starY += starY_dir;
	  
	  this.z += -0.5;
	  
	  if(this.z <= 0){
	     this.z = parseInt(innerWidth);
	  }
	  
	  this.draw();
	
	}
	
	// Function for draw star
	this.draw = function(){
		c.beginPath();
		c.arc(starX,starY,starRadius, TWO_PI, false);
		c.fillStyle = this.color;
		c.fill();
		c.closePath();
	}
	
}	

// X,Y,Z values
for(let s = 0; s < numStars; s++){
	x = Math.random() * innerWidth;
	y = Math.random() * innerHeight;
	z = Math.random() * innerWidth;
	new Star(x,y,z);
}

// Function for animate canvas objects
function animate(){
    requestAnimationFrame(animate);
	c.fillStyle = "#111";
	c.fillRect(0,0,innerWidth,innerHeight);
	
	for( let i in stars){
	  stars[i].update();
	}
}

animate();
