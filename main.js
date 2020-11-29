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
        void main() {
            mat4 translasi = mat4(
                1.0, 0.0, 0.0, 0.0,
                0.0, 1.0, 0.0, 0.0,
                0.0, 0.0, 1.0, 0.0,
                d, 0.0, 1.0
                );
            gl_PointSize = 25.0;
            gl_Position = translasi * vec4(a_Position, 0.0, 1.0);
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


    var d = [-1.0, 0.0];
    var uD = gl.getUniformLocation(shaderProgram, 'd');
    

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
    function render() {
        if(!freeze) {
            d[0] += 0.001;
        }
        gl.uniform2fv(uD, d);
        gl.clearColor(0.0,0.22,0.5,1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(primitive, offset, nVertex);
        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
    

}