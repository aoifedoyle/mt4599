// global variables
var inputX = null;				
var inputY = null;				
var inputSize = 2;				
var numObs = 0;
var mean = 50;
var stddev = 15;
var corrArray = new Array();	
var corrIndex = 0;	
var corrGuessArray = new Array();
var errorArray = new Array();
var sampleX = new Array();
var sampleY = new Array();
var varNames = ["x", "y"];
var dataSets = [
	{
		x: [24, 23, 10, 36, 48, 33, 27],
		y: [72, 65, 48, 82, 95, 60, 90]
	}, 
	{
		x: [6, 7, 5, 8, 9, 6, 7], 
		y: [4, 6, 8, 2, 4, 5, 1]
	}, 
	{
		x: [69.3, 87.7, 50.5, 51.9, 82.7, 70.5, 72.4, 91.7, 86.6, 79.4], 
		y: [56, 89, 55, 72, 61, 66, 90, 93, 18, 84]
	}
];
var currentDataSetIndex = 0;

var dataPlot = {
	canvasName: "dataPlot",			
	canvasWidth: 0, 				
	canvasHeight: 0, 				
	usableCanvasWidth: 0, 			
	usableCanvasHeight: 0, 			
	minX: 0, 					
	minY: 0, 					
	maxX: 0,	 				
	maxY: 0, 						
	chartToCanvasScaleX: 0, 	
	chartToCanvasScaleY: 0, 		
	topTitle: "Data",					
	xTitle: "x", 					
	yTitle: "y",				
	xTitleCanvasOffset: 30,			
	yTitleCanvasOffset: -30,		
	xLabelCount: 5,					
	xLabelFct: stdPlotXLabelFct,	
	yLabelCount: 5,					
	yLabelFct: stdPlotYLabelFct,	
	xLabelDecimals: 1,		
	xLabelCanvasOffset: 15,			
	yLabelCanvasOffset: -10,		
	xBorderWidth: 40,			
	yBorderWidth: 40,			
	y2BorderWidth: 20,		
	topBorderWidth: 20		
	};

// Shortcut for document.getElementById().
function doc$(id) {
  return document.getElementById(id);
}

// Initialize page.
function pageSetup() {
	doc$("appletTitle").innerHTML = "Guess the Correlation";
	document.onmousedown = onMouseDown;
	document.onmouseup = onMouseUp;
	// Setup plots
	plotSetup(dataPlot);
	resetPlot(dataPlot);
}

function onMouseDown(event) {
	chartXY = null;
	if (chartXY != null) {

}}

function onMouseUp(event) {
	document.onselectstart = null;
}

function plotSetup(plot) {
var canvas = doc$(plot.canvasName);  
var ctx = canvas.getContext("2d");  
ctx.font = "9pt verdana";
	// Set chart width and height, based on html canvas definition.
	plot.canvasWidth = canvas.width;
	plot.canvasHeight = canvas.height;
	// Set usable canvas width and height, leaving space for x border and y border.
	plot.usableCanvasWidth = plot.canvasWidth - plot.yBorderWidth - plot.y2BorderWidth;
	plot.usableCanvasHeight = plot.canvasHeight - plot.topBorderWidth - plot.xBorderWidth;

	setPlotScale(plot);
	drawAxes(plot, ctx);
	writeTopTitle(plot, ctx);
	writeXAxisTitle(plot, ctx);
	writeYAxisTitle(plot, ctx);
	writeXAxisLabels(plot, ctx);
	writeYAxisLabels(plot, ctx);
}

// Convert chart Y values (0 is at bottom) to canvas Y values (0 is at top).
function toCanvasY(plot, chartY) {
	return (plot.canvasHeight - (chartY-plot.minY) * plot.chartToCanvasScaleY - plot.xBorderWidth);
}
// Convert chart X values to canvas X values (add on y-axis border width).
function toCanvasX(plot, chartX) {
	return ((chartX-plot.minX) * plot.chartToCanvasScaleX + plot.yBorderWidth);
}

function setPlotMinMax(plot) {
	// Get min/max for this distribution.
	plot.minX = 0;
	plot.maxX = 100;
	plot.minY = 0;
	plot.maxY = 100;
}

function setPlotMinMax2(plot, x1, x2, y1, y2) {
	// Get min/max for this distribution.
	plot.minX = x1;
	plot.maxX = x2;
	plot.minY = y1;
	plot.maxY = y2;
}

function setPlotScale(plot) {
	// Set scaling factors, to go from chart to canvas.
	if (plot.maxX > plot.minX) {
		plot.chartToCanvasScaleX = plot.usableCanvasWidth / (plot.maxX - plot.minX);
	} else {
		plot.chartToCanvasScaleX = 1;
	}
	if (plot.maxY > plot.minY) {
		plot.chartToCanvasScaleY = plot.usableCanvasHeight / (plot.maxY - plot.minY);
	} else {
		plot.chartToCanvasScaleY = 1;
	}
}

function drawAxes(plot, ctx) {
	// Draw x-axis and y-axis
	ctx.strokeStyle = "black"; 
	ctx.beginPath();
	ctx.moveTo(toCanvasX(plot, plot.minX),toCanvasY(plot, plot.minY));
	ctx.lineTo(toCanvasX(plot, plot.maxX),toCanvasY(plot, plot.minY));
	ctx.stroke();
	ctx.moveTo(toCanvasX(plot, plot.minX),toCanvasY(plot, plot.minY));
	ctx.lineTo(toCanvasX(plot, plot.minX),toCanvasY(plot, plot.maxY));
	ctx.stroke();
	ctx.closePath();
}

function writeXAxisTitle(plot, ctx) {
	// Add x-axis title
	ctx.fillStyle = "black";
	ctx.textAlign = "center";
	ctx.fillText(plot.xTitle, toCanvasX(plot, plot.minX + (plot.maxX-plot.minX)/2.0),toCanvasY(plot, plot.minY) + plot.xTitleCanvasOffset);
}

function writeYAxisTitle(plot, ctx) {
	if (plot.yTitle == null) {
		// No y title.
		return;
	}
	// Add y-axis title 
	ctx.fillStyle = "black";
	ctx.save();
	ctx.translate(toCanvasX(plot, plot.minX) + plot.yTitleCanvasOffset,toCanvasY(plot, plot.minY + (plot.maxY-plot.minY)/2.0));
	ctx.rotate(-Math.PI/2);
	ctx.textAlign = "center";
	ctx.fillText(plot.yTitle, 0, 0);
	ctx.restore();
}

function writeXAxisLabels(plot, ctx) {
var labelNum;
var betweenLabels;
var x;
	ctx.fillStyle = "black";
	ctx.textAlign = "center";
	// Get x-axis labels.
	betweenLabels = getBetweenLabels(plot.minX, plot.maxX, plot.xLabelCount);
	// Display more decimals if minX and maxX are very close together
	if ((plot.maxX - plot.minX) / plot.xLabelCount < 0.1 && plot.xLabelDecimals < 2) {
		plot.xLabelDecimals = 2;
	}
	if ((plot.maxX - plot.minX) / plot.xLabelCount < 0.01 && plot.xLabelDecimals < 3) {
		plot.xLabelDecimals = 3;
	}
	// Add x-axis labels.
	for (x=betweenLabels.firstLabel; x <= plot.maxX; x += betweenLabels.betweenLabels) {
		ctx.fillText(x.toFixed(plot.xLabelDecimals).replace(".000000000".substring(0,plot.xLabelDecimals+1),""), 
			toCanvasX(plot, x),toCanvasY(plot, plot.minY) + plot.xLabelCanvasOffset);
	}
}

function stdPlotXLabelFct(plot, labelNum, xBetweenLabels) {
	var x = plot.minX + labelNum * xBetweenLabels;
	var labelXText = x.toFixed(plot.xLabelDecimals).replace(".000000000".substring(0,plot.xLabelDecimals+1),"")	
	var canvasX = toCanvasX(plot, x);
	var canvasY = toCanvasY(plot, plot.minY) + plot.xLabelCanvasOffset;
	return {
		x: x,
		labelXText: labelXText,
		canvasX: canvasX,
		canvasY: canvasY
	}
}

function writeYAxisLabels(plot, ctx) {
var labelNum;
var yBetweenLabels;
var y;
var labelY;
var labelInfo;
var yLabelDecimals = 1;
	ctx.fillStyle = "black";
	ctx.save();
	// Translate so that origin is (toCanvasX(plot, plot.minX) + plot.yLabelCanvasOffset,toCanvasY(plot, plot.minY)).
	ctx.translate(toCanvasX(plot, plot.minX) + plot.yLabelCanvasOffset,toCanvasY(plot, plot.minY));
	// Rotate by -90 degrees.
	ctx.rotate(-Math.PI/2);
	ctx.textAlign = "center";
	// Get y-axis labels.
	yBetweenLabels = getBetweenLabels(plot.minY, plot.maxY, plot.yLabelCount);
	for (y=yBetweenLabels.firstLabel; y <= plot.maxY; y += yBetweenLabels.betweenLabels) {
		yInfo = plot.yLabelFct(plot, y, yLabelDecimals);
		// Now that we have rotated, specify y as the x, and 0 as the y.
		ctx.fillText(yInfo.yLabelText, yInfo.canvasY, 0);
	}
	// Restore original context
	ctx.restore();
}

function stdPlotYLabelFct(plot, y, yLabelDecimals) {
	var yLabelText = y.toFixed(yLabelDecimals).replace(".000000000".substring(0,yLabelDecimals+1),"");
	var canvasY = (y - plot.minY) * plot.chartToCanvasScaleY; 
	return {
		yLabelText: yLabelText,
		canvasY: canvasY
	}
}

function getBetweenLabels(min, max, labelCount) {
	// Compute exact y between labels.
	var betweenLabels = (max - min)/(labelCount-1);
	var logBetween = Math.log(betweenLabels) / Math.log(10);
	logBetween = Math.floor(logBetween);
	var Increment = Math.pow(10,logBetween);
	if (betweenLabels < Increment) {
		betweenLabels = Increment;
	} else {
		betweenLabels = Increment * Math.floor(betweenLabels / Increment);
	}
	var firstLabel = min;
	if (betweenLabels > 0) {
		firstLabel = Math.ceil(min / betweenLabels) * betweenLabels;
		// Double-check
		if (firstLabel > max) {
			firstLabel = min;
		}
	}
	return {
		betweenLabels: betweenLabels,
		firstLabel: firstLabel
	}
}

function writeUpperLeftText(plot, ctx, row, text) {
var XOffset = 5;
var YOffset = 10; 
var rowYSize = 15; 
	// Add text in upper left of plot
	ctx.fillStyle = "black";
	ctx.textAlign = "left";
	ctx.fillText(text, toCanvasX(plot, plot.minX) + XOffset,toCanvasY(plot, plot.maxY) + YOffset + row * rowYSize);
}

function writeUpperRightText(plot, ctx, row, text) {
var XOffset = 5; 
var YOffset = 10; 
var rowYSize = 15;
	// Add text in upper right of plot
	ctx.fillStyle = "black";
	ctx.textAlign = "right";
	ctx.fillText(text, toCanvasX(plot, plot.maxX) - XOffset,toCanvasY(plot, plot.maxY) + YOffset + row * rowYSize);
}

// Clear the demoPlot and redraw axes
function resetPlot(plot) {
var canvas = doc$(plot.canvasName);  
var ctx = canvas.getContext("2d");  
	// clear the entire canvas.
	 ctx.clearRect(0, 0, canvas.width, canvas.height);
	 // setup the plot
	setPlotMinMax(plot);
	setPlotScale(plot);
	drawAxes(plot, ctx);
	writeTopTitle(plot, ctx);
	writeXAxisTitle(plot, ctx);
	writeYAxisTitle(plot, ctx);
	writeXAxisLabels(plot, ctx);
	writeYAxisLabels(plot, ctx);
}

// Write top title (if any)
function writeTopTitle(plot, ctx) {
var YOffset = 10; 
	ctx.fillStyle = "black";
	ctx.textAlign = "center";
	ctx.fillText(plot.topTitle, 0.5 * (toCanvasX(plot, plot.minX) + toCanvasX(plot, plot.maxX)), YOffset);	
}

//Important function!
function addPoint(plot, xval, yval) {
var canvas = doc$(plot.canvasName);  
var ctx = canvas.getContext("2d");
	ctx.strokeStyle = "blue";
	ctx.lineWidth = 1;
	ctx.beginPath();
	ctx.arc(toCanvasX(plot, xval), toCanvasY(plot, yval), inputSize, 0, 2 * Math.PI, false);
	ctx.stroke();
	ctx.closePath();
}

// Process data specified in dataText.
function useData() {
	readData();
}

function displaySampleData() {	
	doc$("dataText").value = varNames[0] + "\t" + varNames[1] + "\n";	
	for (k=0; k < numObs; k++){	
			doc$("dataText").value += sampleX[k].toFixed(1) + "\t" + sampleY[k].toFixed(1) + "\n";
	}
	
}
// Read user-provided sample data into obsX and obsY;
function readData() {
	// Pre-defined x and y values 
	var sampleX = [24, 23, 10, 36, 48, 33, 27];
	var sampleY = [72, 65, 48, 82, 95, 60, 90];
	// Set the number of observations 
	numObs = sampleX.length;
	// Get the input string from a DOM element with ID "dataText" amd stores in 'dataText' variable
	var dataTextObj = doc$("dataText");
	var dataText = dataTextObj.value;
	// Split the input string into an array of rows (each row is a string) using newline characters as delimiters
	var dataRows = dataText.split(/\n+/);

	// initliase vairables for storing the number of observations, the x-axis values and the y-axis values 
	var sampleX, sampleY;
	numObs = 0;
	sampleX = new Array();
	sampleY = new Array();
	
	var startIndex = 0;
	
	varNames = dataRows[0].trim().split(/\s+/);
	if (isNaN(parseFloat(varNames[0]))) { 
		startIndex = 1;
		dataPlot.xTitle = varNames[0];
		dataPlot.yTitle = varNames[1];
		}
	
	var getNewCorr = calcCorr(sampleX, sampleY);
	corrArray[corrIndex] = getNewCorr.correlation;
	
	// clear the entire canvas.
	 ctx = dataPlot.getContext("2d")
	 ctx.clearRect(0, 0, dataPlot.width, dataPlot.height);
	
	setPlotMinMax2(dataPlot, Math.min.apply(null,sampleX), Math.max.apply(null,sampleX), Math.min.apply(null,sampleY), Math.max.apply(null,sampleY));
	setPlotScale(dataPlot);
	drawAxes(dataPlot, ctx);
	writeTopTitle(dataPlot, ctx);
	writeXAxisTitle(dataPlot, ctx);
	writeYAxisTitle(dataPlot, ctx);
	writeXAxisLabels(dataPlot, ctx);
	writeYAxisLabels(dataPlot, ctx);
		for (var i=0; i < numObs; i++) {
						addPoint(dataPlot, sampleX[i],sampleY[i]);

		}
}

function createSample(currentDataSetIndex) {
	//Clear existing data
	clearData();
	
	//Pre-defined values 
	var sampleX = dataSets[currentDataSetIndex].x;
	var sampleY = dataSets[currentDataSetIndex].y;

	//set number of observations 
	numObs = sampleX.length;

	//Calc and store the correlation
	corrIndex = corrIndex + 1;
	var getCorr = calcCorr(sampleX, sampleY);
	corrArray[corrIndex] = getCorr.correlation;

	//plot the predefined samples 
	for (var i =0; i < numObs; i++){
		addPoint(dataPlot, sampleX[i], sampleY[i]);
	}

	//Increment the data set index to use the next data set when the button is clicked again
	//currentDataSetIndex = (currentDataSetIndex + 1) % dataSets.length;
}

// Clear dataText
function clearData() {
	//Clear the data 
	sampleX = [];
	sampleY = [];

	//Reset number of observation
	numObs = 0;

	//Reset the plot
	resetPlot(dataPlot);

	//Clear the data text area
	doc$("dataText").value = "";
}


//generate the random bivariate observations and graph them
function drawSample(){
	ctx = dataPlot.getContext("2d")
	ctx.clearRect(0, 0, dataPlot.width, dataPlot.height);
	dataPlot.xTitle = "x";
	dataPlot.yTitle= "y";
	resetPlot(dataPlot);
	numObs=0;
	doc$("revealCorr").innerHTML = "&nbsp;";
	doc$("inputGuessCorr").value= 0;
	createSample();
	seeData();
}

function checkGuessSubmit(){
	checkGuess();
	return false;
}

function checkGuess(){
	corrGuessArray[corrIndex] = parseFloat(doc$("inputGuessCorr").value, 3);
	if (isNaN(corrGuessArray[corrIndex])) {
		showAlert("Please enter a numeric value");
		return;
	}
	doc$("revealCorr").style.display="";
	doc$("revealCorr").innerHTML = "<font color=#DB0000> <i>r</i> = " + corrArray[corrIndex].toFixed(3);
};

function calcCorr(x, y){
var sumX = 0;
var sumY = 0;
var sumXSq = 0;
var sumYSq = 0;
var sumXY = 0;
var sxy = 0;
var sxx = 0;
var SST = 0;
var correlation = 0;

	for (i=0; i< numObs; i++){
		sumX += x[i];
		sumY += y[i];
		sumXSq += Math.pow(x[i],2);
		sumYSq += Math.pow(y[i],2);
		sumXY += x[i] * y[i];
	}
	
if (numObs > 0) {
		avgY = sumY / numObs;
		avgX = sumX / numObs;
	}
	if (numObs> 0 && sumXSq > 0){
		sxy = sumXY - avgX*avgY*numObs;
		sxx = sumXSq - Math.pow(sumX,2)/numObs;
		SST = sumYSq-Math.pow(sumY,2)/numObs;
		correlation = sxy/Math.sqrt(sxx*SST);
	}
	return {
				correlation: correlation
	}
};
