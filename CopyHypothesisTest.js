let style1colour = "black"
let style2colour = "red"
let style3colour = "rgba(255,0,0,0.2)"
let style4colour = "blue"
let style5colour = "rgba(0,0,255,0.2)"
let x1, x2;

const checkbox = document.getElementById('myCheckbox');
const canvas1 = document.getElementById('canvas1');
const canvas2 = document.getElementById('canvas2');

window.onload = function() {
    draw();
}

function draw(){ 
    var mean = 0; //Fixing the mean value
    var stddev = parseFloat(document.getElementById("stddev-slider").value);
    var xMin = mean - 5 * stddev;
    var xMax = mean + 5 * stddev;
    var step = (xMax - xMin)/600;

    if (!x1) x1 = xMin;
    if (!x2) x2 = xMax;

    var x = xMin;
    var y;
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var offsetB = 30;
    var yOffset = 100; // Move plot up by 200 pixels
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    //Draw normal curve
    ctx.strokeStyle = style1colour;
    ctx.lineWidth = 2;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - offsetB - yOffset);
    while (x <= xMax) {
        y = canvas.height * (1 / (stddev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * (x - mean) * (x - mean) / (stddev * stddev));
        ctx.lineTo((x - xMin) / step, canvas.height - offsetB - y - yOffset);
        x += step;
    }
    ctx.stroke();

    //Draw x-axis
    ctx.strokeStyle = style1colour;
    ctx.lineWidth = 2;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - offsetB - yOffset);
    ctx.lineTo(canvas.width, canvas.height - offsetB - yOffset);
    ctx.stroke();

    //Draw x-axis tick marks
    ctx.strokeStyle = style1colour;
    ctx.lineWidth = 1;
    ctx.setLineDash([]);
    for (var i = -4; i <= 4; i++) {
        x = mean + i * stddev;
        if (x >= xMin && x <= xMax) {
        ctx.beginPath();
        ctx.moveTo((x - xMin) / step, canvas.height - offsetB - 4 - yOffset);
        ctx.lineTo((x - xMin) / step, canvas.height - offsetB + 4 - yOffset);
        ctx.stroke();
        }
    }

    //Draw x-axis labels 
    ctx.strokeStyle = style1colour;
    ctx.fillStyle = style1colour;
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    for (var i = -4; i <=4; i++){
        x = mean + i * stddev;
        if (x >= xMin && x <= xMax){
            ctx.fillText(x.toFixed(2), (x - xMin) / step, canvas.height - offsetB + 4 - yOffset);
        }
    }

    //Draw alpha boundaries
    var alpha = parseFloat(document.getElementById("alpha-value").value);
    var z_alpha = jStat.normal.inv(1 - alpha / 2, 0, 1);
    var x_alpha1 = mean - z_alpha * stddev;
    var x_alpha2 = mean + z_alpha * stddev;

    //Drawing the dashed lines for the alpha boundaries
    ctx.strokeStyle = style2colour;
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 3]);
    //Lower line
    ctx.beginPath();
    ctx.moveTo((x_alpha1 - xMin) / step, canvas.height - offsetB - yOffset);
    ctx.lineTo((x_alpha1 - xMin) / step, 0);
    ctx.stroke();
    //Upper line
    ctx.beginPath();
    ctx.moveTo((x_alpha2 - xMin) / step, canvas.height - offsetB - yOffset);
    ctx.lineTo((x_alpha2 - xMin) / step, 0);
    ctx.stroke();

    //Lower area fill
    ctx.fillStyle = style3colour;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - offsetB - yOffset);
    x = xMin;
    while (x <= x_alpha1) {
        y = canvas.height * (1 / (stddev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * (x - mean) * (x - mean) / (stddev * stddev));
        ctx.lineTo((x - xMin) / step, canvas.height - offsetB - y - yOffset);
        x += step;
    }
    ctx.lineTo((x_alpha1 - xMin) / step, canvas.height - offsetB - yOffset);
    ctx.closePath();
    ctx.fill();

    //Upper area fill
    ctx.fillStyle = style3colour;
    ctx.beginPath();
    ctx.moveTo((x_alpha2 - xMin) / step, canvas.height - offsetB - yOffset);
    x = x_alpha2;
    while (x <= xMax) {
        y = canvas.height * (1 / (stddev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * (x - mean) * (x - mean) / (stddev * stddev));
        ctx.lineTo((x - xMin) / step, canvas.height - offsetB - y - yOffset);
        x += step;
    }
    ctx.lineTo((xMax - xMin) / step, canvas.height - offsetB - yOffset);
    ctx.closePath();
    ctx.fill();

    x1 = parseFloat(document.getElementById("x1").value);
    x2 = parseFloat(document.getElementById("x2").value);
}

//Draws the second plot
function draw2(){ 
    var mean = 0; //Fixing the mean value
    var stddev = parseFloat(document.getElementById("stddev-slider").value);
    var xMin2 = mean - 5 * stddev;
    var xMax2 = mean + 5 * stddev;
    var step = (xMax2 - xMin2)/600;

    if (!x1) x1 = xMin2;
    if (!x2) x2 = xMax2;

    var x = xMin2;
    var y;
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var offsetB = 30;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    //Draw normal curve
    ctx.strokeStyle = style4colour;
    ctx.lineWidth = 2;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - offsetB);
    while (x <= xMax2) {
        y = canvas.height * (1 / (stddev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * (x - mean) * (x - mean) / (stddev * stddev));
        ctx.lineTo((x - xMin2) / step, canvas.height - offsetB - y);
        x += step;
    }
    ctx.stroke();

//Draw x-axis
ctx.strokeStyle = style1colour;
ctx.lineWidth = 2;
ctx.setLineDash([]);
ctx.beginPath();
ctx.moveTo(0, canvas.height - offsetB);
ctx.lineTo(canvas.width, canvas.height - offsetB);
ctx.stroke();

//Draw x-axis tick marks
ctx.strokeStyle = style1colour;
ctx.lineWidth = 1;
ctx.setLineDash([]);
for (var i = -4; i <= 4; i++) {
    x = mean + i * stddev;
    if (x >= xMin2 && x <= xMax2) {
    ctx.beginPath();
    ctx.moveTo((x - xMin2) / step, canvas.height - offsetB - 4);
    ctx.lineTo((x - xMin2) / step, canvas.height - offsetB + 4);
    ctx.stroke();
    }
}

//Draw x-axis labels 
ctx.strokeStyle = style1colour;
ctx.fillStyle = style1colour;
ctx.font = "12px Arial";
ctx.textAlign = "center";
ctx.textBaseline = "top";
for (var i = -4; i <=4; i++){
    x = mean + i * stddev;
    if (x >= xMin2 && x <= xMax2){
        ctx.fillText(x.toFixed(2), (x - xMin2) / step, canvas.height - offsetB + 4);
    }
}

x1 = parseFloat(document.getElementById("x1").value);
x2 = parseFloat(document.getElementById("x2").value);
}

// Attach an event listener to the checkbox
checkbox.addEventListener('change', function() {
    // Check the checkbox state
    if (checkbox.checked) {
      // Call both draw functions if the checkbox is checked
      draw();
      draw2();
    } else {
      // Otherwise, just call the first draw function
      draw();
    }
  });

// Attach an event listener to the checkbox
function myFunction() {
  if (checkbox.checked) {
    // Do something when the checkbox is checked
  } else {
    // Do something when the checkbox is unchecked
  }
}

//Draws a line
function draw3(){
    //DRAW A LINE
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var offsetB = 30;
    ctx.strokeStyle = style1colour;
    ctx.lineWidth = 2;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - offsetB);
    ctx.lineTo(canvas.width, canvas.height - offsetB);
    ctx.stroke();
}

// Attach an event listener to the checkbox
function myFunction() {
    if (checkbox.checked) {
      draw();
      draw3();
    } else {
      draw();
    }
  }

checkbox.addEventListener('change', myFunction); 

