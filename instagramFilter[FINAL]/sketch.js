
var imgIn;

var currentFilter;

var filtername;

var matrix = [
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64]
];



var matrixX = [    
    [-1, -2, -1],
    [0, 0, 0],
    [1, 2, 1]
];
var matrixY = [
    [-1, 0, 1],
    [-2, 0, 2],
    [-1, 0, 1]
];



/////////////////////////////////////////////////////////////////
function preload() {
    
    imgIn = loadImage("assets/husky.jpg");
}
/////////////////////////////////////////////////////////////////
function setup() {
    
    createCanvas((imgIn.width * 2), imgIn.height);
    
   
    currentFilter = earlyBirdFilter;
    
    filtername = "Early Bird Filter"
}
/////////////////////////////////////////////////////////////////
function draw() {
    
    background(125);
    
    image(imgIn, 0, 0);
    
    
    imgFilter(currentFilter(imgIn));
    
    textSize(25);
    
    fill(255,0,0);
    text('Press buttons 1 or 2 or 3 or 4 to view different filter colours', 10, 40);
    
    text('Current Filter is : ' + filtername, 950, 40);
    
    noLoop();
}
/////////////////////////////////////////////////////////////////
function mousePressed() {
    
  loop();
}
/////////////////////////////////////////////////////////////////
function keyPressed() {
    
  if(key == 1) {
   
    currentFilter = earlyBirdFilter;
    filtername = "Early Bird Filter";
    loop();
  }
    
  if(key == 2) {
    
    currentFilter = pinkImgFilter;
    filtername = "Pink Colour Filter";
    loop();
  }
    
  if(key == 3) {
   
    currentFilter = greenImgFilter;
    filtername = "Green Colour Filter";
    loop();
  }
    
  if(key == 4) {
      currentFilter = edgeFilter;
      filtername = "Black Colour Filter";
      loop();
  }

}
/////////////////////////////////////////////////////////////////
function earlyBirdFilter(img) {
    
  var resultImg = createImage(imgIn.width, imgIn.height);
    
  resultImg = sepiaFilter(imgIn, resultImg);
    
  resultImg = darkCorners(resultImg);
    
  resultImg = radialBlurFilter(resultImg);
    
  resultImg = borderFilter(resultImg);
    
  return resultImg;
}


function edgeFilter(img) {

  var resultImg = createImage(imgIn.width, imgIn.height);
 
  resultImg = edgeDetectionFilter(imgIn, resultImg);
    

  resultImg = darkCorners(resultImg);
    
  resultImg = radialBlurFilter(resultImg);
    
  resultImg = borderFilter(resultImg);
    
  return resultImg;
}





function pinkImgFilter(img) {

  var resultImg = createImage(imgIn.width, imgIn.height);
 
  resultImg = pink_Filter(imgIn, resultImg);
    

  resultImg = darkCorners(resultImg);
    
  resultImg = radialBlurFilter(resultImg);
    
  resultImg = borderFilter(resultImg);
    
  return resultImg;
}


    
function greenImgFilter(img) {

  var resultImg = createImage(imgIn.width, imgIn.height);
 
  resultImg = green_Filter(imgIn, resultImg);
    
  resultImg = darkCorners(resultImg);
    
  resultImg = radialBlurFilter(resultImg);
    
  resultImg = borderFilter(resultImg);
    
  return resultImg;
}

// Step 4: Adding Borders 

function borderFilter(imgIn) {
  
    
  var buffer = createGraphics(imgIn.width, imgIn.height);
    
  buffer.image(imgIn, 0, 0);
    
    // Drawing rectangle with corners
  buffer.noFill();
    
  buffer.stroke(255);
    
  buffer.strokeWeight(30);
    
  buffer.rect(0, 0, imgIn.width, imgIn.height, 40);
    
    
  // Drawing rectangle
  buffer.noFill();
    
  buffer.stroke(255);
    
  buffer.strokeWeight(30);
    
  buffer.rect(0, 0, imgIn.width, imgIn.height);

 return buffer;
    

}

function imgFilter(filter) {
    
  image(filter,imgIn.width,0)
}

// Step 3: Radial Blur
function radialBlurFilter(imgIn){
    
  imgIn.loadPixels();

  for(var x = 0; x<imgIn.width; x++) {
      
    for(var y = 0; y<imgIn.height; y++) {
        
      var pixelIndex = ((imgIn.width * y)+x)*4;
        
      var oldRed = imgIn.pixels[pixelIndex+0];
        
      var oldGreen = imgIn.pixels[pixelIndex+1];
        
      var oldBlue = imgIn.pixels[pixelIndex+2];

      var c = convolution(x, y, matrix, matrix.length, imgIn);

      var mouseDist = abs(dist(x, y, mouseX, mouseY));
        
      var dynBlur = map(mouseDist, 100, 300, 0, 1);
        
      dynBlur = constrain(dynBlur, 0, 1);

      var newRed = c[0]*dynBlur + oldRed*(1-dynBlur);
        
      var newGreen  = c[1]*dynBlur + oldGreen*(1-dynBlur);
        
      var newBlue = c[2]*dynBlur + oldBlue*(1-dynBlur);
        
        

      imgIn.pixels[pixelIndex+0] = newRed;
        
      imgIn.pixels[pixelIndex+1] = newGreen;
        
      imgIn.pixels[pixelIndex+2] = newBlue;
    }
      
  }

  imgIn.updatePixels();
    
  return imgIn;
}

function convolution(x, y, matrix, matrixSize, img) {
    
  var totalRed = 0.0;
    
  var totalGreen = 0.0; 
    
  var totalBlue = 0.0;
  
  var offset = floor(matrixSize / 2);

  
  for(var i = 0; i<matrixSize; i++) {
      
    for(var j = 0; j<matrixSize; j++) {
        
      
      var xloc = x + i - offset;
        
      var yloc = y + j - offset;
        
      var index = (xloc + img.width*yloc)*4;
      
      index = constrain(index, 0, img.pixels.length-1);

      
      totalRed += img.pixels[index + 0] * matrix[i][j];
        
      totalGreen += img.pixels[index + 1] * matrix[i][j];
        
      totalBlue += img.pixels[index + 2] * matrix[i][j];
        
    }
  }
    
  return[totalRed, totalGreen, totalBlue];
}

// Step 2: Dark Corners

function darkCorners(imgIn) {
    
  imgIn.loadPixels();

  var midX = imgIn.width/2;
    
  var midY = imgIn.height/2;
    
  var maxDist = abs(dist(midX, midY, 0, 0));
    
  var dynLum = 1;

  for(var x = 0; x<imgIn.width; x++) {
      
    for(var y = 0; y<imgIn.height; y++) {
        
      var d = abs(dist(midX, midY, x, y));
        
      if(d > 300) {
          
        var pixelIndex = ((imgIn.width * y) + x) * 4;
          
        var oldRed = imgIn.pixels[pixelIndex+0];
          
        var oldGreen = imgIn.pixels[pixelIndex+1];
          
        var oldBlue = imgIn.pixels[pixelIndex+2];

        if(d <= 450) {
            
          dynLum = map(d, 300, 450, 1, 0.4);
            
        } else {
            
          dynLum = map(d, 450, maxDist, 0.4, 0);
        }

        dynLum = constrain(dynLum, 0, 1);
          
        imgIn.pixels[pixelIndex+0] = oldRed * dynLum;
          
        imgIn.pixels[pixelIndex+1] = oldGreen * dynLum;
          
        imgIn.pixels[pixelIndex+2] = oldBlue * dynLum;
          
      }
        
    }
      
  }

  imgIn.updatePixels();
    
  return imgIn;

}

// Step 1: Sepia Filter

function sepiaFilter(imgIn,resultImg) {

  imgIn.loadPixels();
    
  resultImg.loadPixels();

  for(var x = 0; x<imgIn.width; x++) {
      
    for(var y = 0; y<imgIn.height; y++) {
        
      var pixelIndex = ((imgIn.width * y)+x)*4;
        
      var oldRed = imgIn.pixels[pixelIndex+0];
        
      var oldGreen = imgIn.pixels[pixelIndex+1];
        
      var oldBlue = imgIn.pixels[pixelIndex+2];
        

      var newRed = (oldRed * .393) + (oldGreen *.769) + (oldBlue * .189);
        
      var newGreen = (oldRed * .349) + (oldGreen *.686) + (oldBlue * .168);
        
      var newBlue = (oldRed * .272) + (oldGreen *.534) + (oldBlue * .131);

      
      newRed = constrain(newRed, 0, 255);
        
      newGreen = constrain(newGreen, 0, 255);
        
      newBlue = constrain(newBlue, 0, 255);
        

      resultImg.pixels[pixelIndex+0] = newRed;
        
      resultImg.pixels[pixelIndex+1] = newGreen;
        
      resultImg.pixels[pixelIndex+2] = newBlue;
        
      resultImg.pixels[pixelIndex+3] = 255;

    }
  }

  resultImg.updatePixels();
    
  return resultImg;
    
}






// Implementation of further ideas

function pink_Filter(imgIn,resultImg) {

  imgIn.loadPixels();
    
  resultImg.loadPixels();

  for(var x = 0; x<imgIn.width; x++) {
      
    for(var y = 0; y<imgIn.height; y++) {
        
      var pixelIndex = ((imgIn.width * y)+x)*4;
        
      var oldRed = imgIn.pixels[pixelIndex+0];
        
      var oldGreen = imgIn.pixels[pixelIndex+1];
        
      var oldBlue = imgIn.pixels[pixelIndex+2];

    
      
      
      var newRed = (oldRed * .382) + (oldGreen *.721) + (oldBlue * .179);
        
      var newGreen = (oldRed * .281) + (oldGreen *.523) + (oldBlue * .123);
        
      var newBlue = (oldRed * .349) + (oldGreen *.675) + (oldBlue * .179);
      
      

      newRed = constrain(newRed, 0, 255);
        
      newGreen = constrain(newGreen, 0, 255);
        
      newBlue = constrain(newBlue, 0, 255);
        
        

      resultImg.pixels[pixelIndex+0] = newRed;
        
      resultImg.pixels[pixelIndex+1] = newGreen;
        
      resultImg.pixels[pixelIndex+2] = newBlue;
        
      resultImg.pixels[pixelIndex+3] = 255;

    }
  }

  resultImg.updatePixels();
    
  return resultImg;
}


// Implementation of further ideas - 

function green_Filter(imgIn,resultImg) {

  imgIn.loadPixels();
    
  resultImg.loadPixels();

  for(var x = 0; x<imgIn.width; x++) {
      
    for(var y = 0; y<imgIn.height; y++) {
        
      var pixelIndex = ((imgIn.width * y)+x)*4;
        
      var oldRed = imgIn.pixels[pixelIndex+0];
        
      var oldGreen = imgIn.pixels[pixelIndex+1];
        
      var oldBlue = imgIn.pixels[pixelIndex+2];

     
      
      var newRed = (oldRed * .338) + (oldGreen *.597) + (oldBlue * .168);
      var newGreen = (oldRed * .294) + (oldGreen *.728) + (oldBlue * .171);
      var newBlue = (oldRed * .172) + (oldGreen *.494) + (oldBlue * .123);
        

      newRed = constrain(newRed, 0, 255);
        
      newGreen = constrain(newGreen, 0, 255);
        
      newBlue = constrain(newBlue, 0, 255);
        
        

      resultImg.pixels[pixelIndex+0] = newRed;
        
      resultImg.pixels[pixelIndex+1] = newGreen;
        
      resultImg.pixels[pixelIndex+2] = newBlue;
        
      resultImg.pixels[pixelIndex+3] = 255;

    }
      
  }

  resultImg.updatePixels();
    
  return resultImg;
}


//Implement further ideas - 
function edgeDetectionFilter(imgIn,resultImg){
    
  var matrixSize = matrixX.length;

  imgIn.loadPixels();
    
  resultImg.loadPixels();

  
  for (var x = 0; x<imgIn.width; x++) {
      
      for (var y = 0; y<imgIn.height; y++) {

          var index = (x + y * imgIn.width)*4;
          
         
          
          var valueX = convolution(x, y, matrixX, matrixSize, imgIn);
          
        
          
          var valueY = convolution(x, y, matrixY, matrixSize, imgIn);

          
          
          valueX = map(abs(valueX[0]), 1, 1522, 0, 255);
          
         
          
          valueY = map(abs(valueY[0]), 1, 1522, 0, 255);
          
          
          var combination = valueX+valueY;


          
          resultImg.pixels[index+0] = combination;
          
          resultImg.pixels[index+1] = combination;
          
          resultImg.pixels[index+2] = combination;
          
          resultImg.pixels[index+3] = 255;
          
          
      }
  }
    
  resultImg.updatePixels();
    
  return resultImg;
}