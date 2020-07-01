export interface Message {
  message: string;
}

export interface NewBiogridBody {
  startDate: Date,
  endDate: Date,
  smallBatteryCells: number,
  largeBatteryCells: number,
}
