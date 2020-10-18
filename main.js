function main() {
    var canvas = document.getElementById("myCanvas");
    var gl = canvas.getContext("webgl");

    // Definisi titik pembentuk segitiga
    // A = (-0.5,0.5)
    // B = (0.5,0.5)
    // C = (0.5,-0.5)
    var vertices = [
        -0.5, 0.5, //titik A
        0.5, 0.5, // titik B
        0.5, -0.5, // titik C
    ];

    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    //ibaratnya di bawah ini adalah .c
    var vertexShaderSource = `
        attribute vec2 a_Position;
        void main() {
            gl_PointSize = 25.0;
            gl_Position = vec4(a_Position, 0.0, 1.0);
        }
    `;
    var fragmentShaderSource = `
        void main() {
            gl_FragColor = vec4(1.0,1.0,0.0,1.0);
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
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPosition);

    gl.clearColor(0.0,0.22,0.5,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    var primitive = gl.LINE_LOOP;
    var offset = 0;
    var nVertex = 3;
    gl.drawArrays(primitive, offset, nVertex);

}