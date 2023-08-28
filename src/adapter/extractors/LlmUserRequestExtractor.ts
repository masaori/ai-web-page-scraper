import { Ok } from '@sniptt/monads'
import { v4 as uuid } from 'uuid'

import { PromisedResult, UnknownRuntimeError, unknownRuntimeError } from '../../_shared/error'
import { OpenAiClient } from '../_shared/OpenAiClient'
import { UserRequest } from '../../domain/entities/UserRequest'
import { userRequestFormatInstruction } from '../_shared/_gen/formatInstructions/userRequestFormatInstruction'
import { checkEntityTypeUserRequest } from '../../domain/_shared/_gen/checkEntityTypes/single/checkEntityTypeUserRequest'

export class LlmUserRequestExtractor {
  constructor(private readonly openAiClient: OpenAiClient) {}

  extractFromUserMessage = async (userMessage: string): PromisedResult<UserRequest, UnknownRuntimeError> => {
    const prompt = `Please create UserRequest from the following message:
    User Message: ${userMessage}}
    Now: ${new Date().toISOString()}

    Output Format (JSON):
    ${userRequestFormatInstruction('<url of the web page>', '<prompt>', '<requested date>')}
    `

    console.log(`[LlmUserRequestExtractor] extractFromUserMessage: prompt: ${prompt}`)

    const createChatCompletionResult = await this.openAiClient.createChatCompletion([
      {
        role: 'system',
        content: 'If a specific output format is provided, please respond only with the output that follows that format, without including any explanations.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ])

    if (!createChatCompletionResult.content) {
      return unknownRuntimeError('createChatCompletionResult.content is null')
    }

    let parsedMessageContent: unknown

    try {
      parsedMessageContent = JSON.parse(createChatCompletionResult.content)
    } catch (e: unknown) {
      throw new Error(`[LlmUserRequestExtractor] failed to parse ${createChatCompletionResult.content} : ${JSON.stringify(e)}`)
    }

    const userRequestId = uuid().toString()
    const userRequest: unknown = {
      id: userRequestId,
      ...(parsedMessageContent ?? {}),
    }

    if (!checkEntityTypeUserRequest(userRequest)) {
      console.error(
        `[LlmUserRequestExtractor] extractFromUserMessage: parsedMessageContent is not ActionPlanWithAssociation: ${JSON.stringify(
          parsedMessageContent,
          null,
          2,
        )}`,
      )

      return unknownRuntimeError('parsedMessageContent is not ActionPlanWithAssociation')
    }

    return Ok(userRequest)
  }
}
