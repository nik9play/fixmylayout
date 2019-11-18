let textWindow = document.createElement("div")
textWindow.style.position = "fixed"
textWindow.style.boxShadow = "rgba(0, 0, 0, 0.6) 0px 2px 8px -4px"
textWindow.style.backgroundColor = "white"
textWindow.style.borderRadius = "8px"
textWindow.style.minWidth = "100px"
textWindow.style.minHeight = "70px"
textWindow.style.zIndex = "1000000"
textWindow.style.display = "none"
textWindow.style.padding = "10px"
textWindow.style.justifyItems = "start"
textWindow.style.color = "#000000"
textWindow.style.fontFamily = "sans-serif"
textWindow.style.boxSizing = "border-box"
textWindow.style.lineHeight = "1.2"

textWindow.style.left = "0px"
textWindow.style.top = "0px"

let closeWindow = document.createElement("img")
closeWindow.setAttribute("src", browser.extension.getURL("imgs/close.svg"))
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

let resultTextWindow = document.createElement("span")
resultTextWindow.style.fontSize = "14px"

textWindow.appendChild(closeWindow)
textWindow.appendChild(titleWindow)
textWindow.appendChild(resultTextWindow)

document.body.appendChild(textWindow)

closeWindow.onclick = function() {
  textWindow.style.display = "none"
}

textWindow.onmousedown = function(event) {
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

  textWindow.onmouseup = function() {
    textWindow.style.opacity = "1"
    document.removeEventListener('mousemove', onMouseMove);
    textWindow.onmouseup = null;
  }
}

textWindow.ondragstart = function() {
  return false;
}

function escapeHTML(html) {
  return html.replace(/[&"'<>]/g, (m) => ({ "&": "&amp;", '"': "&quot;", "'": "&#39;", "<": "&lt;", ">": "&gt;" })[m])
}

function tabReceiver(request, sender, sendResponse) {
  let input = document.activeElement
  switch (request.command) {
    case "fix-selected-text-layout":
      let element = window.getSelection().anchorNode.parentElement
      let rect = element.getBoundingClientRect();
      
      titleWindow.innerHTML = `Точность определения: ${request.accuracy * 100}%`
      resultTextWindow.innerHTML = `${escapeHTML(request.text)}`

      textWindow.style.left = rect.x.toString() + "px"
      textWindow.style.top = rect.y.toString() + "px"
      textWindow.style.display = "inline-grid"
      break
    case "fix-input-result":
      console.log(request.text)
      input.value = request.text
      break
    case "get-input-text":
      browser.runtime.sendMessage({
        type: "send-input-text", 
        text: input.value
      })
      break
  }
}
browser.runtime.onMessage.addListener(tabReceiver)