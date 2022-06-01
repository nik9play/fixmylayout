let textWindow = document.createElement("div")
textWindow.style.position = "fixed"
textWindow.style.boxShadow = "rgba(0, 0, 0, 0.6) 0px 2px 8px -4px"
textWindow.style.backgroundColor = "white"
textWindow.style.borderRadius = "8px"
textWindow.style.minWidth = "100px"
textWindow.style.minHeight = "70px"
textWindow.style.zIndex = "1000000"
textWindow.style.display = "none"
textWindow.style.padding = "26px 10px 10px"
textWindow.style.color = "#000000"
textWindow.style.fontFamily = "sans-serif"
textWindow.style.boxSizing = "border-box"
textWindow.style.lineHeight = "1.2"
textWindow.style.maxHeight = "50vh"
textWindow.style.maxWidth = "50vw"
textWindow.style.minWidth = "300px"

textWindow.style.left = "0px"
textWindow.style.top = "0px"

let closeWindow = document.createElement("img")
closeWindow.setAttribute("src", browser.runtime.getURL("imgs/close.svg"))
closeWindow.style.width = "16px"
closeWindow.style.height = "16px"
closeWindow.style.position = "absolute"
closeWindow.style.right = "8px"
closeWindow.style.top = "8px"
closeWindow.style.cursor = "pointer"

let titleWindow = document.createElement("span")
titleWindow.style.fontSize = "14px"
titleWindow.style.fontWeight = "bold"
titleWindow.style.paddingRight = "24px"
titleWindow.style.left = "8px"
titleWindow.style.top = "8px"
titleWindow.style.position = "absolute"
titleWindow.style.cursor = "move"

let resultTextWindow = document.createElement("span")
resultTextWindow.style.fontSize = "14px"
resultTextWindow.style.overflow = "auto"

textWindow.appendChild(closeWindow)
textWindow.appendChild(titleWindow)
textWindow.appendChild(resultTextWindow)

document.body.appendChild(textWindow)

closeWindow.onclick = function() {
  textWindow.style.display = "none"
}

titleWindow.onmousedown = function(event) {
  event.preventDefault();
  textWindow.style.opacity = "0.8"

  let shiftX = event.clientX - textWindow.getBoundingClientRect().left
  let shiftY = event.clientY - textWindow.getBoundingClientRect().top

  function moveAt(clientX, clientY) {
    textWindow.style.left = clientX - shiftX + 'px'
    textWindow.style.top = clientY - shiftY + 'px'
  }

  function onMouseMove(event) {
    event.preventDefault()
    moveAt(event.clientX, event.clientY);
  }

  document.addEventListener('mousemove', onMouseMove);

  titleWindow.onmouseup = function() {
    textWindow.style.opacity = "1"
    document.removeEventListener('mousemove', onMouseMove)
    document.onMouseMove = null
  }
}

textWindow.ondragstart = function() {
  return false
}

function setCaretContentEditable(el, pos) {
  let range = document.createRange()
  let sel = window.getSelection()
  range.setStart(el.childNodes[0], pos)
  range.collapse(true)
  sel.removeAllRanges()
  sel.addRange(range)
  el.focus()
}

function isTextBox(element) {
  const tagName = element.tagName.toLowerCase()

  if (tagName === 'textarea') return true
  if (tagName !== 'input') return false

  const type = element.getAttribute('type').toLowerCase()
  const inputTypes = ['text', 'password', 'email', 'url', 'search']

  return inputTypes.includes(type)
}

function tabReceiver(request, sender, sendResponse) {
  let input = document.activeElement
  switch (request.command) {
    case "fix-selected-text-layout":
      let element = window.getSelection().anchorNode.parentElement
      let rect = element.getBoundingClientRect();
      
      titleWindow.innerText = `Точность определения: ${request.accuracy * 100}%`
      resultTextWindow.innerText = `${request.text}`

      textWindow.style.left = rect.x.toString() + "px"
      textWindow.style.top = rect.y.toString() + "px"
      textWindow.style.display = "flex"
      break
    case "fix-input-result":
      if (!isTextBox(input)) {
        if (!input.isContentEditable)
          break
      }

      if (input.isContentEditable) {
        input.innerText = request.text
        setCaretContentEditable(input, input.innerText.length)
      } else {
        input.value = request.text
      }

      break
    case "get-input-text":
      if (!isTextBox(input)) {
        if (!input.isContentEditable)
          break
      }

      let value

      if (input.isContentEditable) {
        value = input.innerText
      } else {
        value = input.value
      }

      browser.runtime.sendMessage({
        type: "send-input-text", 
        text: value
      })
      break
  }
}
browser.runtime.onMessage.addListener(tabReceiver)