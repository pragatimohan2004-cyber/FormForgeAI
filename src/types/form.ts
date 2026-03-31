export type FieldType = 'text' | 'email' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'phone' | 'url';

export interface FormFieldOption {
  label: string;
  value: string;
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: FormFieldOption[];
  validation?: string;
}

export interface GeneratedForm {
  title: string;
  description: string;
  fields: FormField[];
}
