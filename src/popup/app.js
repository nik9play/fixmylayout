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

function saveSettings() {
  browser.storage.sync.set({
    pasteFromClipboard: pasteFromClipboard.checked
  })
}

pasteFromClipboard.onchange = saveSettings

function loadSettings() {
  browser.storage.sync.get().then(d => {
    if (typeof d.pasteFromClipboard == "undefined") {
      browser.storage.sync.set({
        pasteFromClipboard: true
      })
      loadSettings()
    } else {
      pasteFromClipboard.checked = d.pasteFromClipboard
    }
  })
}

loadSettings()