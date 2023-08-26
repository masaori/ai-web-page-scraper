import { Ok } from '@sniptt/monads'
import { v4 as uuid } from 'uuid'

import { PromisedResult, UnknownRuntimeError, unknownRuntimeError } from '../../_shared/error'
import { WebPageWithAssociation } from '../../domain/entities/_gen/WebPageWithAssociation'
import { ActionPlanWithAssociation } from '../../domain/entities/_gen/ActionPlanWithAssociation'
import { OpenAiClient } from '../_shared/OpenAiClient'
import { UserRequestWithAssociation } from '../../domain/entities/_gen/UserRequestWithAssociation'
import { actionPlanClickFormatInstruction } from './_gen/formatInstructions/actionPlanClickFormatInstruction'
import { actionPlanObserveWebPageFormatInstruction } from './_gen/formatInstructions/actionPlanObserveWebPageFormatInstruction'
import { actionPlanCollectDataFormatInstruction } from './_gen/formatInstructions/actionPlanCollectDataFormatInstruction'
import { actionPlanCreateSpreadsheetFormatInstruction } from './_gen/formatInstructions/actionPlanCreateSpreadsheetFormatInstruction'
import { actionPlanAppendSheetToSpreadsheetFormatInstruction } from './_gen/formatInstructions/actionPlanAppendSheetToSpreadsheetFormatInstruction'
import { checkEntityTypeActionPlanWithAssociationList } from '../../domain/_shared/_gen/checkEntityTypes/withAssociationList/checkEntityTypeActionPlanWithAssociationList'
import { WebPageElementWithAssociation } from '../../domain/entities/_gen/WebPageElementWithAssociation'

export class LlmActionPlanPredictor {
  constructor(private readonly openAiClient: OpenAiClient) {}

  predictByWebPageAndUserRequestAndActionPlans = async (
    webPage: WebPageWithAssociation,
    userRequest: UserRequestWithAssociation,
    actionPlans: ActionPlanWithAssociation[],
  ): PromisedResult<ActionPlanWithAssociation[], UnknownRuntimeError> => {
    const prompt = `Please create ActionPlans to complete the following UserRequest:
    URL: ${userRequest.url}
    Prompt: ${userRequest.prompt}}

    Current WebPage:
    ${JSON.stringify(
      {
        ...webPage,
        webPageElements: webPage.webPageElements.map((e) => {
          const copy: Partial<WebPageElementWithAssociation> = { ...e }

          delete copy.id
          delete copy.webPageId
          delete copy.webPageElementId

          return copy
        }),
      },
      null,
      2,
    )}

    Current ActionPlans:
    ${JSON.stringify(actionPlans, null, 2)}

    Output Format (JSON):
    [
      // Choose one of the following:
      ${[
        actionPlanClickFormatInstruction('<label of the element>', '<coordinate of center of the element>', '<coordinate of center of the element>'),
        actionPlanObserveWebPageFormatInstruction('<url of the web page>'),
        actionPlanCollectDataFormatInstruction('<name of the data>', '<url of the web page>', '<description>'),
        actionPlanCreateSpreadsheetFormatInstruction('<title of the spreadsheet>'),
        actionPlanAppendSheetToSpreadsheetFormatInstruction('<parent spreadsheet title>', '<title of the sheet>', '<name of the collected data>'),
      ].join(',\n')}
    ]
    `

    console.log(`[LlmActionPlanPredictor] predictByWebPageAndUserRequestAndActionPlans: prompt: ${prompt}`)

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

    const parsedMessageContent: unknown = JSON.parse(createChatCompletionResult.content)

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
        `[LlmActionPlanPredictor] predictByWebPageAndUserRequestAndActionPlans: parsedMessageContent is not ActionPlanWithAssociation: ${JSON.stringify(
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
