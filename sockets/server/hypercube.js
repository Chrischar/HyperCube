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
        "y": 0,
        "z": 1000
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
        "y": 1,
        "z": 250
    }, // centre of screen location in mm
    "screenlookingat": {
        "x": 0,
        "y": 0,
        "z": 0
    }, // where the screen is facing
    "rotation": 0 // how much it rotates around the
        // (screenlookingat - screenlocation) vector, not yet implemented!
}

        var layoutdata = {
            "screenpixels": {
                "width": 0,
                "height": 0
            },
            "screenactual": {
                "width": 0,
                "height": 0
            },
            "screenlocation": {
                "l": {
                    "x": 0,
                    "y": 0,
                    "z": 0
                },
                "r": {
                    "x": 0,
                    "y": 0,
                    "z": 0
                },
                "b": {
                    "x": 0,
                    "y": 0,
                    "z": 0
                },
                "t": {
                    "x": 0,
                    "y": 0,
                    "z": 0
                }
            }
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
        //console.log(msg);

        globalstatus = msg;
        updateCamera();
    });

    socket.on('get-layout', function(msg) {
        log('get-layout');
        updateCamera();
        socket.emit('send-layout', layoutdata);
    });

    socket.on('client-update', function(msg) {
        //log("client-update> " + msg);
        //console.log(msg);

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
    camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.01, 1000000);
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
    mesh.position.y = -50;
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
    group1.position.y = 50;
    group1.rotation.x = 0;
    scene.add(group1);
    var grid1 = new THREE.GridHelper(250, 10);
    scene.add(grid1);
    var grid2 = new THREE.GridHelper(250, 10);
    grid1.position.z = -100;
    grid1.rotation.x = 0;
    scene.add(grid2);
    var grid3 = new THREE.GridHelper(250, 10);
    scene.add(grid3);
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

function sgn(a) {
    if (a > 0.0) return (1.0);
    if (a < 0.0) return (-1.0);
    return (0.0);
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
    var screenRight = new THREE.Vector3().crossVectors(screenForward, new THREE.Vector3(0, 1, 0)).applyAxisAngle(screenForward, (Math.PI / 180) * clientstatus.rotation).normalize();
    var screenUp = new THREE.Vector3().crossVectors(screenRight, screenForward).normalize();

    // Now we compute the Field of View (T = top, L = left, etc.)
    var screenL = screenLocation.clone().addScaledVector(screenRight, -actualWidth / 2);
    var screenR = screenLocation.clone().addScaledVector(screenRight, +actualWidth / 2);
    var screenT = screenLocation.clone().addScaledVector(screenUp, +actualHeight / 2);
    var screenB = screenLocation.clone().addScaledVector(screenUp, -actualHeight / 2);

    var cameraToL = screenL.clone().addScaledVector(cameraLocation, -1);
    var cameraToR = screenR.clone().addScaledVector(cameraLocation, -1);
    var cameraToT = screenT.clone().addScaledVector(cameraLocation, -1);
    var cameraToB = screenB.clone().addScaledVector(cameraLocation, -1);

    var angleL = cameraLocation.angleTo(cameraToL);
    var angleR = cameraLocation.angleTo(cameraToR);
    var angleT = cameraLocation.angleTo(cameraToT);
    var angleB = cameraLocation.angleTo(cameraToB);

    var near = 1;
    var far = 1000;
    var L = near * Math.tan(angleL);
    var R = near * Math.tan(angleR);
    var T = near * Math.tan(angleT);
    var B = near * Math.tan(angleB);

    var lookingAt = screenLocation.clone().addScaledVector(cameraLocation, -1);

    // Set all the things
    camera.position.copy(cameraLocation);
    camera.up = screenUp;
    camera.lookAt(lookingAt);
    camera.fov = angleT + angleB;
    camera.near = lookingAt.length();

    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
    camera.matrixWorldInverse.getInverse(camera.matrixWorld);

    // Matrix magic
    // see: http://jsfiddle.net/slayvin/PT32b/
    // see: http://www.terathon.com/lengyel/Lengyel-Oblique.pdf
    frustumPlane = new THREE.Plane();
    frustumPlane.setFromNormalAndCoplanarPoint(screenForward, screenLocation);
    frustumPlane.applyMatrix4(camera.matrixWorldInverse);

    frustumPlane = new THREE.Vector4(frustumPlane.normal.x, frustumPlane.normal.y, frustumPlane.normal.z, frustumPlane.constant);

    var q = new THREE.Vector4();
    var projectionMatrix = camera.projectionMatrix;

    var q = new THREE.Vector4(sgn(frustumPlane.x), sgn(frustumPlane.y), 1, 1).applyMatrix4(new THREE.Matrix4().getInverse(projectionMatrix));

    // Calculate the scaled plane vector
    var c = new THREE.Vector4();
    c = frustumPlane.multiplyScalar(2.0 / frustumPlane.dot(q));

    // Replace the third row of the projection matrix
    projectionMatrix.elements[2] = c.x - projectionMatrix.elements[3];
    projectionMatrix.elements[6] = c.y - projectionMatrix.elements[7];
    projectionMatrix.elements[10] = c.z - projectionMatrix.elements[11];
    projectionMatrix.elements[14] = c.w - projectionMatrix.elements[15];


    layoutdata = {
        "screenpixels": {
            "width": window.innerWidth,
            "height": window.innerHeight
        },
        "screenactual": {
            "width": actualWidth,
            "height": actualHeight
        },
        "screenlocation": {
            "l": {
                "x": screenL.x,
                "y": screenL.y,
                "z": screenL.z
            },
            "r": {
                "x": screenR.x,
                "y": screenR.y,
                "z": screenR.z
            },
            "b": {
                "x": screenB.x,
                "y": screenB.y,
                "z": screenB.z
            },
            "t": {
                "x": screenT.x,
                "y": screenT.y,
                "z": screenT.z
            }
        }
    }
}

function render() {
    updateCamera();
    renderer.render(scene, camera);
}
