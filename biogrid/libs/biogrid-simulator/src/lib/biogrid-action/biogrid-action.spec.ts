/**
 * @summary defines the unit tests for the @class BiogridAction
 * @author Lev Stambler <levst@google.com>
 * @author Roland Naijuka <rnaijuka@google.com>
 *
 * Created at     : 6/29/2020, 11:01:26 AM
 * Last modified  : 7/29/2020, 10:39:00 AM
 */
import { BiogridAction } from './';

describe('classes', () => {
  test('create a BiogridAction', () => {
    const efficiency = 100;
    const action = new BiogridAction({
      "small-battery": "solar-panel"
    }, efficiency);
    expect(action.getSupplyingPaths()).toEqual({
      "small-battery": "solar-panel"
    });
  });
});
