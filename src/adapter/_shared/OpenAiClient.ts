import fs from 'fs'
import { OpenAI } from 'openai'

export class OpenAiClient {
  private openAiClient: OpenAI

  constructor() {
    const OPENAI_API_KEY = fs.readFileSync('./openapi_key.txt', 'utf8').trim()

    this.openAiClient = new OpenAI({
      apiKey: OPENAI_API_KEY,
    })
  }

  createEmbedding = async (text: string) => {
    const result = await this.openAiClient.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text,
    })

    return result.data
  }

  createChatCompletion = async (messages: Parameters<typeof this.openAiClient.chat.completions.create>[0]['messages']) => {
    const result = await this.openAiClient.chat.completions.create({
      model: 'gpt-4',
      messages,
    })

    if (!result.choices[0]?.message) {
      throw new Error('[OpenAiClient]: Failed to get message')
    }

    return result.choices[0].message
  }
}
