export enum FieldType {
  SINGLE_LINE_TEXT = 'singleLineText',
  EMAIL = 'email',
  URL = 'url',
  MULTILINE_TEXT = 'multilineText',
  NUMBER = 'number',
  PERCENT = 'percent',
  CURRENCY = 'currency',
  SINGLE_SELECT = 'singleSelect',
  MULTIPLE_SELECTS = 'multipleSelects',
  SINGLE_COLLABORATOR = 'singleCollaborator',
  MULTIPLE_COLLABORATORS = 'multipleCollaborators',
  MULTIPLE_RECORD_LINKS = 'multipleRecordLinks',
  DATE = 'date',
  PHONE_NUMBER = 'phoneNumber',
  MULTIPLE_ATTACHMENTS = 'multipleAttachments',
  CHECKBOX = 'checkbox',
  FORMULA = 'formula',
  CREATED_TIME = 'createdTime',
  ROLLUP = 'rollup',
  COUNT = 'count',
  LOOKUP = 'lookup',
  CREATED_BY = 'createdBy',
  LAST_MODIFIED_TIME = 'lastModifiedTime',
  LAST_MODIFIED_BY = 'lastModifiedBy',
  AUTO_NUMBER = 'autoNumber',
  BARCODE = 'barcode',
  RATING = 'rating',
  RICH_TEXT = 'richText',
  DURATION = 'duration',
}

export enum RelationshipType {
  ONE_TO_MANY = 'oneToMany',
  MANY_TO_ONE = 'manyToOne',
  ONE_TO_ONE = 'oneToOne',
}

export enum LoadingState {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error',
}