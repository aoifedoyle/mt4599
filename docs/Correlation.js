// global variables
var inputX = null;				// Most recent valid input (a).
var inputY = null;				// Most recent valid input (b).
var inputSize = 2;				// Most recent valid input (n).
var numObs = 0;
var mean = 50;
var stddev = 15;
var corrArray = new Array();	// Array of correlation coefficients
var corrIndex = 0;	
var corrGuessArray = new Array();
var errorArray = new Array();
var sampleX = new Array();
var sampleY = new Array();
var varNames = ["x", "y"];

var dataPlot = {
	canvasName: "dataPlot",			// ID of canvas html element
	canvasWidth: 0, 				// Width of chart canvas (controlled by html canvas element). Set by pageSetup() so we can use it elsewhere.
	canvasHeight: 0, 				// Height of chart canvas (controlled by html canvas element). Set by pageSetup() so we can use it elsewhere.
	usableCanvasWidth: 0, 			// Usable width of chart canvas, after leaving space for axes. Set by pageSetup().
	usableCanvasHeight: 0, 			// Usable width of chart canvas, after leaving space for axes. Set by pageSetup().
	minX: 0, 						// Minimum chart X value. 
	minY: 0, 						// Minimum chart Y value. 
	maxX: 0,	 					// Maximum chart X value. 
	maxY: 0, 						// Maximum chart Y value. 
	chartToCanvasScaleX: 0, 		// Scaling factor = usableCanvasWidth / (maxX - minX).
	chartToCanvasScaleY: 0, 		// Scaling factor = usableCanvasHeight / (maxY - minY).
	topTitle: "Data",					// Title at top of chart.
	xTitle: "x", 					// The x-axis Title.
	yTitle: "y",					// The y-axis Title.
	xTitleCanvasOffset: 30,			// Canvas offset of x-axis title relative to x-axis.
	yTitleCanvasOffset: -30,		// Canvas offset of y-axis title relative to y-axis.
	xLabelCount: 5,					// Desired number of x-axis labels.
	xLabelFct: stdPlotXLabelFct,	// The function called to get X-label info.
	yLabelCount: 5,					// Desired number of y-axis labels.
	yLabelFct: stdPlotYLabelFct,	// The function called to get Y-label info.
	xLabelDecimals: 1,				// Desired number of x-axis label decimals (e.g. 1 for 1.x, 2.x, 3.x)
	xLabelCanvasOffset: 15,			// Canvas offset of x-axis labels relative to x-axis.
	yLabelCanvasOffset: -10,		// Canvas offset of y-axis labels relative to y-axis.
	xBorderWidth: 40,				// The size (pixels) between bottom edge of canvas and x-axis.
	yBorderWidth: 40,				// The size (pixels) between left edge of canvas and y-axis.
	y2BorderWidth: 20,				// The size (pixels) between right edge of canvas and right-most point of x-axis.
	topBorderWidth: 20				// The size (pixels) between top edge of canvas and top of y-axis.
	};

var minDistanceForSelect = 75;	// Minimum (squared) distance to select a point when user tries to click on it. 
var showNotes = false;
var t_notesButton = ["User notes", "Notas"];

// Shortcut for much-used document.getElementById().
function bc$(id) {
  return document.getElementById(id);
}

// Initialize page.
function pageSetup() {
	bc$("appletTitle").innerHTML = "Guess the Correlation";
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
var canvas = bc$(plot.canvasName);  
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
function plotSetupY1Y2(plot, y1, y2) {
var canvas = bc$(plot.canvasName);  
var ctx = canvas.getContext("2d");  

	// Set chart width and height, based on html canvas definition.
	plot.canvasWidth = canvas.width;
	plot.canvasHeight = canvas.height;
	// Set usable canvas width and height, leaving space for x border and y border.
	plot.usableCanvasWidth = plot.canvasWidth - plot.yBorderWidth - plot.y2BorderWidth;
	plot.usableCanvasHeight = plot.canvasHeight - plot.topBorderWidth - plot.xBorderWidth;

//added these here from resetplot	
	setPlotMinMax2(plot, -1, 1, y1, y2);
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

// Convert canvas Y values (0 is at top) to chart Y values.
function toChartY(plot, canvasY) {
	if (plot.chartToCanvasScaleY > 0) {
		return ((plot.canvasHeight - canvasY - plot.xBorderWidth) / plot.chartToCanvasScaleY + plot.minY);
	} else {
		return null;
	}
}

// Convert chart X values to canvas X values (add on y-axis border width).
function toCanvasX(plot, chartX) {
	return ((chartX-plot.minX) * plot.chartToCanvasScaleX + plot.yBorderWidth);
}

// Convert canvas X values to chart X values.
function toChartX(plot, canvasX) {
	if (plot.chartToCanvasScaleX > 0) {
		return ((canvasX - plot.yBorderWidth) / plot.chartToCanvasScaleX + plot.minX);
	} else {
		return null;
	}
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
	// stroke does the work of drawing the line, without this the user will not be able to see it.
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
	// Add y-axis title -- more complex because the text is rotated.
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
	// Save context and then translate and rotate, so we can draw rotate numbers.
	ctx.save();
	// Translate so that origin is (toCanvasX(plot, plot.minX) + plot.yLabelCanvasOffset,toCanvasY(plot, plot.minY)).
	ctx.translate(toCanvasX(plot, plot.minX) + plot.yLabelCanvasOffset,toCanvasY(plot, plot.minY));
	// Rotate by -90 degrees.
	ctx.rotate(-Math.PI/2);
	ctx.textAlign = "center";
	// Get y-axis labels.
	yBetweenLabels = getBetweenLabels(plot.minY, plot.maxY, plot.yLabelCount);

	for (y=yBetweenLabels.firstLabel; y <= plot.maxY; y += yBetweenLabels.betweenLabels) {
		// IMPORTANT: After translation and rotation, the (0,0) point is at the left edge of the bottom y-axis label.
		// Increasing x values point skyward because the canvas is rotated -90 degrees.
		// So it's important not to use toCanvasY values to get the x value for fillText of y axis labels,
		// because toCanvasY for the bottom-most y-axis label is a *large* number, because toCanvasY is setup for (0,0) in the upper left corner!
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
	// To produce nice-looking numbers, e.g. 10, 20, 30 rather than 9.8, 18.6, etc:
	// Compute log-base-10 of betweenLabels
	var logBetween = Math.log(betweenLabels) / Math.log(10);
	// Round down to closest integer. 
	logBetween = Math.floor(logBetween);
	// If we take 10 to the resulting power, this gives us a nice increment.
	var niceIncrement = Math.pow(10,logBetween);
	// Make betweenLabels a multiple of niceIncrement
	if (betweenLabels < niceIncrement) {
		// Force up to niceIncrement
		betweenLabels = niceIncrement;
	} else {
		// Force down to a multiple of niceIncrement.
		betweenLabels = niceIncrement * Math.floor(betweenLabels / niceIncrement);
	}
	// Now we have a nice looking interval between labels.
	// If possible, set firstLabel to be first integer multiple of this interval, to right of min.
	// Default to min, and then see if we can do better.
	var firstLabel = min;
	if (betweenLabels > 0) {
		// min / betweenLabels gives us min as a multiple of betweenLabels
		// Math.ceil(min / betweenLabels) gives us next higher integer multiple of betweenLabels
		// Math.ceil(min / betweenLabels) * betweenLabels gives us the spot for our first label
		firstLabel = Math.ceil(min / betweenLabels) * betweenLabels;
		// Double-check
		if (firstLabel > max) {
			// Something is wrong, just use min for first label.
			firstLabel = min;
		}
	}
	return {
		betweenLabels: betweenLabels,
		firstLabel: firstLabel
	}
}

function writeUpperLeftText(plot, ctx, row, text) {
var prettyXOffset = 5; // Shift text to right a bit to keep it off y-axis.
var prettyYOffset = 10; // Shift text down a bit to make it look nice.
var rowYSize = 15; // Decent-looking size of row of text.
	// Add text in upper left of plot
	ctx.fillStyle = "black";
	ctx.textAlign = "left";
	ctx.fillText(text, toCanvasX(plot, plot.minX) + prettyXOffset,toCanvasY(plot, plot.maxY) + prettyYOffset + row * rowYSize);
}

function writeUpperRightText(plot, ctx, row, text) {
var prettyXOffset = 5; // Shift text to left a bit to keep it off right side
var prettyYOffset = 10; // Shift text down a bit to make it look nice.
var rowYSize = 15; // Decent-looking size of row of text.
	// Add text in upper right of plot
	ctx.fillStyle = "black";
	ctx.textAlign = "right";
	ctx.fillText(text, toCanvasX(plot, plot.maxX) - prettyXOffset,toCanvasY(plot, plot.maxY) + prettyYOffset + row * rowYSize);
}

// Clear the demoPlot and redraw axes
function resetPlot(plot) {
var canvas = bc$(plot.canvasName);  
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
var prettyYOffset = 10; // Shift text down a bit to get it fully onto canvas.

	ctx.fillStyle = "black";
	ctx.textAlign = "center";
	ctx.fillText(plot.topTitle, 0.5 * (toCanvasX(plot, plot.minX) + toCanvasX(plot, plot.maxX)), prettyYOffset);	
}

function addPoint(plot, xval, yval) {
var canvas = bc$(plot.canvasName);  
var ctx = canvas.getContext("2d");
	ctx.strokeStyle = "blue";
	ctx.lineWidth = 1;
	ctx.beginPath();
	ctx.arc(toCanvasX(plot, xval), toCanvasY(plot, yval), inputSize, 0, 2 * Math.PI, false);
	ctx.stroke();
	ctx.closePath();
}

// Pull inputs into global variables, validate.
// Return true if ok, false otherwise.
function getInputs() {
var x = 10;
var y = 10;
	// All inputs look ok, assign to global vars
	inputX = x;
	inputY = y;
seeData();
	return true;
}

function seeData() {
	if (bc$("pasteData").checked) {
		bc$("dataText").style.display="";
		bc$("useDataBoxes").style.display="";
//		readData();
		clearData();
		displaySampleData();
	} else {
		bc$("dataText").style.display="none";
		bc$("useDataBoxes").style.display="none";
		// Wipe out any existing sample data and statistics.
		//initSampleData();
	}
}

// Process data specified in dataText.
function useData() {
	readData();
}

function displaySampleData() {	
	bc$("dataText").value = varNames[0] + "\t" + varNames[1] + "\n";	
	for (k=0; k < numObs; k++){	
			bc$("dataText").value += sampleX[k].toFixed(1) + "\t" + sampleY[k].toFixed(1) + "\n";
	}
	
}
// Read user-provided sample data into obsX and obsY;
// Returns true if data looks ok, false otherwise.
function readData() {
	// Get the input string
	var dataTextObj = bc$("dataText");
	var dataText = dataTextObj.value;
	// Split by newlines into rows
	var dataRows = dataText.split(/\n+/);

	// Read in the data, store in obsX and obsY.
	var sampleX, sampleY;
	// Init.
	numObs = 0;
	sampleX = new Array();
	sampleY = new Array();
	
	var startIndex = 0;
	
	varNames = dataRows[0].trim().split(/\s+/);
	if (isNaN(parseFloat(varNames[0]))) { //have variable names
		startIndex = 1;
		dataPlot.xTitle = varNames[0];
		dataPlot.yTitle = varNames[1];
		}
	
	
	for (var i=startIndex; i < dataRows.length; i++) {
		// Split row by whitespace (tabs, spaces, etc).
		if (dataRows[i].trim().length > 0) {
			var dataWords = dataRows[i].trim().split(/\s+/);
			if (dataWords.length > 0) {
				sampleX[numObs] = null;
				sampleY[numObs] = null;
				if (dataWords[0].length > 0) {
					sampleX[numObs] = parseFloat(dataWords[0]);
				}
				if (dataWords.length > 1 && dataWords[1].length > 0) {
					sampleY[numObs] = parseFloat(dataWords[1]);
				}	
				numObs++;
			}
		}
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

// General normal random variate
function genNormal(mean, stdDev) {
	if (mean == undefined) mean = 0.0;
	if (stdDev == undefined) stdDev = 1.0;
	// Generate using polar method (rejection).
	var V1, V2, S;
	do {
		var U1 = Math.random();
		var U2 = Math.random();
		V1 = 2 * U1 - 1;
		V2 = 2 * U2 - 1;
		S = V1 * V1 + V2 * V2;
	} while (S > 1);
	X = Math.sqrt(-2 * Math.log(S) / S) * V1;
	X = mean + stdDev * X;
	// We are actually generating two random variates but throwing second one away - if this is too slow
	// we should figure out how to use both.
	// Y = Math.sqrt(-2 * Math.log(S) / S) * V2;
	// Y = mean + stdDev * Y ;
	return X;
}

function createSample() {
		var xi=0,yi=0;
		var rho=0;
		var meany=0,stddevy=0;
		var numberOfPoints = parseInt(bc$("inputNumPoints").value, 10);
		clearData();
		
		rho = Math.random()*2.0-1.0;
		for (i=0; i < numberOfPoints; i++) {
			xi = genNormal()*stddev + mean;
			meany = mean + rho * (xi-mean);
			stddevy = stddev * Math.sqrt(1-rho*rho);
			yi = genNormal()*stddevy + meany;
			addPoint(dataPlot, xi,yi);
			sampleX[i] = xi;
			sampleY[i] = yi;
		}
		corrIndex = corrIndex + 1;
		numObs = numberOfPoints;
		var getCorr = calcCorr(sampleX, sampleY);
		corrArray[corrIndex] = getCorr.correlation;
			}

// Clear dataText
function clearData() {
	var dataTextObj = bc$("dataText");
	dataTextObj.value = "";
}

//generate the random bivariate observations and graph them
function drawSample(){
		dataPlot.xTitle = "x";
		dataPlot.yTitle= "y";
		resetPlot(dataPlot);
		sampleX = new Array();
		sampleY = new Array();
		numObs=0;
		bc$("revealCorr").innerHTML = "&nbsp;";
		bc$("inputGuessCorr").value= 0;
		createSample();
		seeData();
}

function addLine(plot, x1, y1, x2, y2){
var canvas = bc$(plot.canvasName);  
var ctx = canvas.getContext("2d");

	ctx.strokeStyle = "grey";
	ctx.lineWidth = 1;
	ctx.beginPath();
	ctx.moveTo(toCanvasX(plot, x1),toCanvasY(plot, y1));
	ctx.lineTo(toCanvasX(plot, x2),toCanvasY(plot, y2));
	ctx.stroke();
	ctx.closePath();
}

function checkGuessSubmit(){
	checkGuess();
	// We *must* return false, otherwise hitting enter in the form reloads the page!
	return false;
}
function checkGuess(){
	corrGuessArray[corrIndex] = parseFloat(bc$("inputGuessCorr").value, 3);
	if (isNaN(corrGuessArray[corrIndex])) {
		showAlert("Please enter a numeric value");
		return;
	}
	bc$("revealCorr").style.display="";
	bc$("revealCorr").innerHTML = "<font color=#DB0000> <i>r</i> = " + corrArray[corrIndex].toFixed(3);
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

function calcCorrActualGuess(){
var sumX = 0;
var sumY = 0;
var sumXSq = 0;
var sumYSq = 0;
var sumXY = 0;
var sxy = 0;
var sxx = 0;
var SST = 0;
var correlation = 0;

for(i=1; i<= corrIndex; i++) {
		sumX += corrArray[i];
		sumY += corrGuessArray[i];
		sumXSq += Math.pow(corrArray[i],2);
		sumYSq += Math.pow(corrGuessArray[i],2);
		sumXY += corrArray[i] * corrGuessArray[i];
	}
	if (corrIndex > 0) {
		avgY = sumY / corrIndex;
		avgX = sumX / corrIndex;
	}
	if (corrIndex> 0 && sumXSq > 0){
		sxy = sumXY - avgX*avgY*corrIndex;
		sxx = sumXSq - Math.pow(sumX,2)/corrIndex;
		SST = sumYSq-Math.pow(sumY,2)/corrIndex;
		correlation = sxy/Math.sqrt(sxx*SST);
	}
	return {
				correlation: correlation
	}
};

// Redraw all outputs.
function reset() {
	if (!getInputs()) {
		return;
	}
}

// Load data into the applet for each question. 
// Instead of using random have a set of data for each question.
