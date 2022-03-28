export default () => {
  const canvas = document.createElement("canvas")

  const gl = canvas.getContext("webgl")
  let program

  async function getShaderSource(name) {
    const response = await fetch(`http://localhost:3000/glsl/${name}.glsl`, {
      method: "get",
      mode: "cors",
      accept: "text/plain",
    })
    const text = await response.text()
    return text
  }

  function createShader(gl, type, source) {
    const shader = gl.createShader(type) // 创建shader
    gl.shaderSource(shader, source) // 绑定shader与source
    gl.compileShader(shader) // 编译shader
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS) // 获取编译状态
    if (success) {
      return shader
    }

    gl.deleteShader(shader)
  }

  function createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram() // 创建着色程序
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader) // 绑定shader
    gl.linkProgram(program) // 正式绑定
    const success = gl.getProgramParameter(program, gl.LINK_STATUS) // 查询绑定状态
    if (success) {
      return program
    }

    gl.deleteProgram(program)
  }

  const canvasInit = async () => {
    const fragmentSource = await getShaderSource("fragment")
    const vertexSource = await getShaderSource("vertex")

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource)
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource)

    program = createProgram(gl, vertexShader, fragmentShader)
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    // 清空画布
    gl.clearColor(1, 1, 1, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.useProgram(program) // 启用程序
  }

  function drawTriangles(points) {
    gl.clear(gl.COLOR_BUFFER_BIT)
    // 寻找在vertex.glsl中定义的变量a_position
    const aPosition = gl.getAttribLocation(program, "a_position")
    // 创建一个缓冲
    const positionBuffer = gl.createBuffer()

    gl.enableVertexAttribArray(aPosition) // 使用变量

    // 将绑定点绑定到缓冲数据（positionBuffer）
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer) //
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([...points]),
      gl.STATIC_DRAW
    )

    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0)

    gl.drawArrays(gl.TRIANGLES, 0, points.length / 2)
  }

  function init() {
    canvas.width = 3200
    canvas.height = 3200
    canvas.classList.add("canvas")
    document.body.appendChild(canvas)
    canvasInit()
  }

  init()

  const point = {
    points: [],
    add(point) {
      this.points.push(point)
    },
    get() {
      if (this.points.length % 3 === 0)
        return this.points.reduce((prevArr, item) => {
          return [...prevArr, ...item]
        }, [])
    },
  }

  canvas.addEventListener("click", event => {
    const { offsetX, offsetY } = event
    console.log(offsetX)
    point.add([offsetX * 8, gl.canvas.height - offsetY * 8])
    if (point.get()) {
      drawTriangles(point.get())
    }
  })
}
