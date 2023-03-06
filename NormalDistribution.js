
/*
The following is the base code for the Normal Distribution Applet. 
The aim is to create classes like the HypothesisTesting Applet to make the code easier to read and maintain.
The code is pretty much finished other than adding in comments and the classes.
*/
var can;
var ctx;
var h = 400;
var w = 496; //Divisible by 8.
var xorigin = 15;
var middle = (w + 2*xorigin)/2;

var mean = 100;
var sd = 15;

var rad = 6;
var base=10; //Size of triangle base.

var xvals = [];
var yvals = [];
var showz = false;

var ax = 100; 
var bx = 300;
var baseline = h+xorigin-50;
var dragp = 0;

var dragok = false;

var probab = 0;

var inputmean;
var inputsd;

var showcuml = false; //When true, show cumulative probabilities.
var showFa = false; //show P(X<a)
var showFb = false;
	
window.onload = function(){
	can = document.getElementById("canvas");
	ctx = can.getContext("2d");			
	can.height = h+2*xorigin;
	can.width = w+2*xorigin;		
	can.addEventListener('mousedown', mouse_down);			
	can.addEventListener('mouseup', mouse_up);
	can.addEventListener('mouseout', mouse_up);
	
	
	for(var i=0; i < w; i++){
		xvals[i] = i;
		yvals[i] = jStat.normal.pdf(i,w/2,w/8);		
	}	
	cbvisibility("hidden");
	paint();		
}

function paint(){	
	ctx.clearRect(0,0,can.width,can.height);
	ctx.fillStyle="black";
	ctx.strokeStyle = "black";
	ctx.lineWidth = 3;
	
	drawLine(ctx,xorigin,h+xorigin-50,w + 2*xorigin, h+xorigin-50);	//Draw x axis.	
		
	//Add numbers to x axis
	ctx.font="16px Arial";
	var unit = w/8;
	var txt = "";
	var val = 0;
	for(var i = 0; i <= 8; i++){
		ctx.fillStyle="black";
		val = eval(mean)+eval((i-4)*sd);
		txt = "" + val;
		ctx.fillText(txt, xorigin + i*unit - ctx.measureText(txt).width/2 , xorigin + h-30 );
		if(showz == true){
			ctx.fillStyle="black";
			txt = "" + i-4;
			ctx.fillText(txt, xorigin + i*unit - ctx.measureText(txt).width/2 , xorigin + h );
		}
	}	
	if(showcuml == false) drawPartialCurve(ctx, xvals, yvals, ax - xorigin, bx-xorigin, true, "#00006699");
	else{
		if(showFb) drawPartialCurve(ctx, xvals, yvals, 0, bx-xorigin, true,  "#00006699");
		if(showFa && showFb) drawPartialCurve(ctx, xvals, yvals, 0, ax-xorigin, true, "#006633");
		else if(showFa) drawPartialCurve(ctx, xvals, yvals, 0, ax-xorigin, true, "#00c205");
	}
	
	var axz = Math.round((ax-middle)/unit*100)/100; //zscore
	var bxz = Math.round((bx-middle)/unit*100)/100; //zscore
	
	var proba = Math.round((jStat.normal.cdf(axz, 0,1))*100)/100;	
	var probb = Math.round((jStat.normal.cdf(bxz, 0,1) )*100)/100;
	var probab = Math.round((probb-proba)*100)/100;
	
	var axval = Math.round((eval(axz*sd)+eval(mean))*100)/100; //context a
	var bxval = Math.round((eval(bxz*sd)+eval(mean))*100)/100;  //context b	
	
	if(!showcuml || showFa){
		drawTri(ctx, ax,"#0099cc", 2*base, base);
		txt = axval;
		ctx.fillText(txt, ax - ctx.measureText(txt).width/2, h+xorigin-15);
		ctx.fillStyle="white";
		ctx.font = ".7em Arial";
		txt="a";
		ctx.fillText(txt, ax - ctx.measureText(txt).width/2, h+xorigin-33);
	}
	if(!showcuml || showFb){
		ctx.font="16px Arial";
		drawTri(ctx, bx,"#0099cc", 2*base,base);
		txt = bxval;
		ctx.fillText(txt, bx - ctx.measureText(txt).width/2, h+xorigin-15);	
		ctx.fillStyle="white";
		ctx.font = ".7em Arial";
		txt="b";
		ctx.fillText(txt, bx - ctx.measureText(txt).width/2, h+xorigin-33);
	}
	
	drawCurve(ctx,xvals,yvals,false); //Draw the Normal Curve	
	
	/****ADD PROB TEXT****/	
	var sd2=Math.pow(sd,2);
	txt = "X ~ N(" + mean + ", " + sd2 + ")";
	document.getElementById("label1").innerHTML = txt;
	
	document.getElementById("problabel1").style.visibility = "visible";
	document.getElementById("problabel2").style.visibility = "hidden";
	document.getElementById("stdnlabel").style.visibility = "hidden";		
			
	if(showcuml){
		if(showFa && showFb){
			txt = "P(" + axval + " <  X < " + bxval + ") = P(X < " + bxval + ") -  P(X < " + axval + ")";  
			document.getElementById("problabel1").innerHTML = txt;	
			txt = " = " + probb + " - " +proba + " = " + probab;
			document.getElementById("problabel2").innerHTML = txt;
			document.getElementById("problabel2").style.visibility = "visible";
		}
		else if(showFa){
			txt = "P(" +  "X < " + axval + ") " + " = " + proba; 
			document.getElementById("problabel1").innerHTML = txt;				
		}
		else if(showFb){
			txt = "P(" +  "X < " + bxval + ") " + " = " + probb; 
			document.getElementById("problabel1").innerHTML = txt;
		}
		else{
			document.getElementById("problabel1").style.visibility = "hidden";	
		}
	}
	else{
		txt = "P(" + axval + " <  X < " + bxval + ") = " + probab;
		document.getElementById("problabel1").innerHTML = txt;			
	}
	
	
	if(showz){
		txt = "P(" + axz + " <  Z < " + bxz + ") = " + probab;
		document.getElementById("stdnlabel").style.visibility = "visible";
		document.getElementById("stdnlabel").innerHTML = txt;
	}
	
	
}

function drawTri(context, m, color, l, w){
	var ht = h + xorigin - 50 ;
	context.beginPath();
	context.moveTo(m, ht);
	context.lineTo(m+w, ht+l);
	context.lineTo(m-w, ht+l);
	context.lineTo(m, ht);
	context.closePath();
	context.fillStyle = color;
	context.fill();
}
function showZ(){
	if(showz) showz = false;
	else showz = true;
	paint();
}

function showCuml(){
	if(showcuml){
		showcuml = false;
		cbvisibility("hidden");
	}
	else{
		showcuml = true;
		cbvisibility("visible");
	}
	paint();
}

function cbvisibility(state){
		document.getElementById("myshowa").style.visibility = state;
		document.getElementById("myshowb").style.visibility = state;
		document.getElementById("labela").style.visibility = state;
		document.getElementById("labelb").style.visibility = state;
}

function showA(){
	if(showFa) showFa = false;
	else showFa = true;
	paint();
}
function showB(){
	if(showFb) showFb = false;
	else showFb = true;
	paint();
}

function setMean() {
  var x = document.getElementById("myMean").value;
  mean = x;
  paint();
}
function setSD() {
  var x = document.getElementById("mySD").value;
  if(x > 0){ 
	sd = x;
	document.getElementById("label1").innerHTML = "";
  }
  else document.getElementById("label1").innerHTML = "The sd must be > 0.";
  paint();
}

function drawPartialCurve(context, xvals, yvals, startx, endx, fill, col){	
	context.beginPath();
	context.moveTo(xorigin + xvals[startx], baseline);
	context.lineTo(xorigin + xvals[startx],xorigin + h - 50 -yvals[startx]/yvals[middle]*350);
	for(var i = startx; i < endx; i++){
		context.lineTo(xorigin + xvals[i],xorigin + h-50-yvals[i]/yvals[middle]*350);
	}
	context.lineTo(xorigin + xvals[endx], baseline);
	context.moveTo(xorigin + xvals[endx], baseline);
	context.closePath();
	context.fillStyle=col;
	if(fill == true) context.fill();
	else context.stroke();
}

function drawCurve(context, xvals, yvals, fill){
	context.beginPath();
	context.moveTo(xorigin + xvals[0],xorigin + h - 50 -yvals[0]/yvals[middle]*350);
	for(var i = 1; i < w; i++){
		context.lineTo(xorigin + xvals[i],xorigin + h-50-yvals[i]/yvals[middle]*350);
	}
	context.closePath();
	if(fill == true) context.fill();
	else context.stroke();
}

function mouse_down(e){
	var rect = can.getBoundingClientRect();
	var x = e.clientX - rect.left;
	var y = e.clientY - rect.top;	
	
	
	if (x < ax + base  && x > ax - base  && y < baseline + 2*base &&  y > baseline - base ){
		dragok = true;
		dragp=0;
	}
	else if (x < bx + base  && x > bx - base  && y < baseline + 2*base &&  y > baseline - base){
		dragok = true;
		dragp=1;
	}
	else dragok=false;
	
	can.onmousemove = mouse_move;
}

function mouse_up(){
	dragok = false;	
	canvas.onmousemove = null;
}

function mouse_move(e){	
	var rect = can.getBoundingClientRect();
	var x = e.clientX - rect.left;
	var y = e.clientY - rect.top;	

		//document.getElementById("testlabel").innerHTML="mouse move, dragok: " + dragok + ", dragp: " + dragp;
	if (dragok && dragp == 0 && x < bx) ax = x;
	else if (dragok && dragp == 1 && x > ax) bx = x;
		
	paint();
}

function drawLine(context, x1, y1, x2, y2){
	context.beginPath();
	context.moveTo(x1, y1);
	context.lineTo(x2, y2);
	context.closePath();
	context.stroke();
}

function drawpoint(context,x,y,color,r){
		context.fillStyle = color;	
		context.beginPath();
		context.arc(x, y, r, 0, 2*Math.PI);
		context.closePath();
		context.fill();
}