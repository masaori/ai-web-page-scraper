import path from 'path'
import fs from 'fs'
import { getEntityDefinitions } from 'ast-to-entity-definitions/bin/adapter/entry-points/function'
import { pascalCase } from 'change-case'
import { excludeNull } from '../src/_shared/array'

export const generateInterfaceRepositories = async () => {
  const pathToEntitiesDirectory = path.join(__dirname, '..', 'src', 'domain', 'entities')
  const pathToOutputDirectory = path.join(__dirname, '..', 'src', 'domain', 'interfaces', 'repositories', '_gen')

  // Remove all file in pathToOutputDirectory first
  fs.readdirSync(pathToOutputDirectory).forEach((file) => {
    fs.unlinkSync(path.join(pathToOutputDirectory, file))
  })

  const entityDefinitions = await getEntityDefinitions(pathToEntitiesDirectory)

  for (const entityDefinition of entityDefinitions) {
    const result = `// This file is generated by scripts/generateInterfaceRepositories.ts
      ${entityDefinitions.map((entityDefinition) => `import { ${pascalCase(entityDefinition.name)} } from '../../../entities/${pascalCase(entityDefinition.name)}'`).join('\n')}
      import { PromisedResult, UnknownRuntimeError, AlreadyExistsError, NotFoundError } from '../../../../_shared/error'

      export interface ${pascalCase(entityDefinition.name)}Repository {
      issueId: () => PromisedResult<string, UnknownRuntimeError>
      getAll: () => PromisedResult<${pascalCase(entityDefinition.name)}[], UnknownRuntimeError>
      getRelevant: (text: string, limit: number) => PromisedResult<${pascalCase(entityDefinition.name)}[], UnknownRuntimeError>
      create: (entity: ${pascalCase(entityDefinition.name)}) => PromisedResult<${pascalCase(entityDefinition.name)}, UnknownRuntimeError | AlreadyExistsError>
      update: (entity: ${pascalCase(entityDefinition.name)}) => PromisedResult<${pascalCase(entityDefinition.name)}, UnknownRuntimeError | NotFoundError>
      delete: (id: string) => PromisedResult<void, UnknownRuntimeError | NotFoundError>
      ${excludeNull(
        entityDefinition.properties.map((property) => {
          if (property.isReference) {
            if (property.isUnique) {
              return `getBy${pascalCase(property.name)}: (${pascalCase(property.name)}: ${property.targetEntityDefinitionName}['id']) => PromisedResult<${pascalCase(
                entityDefinition.name,
              )} | null, UnknownRuntimeError>`
            } else {
              return `getAllBy${pascalCase(property.name)}: (${pascalCase(property.name)}: ${property.targetEntityDefinitionName}['id']) => PromisedResult<${pascalCase(
                entityDefinition.name,
              )}[], UnknownRuntimeError>`
            }
          } else if (property.name === 'id') {
            return `getById: (id: string) => PromisedResult<${pascalCase(entityDefinition.name)} | null, UnknownRuntimeError>`
          } else {
            return null
          }
        }),
      ).join('\n')}
    }
    `

    fs.writeFileSync(path.join(pathToOutputDirectory, `${pascalCase(entityDefinition.name)}Repository.ts`), result)
  }
}

generateInterfaceRepositories().catch((error) => {
  console.error(error)
  process.exit(1)
})
