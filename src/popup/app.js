import 'bulma/css/bulma.css'
import converter from '../background/converter'
import hotkeys from 'hotkeys-js'

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

hotkeys.filter = function(event) {
  console.log(event)
  let id = (event.target || event.srcElement).id;
  return (id == 'hotkey-input')
}

hotkeys('*', function() {
  console.log(hotkeys)
})

let hotkeyInput = document.getElementById("hotkey-input")
let pasteFromClipboard = document.getElementById("paste-from-clipboard")

function saveSettings() {
  browser.storage.sync.set({
    hotkeyInput: hotkeyInput.value,
    pasteFromClipboard: pasteFromClipboard.checked
  })
}

hotkeyInput.onchange = saveSettings
pasteFromClipboard.onchange = saveSettings

function loadSettings() {
  browser.storage.sync.get().then(d => {
    if (typeof d.hotkeyInput == "undefined") {
      browser.storage.sync.set({
        hotkeyInput: "ctrl+alt+d"
      })
      loadSettings()
    } else {
      hotkeyInput.value = d.hotkeyInput
    }
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