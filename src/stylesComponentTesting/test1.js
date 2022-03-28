const c = "#fff"

function parse(str, ...data) {
  console.log(str)
  console.log(data)
}

export default () => {
  parse`color: ${props => props.color};`
}
