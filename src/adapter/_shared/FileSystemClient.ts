import fs from 'fs'
import path from 'path'

export class FileSystemClient {
  constructor(
    private directoryPath: string,
    createDirectoryIfNotExists = false,
  ) {
    if (createDirectoryIfNotExists && !fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true })
    }
  }

  async createFile(fileName: string, content: string): Promise<void> {
    await fs.promises.writeFile(path.join(this.directoryPath, fileName), content)
  }

  async readFile(fileName: string): Promise<string> {
    const fileContent = await fs.promises.readFile(path.join(this.directoryPath, fileName))

    return fileContent.toString()
  }

  async deleteFile(fileName: string): Promise<void> {
    await fs.promises.unlink(path.join(this.directoryPath, fileName))
  }
}
