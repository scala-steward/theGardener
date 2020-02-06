
export interface OpenApiModelRow {
  title: string;
  openApiType: string;
  default: string;
  description: string;
  example: string;
}

export interface OpenApiModel {
  modelName: string;
  required: Array<string>;
  openApiRows: Array<OpenApiModelRow>;
  childrenModels: Array<OpenApiModel>;
}