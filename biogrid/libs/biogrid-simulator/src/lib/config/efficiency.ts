import { RESISTANCE } from ".";
import { Power } from '@biogrid/grid-simulator';
/**
 * This function calculates the resistance of a given length of WIRE 16 AWG which is the one we are using for our transmission
 * The wire has a constant reistance per kilometre, thus multiplying by the length of the wire gives 
 * the resistance of that whole wire
 * @param length the length of the wire which is synonymous to the distance between the supplier and reciever of power
 * @returns the resistance of the wire for calculate the power loss
 */
export function calculateResistance(length: number, isMetre: boolean = false) {
  // Change the metre values to kilometres
  if (isMetre) {
    length = length / 1000;
  }
  return (RESISTANCE.RESISTANCE_16 * length);
}

/**
 * This function calculates the current passing through the circuit at any given time using the physics 
 * equation of calculating current, I = V / R where I is the current, V is voltage, R is resistance
 * @param voltage is the voltage of the circuit at that particular point
 * @param loadResistance is the resistance for the grid items in the shortest path
 * @param wireResistance is the resistance of the wires
 * @returns the current flowing in that particular circuit
 */
export function calculateCurrent(voltage: number, loadResistance: number, wireResistance: number) {
  return (voltage / (loadResistance + wireResistance));
}

/**
 * This function calculates the voltage loss while passing through the wires using the physics 
 * equation of calculating voltage. V = I * R where V is voltage, I is current and R is resistance
 * @param current is the current in the circuit
 * @param resistance is the resistance of the wires
 * @returns the voltage lost while transport through the wires
 */
export function calculateVoltage(current: number, resistance: number) {
  return (current * resistance);
}

/**
 * This function calculates the power in the circuit for usage in the efficiency
 * It calculates this based on the two physics equations
 *    1. P = V * I
 *    2. I = V / R
 * where P is power, V is voltage, I is current and R is resistance
 * Since current is constant in circuits
 * Th final equation used is P = V^2 / R
 * @param voltage is the voltage in the circuit at that particular time
 * @param resistance is the resistance of the wires
 * @return the power transport over the given @param resistance
 */
export function calculatePower(voltage: number, resistance: number) {
  return (Math.pow(voltage, 2) / resistance);
}

/**
 * This function calculates the power in the circuit for usage in the efficiency
 * It calculates this based on the two physics equations
 *    1. P = V * I
 *    2. V = I * R
 * where P is power, V is voltage, I is current and R is resistance
 * Since current is constant in circuits
 * Th final equation implemented is P = I^2 * R
 * @param current is the current in the circuit at that particular time
 * @param resistance is the resistance of the wires
 * @return the power transport over the given @param resistance
 */
export function calculatePowerWithCurrent(current: number, resistance: number) {
  return (Math.pow(current, 2) * resistance);
}

/**
 * This function is used to calculate the current in the circuit using the given @param power
 * It calculates the current based on these physics equations for electricity
 *    1. P = V * I
 *    2. V = I * R
 * From these two equations, we can deduce that, 3. P = I^2 * R
 * where P is power, V is voltage, I is current and R is resistance
 * The final equation implemented is the reverse of equation 3, with I = sqrt(P * R)
 * @param power is the power coming in the circuit
 * @param resistance is the resistance of the circuit
 * @returns the current that is going through the circuit over the given @param resistance
 */
export function calculateCurrentFromPower(power: number, resistance: number) {
  return Math.sqrt(power / resistance);
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
 * This function calculates the efficiency of the circuit or system.
 * It bases this from the physics equation for calculting efficiency in a circuit
 * Efficiency = P_output / P_input * 100%
 * where P_output is the power output of the circuit, and P_input is the power input into that same circuit
 * @param input is the input Power at the beginning of the circuit
 * @param output is the output power at the end of the the circuit
 * @returns the efficiency of the system which is in percentages
 */
export function calculateEfficiency(input: Power, output: Power) {
  return (output / input) * 100;
}
