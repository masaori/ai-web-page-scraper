import { program } from 'commander'
import { main } from './_shared/main'

try {
  program.option('-m, --message <message>', 'A message from the user. It needs to contain the URL of the web page to scrape.')

  const parsed = program.parse(process.argv)
  const userMessage: unknown = parsed.opts().message

  if (typeof userMessage !== 'string') {
    throw new Error('userMessage is not a string')
  }
  void main(userMessage)
} catch (error) {
  console.error(error)
}
