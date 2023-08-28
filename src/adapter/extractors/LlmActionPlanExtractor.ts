import { Ok } from '@sniptt/monads'
import { v4 as uuid } from 'uuid'

import { PromisedResult, UnknownRuntimeError, unknownRuntimeError } from '../../_shared/error'
import { WebPageWithAssociation } from '../../domain/entities/_gen/WebPageWithAssociation'
import { ActionPlanWithAssociation } from '../../domain/entities/_gen/ActionPlanWithAssociation'
import { OpenAiClient } from '../_shared/OpenAiClient'
import { UserRequestWithAssociation } from '../../domain/entities/_gen/UserRequestWithAssociation'
import { actionPlanClickFormatInstruction } from '../_shared/_gen/formatInstructions/actionPlanClickFormatInstruction'
import { actionPlanCollectDataFormatInstruction } from '../_shared/_gen/formatInstructions/actionPlanCollectDataFormatInstruction'
import { actionPlanCreateSpreadsheetFormatInstruction } from '../_shared/_gen/formatInstructions/actionPlanCreateSpreadsheetFormatInstruction'
import { actionPlanAppendSheetToSpreadsheetFormatInstruction } from '../_shared/_gen/formatInstructions/actionPlanAppendSheetToSpreadsheetFormatInstruction'
import { checkEntityTypeActionPlanWithAssociationList } from '../../domain/_shared/_gen/checkEntityTypes/withAssociationList/checkEntityTypeActionPlanWithAssociationList'
import { ActionPlanExtractor } from '../../domain/interfaces/extractors/ActionPlanExtractor'
import { actionPlanReportResultFormatInstruction } from '../_shared/_gen/formatInstructions/actionPlanReportResultFormatInstruction'

export class LlmActionPlanExtractor implements ActionPlanExtractor {
  constructor(private readonly openAiClient: OpenAiClient) {}

  extractFromWebPageAndUserRequestAndActionPlans = async (
    webPage: WebPageWithAssociation,
    userRequest: UserRequestWithAssociation,
    actionPlans: ActionPlanWithAssociation[],
  ): PromisedResult<ActionPlanWithAssociation[], UnknownRuntimeError> => {
    const prompt = `Please create ActionPlans to complete the following UserRequest:
    URL: ${userRequest.url}
    Prompt: ${userRequest.prompt}}
    Requested At: ${userRequest.requestedAt}

    Current ActionPlans:
    ${JSON.stringify(actionPlans, null, 2)}

    Output Format (JSON):
    [
      // Choose one of the following:
      ${[
        actionPlanClickFormatInstruction('<label of the element>', '<coordinate of center of the element>', '<coordinate of center of the element>'),
        // actionPlanObserveWebPageFormatInstruction('<url of the web page>'),
        actionPlanCollectDataFormatInstruction('<name:put date and time to identify>', '<url of the web page>', '<explain what to collect>'),
        actionPlanCreateSpreadsheetFormatInstruction('<name:put date and time to identify:human friendly:japanese>', '<description of the spreadsheet>'),
        actionPlanAppendSheetToSpreadsheetFormatInstruction(
          '<parent spreadsheet name>',
          '<name:human friendly:japanese>',
          '<description of the sheet>',
          '<name of the collected data>',
        ),
        actionPlanReportResultFormatInstruction('<message text to report. put placeholder if necessary>'),
      ].join(',\n')}
    ]
    `

    console.log(`[LlmActionPlanExtractor] extractFromWebPageAndUserRequestAndActionPlans: prompt: ${prompt}`)

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
      console.error(`[LlmActionPlanExtractor] failed to : ${JSON.stringify(e)}`)

      return unknownRuntimeError('parsedMessageContent cannot be parsed')
    }

    if (!Array.isArray(parsedMessageContent)) {
      return unknownRuntimeError('parsedMessageContent is not an array')
    }

    const actionPlanWithAssociation = parsedMessageContent.map((el: unknown) => {
      const actionPlanId = uuid().toString()

      return {
        id: actionPlanId,
        actionPlanId,
        userRequestId: userRequest.id,
        ...(el ?? {}),
      }
    })

    if (!checkEntityTypeActionPlanWithAssociationList(actionPlanWithAssociation)) {
      console.error(
        `[LlmActionPlanExtractor] extractFromWebPageAndUserRequestAndActionPlans: parsedMessageContent is not ActionPlanWithAssociation: ${JSON.stringify(
          actionPlanWithAssociation,
          null,
          2,
        )}`,
      )

      return unknownRuntimeError('parsedMessageContent is not ActionPlanWithAssociation')
    }

    return Ok(actionPlanWithAssociation)
  }
}
