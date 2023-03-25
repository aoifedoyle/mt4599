/*
This is the start of the code for the correlation game. 
There are a few issues with the code that I need to work through. 
The first is that the data is not being plotted correctly. 
The second is the issues with the checkGuess function.
There are also issues with the getValues function.
*/

let lives = 3;
let score = 0;
let x, y, plot;

function generatePlot() {
    const trace = {
      x: x,
      y: y,
      mode: 'markers',
      type: 'scatter'
    };
    const layout = {
      title: 'Scatter Plot',
      xaxis: {title: 'x'},
      yaxis: {title: 'y'},
      margin: {t: 40}
    };
    Plotly.newPlot('plot', [trace], layout);
  }

  function checkGuess() {
    const guess = parseFloat(document.getElementById('guess').value);
    if (isNaN(guess)) {
      document.getElementById('output').innerHTML = 'Input must be a number!';
    } else if (guess < -1 || guess > 1) {
      document.getElementById('output').innerHTML = 'Input must be between -1 and 1!';
    } else {
      const corr = Math.round(jStat.corrcoeff(x, y), 2);
      const diff = Math.abs(corr - guess);
      if (diff <= 0.05) {
        score += 1;
        document.getElementById('output').innerHTML = `Correct! The correlation is ${corr}.`;
        document.getElementById('score').innerHTML = `Score: ${score}`;
        generatePlot();
      } else {
        lives -= 1;
        document.getElementById('output').innerHTML = `Incorrect! The correlation is ${corr}.`;
        document.getElementById('score').innerHTML = `Lives: ${lives} Score: ${score}`;
        if (lives === 0) {
          document.getElementById('output').innerHTML += ' Game over!';
          document.getElementById('guess').setAttribute('disabled', true);
        }
      }
    }
  }
  
  function getValues() {
    x = document.getElementById('x-values').value.split(',').map(parseFloat);
    y = document.getElementById('y-values').value.split(',').map(parseFloat);
    generatePlot();
  }

    document.getElementById('guess').addEventListener('keyup', function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById('submit').click();
        }
        }
    );
