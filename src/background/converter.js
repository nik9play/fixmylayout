import ruPC from "../layouts/ruPC"

export default {
  enLetters: [ "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "a", "s", "d", "f", "g", "h", "j", "k",
  "l", "z", "x", "c", "v", "b", "n", "m" ],

  text: "",

  identifyResult: "",

  identify: function() {
    let arrText = [...this.text]

    let allLetters = 0
    let ruLetters = 0
    let enLetters = 0

    arrText.forEach(char => {
      if (this.enLetters.includes(char)) {
        allLetters++
        enLetters++
      } else if (ruPC.letters.includes(char)) {
        allLetters++
        ruLetters++
      }
    })

    let ruP = ruLetters / allLetters
    let enP = enLetters / allLetters

    if (ruLetters == 0 && enLetters == 0) {
      this.identifyResult = [0, 0]
    } else {
      this.identifyResult = [ruP.toFixed(2), enP.toFixed(2)]
    }
  },

  convert: function() {
    this.identify()
    let layoutName
    
    if (this.identifyResult[0] == 0 && this.identifyResult[1] == 0) {
      layoutName = "none"
    } else if (this.identifyResult[0] > this.identifyResult[1]) {
      layoutName = "ru"
    } else if (this.identifyResult[0] < this.identifyResult[1]) {
      layoutName = "en"
    } else {
      layoutName = "none"
    }

    if (layoutName == "ru") {
      // let enChars = Object.getOwnPropertyNames(ruPC.chars)
      // Object.values(ruPC.chars).forEach((char, index) => {
      //   console.log(char)
      //   let newText = this.text.replace(new RegExp(char, "g"), enChars[index])
      //   if (char.toUpperCase() != char[index + 1]) {
      //     newText = newText.replace(new RegExp(char.toUpperCase(), "g"), enChars[index].toUpperCase())
      //   }

      //   this.text = newText
      //   console.log(this.text)
        
      // })

      let chars = [...this.text]
      let enChars = Object.getOwnPropertyNames(ruPC.chars)
      let ruChars = Object.values(ruPC.chars)

      chars.forEach((char, index) => {
        charIndex = ruChars.indexOf(char)

        if (charIndex != -1) {
          chars[index] = enChars[charIndex]
        } else if (charIndex == -1 && char.toUpperCase() != ruChars[charIndex + 1]) {
          charIndex = ruChars.indexOf(char.toLowerCase())
          if (charIndex != -1) chars[index] = enChars[charIndex].toUpperCase()
        }
      })

      this.text = chars.join("")
      console.log(this.text)
    } else if (layoutName == "en") {
      let chars = [...this.text]
      let enChars = Object.getOwnPropertyNames(ruPC.chars)
      let ruChars = Object.values(ruPC.chars)

      chars.forEach((char, index) => {
        charIndex = enChars.indexOf(char)

        if (charIndex != -1) {
          chars[index] = ruChars[charIndex]
        } else if (charIndex == -1) {
          charIndex = enChars.indexOf(char.toLowerCase())
          if (charIndex != -1) chars[index] = ruChars[charIndex].toUpperCase()
        }
      })

      this.text = chars.join("")
      console.log(this.text)
    } else if (layoutName == "none") {
      this.text = "Не удалось определить раскладку."
    }
  }
}