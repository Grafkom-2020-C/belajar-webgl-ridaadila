function main() {
    var canvas = document.getElementById("myCanvas");
    var gl = canvas.getContext("webgl");

    //ibaratnya di bawah ini adalah .c
    var vertexShaderSource = `
        void main() {
            gl_PointSize = 25.0;
            gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
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

    gl.clearColor(0.0,0.22,0.5,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.POINTS, 0, 1);

}