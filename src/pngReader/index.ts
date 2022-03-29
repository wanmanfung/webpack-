import getIHDR from "./getIHDR"

const handleFileRead = (data: Uint8Array) => {
  const charList: string[] = []
  const code16: string[] = []
  for (let i = 0; i < data.length; i++) {
    const code = data[i]
    charList.push(String.fromCharCode(code))
    let codeStr = code.toString(16)
    if (codeStr.length === 1) codeStr = "0" + codeStr
    code16.push(codeStr)
  }
  console.log(data)
  console.log(charList) // 字符串
  console.log(code16) // 十六进制码

  {
    /**
     * 寻找IHDR所在位置
     * IHDR的前4个字节表示IHDR块长度（13）
     * IHDR4个字节表示这个是IHDR数据块
     * 接下来4个自己是宽带，后4个字节是高度
     */
    const IHDR_INDEX = getIHDR(charList)
    if (!IHDR_INDEX) return
    console.log("===IHDR====")
    const IHDR_LENGTH = parseInt(
      "0x" + code16.slice(IHDR_INDEX - 4, IHDR_INDEX).join(""),
      16
    )
    console.log("IHDR_LENGTH", IHDR_LENGTH)

    const IHDR_WIDTH = parseInt(
      "0x" + code16.slice(IHDR_INDEX + 4, IHDR_INDEX + 4 + 4).join(""),
      16
    )
    console.log("IHDR_WIDTH", IHDR_WIDTH)

    const IHDR_HEIGHT = parseInt(
      "0x" + code16.slice(IHDR_INDEX + 8, IHDR_INDEX + 8 + 4).join(""),
      16
    )
    console.log("IHDR_HEIGHT", IHDR_HEIGHT)
    console.log("===IHDR====")
  }
}
export default () => {
  const fileInput: HTMLInputElement = document.createElement("input")
  fileInput.type = "file"
  fileInput.onchange = () => {
    const { files } = fileInput
    if (!files || !files[0]) return
    const file = files[0]
    const fr = new FileReader()
    fr.onloadend = e => {
      if (!fr.result) return
      handleFileRead(new Uint8Array(fr.result as ArrayBuffer))
    }
    fr.readAsArrayBuffer(file)
  }
  document.body.appendChild(fileInput)
}
