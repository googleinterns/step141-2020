/**
 * @summary the file holds an interface for the Brain which contains the compute 
 * function for determine the action to take by the grid.
 * @author Lev Stambler <levst@google.com>
 * @author Roland Naijuka <rnaijuka@google.com>
 *
 * Created at     : 6/29/2020, 11:49:51 AM
 * Last modified  : 7/28/2020, 2:11:10 PM
 */

import { StateGraph } from '../state';
import { GridAction } from '../grid-action';

export interface Brain {
  computeAction(state: StateGraph): Promise<GridAction>;
}
