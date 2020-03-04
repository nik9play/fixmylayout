import 'bulma/css/bulma.css'
import converter from '../background/converter'

browser.storage.sync.get("pasteFromClipboard").then(d => {
  if (d.pasteFromClipboard) navigator.clipboard.readText().then(text => document.getElementById("textarea").value = text)
})

function fixLayout() {
  converter.text = document.getElementById("textarea").value
  converter.convert()
  document.getElementById("textarea").value = converter.text
}

let fixLayoutBtn = document.getElementById("fixLayoutBtn")
fixLayoutBtn.onclick = fixLayout

let pasteFromClipboard = document.getElementById("paste-from-clipboard")
let contextMenuBtn = document.getElementById("context-menu-btn")

function saveSettings() {
  browser.storage.sync.set({
    pasteFromClipboard: pasteFromClipboard.checked,
    contextMenuBtn: contextMenuBtn.checked
  })
}

pasteFromClipboard.onchange = saveSettings
contextMenuBtn.onchange = saveSettings

browser.storage.sync.get().then(d => {
  pasteFromClipboard.checked = d.pasteFromClipboard
  contextMenuBtn.checked = d.contextMenuBtn
})