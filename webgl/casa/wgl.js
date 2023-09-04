'use strict';

var appContext = {
  gl: null,
  vertexShader: null,
  fragmentShader: null,
  shaderProgram: null,
  vertexBuffer: null,
  indexBuffer: null,
  colorBuffer: null
};

function start() {
  var canvas = document.getElementById('glcanvas');

  appContext.gl = initWebGL(canvas);
  initShaders();
  loadGeometry();
  render();
}

function render() {
  var gl = appContext.gl;
  gl.useProgram(appContext.shaderProgram);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.bindBuffer(gl.ARRAY_BUFFER, appContext.vertexBuffer);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, appContext.indexBuffer);

  var vertexLocation = gl.getAttribLocation(appContext.shaderProgram, 'vertex');
  gl.vertexAttribPointer(vertexLocation, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vertexLocation);

  var colorLocation = gl.getAttribLocation(appContext.shaderProgram, 'color');
  gl.bindBuffer(gl.ARRAY_BUFFER, appContext.colorBuffer);
  gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(colorLocation);

  gl.drawElements(gl.TRIANGLES, 27, gl.UNSIGNED_SHORT, 0); 
}

function loadGeometry() {
  var gl = appContext.gl;

  var vertex = [
    // Teto (triângulo)
    0.0, 0.5, 0.0,
    -0.5, -0.1667, 0.0, 
    0.5, -0.1667, 0.0,

    // Parede (retângulo)
    -0.5, -0.1667, 0.0,
    -0.5, -1.0, 0.0, // Altura total da parede
    0.5, -1.0, 0.0,
    0.5, -0.1667, 0.0,

    // Porta (retângulo)
    -0.35, -1.0, 0.0, // Lado esquerdo da parede
    -0.35, -0.4, 0.0, // Altura da porta 
    -0.15, -0.4, 0.0, // Altura da porta 
    -0.15, -1.0, 0.0,

    // Janela (retângulo)
    0.1, -0.6, 0.0,  // Lado direito da parede
    0.1, -0.4, 0.0,  // Altura da janela 
    0.4, -0.4, 0.0,  // Altura da janela 
    0.4, -0.6, 0.0,


    // Chão (retângulo)
    -1.0, -1.0, 0.0, // Altura total do chão
    -1.0, -0.7, 0.0,
    1.0, -0.7, 0.0,
    1.0, -1.0, 0.0
  ];

  var index = [
    0, 1, 2, // Teto
    3, 4, 5, 5, 6, 3, // Parede
    7, 8, 9, 9, 10, 7, // Porta
    11, 12, 13, 13, 14, 11, // Janela
    15, 16, 17, 17, 18, 15, // Chão

  ];

  var colors = [
    // Cores para o teto
    0.5, 0.2, 0.2,
    0.5, 0.2, 0.2,
    0.5, 0.2, 0.2,
  
    // Cores para a parede
    1.0, 1.0, 1.0,
    1.0, 1.0, 1.0,
    1.0, 1.0, 1.0,
    1.0, 1.0, 1.0,
  
    // Cores para a porta
    0.6, 0.4, 0.2,
    0.6, 0.4, 0.2,
    0.6, 0.4, 0.2,
    0.6, 0.4, 0.2,
    
    // Cores para a janela
    0.6, 0.7, 0.8, 
    0.6, 0.7, 0.8, 
    0.6, 0.7, 0.8, 
    0.6, 0.7, 0.8, 

    // Cores para o chão
    0.0, 0.5, 0.0,
    0.0, 0.5, 0.0,
    0.0, 0.5, 0.0,
    0.0, 0.5, 0.0,
    
    // Cores para a porta
    0.6, 0.4, 0.2,
    0.6, 0.4, 0.2,
    0.6, 0.4, 0.2,
    0.6, 0.4, 0.2,
  
    // Cores para a janela
    0.6, 0.8, 1.0,
    0.6, 0.8, 1.0,
    0.6, 0.8, 1.0,
    0.6, 0.8, 1.0,

  ];
  
  appContext.vertexBuffer = gl.createBuffer();
  appContext.indexBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, appContext.vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, appContext.indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(index), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

  appContext.colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, appContext.colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
}

function initShaders() {
  var gl = appContext.gl;

  var vertexShaderCode = `
    attribute vec3 vertex;
    attribute vec3 color;

    varying vec3 vColor;

    void main(void) {
      gl_Position = vec4(vertex, 1.0);
      vColor = color;
    }
    `;

  appContext.vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(appContext.vertexShader, vertexShaderCode);
  gl.compileShader(appContext.vertexShader);

  var fragmentShaderCode = `
    precision mediump float;

    varying vec3 vColor;

    void main(void) {
      gl_FragColor = vec4(vColor, 1.0);
    }
    `;

  appContext.fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(appContext.fragmentShader, fragmentShaderCode);
  gl.compileShader(appContext.fragmentShader);

  appContext.shaderProgram = gl.createProgram();
  gl.attachShader(appContext.shaderProgram, appContext.vertexShader);
  gl.attachShader(appContext.shaderProgram, appContext.fragmentShader);
  gl.linkProgram(appContext.shaderProgram);

  gl.useProgram(appContext.shaderProgram);
}

function initWebGL(canvas) {
  var gl = null;

  try {
    gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  } catch(e) {
    console.error(e);
  }

  if (!gl) {
    alert('Impossível inicializar WebGL. Seu navegador pode não suportar o WebGL.');
    gl = null;
  } else {
    gl.clearColor(0.53, 0.81, 0.92, 1.0); // Cor do céu
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }

  return gl;
}

start();