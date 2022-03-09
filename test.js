const canvas = document.getElementById("test");
const gl = canvas.getContext("webgl");

async function getShaderSource(name) {
  const response = await fetch(`http://localhost:3000/glsl/${name}.glsl`, {
    method: "get",
    mode: "cors",
    accept: "text/plain",
  });
  const text = await response.text();
  return text;
}

function createShader(gl, type, source) {
  const shader = gl.createShader(type); // 创建shader
  gl.shaderSource(shader, source); // 绑定shader与source
  gl.compileShader(shader); // 编译shader
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS); // 获取编译状态
  if (success) {
    return shader;
  }

  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram(); // 创建着色程序
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader); // 绑定shader
  gl.linkProgram(program); // 正式绑定
  const success = gl.getProgramParameter(program, gl.LINK_STATUS); // 查询绑定状态
  if (success) {
    return program;
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

const init = async () => {
  const fragmentSource = await getShaderSource("fragment");
  const vertexSource = await getShaderSource("vertex");

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

  const program = createProgram(gl, vertexShader, fragmentShader);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  // 清空画布
  gl.clearColor(1, 1, 1, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program); // 启用程序

  // 绑定坐标
  {
    // 寻找在vertex.glsl中定义的变量a_position
    const aPosition = gl.getAttribLocation(program, "a_position");
    // 创建一个缓冲
    const positionBuffer = gl.createBuffer();

    // 6个二维坐标点
    const position = new Float32Array([
      0, 0, 100, 600, 1600, 1600, 2400, 3100, 100, 400, 1900, 2100,
    ]);
    gl.enableVertexAttribArray(aPosition); // 使用变量

    // 将绑定点绑定到缓冲数据（positionBuffer）
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer); //
    gl.bufferData(gl.ARRAY_BUFFER, position, gl.STATIC_DRAW);


    // 告诉属性怎么从positionBuffer中读取数据 (ARRAY_BUFFER)
    const size = 2; // 每次迭代运行提取两个单位数据
    const type = gl.FLOAT; // 每个单位的数据类型是32位浮点型
    const normalize = false; // 不需要归一化数据
    const stride = 0; // 0 = 移动单位数量 * 每个单位占用内存（sizeof(type)）
    const offset = 0; // 从缓冲起始位置开始读取
    gl.vertexAttribPointer(aPosition, size, type, normalize, stride, offset);
  }

  {
    const primitiveType = gl.TRIANGLES;
    const offset = 0;
    const count = 6;
    gl.drawArrays(primitiveType, offset, count);
  }
};

init();
