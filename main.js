const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

document.getElementById("thresholdInput").addEventListener('input', () => {
    document.getElementById("thresholdValue").textContent = document.getElementById("thresholdInput").value;
});

function loadImageInCanvas() {
    if (!ctx) {
        return;
    }

    const img = new Image();
    img.src = "panda.jpeg";
    img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };  
}


function invertColors() {
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imgData.data;

    // array 1D, every 4 positions represents a pixel from canvas
    for (let i = 0; i < pixels.length; i += 4) {
        pixels[i] = 255 - pixels[i];       // red
        pixels[i + 1] = 255 - pixels[i + 1]; // green
        pixels[i + 2] = 255 - pixels[i + 2]; // blue
        // pixels[i + 3] is alpha channel, also from 0 to 255
    }

    ctx.putImageData(imgData, 0, 0);
}

function applyThreshold() {
    const thresholdValue = parseInt(document.getElementById("thresholdInput").value);
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
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
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imgData.data;

    for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];

        // Calculando a escala de cinza
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;

        // Aplicando o mesmo valor nos três canais de cor
        pixels[i] = pixels[i + 1] = pixels[i + 2] = gray;
    }
    ctx.putImageData(imgData, 0, 0);
}