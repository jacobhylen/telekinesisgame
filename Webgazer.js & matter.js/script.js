window.saveDataAcrossSessions = false;

let eyeX  = 0;
let eyeY = 0;

window.onload = async function() {

    if (!window.saveDataAcrossSessions) {
        var localstorageDataLabel = 'webgazerGlobalData';
        localforage.setItem(localstorageDataLabel, null);
        var localstorageSettingsLabel = 'webgazerGlobalSettings';
        localforage.setItem(localstorageSettingsLabel, null);
    }
    const webgazerInstance = await webgazer.setRegression('ridge') /* currently must set regression and tracker */
      .setTracker('TFFacemesh')
      .begin();
    webgazerInstance.showVideoPreview(true) /* shows all video previews */
      .showPredictionPoints(false) /* shows a square every 100 milliseconds where current prediction is */
      .applyKalmanFilter(true); // Kalman Filter defaults to on.
      // Add the SVG component on the top of everything.
    executeGame();
    webgazer.setGazeListener( collisionEyeListener );
  };

  window.onbeforeunload = function() {
    if (window.saveDataAcrossSessions) {
        webgazer.end();
    } else {
        localforage.clear();
    }
  }

  function executeGame(){

  }

  var webgazerCanvas = null;

  var previewWidth = webgazer.params.videoViewerWidth;

  var collisionEyeListener = async function(data, clock) {
    if(!data)
      return;

    if (!webgazerCanvas) {
      webgazerCanvas = webgazer.getVideoElementCanvas();
    }

    await webgazer.getTracker().getEyePatches(webgazerCanvas, webgazerCanvas.width, webgazerCanvas.height);
    var fmPositions = await webgazer.getTracker().getPositions();

    var whr = webgazer.getVideoPreviewToCameraResolutionRatio();

      var line = d3.select('#eyeline1')
              .attr("x1",data.x)
              .attr("y1",data.y)
              .attr("x2",previewWidth - fmPositions[145][0] * whr[0])
              .attr("y2",fmPositions[145][1] * whr[1]);

      var line = d3.select("#eyeline2")
              .attr("x1",data.x)
              .attr("y1",data.y)
              .attr("x2",previewWidth - fmPositions[374][0] * whr[0])
              .attr("y2",fmPositions[374][1] * whr[1]);

    var dot = d3.select("#predictionSquare")
              .attr("x",data.x)
              .attr("y",data.y);

             eyeX = data.x;
             eyeY= data.y;
  }