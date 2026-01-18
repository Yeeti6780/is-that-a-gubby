module.exports = {
  helpf: '(phrase | target | source)',
  desc: 'Translates the phrase inside the function from source to target, otherwise auto.',
  func: async function (matches) {
    let poopy = this
    let { splitKeyFunc } = poopy.functions
    let vars = poopy.vars
    let { axios } = poopy.modules

    var word = matches[1]
    var split = splitKeyFunc(word, { args: 3 })
    var phrase = split[0] ?? ''
    var target = split[1] ?? 'en'
    var source = split[2] ?? 'auto'

    if (Object.entries(vars.languages).find(language => language[0] == target.toLowerCase() || language[1] == target.toLowerCase())) {
      target = Object.entries(vars.languages).find(language => language[0] == target.toLowerCase() || language[1] == target.toLowerCase())[0]
    } else {
      target == 'en'
    }

    if (Object.entries(vars.languages).find(language => language[0] == source.toLowerCase() || language[1] == source.toLowerCase())) {
      source = Object.entries(vars.languages).find(language => language[0] == source.toLowerCase() || language[1] == source.toLowerCase())[0]
    } else {
      source == 'auto'
    }

    var options = {
      method: 'GET',
      url: "https://translate-pa.googleapis.com/v1/translate?" + new URLSearchParams({
        "params.client": "gtx",
        "dataTypes": "TRANSLATION",
        "key": "AIzaSyDLEeFI5OtFBwYBIoK_jj5m32rZK5CkCXA", // some google API key
        "query.sourceLanguage": source,
        "query.targetLanguage": target,
        "query.text": phrase
      })
    };

    var response = await axios(options).catch(() => { })

    if (response) {
      return response.data.translation
    }

    return phrase
  },
  attemptvalue: 10,
  limit: 5,
  cmdconnected: 'translate'
}
