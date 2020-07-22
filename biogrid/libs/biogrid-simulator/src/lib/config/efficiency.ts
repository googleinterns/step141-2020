import { RESISTANCE } from ".";
import { Power } from '@biogrid/grid-simulator';
/**
 * This function calculates the resistance of a given length of WIRE 16 AWG which is the one we are using for our transmission
 * @param length the length of the wire which is synonymous to the distance between the supplier and reciever of power
 * @returns the resistance of the wire for calculate the power loss
 */
export function calculateResistance(length: number, isMetre: boolean = true) {
  if (!isMetre) {
    length = length / 1000;
  }
  return RESISTANCE.RESISTANCE_16 * length;
}

/**
 * This function calculates the current passing through the circuit at any given time
 * @param voltage is the voltage of the circuit at that particular point
 * @param resistance is the resistance of the wires and any connected materials in the circuit
 * @returns the current flowing in that particular circuit
 */
export function calculateCurrent(voltage: number, loadResistance: number, wireResistance: number) {
  return voltage / (loadResistance + wireResistance);
}

/**
 * This function calculates the voltage loss while passing through the wires
 * @param current is the current in the circuit
 * @param resistance is the resistance of the wires
 * @returns the voltage lost while transport through the wires
 */
export function calculateVoltage(current: number, resistance: number) {
  return current * resistance;
}

/**
 * This function calculates the power in the circuit for usage in the efficiency
 * @param voltage is the voltage in the circuit at that particular time
 * @param resistance is the resistance of the wires
 * @return the power transport over the given @param resistance
 */
export function calculatePower(voltage: number, resistance: number) {
  return voltage * voltage / resistance;
}

/**
 * This function is used to calculate the voltage in the circuit using the given @param power
 * @param power is the power coming in the circuit
 * @param resistance is the resistance of the circuit
 * @returns the voltage that is going through the circuit over the given @param resistance
 */
export function calculateVoltageFromPower(power: number, resistance: number) {
  return Math.sqrt(power * resistance);
}

/**
 * This function calculates the efficiency of the circuit or system
 * @param input is the input Power at the beginning of the circuit
 * @param output is the output power at the end of the the circuit
 * @returns the efficiency of the system which is in percentages
 */
export function calculateEfficiency(input: Power, output: Power) {
  return (output / input) * 100;
}
