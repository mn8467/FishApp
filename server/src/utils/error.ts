// errors.ts
export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

export class DbError extends Error {
  constructor(message: string, public cause?: unknown) {
    super(message);
    this.name = "DbError";
  }
}

export class MappingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MappingError";
  }
}
