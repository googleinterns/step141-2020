// Validation
export interface Validatable {
  value: number;
  min?: number;
  max?: number;
  isPositive: boolean;
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
  return isValid && validatableInput.isPositive;
}
