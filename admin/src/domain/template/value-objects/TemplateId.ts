export class TemplateId {
  constructor(public readonly value: string) {
    if (!value || value.trim() === '') {
      throw new Error('TemplateId cannot be empty');
    }
  }

  static create(): TemplateId {
    return new TemplateId(crypto.randomUUID());
  }

  static from(value: string): TemplateId {
    return new TemplateId(value);
  }

  equals(other: TemplateId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
