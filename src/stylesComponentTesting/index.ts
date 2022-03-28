import {
  compile,
  hash,
  middleware,
  prefixer,
  serialize,
  stringify,
} from "stylis"

type templateVar = ((arg0: any) => string) | number | string

function parse(str: TemplateStringsArray, ...data: templateVar[]) {
  return (props: any) => {
    let cssString = ""
    let i = 0
    let j = 0
    while (i < str.length) {
      cssString += str[i]

      if (data[j] && typeof data[j] === "function") {
        cssString += (data[j] as (arg0: any) => string)(props)
      }
      if (data[j] && typeof data[j] === "number") {
        cssString += data[j]
      }
      if (data[j] && typeof data[j] === "string") {
        cssString += data[j]
      }
      i++
      j++
    }

    const className = `wwf_${hash(cssString, 10)}`

    const styleStr = serialize(
      compile(`.${className} {${cssString}}`),
      middleware([prefixer, stringify])
    )

    const styleElement = document.createElement("style")
    styleElement.innerHTML = styleStr
    document.head.appendChild(styleElement)

    return className
  }
}

type creator<K extends keyof HTMLElementTagNameMap> = (
  str: TemplateStringsArray,
  ...data: templateVar[]
) => data2element<K>

type data2element<K extends keyof HTMLElementTagNameMap> = (
  arg: any
) => HTMLElementTagNameMap[K]

const styles = <K extends keyof HTMLElementTagNameMap>(tag: K): creator<K> => {
  const element = document.createElement(tag)

  return (str: TemplateStringsArray, ...data: templateVar[]) => {
    const cssCreator = parse(str, ...data)
    return (data: any) => {
      const className = cssCreator(data)
      element.classList.add(className)
      return element
    }
  }
}

export default styles
