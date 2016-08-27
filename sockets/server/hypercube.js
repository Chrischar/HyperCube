function formatTimeOfDay(millisSinceEpoch) {
    d = new Date(millisSinceEpoch);
    return d.toLocaleString();
}


function log(msg) {
    $('#log').prepend("<p>&lt;" + formatTimeOfDay($.now()) + "&gt;: " + msg + "</p>")
}

var socket = io();
log('socket created');

var globalstatus = {
    "camera": {
        "x": 0,
        "y": -800,
        "z": 0
    },
    "scene": "scene1"
}


var clientstatus = {
    "screenppmm": {
        "x": 4,
        "y": 4
    }, // screen pixels per cm, 1dpi ~ 0.03937008 p/mm
    "screenlocation": {
        "x": 0,
        "y": -120,
        "z": 120
    }, // centre of screen location in mm
    "screenlookingat": {
        "x": 0,
        "y": 0,
        "z": 0
    }, // where the screen is facing
    "rotation": 0 // how much it rotates around the
        // (screenlookingat - screenlocation) vector, not yet implemented!
}


$(function() {
    $('#c').click(function() {
        socket.emit('name', $('#n').val());
        log('registered as ' + $('#n').val());
        return false;
    });

    socket.on('info', function(msg) {
        log("server> " + msg)
    });

    socket.on('update', function(msg) {
        //log("update> " + msg);
        console.log(msg);

        globalstatus = msg;
        updateCamera();
    });

    socket.on('client-update', function(msg) {
        //log("client-update> " + msg);
        console.log(msg);

        clientstatus = msg;
        updateCamera();
    });
});


function onDocumentMouseMove(event) {
    socket.emit('update', {
        "x": event.clientX,
        "y": event.clientY
    });
}



// ************************************
// ************************************
// ************ OPENGL ****************
// ************************************
// ************************************

var container;
var camera, scene, renderer;
var mesh, group1, light;
var mouseX = 0,
    mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

init();
animate();

function init() {
    container = document.getElementById('opengl');
    camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 800;
    scene = new THREE.Scene();
    light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 0, 1);
    scene.add(light);
    // shadow
    var canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    var context = canvas.getContext('2d');
    var gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
    gradient.addColorStop(0.1, 'rgba(210,210,210,1)');
    gradient.addColorStop(1, 'rgba(255,255,255,1)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
    var shadowTexture = new THREE.Texture(canvas);
    shadowTexture.needsUpdate = true;
    var shadowMaterial = new THREE.MeshBasicMaterial({
        map: shadowTexture
    });
    var shadowGeo = new THREE.PlaneBufferGeometry(100, 100, 1, 1);
    mesh = new THREE.Mesh(shadowGeo, shadowMaterial);
    mesh.position.z = 0;
    //mesh.rotation.x = -Math.PI / 2;
    scene.add(mesh);
    var faceIndices = ['a', 'b', 'c'];
    var color, f, p, vertexIndex,
        radius = 50,
        geometry = new THREE.IcosahedronGeometry(radius, 1);
    for (var i = 0; i < geometry.faces.length; i++) {
        f = geometry.faces[i];
        for (var j = 0; j < 3; j++) {
            vertexIndex = f[faceIndices[j]];
            p = geometry.vertices[vertexIndex];
            color = new THREE.Color(0xffffff);
            color.setHSL((p.y / radius + 1) / 2, 1.0, 0.5);
            f.vertexColors[j] = color;
        }
    }
    var materials = [
        new THREE.MeshPhongMaterial({
            color: 0xffffff,
            shading: THREE.FlatShading,
            vertexColors: THREE.VertexColors,
            shininess: 0
        }),
        new THREE.MeshBasicMaterial({
            color: 0x000000,
            shading: THREE.FlatShading,
            wireframe: true,
            transparent: true
        })
    ];
    group1 = THREE.SceneUtils.createMultiMaterialObject(geometry, materials);
    group1.position.z = 120;
    group1.rotation.x = 0;
    scene.add(group1);
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setClearColor(0xffffff);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function distance(x1, y1, z1, x2, y2, z2) {
    return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2) + (z1 - z2) * (z1 - z2));
}

function distance2(obj1, obj2) {
    return distance(obj1.x, obj1.y, obj1.z, obj2.x, obj2.y, obj2.z);
}

function updateCamera() {
    // This computes a new frustum based on the settings
    // It's a cheapo version, I don't really project onto the screen,
    // but I rather fake the camera to be good enough

    // Compute the size of the screen in mm
    var actualWidth = window.innerWidth / clientstatus.screenppmm.x;
    var actualHeight = window.innerHeight / clientstatus.screenppmm.y;

    // Screen location
    var screenLocation = new THREE.Vector3(clientstatus.screenlocation.x, clientstatus.screenlocation.y, clientstatus.screenlocation.z);

    // Camera location
    var cameraLocation = new THREE.Vector3(globalstatus.camera.x, globalstatus.camera.y, globalstatus.camera.z);

    // Compute the axes of the screen as unit vectors
    var screenForward = new THREE.Vector3(clientstatus.screenlookingat.x - clientstatus.screenlocation.x, clientstatus.screenlookingat.y - clientstatus.screenlocation.y, clientstatus.screenlookingat.z - clientstatus.screenlocation.z).normalize();
    var screenRight = new THREE.Vector3();
    screenRight.crossVectors(screenForward, new THREE.Vector3(0, 0, 1));
    screenRight.applyAxisAngle(screenForward, Math.PI / 180 * clientstatus.rotation).normalize();
    var screenUp = new THREE.Vector3();
    screenUp.crossVectors(screenRight, screenForward).normalize();

    // Now we compute the Field of View (T = top, L = left, etc.)
    var screenL = screenLocation.clone().addScaledVector(screenRight, -actualWidth / 2);
    var screenR = screenLocation.clone().addScaledVector(screenRight, +actualWidth / 2);
    var screenT = screenLocation.clone().addScaledVector(screenUp, +actualHeight / 2);
    var screenB = screenLocation.clone().addScaledVector(screenUp, -actualHeight / 2);
    var cameraToL = screenL.clone().addScaledVector(cameraLocation, -1);
    var cameraToR = screenR.clone().addScaledVector(cameraLocation, -1);
    var cameraToT = screenT.clone().addScaledVector(cameraLocation, -1);
    var cameraToB = screenB.clone().addScaledVector(cameraLocation, -1);
    var fovHor = 180 / Math.PI * cameraToL.angleTo(cameraToR);
    var fovVer = 180 / Math.PI * cameraToT.angleTo(cameraToB);

    console.log(fovHor);
    console.log(fovVer);

    var fakeAspectRatio = fovHor / fovVer;

    var lookingAt = screenLocation.clone().addScaledVector(cameraLocation, -1);
    console.log(lookingAt);

    // Set all the things
    camera.fov = fovVer;
    camera.aspect = fakeAspectRatio;
    camera.position = screenLocation;
    camera.up = screenUp;
    camera.lookAt(lookingAt);
    camera.updateProjectionMatrix();
}

function render() {
    //camera.position.x += (mouseX - camera.position.x) * 0.05;
    //camera.position.y += (-mouseY - camera.position.y) * 0.05;
    //camera.lookAt(scene.position);
    renderer.render(scene, camera);
}
