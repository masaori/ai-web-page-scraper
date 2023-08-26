import fs from 'fs'
import path from 'path'
import { google, sheets_v4, drive_v3 } from 'googleapis'

export class GoogleApiClient {
  private sheetsApi: sheets_v4.Sheets | null = null

  private driveApi: drive_v3.Drive | null = null

  private async authorize() {
    if (this.sheetsApi || this.driveApi) {
      return
    }

    const serviceAccountCredentialJson = fs.readFileSync(path.join(__dirname, '../../../google-service-account.json'), 'utf-8')
    const serviceAccountCredentials: unknown = JSON.parse(serviceAccountCredentialJson)

    if (
      !serviceAccountCredentials ||
      typeof serviceAccountCredentials !== 'object' ||
      !('client_email' in serviceAccountCredentials) ||
      !serviceAccountCredentials.client_email ||
      typeof serviceAccountCredentials.client_email !== 'string' ||
      !('private_key' in serviceAccountCredentials) ||
      !serviceAccountCredentials.private_key ||
      typeof serviceAccountCredentials.private_key !== 'string'
    ) {
      throw new Error('client_email or private_key is not found')
    }

    const jwtClient = new google.auth.JWT(
      serviceAccountCredentials.client_email,
      undefined,
      serviceAccountCredentials.private_key,
      ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive'],
      undefined,
    )

    await jwtClient.authorize()
    this.sheetsApi = google.sheets({ version: 'v4', auth: jwtClient })
    this.driveApi = google.drive({ version: 'v3', auth: jwtClient })
  }

  async getSpreadsheet(spreadsheetId: string): Promise<{
    spreadsheetId: string
    spreadsheetUrl: string
    title: string
  }> {
    await this.authorize()

    if (!this.sheetsApi) {
      throw new Error('sheets is not initialized')
    }

    const response = await this.sheetsApi.spreadsheets.get({
      spreadsheetId,
      fields: 'spreadsheetId,spreadsheetUrl,properties.title',
    })

    if (!response.data.spreadsheetId || !response.data.spreadsheetUrl) {
      throw new Error('spreadsheetId or spreadsheetUrl is not found')
    }

    if (!response.data.properties?.title) {
      throw new Error('title is not found')
    }

    return {
      spreadsheetId: response.data.spreadsheetId,
      spreadsheetUrl: response.data.spreadsheetUrl,
      title: response.data.properties.title,
    }
  }

  async getAllSpreadsheets(): Promise<
    {
      spreadsheetId: string
      spreadsheetUrl: string
      title: string
    }[]
  > {
    await this.authorize()

    if (!this.sheetsApi) {
      throw new Error('sheets is not initialized')
    }

    const response = await this.sheetsApi.spreadsheets.get({
      fields: 'spreadsheetId,spreadsheetUrl,sheets.properties.title',
    })

    if (!response.data.sheets) {
      throw new Error('sheets is not found')
    }

    return response.data.sheets.map((sheet) => {
      if (!response.data.spreadsheetId || !response.data.spreadsheetUrl) {
        throw new Error('spreadsheetId or spreadsheetUrl is not found')
      }

      if (!sheet.properties?.title) {
        throw new Error('title is not found')
      }

      return {
        spreadsheetId: response.data.spreadsheetId,
        spreadsheetUrl: response.data.spreadsheetUrl,
        title: sheet.properties.title,
      }
    })
  }

  async createSpreadsheet(title: string): Promise<{
    spreadsheetId: string
    spreadsheetUrl: string
  }> {
    await this.authorize()

    if (!this.sheetsApi || !this.driveApi) {
      throw new Error('sheets or drive is not initialized')
    }

    const response = await this.sheetsApi.spreadsheets.create({
      requestBody: {
        properties: {
          title,
        },
      },
      fields: 'spreadsheetId,spreadsheetUrl',
    })

    if (!response.data.spreadsheetId || !response.data.spreadsheetUrl) {
      throw new Error('spreadsheetId or spreadsheetUrl is not found')
    }

    // Set permission to anyone
    await this.driveApi.permissions.create({
      fileId: response.data.spreadsheetId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    })

    return {
      spreadsheetId: response.data.spreadsheetId,
      spreadsheetUrl: response.data.spreadsheetUrl,
    }
  }

  async updateSpreadsheet(
    spreadsheetId: string,
    title: string,
  ): Promise<{
    spreadsheetId: string
    spreadsheetUrl: string
  }> {
    await this.authorize()

    if (!this.sheetsApi) {
      throw new Error('sheets is not initialized')
    }

    const response = await this.sheetsApi.spreadsheets.get({
      spreadsheetId,
      fields: 'spreadsheetId,spreadsheetUrl',
    })

    if (!response.data.spreadsheetId || !response.data.spreadsheetUrl) {
      throw new Error('spreadsheetId or spreadsheetUrl is not found')
    }

    await this.sheetsApi.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            updateSpreadsheetProperties: {
              properties: {
                title,
              },
              fields: 'title',
            },
          },
        ],
      },
    })

    return {
      spreadsheetId: response.data.spreadsheetId,
      spreadsheetUrl: response.data.spreadsheetUrl,
    }
  }

  async createSheet(
    spreadsheetId: string,
    title: string,
    values: (string | number)[][],
  ): Promise<{
    spreadsheetId: string
    sheetId: number
    spreadsheetUrl: string
  }> {
    await this.authorize()

    if (!this.sheetsApi) {
      throw new Error('sheets is not initialized')
    }

    // Get spreadsheet info
    const spreadsheet = await this.sheetsApi.spreadsheets.get({
      spreadsheetId,
      fields: 'sheets(properties(sheetId,title))',
    })

    if (!spreadsheet.data.sheets) {
      throw new Error('sheets is not found')
    }

    // Remove default sheet
    const isDefault = spreadsheet.data.sheets.length === 1 && spreadsheet.data.sheets[0].properties?.title === 'Sheet1'

    let sheetId: number

    if (isDefault) {
      sheetId = spreadsheet.data.sheets[0].properties?.sheetId || 0
    } else {
      // Create new sheet
      const sheet = await this.sheetsApi.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              addSheet: {
                properties: {
                  title,
                },
              },
            },
          ],
        },
      })

      sheetId = sheet.data.replies?.[0]?.addSheet?.properties?.sheetId || 0
    }

    if (sheetId === undefined || sheetId === null) {
      throw new Error('sheetId is not found')
    }

    // Update sheet title
    await this.sheetsApi.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            updateSheetProperties: {
              properties: {
                sheetId,
                title,
              },
              fields: 'title',
            },
          },
        ],
      },
    })

    await this.sheetsApi.spreadsheets.values.append({
      spreadsheetId,
      range: `${title}!A1:Z1`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values,
      },
    })

    return {
      spreadsheetId,
      sheetId,
      spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit#gid=${sheetId}`,
    }
  }

  async updateSheet(
    spreadsheetId: string,
    sheetId: number,
    title: string,
    values: (string | number)[][],
  ): Promise<{
    spreadsheetId: string
    sheetId: number
    spreadsheetUrl: string
  }> {
    await this.authorize()

    if (!this.sheetsApi) {
      throw new Error('sheets is not initialized')
    }

    // Update sheet title
    await this.sheetsApi.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            updateSheetProperties: {
              properties: {
                sheetId,
                title,
              },
              fields: 'title',
            },
          },
        ],
      },
    })

    await this.sheetsApi.spreadsheets.values.update({
      spreadsheetId,
      range: `${title}!A1:Z1`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values,
      },
    })

    return {
      spreadsheetId,
      sheetId,
      spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit#gid=${sheetId}`,
    }
  }
}
