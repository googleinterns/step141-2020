import { generateTSFiles } from 'swagger-ts-generator';

const config = {
  file: __dirname + '/swagger.json',
};

export function buildSwagger() {
  generateTSFiles(
    config.file, // This can be either a file containing the Swagger json or the Swagger object itself
    {
      modelFolder: './apps/biogrid-mvp/src/app/build/models',
      enumTSFile: './apps/biogrid-mvp/src/app/build/models/enums.ts',
      // + optionally more configuration
    }
  );
}
