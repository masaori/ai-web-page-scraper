import { Ok } from '@sniptt/monads'
import { v4 as uuid } from 'uuid'

import { PromisedResult, UnknownRuntimeError, unknownRuntimeError } from '../../_shared/error'
import { OpenAiClient } from '../_shared/OpenAiClient'
import { ActionResultReportResultExtractor } from '../../domain/interfaces/extractors/ActionResultReportResultExtractor'
import { ActionResultReportResult } from '../../domain/entities/ActionResultReportResult'
import { UserRequest } from '../../domain/entities/UserRequest'
import { ActionResultWithAssociation } from '../../domain/entities/_gen/ActionResultWithAssociation'
import { actionResultReportResultFormatInstruction } from '../_shared/_gen/formatInstructions/actionResultReportResultFormatInstruction'
import { checkEntityTypeActionResultReportResultWithAssociation } from '../../domain/_shared/_gen/checkEntityTypes/withAssociation/checkEntityTypeActionResultReportResultWithAssociation'

export class LlmActionResultReportResultExtractor implements ActionResultReportResultExtractor {
  constructor(private readonly openAiClient: OpenAiClient) {}

  extractFromUserRequestAndActionResults = async (
    userRequest: UserRequest,
    actionResults: ActionResultWithAssociation[],
  ): PromisedResult<ActionResultReportResult, UnknownRuntimeError> => {
    const prompt = `Please create ActionResultReportResult to complete the following UserRequest:
    URL: ${userRequest.url}
    Prompt: ${userRequest.prompt}}
    Requested At: ${userRequest.requestedAt}

    All ActionResults:
    ${JSON.stringify(actionResults, null, 2)}

    Output Format (JSON):
    ${actionResultReportResultFormatInstruction('<ユーザーへの返答を日本語で>')}
    `

    console.log(`[LlmActionResultReportResultExtractor] extractFromWebPageAndUserRequestAndActionResultReportResults: prompt: ${prompt}`)

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
      console.error(`[LlmActionResultReportResultExtractor] failed to : ${JSON.stringify(e)}`)

      return unknownRuntimeError('parsedMessageContent cannot be parsed')
    }

    const actionResultId = uuid().toString()

    const actionResultReportResultWithAssociation: unknown = {
      actionResultId,
      ...(parsedMessageContent ?? {}),
    }

    if (!checkEntityTypeActionResultReportResultWithAssociation(actionResultReportResultWithAssociation)) {
      console.error(
        `[LlmActionResultReportResultExtractor] extractFromWebPageAndUserRequestAndActionResultReportResults: actionResultReportResultWithAssociation is not ActionResultReportResultWithAssociation: ${JSON.stringify(
          actionResultReportResultWithAssociation,
          null,
          2,
        )}`,
      )

      return unknownRuntimeError('actionResultReportResultWithAssociation is not ActionResultReportResultWithAssociation')
    }

    return Ok(actionResultReportResultWithAssociation)
  }
}
