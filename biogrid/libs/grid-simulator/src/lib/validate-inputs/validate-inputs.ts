/**
 * The file is used by the gridItems to validate the inputs for the gridItems.
 * It makes 3 validations for the gridItem inputs.
 * 1. It ensures that the @param value for the gridItem is not less than the specified 
 * minimum value @param min for the griditem input
 * 2. It ensures that the @param value is not greater than the specified maximum 
 * value @param max for the griditem input
 * 3. It ensures that the values @param value, @param max, @param min for the gridItem are positive
 *
 * @summary the file is used to validable inputs.
 * @author Roland Naijuka <rnaijuka@google.com>
 *
 * Created at     : 6/29/2020, 4:34:42 PM
 * Last modified  : 7/28/2020, 9:45:42 AM
 */
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
