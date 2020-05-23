import {
  FieldPossibleValues,
  FieldType, StateMachineMatrix,
  StateMachineTransitions,
  StateMatrixTransitions,
  StateMatrixType,
  Transition
} from '../models';

export const isArraysEqual = (a: Array<number>, b: Array<number>) => {
  for (let ii = 0; ii < a.length; ii++) {
    if (a[ii] !== b[ii]) {
      return false;
    }
  }

  return true;
};

export function every(arr: Array<number>, value: number): boolean {
  for (let ii = 0; ii < arr.length; ii++) {
    if (arr[ii] !== value) {
      return false;
    }
  }
  return true;
}

export function sum(arr: Array<number>): number {
  return arr.reduce((acc, v) => {
    acc += v;
    return acc;
  }, 0);
}

export const createRowFromColumn = (array: FieldType, colIndex: number): Array<number> => {
  const result = [];
  for (let row = 0; row < array.length; row++) {
    result[row] = array[row][colIndex];
  }
  return result;
};

export const applyColumnResult = (array: FieldType, colIndex: number, result: Array<number>): void => {
  for (let row = 0; row < array.length; row++) {
    array[row][colIndex] = result[row];
  }
};

export const resolveNonogram = (rows: Array<Array<number>>, cols: Array<Array<number>>): Promise<FieldType> => {
  return new Promise<FieldType>((resolve, reject) => {
    try {
      const Field = createField(rows, cols);

      let hasChanges;

      do {
        hasChanges = false;

        // Go through rows
        for (let rowNumber = 0; rowNumber < rows.length; rowNumber++) {
          const row = Field[rowNumber];

          if (!row.includes(0)) {
            continue;
          }

          const rowDefinition = rows[rowNumber];

          if (every(row, 0) && sum(rowDefinition) < row.length / 2) {
            continue;
          }

          const result = tryResolveRow(row, rowDefinition);
          if (!isArraysEqual(row, result)) {
            hasChanges = true;
          }
          Field.splice(rowNumber, 1, result);
        }

        // Go through columns
        for (let colNumber = 0; colNumber < cols.length; colNumber++) {
          const row = createRowFromColumn(Field, colNumber);

          if (!row.includes(0)) {
            continue;
          }

          const colDefinition = cols[colNumber];

          if (every(row, 0) && sum(colDefinition) < row.length / 2) {
            continue;
          }

          const result = tryResolveRow(row, colDefinition);
          if (!isArraysEqual(row, result)) {
            hasChanges = true;
          }
          applyColumnResult(Field, colNumber, result);
        }
      } while (hasChanges);

      resolve(Field);
    } catch (e) {
      reject(e);
    }
  })
};

export const createField = (rows: Array<Array<number>>, cols: Array<Array<number>>): FieldType => {
  const Field: FieldType = [];

  // Create empty field
  for (let ii = 0; ii < rows.length; ii++) {
    const row = [];
    for (let jj = 0; jj < cols.length; jj++) {
      row.push(FieldPossibleValues.UNDEFINED);
    }
    Field.push(row);
  }

  return Field;
};

export const tryResolveRow = (row: Array<number>, definition: Array<number>): Array<number> => {
  const stateMachine = createStateMachine(row, definition);
  const transitions = createStateMachineTransitions(stateMachine);
  const stateMatrix = createStateMatrix(transitions, row);
  fillStateMatrix(row, transitions, stateMatrix);
  const result = resolveRow(stateMatrix, transitions, row);
  return result;
};

const createStateMachine = (row: Array<number>, definition: Array<number>): Array<number> => {
  const StateMachine: Array<number> = [];

  for (let ii = 0; ii < definition.length; ii++) {
    const value = definition[ii];

    StateMachine.push(StateMachineTransitions.IDLE);

    for (let jj = 0; jj < value; jj++) {
      StateMachine.push(StateMachineTransitions.TRANSITION);
    }
  }

  StateMachine.push(StateMachineTransitions.IDLE);

  return StateMachine;
};

const createStateMachineTransitions = (stateMachine: Array<number>): Array<Transition> => {
  const StateMachineTransitioner: Transition[] = [];

  for(let ii = 0; ii < stateMachine.length - 2; ii++) {
    const current = stateMachine[ii];
    const next = stateMachine[ii + 1];

    if (current === 0 && next === 1) {
      StateMachineTransitioner.push(new Transition(ii, ii + 1, ii));
    } else if (current === 1 && next === 1) {
      StateMachineTransitioner.push(new Transition(ii, ii + 1, undefined));
    } else if (current === 1 && next === 0) {
      StateMachineTransitioner.push(new Transition(ii, undefined, ii + 1));
    }
  }

  StateMachineTransitioner.push(new Transition(stateMachine.length - 2, undefined, stateMachine.length - 2));

  return StateMachineTransitioner;
};

const createStateMatrix = (transitions: Array<Transition>, rowDefinition: Array<number>): StateMatrixType => {
  const StateMatrix: StateMatrixType = [];
  // Fill State matrix undefined elements
  for (let ii = 0; ii < transitions.length; ii++) {
    const row = [];
    for (let jj = 0; jj < rowDefinition.length; jj++) {
      row.push([]);
    }
    StateMatrix.push(row);
  }

  return StateMatrix;
};

const fillStateMatrix = (row: Array<number>, transitions: Array<Transition>, stateMatrix: StateMatrixType) => {
  const couldBeInPosition = new Set<number>();
  couldBeInPosition.add(0);

  for (let column = 0; column < row.length; column++) {
    const currentFieldValue = row[column];
    const nextStateAvailablePositions: number[] = [];

    couldBeInPosition.forEach((statePositionIndex) => {
      const stateMachineValueForPosition = transitions[statePositionIndex as number];

      switch (currentFieldValue) {
        case FieldPossibleValues.UNDEFINED: {
          if (stateMachineValueForPosition.nextByO !== undefined) {
            if (stateMachineValueForPosition.currentPosition === stateMachineValueForPosition.nextByO) {
              stateMatrix[stateMachineValueForPosition.nextByO][column].push(StateMatrixTransitions.LEFT_O);
            } else {
              stateMatrix[stateMachineValueForPosition.nextByO][column].push(StateMatrixTransitions.LEFT_TOP_O);
            }
            nextStateAvailablePositions.push(stateMachineValueForPosition.nextByO);
          }

          if (stateMachineValueForPosition.nextByX !== undefined) {
            if (stateMachineValueForPosition.currentPosition === stateMachineValueForPosition.nextByX) {
              stateMatrix[stateMachineValueForPosition.nextByX][column].push(StateMatrixTransitions.LEFT_X);
            } else {
              stateMatrix[stateMachineValueForPosition.nextByX][column].push(StateMatrixTransitions.LEFT_TOP_X);
            }
            nextStateAvailablePositions.push(stateMachineValueForPosition.nextByX);
          }
          break;
        }
        case FieldPossibleValues.BLACK_SQUARE: {
          if (stateMachineValueForPosition.nextByX !== undefined) {
            if (stateMachineValueForPosition.currentPosition === stateMachineValueForPosition.nextByX) {
              stateMatrix[stateMachineValueForPosition.nextByX][column].push(StateMatrixTransitions.LEFT_X);
            } else {
              stateMatrix[stateMachineValueForPosition.nextByX][column].push(StateMatrixTransitions.LEFT_TOP_X);
            }
            nextStateAvailablePositions.push(stateMachineValueForPosition.nextByX);
          }
          break;
        }
        case FieldPossibleValues.WHITE_SQUARE: {
          if (stateMachineValueForPosition.nextByO !== undefined) {
            if (stateMachineValueForPosition.currentPosition === stateMachineValueForPosition.nextByO) {
              stateMatrix[stateMachineValueForPosition.nextByO][column].push(StateMatrixTransitions.LEFT_O);
            } else {
              stateMatrix[stateMachineValueForPosition.nextByO][column].push(StateMatrixTransitions.LEFT_TOP_O);
            }
            nextStateAvailablePositions.push(stateMachineValueForPosition.nextByO);
          }
          break;
        }
      }
    });

    couldBeInPosition.clear();

    nextStateAvailablePositions.forEach(v => couldBeInPosition.add(v));
  }
};

const resolveRow = (stateMatrix: StateMatrixType, transitions: Array<Transition>, row: Array<number>): Array<number> => {
  // Check if exist
  const rightBottomCorner = stateMatrix[transitions.length - 1][row.length - 1];

  // If array is empty then we can't reach end our state machine
  if (rightBottomCorner.length === 0) {
    throw new Error('No variants. Something went wrong');
  }

  // Try to create all available variants
  const availableVariants: Array<Array<number>> = [];
  let rowPosition = transitions.length - 1;
  let colPosition = row.length - 1;

  function calculateVariant(rowNumber: number, colNumber: number, matrix: StateMachineMatrix, currentVariant: Array<number> = [], cell: Array<number> = [], useCell = false) {
    while (rowNumber !== -1 && colNumber !== -1) {
      const cellArray = useCell ? cell : matrix[rowNumber][colNumber];
      useCell = false;
      if (cellArray.length === 2) {
        calculateVariant(rowNumber, colNumber, matrix, currentVariant.slice(), [cellArray[0]], true);
        calculateVariant(rowNumber, colNumber, matrix, currentVariant.slice(), [cellArray[1]], true);
        return;
      } else {
        const value = cellArray[0];

        switch (value) {
          case StateMatrixTransitions.LEFT_O: {
            currentVariant.push(FieldPossibleValues.WHITE_SQUARE);
            colNumber = colNumber - 1;
            break;
          }
          case StateMatrixTransitions.LEFT_X: {
            currentVariant.push(FieldPossibleValues.BLACK_SQUARE);
            colNumber = colNumber - 1;
            break;
          }
          case StateMatrixTransitions.LEFT_TOP_O: {
            currentVariant.push(FieldPossibleValues.WHITE_SQUARE);
            rowNumber = rowNumber - 1;
            colNumber = colNumber - 1;
            break;
          }
          case StateMatrixTransitions.LEFT_TOP_X: {
            currentVariant.push(FieldPossibleValues.BLACK_SQUARE);
            rowNumber = rowNumber - 1;
            colNumber = colNumber - 1;
            break;
          }
          default: {
            colNumber = colNumber - 1;
            rowNumber = rowNumber - 1;
          }
        }
      }
    }

    availableVariants.push(currentVariant.reverse());
  }

  calculateVariant(rowPosition, colPosition, stateMatrix);

  const response: Array<number> = [];

  // Go through variants and check if each column has the same value
  for (let col = 0; col < availableVariants[0].length; col++) {
    const value = availableVariants[0][col];
    let theSameValue = true;

    for (let row = 1; row < availableVariants.length; row++) {
      const currentValue = availableVariants[row][col];

      if (value !== currentValue) {
        theSameValue = false;
        break;
      }
    }

    if (theSameValue) {
      response[col] = value;
    } else {
      response[col] = FieldPossibleValues.UNDEFINED;
    }
  }

  return response;
};
