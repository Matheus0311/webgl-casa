
//Vertex Shader
var vertCode = 
    'attribute vec3 coordinates:' +

    'void main(void){'+
        'glo_Position = vec4(coordinates, 1.0);' +
    '}';

var vertShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertShader, vertCode);
gl.compileShader(vertShader);


//Fragment Shader

var fragCode = 
    'void main(void) {'+
        'gl_FragColor = vec4(0, 0.8, 0, 1);' +
    '}';

    var  fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader, fragCode);
    gl.compileShader(fragShader);






function main(){
    const canvas = document.querySelector("#gl_canvas");
    
    const gl = canvas.getContext("webgl");


    if(!gl){
        alert("O navegador ou sua máquina não suportam WebGL.");
        return;
    }
    gl.clearColor(0.0, 1.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
}

main();