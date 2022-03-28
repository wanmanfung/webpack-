import styles from "."

export default () => {
  const blur = "20"

  const divCreator = styles("div")`
    color: ${props => props.color}; 
    background: ${props => props.background};
    box-shadow: 1px ${1}px ${blur}px #ff5156;
    .test{
        color: #000;
        &::after{
            content: '';
            display: flex;
            width: 100px;
            height: 100px;
            background: ${props => props.background};
        }
    }
    `

  const div = divCreator({
    color: "#fff",
    background: "#bbb",
  })

  const inner = document.createElement("div")
  inner.classList.add("test")
  inner.innerHTML = "testing"

  div.appendChild(inner)

  document.body.appendChild(div)
}
