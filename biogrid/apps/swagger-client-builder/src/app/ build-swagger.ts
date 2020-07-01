import { generateTSFiles } from 'swagger-ts-generator';

const config = {
  file: __dirname + '/swagger.json',
};

export function buildSwagger() {
  generateTSFiles(
    config.file, // This can be either a file containing the Swagger json or the Swagger object itself
    {
      modelFolder: './',
      enumTSFile: './enums.ts',
      // + optionally more configuration
    }
  );
}
