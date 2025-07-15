const apiKeyInput = document.querySelector('#apiKey')
const gameSelect = document.querySelector('#gameSelect')
const questionInput = document.querySelector('#questionInput')
const askButton = document.querySelector("#askButton")
const form = document.querySelector("#form")
const aiResponse = document.querySelector('#aiResponse')

const markdownToHTML = (text) => {
  const converter = new showdown.Converter()
  return converter.makeHtml(text)
}

const askIa = async (question, game, apiKey) => {
  const model = "gemini-2.5-flash"
  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
const pergunta = `
Você é um especialista altamente qualificado no jogo ${game}, responsável por fornecer respostas atualizadas, estratégicas e confiáveis para perguntas sobre builds, decks, cartas, táticas ou composições de jogo.

Sua tarefa é responder a pergunta do usuário com base em fontes confiáveis e atualizadas, considerando o patch atual do jogo e as tendências mais recentes do meta.

---

🧠 **Regras obrigatórias:**

1. Se não souber a resposta, diga **exatamente**: "Não sei a resposta".
2. Se a pergunta não for sobre o jogo ${game}, diga: "Essa pergunta não está relacionada ao jogo ${game}".
3. Utilize apenas cartas, personagens, itens ou estratégias **que realmente existem no jogo atualmente**.
4. O custo médio do deck (quando aplicável) deve ser um número fixo, como **3.8**. **Nunca use intervalos** como “de 3.2 a 3.9”.
5. Os valores de Elixir das cartas devem estar **atualizados conforme o patch mais recente do jogo**.
6. O conteúdo da resposta deve ser dinâmico, **adaptado ao que o usuário pediu**, e **não deve repetir o exemplo fornecido** (exceto se for coincidentemente relevante).

---

📝 **Formato da resposta (em Markdown):**

- A resposta **deve ter no máximo 450 caracteres**.
- Seja direto, claro e objetivo.
- Comece com uma saudação curta e finalize com um incentivo breve.
- Liste as cartas com seus custos em Elixir.
- Se aplicável, apresente o custo médio do deck.

---

💡 **Exemplo de resposta (não repita isso literalmente):**

Olá! O melhor deck de Gigante atualmente é:

**Custo médio: 3.8 de elixir**

**Cartas e custos:**
- Gigante — 🧪 5  
- Mini P.E.K.K.A — 🧪 4  
- Mosqueteira — 🧪 4  
- Zap — 🧪 2  
- Bola de Fogo — 🧪 4  
- Flechas — 🧪 3  
- Bebê Dragão — 🧪 4  
- Coletor de Elixir — 🧪 6  

Boa sorte na arena! ⚔️

---

🎯 **Agora responda à seguinte pergunta:**
${question}
`
  const contents = [{
    role: "user",
    parts: [{
      text: pergunta
    }]
  }]

  const tools = [{
    google_search: {}

  }]

  const response = await fetch(geminiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents,
      tools
    })
  })

  const data = await response.json()
  return data.candidates[0].content.parts[0].text
}

const sendForm = async (event) => {
  event.preventDefault()
  const apiKey = apiKeyInput.value
  const game = gameSelect.value
  const question = questionInput.value

  if (apiKey == '' || game == '' || question == '') {
    alert('Confira os campos vazios !')
    return
  }

  askButton.disabled = true;
  askButton.textContent = 'Perguntando...'
  askButton.classList.add('loading')

  try {
    const text = await askIa(question, game, apiKey)
    aiResponse.querySelector('.response-content').innerHTML = markdownToHTML(text)
    aiResponse.classList.remove('hidden')
  } catch (error) {
    console.log('Erro:', error)
  } finally {
    askButton.disabled = false
    askButton.textContent = "Perguntar"
    askButton.classList.remove('loading')
  }
}
form.addEventListener('submit', sendForm);
