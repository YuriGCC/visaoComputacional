const visualizationAreaCanvas = document.getElementById("visualizationArea");
const visualizationAreaCtx = visualizationAreaCanvas.getContext("2d");
visualizationAreaCanvas.width = 1200;
visualizationAreaCanvas.height = 600; 


const vertices = [
    {x: -1, y: -1, z: -1},
    {x:  1, y: -1, z: -1},
    {x:  1, y:  1, z: -1},
    {x: -1, y:  1, z: -1},
    {x: -1, y: -1, z:  1},
    {x:  1, y: -1, z:  1},
    {x:  1, y:  1, z:  1},
    {x: -1, y:  1, z:  1},
];

const edges = [
    [0,1],[1,2],[2,3],[3,0],  // back face
    [4,5],[5,6],[6,7],[7,4],  // front face
    [0,4],[1,5],[2,6],[3,7],  // front/back connections
];

let isPressed = false;
let lastX = 0;
let lastY = 0;
let angleX = 0;
let angleY = 0;

function project(point3d) {
    const distance = 3;
    const z = point3d.z + distance;
    const scale = distance / z;
    return {
        x: point3d.x * scale * 200 + visualizationAreaCanvas.width / 2,
        y: point3d.y * scale * 200 + visualizationAreaCanvas.height / 2
    };
}

function rotateX(point, angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
        x: point.x,
        y: point.y * cos - point.z * sin,
        z: point.y * sin + point.z * cos
    };
}

function rotateY(point, angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
        x: point.x * cos + point.z * sin,
        y: point.y,
        z: -point.x * sin + point.z * cos
    };
}

function draw() {
    visualizationAreaCtx.clearRect(0, 0, visualizationAreaCanvas.width, visualizationAreaCanvas.height);

    const projected = vertices.map(v => {
        let rotated = rotateX(v, angleX);
        rotated = rotateY(rotated, angleY);
        return project(rotated);
    });

    visualizationAreaCtx.strokeStyle = "blue";
    visualizationAreaCtx.lineWidth = 2;
    edges.forEach(edge => {
        const [start, end] = edge;
        visualizationAreaCtx.beginPath();
        visualizationAreaCtx.moveTo(projected[start].x, projected[start].y);
        visualizationAreaCtx.lineTo(projected[end].x, projected[end].y);
        visualizationAreaCtx.stroke();
    });
}

// Update rotation based on mouse movement
function updateRotation(x, y) {
    if (!isPressed) return;

    let dx = x - lastX;
    let dy = y - lastY;

    angleY += dx * 0.01;
    angleX += dy * 0.01;

    lastX = x;
    lastY = y;

    draw();
}

// Mouse events
visualizationAreaCanvas.addEventListener("mousedown", (e) => {
    isPressed = true;
    let rect = visualizationAreaCanvas.getBoundingClientRect();
    lastX = e.clientX - rect.left;
    lastY = e.clientY - rect.top;
});

visualizationAreaCanvas.addEventListener("mouseup", () => {
    isPressed = false;
});

visualizationAreaCanvas.addEventListener("mouseleave", () => {
    isPressed = false;
});

visualizationAreaCanvas.addEventListener("mousemove", (e) => {
    if (isPressed) {
        let rect = visualizationAreaCanvas.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        updateRotation(x, y);
    }
});

// Touch events
visualizationAreaCanvas.addEventListener("touchstart", (e) => {
    isPressed = true;
    let rect = visualizationAreaCanvas.getBoundingClientRect();
    let touch = e.touches[0];
    lastX = touch.clientX - rect.left;
    lastY = touch.clientY - rect.top;
});

visualizationAreaCanvas.addEventListener("touchend", () => {
    isPressed = false;
});

visualizationAreaCanvas.addEventListener("touchcancel", () => {
    isPressed = false;
});

visualizationAreaCanvas.addEventListener("touchmove", (e) => {
    if (isPressed) {
        e.preventDefault(); // Prevent scrolling while touching canvas
        let rect = visualizationAreaCanvas.getBoundingClientRect();
        let touch = e.touches[0];
        let x = touch.clientX - rect.left;
        let y = touch.clientY - rect.top;
        updateRotation(x, y);
    }
});

draw();
