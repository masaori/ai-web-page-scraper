// This file is generated by scripts/generateInitializeVectorDb.ts
import { QdrantClient } from '../../../../_shared/QdrantClient'

export const initializeVectorDb = async (): Promise<void> => {
  const qdrantClient = new QdrantClient()

  const getAllCollectionsResult = await qdrantClient.getCollections()

  if (!getAllCollectionsResult.collections.find((collection) => collection.name === 'action_plan')) {
    await qdrantClient.createCollection('action_plan', {
      vectors: {
        size: 1536,
        distance: 'Cosine',
      },
    })
    await qdrantClient.createPayloadIndex('action_plan', {
      field_name: 'userRequestId',
      field_schema: 'keyword',
      wait: true,
    })
  }

  if (!getAllCollectionsResult.collections.find((collection) => collection.name === 'action_plan_append_sheet_to_spreadsheet')) {
    await qdrantClient.createCollection('action_plan_append_sheet_to_spreadsheet', {
      vectors: {
        size: 1536,
        distance: 'Cosine',
      },
    })
    await qdrantClient.createPayloadIndex('action_plan_append_sheet_to_spreadsheet', {
      field_name: 'actionPlanId',
      field_schema: 'keyword',
      wait: true,
    })
  }

  if (!getAllCollectionsResult.collections.find((collection) => collection.name === 'action_plan_click')) {
    await qdrantClient.createCollection('action_plan_click', {
      vectors: {
        size: 1536,
        distance: 'Cosine',
      },
    })
    await qdrantClient.createPayloadIndex('action_plan_click', {
      field_name: 'actionPlanId',
      field_schema: 'keyword',
      wait: true,
    })
  }

  if (!getAllCollectionsResult.collections.find((collection) => collection.name === 'action_plan_collect_data')) {
    await qdrantClient.createCollection('action_plan_collect_data', {
      vectors: {
        size: 1536,
        distance: 'Cosine',
      },
    })
    await qdrantClient.createPayloadIndex('action_plan_collect_data', {
      field_name: 'actionPlanId',
      field_schema: 'keyword',
      wait: true,
    })
  }

  if (!getAllCollectionsResult.collections.find((collection) => collection.name === 'action_plan_create_spreadsheet')) {
    await qdrantClient.createCollection('action_plan_create_spreadsheet', {
      vectors: {
        size: 1536,
        distance: 'Cosine',
      },
    })
    await qdrantClient.createPayloadIndex('action_plan_create_spreadsheet', {
      field_name: 'actionPlanId',
      field_schema: 'keyword',
      wait: true,
    })
  }

  if (!getAllCollectionsResult.collections.find((collection) => collection.name === 'action_plan_observe_web_page')) {
    await qdrantClient.createCollection('action_plan_observe_web_page', {
      vectors: {
        size: 1536,
        distance: 'Cosine',
      },
    })
    await qdrantClient.createPayloadIndex('action_plan_observe_web_page', {
      field_name: 'actionPlanId',
      field_schema: 'keyword',
      wait: true,
    })
  }

  if (!getAllCollectionsResult.collections.find((collection) => collection.name === 'action_plan_report_result')) {
    await qdrantClient.createCollection('action_plan_report_result', {
      vectors: {
        size: 1536,
        distance: 'Cosine',
      },
    })
    await qdrantClient.createPayloadIndex('action_plan_report_result', {
      field_name: 'actionPlanId',
      field_schema: 'keyword',
      wait: true,
    })
  }

  if (!getAllCollectionsResult.collections.find((collection) => collection.name === 'action_result')) {
    await qdrantClient.createCollection('action_result', {
      vectors: {
        size: 1536,
        distance: 'Cosine',
      },
    })
    await qdrantClient.createPayloadIndex('action_result', {
      field_name: 'actionPlanId',
      field_schema: 'keyword',
      wait: true,
    })
  }

  if (!getAllCollectionsResult.collections.find((collection) => collection.name === 'action_result_append_sheet_to_spreadsheet')) {
    await qdrantClient.createCollection('action_result_append_sheet_to_spreadsheet', {
      vectors: {
        size: 1536,
        distance: 'Cosine',
      },
    })
    await qdrantClient.createPayloadIndex('action_result_append_sheet_to_spreadsheet', {
      field_name: 'actionResultId',
      field_schema: 'keyword',
      wait: true,
    })
  }

  if (!getAllCollectionsResult.collections.find((collection) => collection.name === 'action_result_click')) {
    await qdrantClient.createCollection('action_result_click', {
      vectors: {
        size: 1536,
        distance: 'Cosine',
      },
    })
    await qdrantClient.createPayloadIndex('action_result_click', {
      field_name: 'actionResultId',
      field_schema: 'keyword',
      wait: true,
    })
  }

  if (!getAllCollectionsResult.collections.find((collection) => collection.name === 'action_result_collect_data')) {
    await qdrantClient.createCollection('action_result_collect_data', {
      vectors: {
        size: 1536,
        distance: 'Cosine',
      },
    })
    await qdrantClient.createPayloadIndex('action_result_collect_data', {
      field_name: 'actionResultId',
      field_schema: 'keyword',
      wait: true,
    })
  }

  if (!getAllCollectionsResult.collections.find((collection) => collection.name === 'action_result_create_spreadsheet')) {
    await qdrantClient.createCollection('action_result_create_spreadsheet', {
      vectors: {
        size: 1536,
        distance: 'Cosine',
      },
    })
    await qdrantClient.createPayloadIndex('action_result_create_spreadsheet', {
      field_name: 'actionResultId',
      field_schema: 'keyword',
      wait: true,
    })
  }

  if (!getAllCollectionsResult.collections.find((collection) => collection.name === 'action_result_observe_web_page')) {
    await qdrantClient.createCollection('action_result_observe_web_page', {
      vectors: {
        size: 1536,
        distance: 'Cosine',
      },
    })
    await qdrantClient.createPayloadIndex('action_result_observe_web_page', {
      field_name: 'actionResultId',
      field_schema: 'keyword',
      wait: true,
    })
  }

  if (!getAllCollectionsResult.collections.find((collection) => collection.name === 'action_result_report_result')) {
    await qdrantClient.createCollection('action_result_report_result', {
      vectors: {
        size: 1536,
        distance: 'Cosine',
      },
    })
    await qdrantClient.createPayloadIndex('action_result_report_result', {
      field_name: 'actionResultId',
      field_schema: 'keyword',
      wait: true,
    })
  }

  if (!getAllCollectionsResult.collections.find((collection) => collection.name === 'collected_data')) {
    await qdrantClient.createCollection('collected_data', {
      vectors: {
        size: 1536,
        distance: 'Cosine',
      },
    })
  }

  if (!getAllCollectionsResult.collections.find((collection) => collection.name === 'spreadsheet')) {
    await qdrantClient.createCollection('spreadsheet', {
      vectors: {
        size: 1536,
        distance: 'Cosine',
      },
    })
  }

  if (!getAllCollectionsResult.collections.find((collection) => collection.name === 'spreadsheet_sheet')) {
    await qdrantClient.createCollection('spreadsheet_sheet', {
      vectors: {
        size: 1536,
        distance: 'Cosine',
      },
    })
    await qdrantClient.createPayloadIndex('spreadsheet_sheet', {
      field_name: 'spreadsheetId',
      field_schema: 'keyword',
      wait: true,
    })
    await qdrantClient.createPayloadIndex('spreadsheet_sheet', {
      field_name: 'collectedDataId',
      field_schema: 'keyword',
      wait: true,
    })
  }

  if (!getAllCollectionsResult.collections.find((collection) => collection.name === 'user_request')) {
    await qdrantClient.createCollection('user_request', {
      vectors: {
        size: 1536,
        distance: 'Cosine',
      },
    })
  }

  if (!getAllCollectionsResult.collections.find((collection) => collection.name === 'web_page')) {
    await qdrantClient.createCollection('web_page', {
      vectors: {
        size: 1536,
        distance: 'Cosine',
      },
    })
  }

  if (!getAllCollectionsResult.collections.find((collection) => collection.name === 'web_page_element')) {
    await qdrantClient.createCollection('web_page_element', {
      vectors: {
        size: 1536,
        distance: 'Cosine',
      },
    })
    await qdrantClient.createPayloadIndex('web_page_element', {
      field_name: 'webPageId',
      field_schema: 'keyword',
      wait: true,
    })
  }

  if (!getAllCollectionsResult.collections.find((collection) => collection.name === 'web_page_element_page_link')) {
    await qdrantClient.createCollection('web_page_element_page_link', {
      vectors: {
        size: 1536,
        distance: 'Cosine',
      },
    })
    await qdrantClient.createPayloadIndex('web_page_element_page_link', {
      field_name: 'webPageElementId',
      field_schema: 'keyword',
      wait: true,
    })
  }

  if (!getAllCollectionsResult.collections.find((collection) => collection.name === 'web_page_element_text')) {
    await qdrantClient.createCollection('web_page_element_text', {
      vectors: {
        size: 1536,
        distance: 'Cosine',
      },
    })
    await qdrantClient.createPayloadIndex('web_page_element_text', {
      field_name: 'webPageElementId',
      field_schema: 'keyword',
      wait: true,
    })
  }
}
