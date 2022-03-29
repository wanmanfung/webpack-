/**
 * IHDR长度固定13字节，是第一个数据块
 */
export default (charList: string[]) => {
  for (let i = 0; i < charList.length; i++) {
    const code =
      charList[i] + charList[i + 1] + charList[i + 2] + charList[i + 3]

    if (code === "IHDR") return i
  }
  return 0
}
