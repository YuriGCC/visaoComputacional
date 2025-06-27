const pixelAreaCanvas = document.getElementById("pixelArea");
const pixelAreaCanvasCtx = pixelAreaCanvas.getContext("2d");
pixelAreaCanvas.width = 1200;
pixelAreaCanvas.height = 600;

document.getElementById("thresholdInput").addEventListener('input', () => {
    document.getElementById("thresholdValue").textContent = document.getElementById("thresholdInput").value;
});

function loadImageInCanvas() {
    if (!pixelAreaCanvasCtx) {
        return;
    }

    const img = new Image();
    img.src = "orchid-1200x600.jpg";
    img.onload = () => {
        ctx.drawImage(img, 0, 0, pixelAreaCanvas.width, pixelAreaCanvas.height);
    };  
}


function invertColors() {
    const imgData = pixelAreaCanvasCtx.getImageData(0, 0, pixelAreaCanvas.width, pixelAreaCanvas.height);
    const pixels = imgData.data;

    // array 1D, every 4 positions represents a pixel from canvas
    for (let i = 0; i < pixels.length; i += 4) {
        pixels[i] = 255 - pixels[i];       // red
        pixels[i + 1] = 255 - pixels[i + 1]; // green
        pixels[i + 2] = 255 - pixels[i + 2]; // blue
        // pixels[i + 3] is alpha channel, also from 0 to 255
    }

    pixelAreaCanvasCtx.putImageData(imgData, 0, 0);
}

function applyThreshold() {
    const thresholdValue = parseInt(document.getElementById("thresholdInput").value);
    const imgData = pixelAreaCanvasCtx.getImageData(0, 0, pixelAreaCanvas.width, pixelAreaCanvas.height);
    const pixels = imgData.data;

    for (let i = 0; i < pixels.length; i += 4) {
        // Apllying threshold only to the RGB values from the pixel
        for (let j = 0; j < 3; j++) {
            pixels[i + j] = pixels[i + j] >= thresholdValue ? 255 : 0;
        }
    }
    ctx.putImageData(imgData, 0, 0);
}

function applyGrayScale() {
    const imgData = pixelAreaCanvasCtx.getImageData(0, 0, pixelAreaCanvas.width, pixelAreaCanvas.height);
    const pixels = imgData.data;

    for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];

        // Calculating the grayscale value based on the ITU-R BT.601 standard
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;

        // Applying the same value to all three color channels
        pixels[i] = pixels[i + 1] = pixels[i + 2] = gray;
    }
    pixelAreaCanvasCtx.putImageData(imgData, 0, 0);
}

function applyKernel() {
    // Getting inputs to make a mask
    let mask = [];
    for (let i = 0; i < 3; i++) {
        let newLine = [];
        for (let j = 0; j < 3; j++) {
            let inputValue = parseFloat(document.getElementById(`i${i}${j}`).value);
            newLine.push(inputValue);
        }
        mask.push(newLine);
    }

    var kernelScalar = document.getElementById("kernelScalar").value;
    var imgData = pixelAreaCanvasCtx.getImageData( 0, 0, pixelAreaCanvas.width, pixelAreaCanvas.height );
    var copyImgData = pixelAreaCanvasCtx.getImageData( 0, 0, pixelAreaCanvas.width, pixelAreaCanvas.height );
    var currentPixelPosition = 0;
    let r, g, b;
    var m        = pixelAreaCanvas.height;
    var n        = pixelAreaCanvas.width;

    for (let y = 0; y < m; y++) {
        for (let x = 0; x < n; x++) {
            r = 0; g = 0; b = 0;
            // Offsetting -1 to 1 centers the kernel over the current pixel during convolution
            for (let i = -1; i < 2; i++) {
                for (let j = -1; j < 2; j++) {
                    // Ensure the neighboring pixel (x+j, y+i) is inside canvas bounds
                    if( (x+j>=0) && (x+j<n) && (y+i>=0) && (y+i<m) ){
                        // Calculate index of neighboring pixel in image data array (4 values per pixel)
                        currentPixelPosition = 4 * ((x+j) + (y+i) * pixelAreaCanvas.width);
                        // Multiply RGB values of neighbor pixel by corresponding kernel weight and accumulate
                        r += imgData.data[currentPixelPosition+0] * mask[i+1][j+1];
                        g += imgData.data[currentPixelPosition+1] * mask[i+1][j+1];
                        b += imgData.data[currentPixelPosition+2] * mask[i+1][j+1];
                    }
                }
            }
            // Calculate index of current pixel in output image data
            currentPixelPosition = 4 * (x + y * pixelAreaCanvas.width);
            // Apply scalar multiplier and set new RGB values for current pixel
            copyImgData.data[currentPixelPosition+0] = kernelScalar * r;
            copyImgData.data[currentPixelPosition+1] = kernelScalar * g;
            copyImgData.data[currentPixelPosition+2] = kernelScalar * b;
        }
    }

    pixelAreaCanvasCtx.putImageData(copyImgData, 0, 0);
}