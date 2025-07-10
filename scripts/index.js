const apiKeyInput = document.querySelector('#apiKey')
const gameSelect = document.querySelector('#gameSelect')
const questionInput = document.querySelector('#questionInput')
const askButton = document.querySelector("#askButton")
const form = document.querySelector("#form")
const aiResponse = document.querySelector('#aiResponse')
//só para não exibir a chave - KEY
const askIa = async(question, game, apiKey) => {
  const model = "gemini-2.5-flash"
  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
  const pergunta = `
    olha, tenho esse jogo ${game} e queria saber sobre isso ${question}
  `
  const contents = [{
    parts:[{
      text:pergunta
    }]
  }]

  //chamada api

  const response = await fetch(geminiUrl, {
    method: 'POST',
    headers:{
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents
    })
  })

  const data = await response.json()
  console.log({data})
  return data
}

const sendForm = async (event) => {
  event.preventDefault()
  const apiKey = apiKeyInput.value
  const game = gameSelect.value
  const question = questionInput.value

  if(apiKey == '' || game == '' || question == ''){
    alert('Confira os campos vazios !')
    return
  }

  askButton.disabled = true;
  askButton.textContent = 'Perguntando...'
  askButton.classList.add('loading')

  try{
   await askIa(question, game, apiKey)
  }catch(error){
    console.log('Erro:', error)
  }finally{
    askButton.disabled = false
    askButton.textContent = "Perguntar"
    askButton.classList.remove('loading')
  }
}

form.addEventListener('submit', sendForm);
