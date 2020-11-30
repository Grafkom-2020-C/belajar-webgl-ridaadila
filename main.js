function main() {
    var canvas = document.getElementById("myCanvas");
    var gl = canvas.getContext("webgl");

    // Definisi titik pembentuk segitiga
    // A = (-0.5,0.5)
    // B = (0.5,0.5)
    // C = (0.5,-0.5)
    // D = (-0.5,-0.5)
    var vertices = [
        -0.5, 0.5, 1.0, 0.0, 0.0, //titik A
        0.5, 0.5, 0.0, 1.0, 0.0,// titik B
        0.5, -0.5, 0.0, 0.0, 1.0,// titik C
        -0.5, 0.5, 1.0, 0.0, 0.0,//titik A
        0.5, -0.5, 0.0, 0.0, 1.0,// titik C
        -0.5,-0.5, 0.0, 1.0, 0.0,//TITIK D
    ];

    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    //ibaratnya di bawah ini adalah .c
    var vertexShaderSource = `
        attribute vec2 a_Position;
        attribute vec3 a_Color;
        varying vec3 v_Color;
        uniform vec2 d;
        uniform mat4 projection;
        uniform mat4 view;
        uniform mat4 model;
        void main() {
            gl_PointSize = 25.0;
            gl_Position = projection * view * model * vec4(a_Position, 0.0, 1.0);
            v_Color = a_Color;
        }
    `;
    var fragmentShaderSource = `
        precision mediump float;
        varying vec3 v_Color; 
        void main() {
            gl_FragColor = vec4(v_Color,1.0);
        }
    `;


    //dibawah ini adalah .o
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    //mengetikkan teks source code ke dalam penampung .c
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.shaderSource(fragmentShader, fragmentShaderSource);

    //mengompilasi .c menjadi .o
    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);

    //membuatkan penampung .exe
    var shaderProgram = gl.createProgram();

    //memasukkan adonan objek ke dalam penampung exe
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);

    //menggabung-gabungkan adonan objek yg ada di dlm penampung
    gl.linkProgram(shaderProgram);

    //memulai menggunakan cat.exe ke dalam konteks  penggambaran grafika
    gl.useProgram(shaderProgram);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    var aPosition = gl.getAttribLocation(shaderProgram, "a_Position");
    var aColor = gl.getAttribLocation(shaderProgram, "a_Color");
    gl.vertexAttribPointer(
        aPosition, 
        2, 
        gl.FLOAT, 
        false, 
        5*Float32Array.BYTES_PER_ELEMENT, 
        0);
    gl.vertexAttribPointer(
        aColor, 
        3, 
        gl.FLOAT, 
        false, 
        5*Float32Array.BYTES_PER_ELEMENT, 
        2*Float32Array.BYTES_PER_ELEMENT);

    gl.enableVertexAttribArray(aPosition);
    gl.enableVertexAttribArray(aColor);

    
    gl.viewport(100, 0, canvas.height, canvas.height);


    var primitive = gl.TRIANGLES;
    var offset = 0;
    var nVertex = 6;

    //Elemen interaktif
    var freeze = false;
    function onMouseClick(event) {
        freeze = !freeze;
    }
    document.addEventListener("click", onMouseClick, false);

    function onKeyDown(event) {
        if(event.keyCode==32) {
            freeze = true;
        }
    }
    function onKeyUp(event) {
        if(event.keyCode==32) {
            freeze = false;
        }
    }

    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);

    var model = glMatrix.mat4.create();
    var view = glMatrix.mat4.create();
    glMatrix.mat4.lookAt(view,
        [0.0, 0.0, 3.0], //posisi kamera (titik)
        [0.0, 0.0, -2.0], //kemana kamera menghadap (vektor)
        [0.0, 1.0, 0.0] // kemana arah atas dari kamera (vektor)
        );
    var projection = glMatrix.mat4.create();

    glMatrix.mat4.perspective(projection,
        glMatrix.glMatrix.toRadian(90),// fov y
        1.0, //rasio aspek
        0.5,//near
        10.0 //far
        );
    var uModel = gl.getUniformLocation(shaderProgram, 'model');
    var uView = gl.getUniformLocation(shaderProgram, 'view');
    var uProjection = gl.getUniformLocation(shaderProgram, 'projection');
    gl.uniformMatrix4fv(uProjection, false, projection);
    gl.uniformMatrix4fv(uView, false, view);

    function render() {
        glMatrix.mat4.rotate(model, model, glMatrix.glMatrix.toRadian(0.5), [0.0, 0.0, 1.0]);
        glMatrix.mat4.rotate(model, model, glMatrix.glMatrix.toRadian(1), [0.0, 1.0, 0.0]);
        gl.uniformMatrix4fv(uModel, false, model);
        gl.clearColor(0.0,0.22,0.5,1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(primitive, offset, nVertex);
        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
    

}