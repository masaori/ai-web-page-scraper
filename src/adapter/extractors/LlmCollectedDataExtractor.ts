import { v4 as uuid } from 'uuid'

import { PromisedResult, UnknownRuntimeError, unknownRuntimeError } from '../../_shared/error'
import { ActionPlanCollectData } from '../../domain/entities/ActionPlanCollectData'
import { CollectedDataWithAssociation } from '../../domain/entities/_gen/CollectedDataWithAssociation'
import { WebPageElementWithAssociation } from '../../domain/entities/_gen/WebPageElementWithAssociation'
import { CollectedDataExtractor } from '../../domain/interfaces/extractors/CollectedDataExtractor'
import { OpenAiClient } from '../_shared/OpenAiClient'
import { Ok } from '@sniptt/monads'

export class LlmCollectedDataExtractor implements CollectedDataExtractor {
  constructor(private readonly openAiClient: OpenAiClient) {}

  extractFromWebPageElementsAndActionPlanCollectData = async (
    webPageElements: WebPageElementWithAssociation[],
    actionPlanCollectData: ActionPlanCollectData,
  ): PromisedResult<CollectedDataWithAssociation, UnknownRuntimeError> => {
    const prompt = `Please collect the following data:
    ${JSON.stringify(actionPlanCollectData, null, 2)}

    Current WebPageElements:
    ${
      // JSON.stringify(
      //   webPageElements.map((e) => {
      //     const copy: Partial<WebPageElementWithAssociation> = { ...e }

      //     delete copy.id
      //     delete copy.webPageId
      //     delete copy.webPageElementId
      //     delete copy.order
      //     delete copy.top
      //     delete copy.left
      //     delete copy.width
      //     delete copy.height

      //     return copy
      //   }),
      //   null,
      //   2,
      // )
      webPageElements.map((e) => `${e.text} {left:${e.left},top:${e.top}}`).join('\n')
    }

    ActionPlanCollectData:
    ${JSON.stringify(actionPlanCollectData, null, 2)}

    Output Format (JSON):
    // 2D array of string, number or ISO 8601 date string
    [
      ["header1", "header2", "header3"],
      ["data1", 1, "1999-12-31T23:59:59.999Z"],
      ["data2", 2, "1999-12-31T23:59:59.999Z"],
      ["data3", 3, "1999-12-31T23:59:59.999Z"]
    ]
    `

    console.log(`[LlmCollectedDataExtractor] extractFromWebPageElementsAndActionPlanCollectData: prompt: ${prompt}`)

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

    if (typeof parsedMessageContent !== 'object' || !parsedMessageContent || !Array.isArray(parsedMessageContent)) {
      console.error(
        `[LlmActionPlanExtractor] extractFromWebPageAndUserRequestAndActionPlans: parsedMessageContent is array: ${JSON.stringify(
          parsedMessageContent,
          null,
          2,
        )}`,
      )

      return unknownRuntimeError('parsedMessageContent cannot be parsed')
    }

    for (const el of parsedMessageContent) {
      if (typeof parsedMessageContent !== 'object' || !parsedMessageContent || !Array.isArray(parsedMessageContent)) {
        console.error(
          `[LlmActionPlanExtractor] extractFromWebPageAndUserRequestAndActionPlans: element of parsedMessageContent is not array: ${JSON.stringify(
            parsedMessageContent,
            null,
            2,
          )}`,
        )

        return unknownRuntimeError('parsedMessageContent cannot be parsed')
      }

      for (const e of el) {
        if (typeof e !== 'string' && typeof e !== 'number' && typeof e !== 'string') {
          console.error(
            `[LlmActionPlanExtractor] extractFromWebPageAndUserRequestAndActionPlans: element of element of parsedMessageContent is not string, number or ISO 8601 date string: ${JSON.stringify(
              parsedMessageContent,
              null,
              2,
            )}`,
          )

          return unknownRuntimeError('parsedMessageContent cannot be parsed')
        }
      }
    }

    const collectedDataId = uuid().toString()
    const collectedDataWithAssociation: CollectedDataWithAssociation = {
      id: collectedDataId,
      name: actionPlanCollectData.collectedDataName,
      webPageUrl: actionPlanCollectData.webPageUrl,
      description: actionPlanCollectData.whatToCollect,
      dataJson: JSON.stringify(parsedMessageContent),
      spreadsheetSheet: null,
    }

    console.log(`[LlmCollectedDataExtractor] extractFromWebPageElementsAndActionPlanCollectData: ${JSON.stringify(parsedMessageContent, null, 2)}`)

    return Ok(collectedDataWithAssociation)
  }
}
