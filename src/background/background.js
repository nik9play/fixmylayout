import converter from "./converter"

// converter.text = "Pflfxf jhufybpfwbb? d jcj,tyyjcnb ;t yfxfkj gjdctlytdyjq hf,jns gj ajhvbhjdfyb. gjpbwbb gjpdjkztn jwtybnm pyfxtybt lfkmytqib[ yfghfdktybq hfpdbnbz/ C lheujq cnjhjys htfkbpfwbz yfvtxtyys[ gkfyjds[ pflfybq gjpdjkztn jwtybnm pyfxtybt ceotcndtyys[ abyfycjds[ b flvbybcnhfnbdys[ eckjdbq/ Hfdysv j,hfpjv hfvrb b vtcnj j,extybz rflhjd d pyfxbntkmyjq cntgtyb j,eckfdkbdftn cjplfybt cjjndtncnde.obq eckjdbq frnbdbpfwbb/ Hfdysv j,hfpjv hfvrb b vtcnj j,extybz rflhjd ghtlcnfdkztn cj,jq bynthtcysq 'rcgthbvtyn ghjdthrb cbcntvs j,extybz rflhjd? cjjndtncndetn yfceoysv gjnht,yjcnzv/ C lheujq cnjhjys htfkbpfwbz yfvtxtyys[ gkfyjds[ pflfybq nht,e.n jn yfc fyfkbpf cbcntv vfccjdjuj exfcnbz/ "
// console.log(converter.convert())

browser.contextMenus.create({
  id: "fix-layout",
  title: "Перевести раскладку",
  contexts: ["selection"]
})

let text
let accuracy

function sendSelectedText(tabs) {
  browser.tabs.sendMessage(tabs[0].id, {
    command: "fix-selected-text-layout",
    text: text,
    accuracy: accuracy
  })
}

browser.contextMenus.onClicked.addListener(function(info, tab) {
  switch (info.menuItemId) {
    case "fix-layout":
      console.log(info.selectionText);
      converter.text = info.selectionText
      converter.convert()
      accuracy = (converter.identifyResult[0] > converter.identifyResult[1] ? converter.identifyResult[0] : converter.identifyResult[1])
      text = converter.text

      let querying = browser.tabs.query({
        active: true,
        currentWindow: true
      });
      querying.then(sendSelectedText);

      break
  }
})

function mainReciever(request, sender, sendResponce) {
  switch (request.type) {
    case "fix-input-text":
      converter.text = request.text
      converter.convert()
      text = converter.text
      let querying = browser.tabs.query({
        active: true,
        currentWindow: true
      });
      querying.then(function(tabs) {
        browser.tabs.sendMessage(tabs[0].id, {
          command: "fix-input-result",
          text: text
        })
      })
      break
  }
}

browser.runtime.onMessage.addListener(mainReciever)

browser.storage.sync.get().then(d => {
  if (typeof d.hotkeyInput == "undefined") {
    browser.storage.sync.set({
      hotkeyInput: "ctrl+alt+d"
    })
    loadSettings()
  }
  if (typeof d.pasteFromClipboard == "undefined") {
    browser.storage.sync.set({
      pasteFromClipboard: true
    })
    loadSettings()
  }
})