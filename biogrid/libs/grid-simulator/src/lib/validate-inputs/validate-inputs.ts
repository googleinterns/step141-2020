// Validation
export interface Validatable {
  value: number;
  min?: number;
  max?: number;
  isInt(): boolean;
}

export function validate(validatableInput: Validatable): boolean {
  let isValid = true;
  if (
    validatableInput.min != null && 
    typeof validatableInput.value === 'number') {
      isValid = isValid && validatableInput.value >= validatableInput.min;
  }
  if (
    validatableInput.max != null &&
    typeof validatableInput.value === 'number'
  ) {
    isValid = isValid && validatableInput.value <= validatableInput.max;
  }
  if (validatableInput.isInt() && typeof validatableInput.value === 'number') {
    isValid = isValid && validatableInput.isInt();
  }
  return isValid;
}
