import React, { useEffect } from 'react';
import './App.scss';

class Transition {
  currentPosition : number | undefined;
  nextByX : number | undefined;
  nextByO : number | undefined;
  constructor(currentPosition: number, nextByX: number | undefined, nextByO: number | undefined) {
    this.currentPosition = currentPosition;
    this.nextByX = nextByX;
    this.nextByO = nextByO;
  }

  toString() {
    return `Current: ${this.currentPosition}; X: ${this.nextByX}; O: ${this.nextByO}`;
  }
}

enum FieldPossibleValues {
  UNDEFINED = 0,
  WHITE_SQUARE = -1,
  BLACK_SQUARE = 1,
}

enum StateMachineTransitions {
  IDLE = 0,
  TRANSITION = 1,
}

enum StateMatrixTransitions {
  UNDEFINED = 0,
  LEFT_O = 1,
  LEFT_X = 2,
  LEFT_TOP_O = 4,
  LEFT_TOP_X = 8,
  // LEFT_O_TOP_X = 16,
  // LEFT_X_TOP_O = 32,
  // LEFT_O_TOP_O = 64,
  // LEFT_X_TOP_X = 128,
}

function App() {
  useEffect(() => {
    const rows = [
      [3],
      [1, 1],
      [1, 1, 1],
      [1, 1],
      [1, 1],
    ];

    const cols = [
      [2, 1],
      [1, 1],
      [1, 1],
      [1, 1],
      [2, 1],
    ];

    const Field = [];

    // Create empty field
    for (let ii = 0; ii < rows.length; ii++) {
      const row = [];
      for (let jj = 0; jj < cols.length; jj++) {
        row.push(FieldPossibleValues.UNDEFINED);
      }
      Field.push(row);
    }

    // Let take first row for testing
    const currentFieldArray = Field[0];
    const currentDefinition = rows[2];
    console.log(`(${currentDefinition})    ${currentFieldArray}`);

    const StateMachine = [];

    for (let ii = 0; ii < currentDefinition.length; ii++) {
      const value = currentDefinition[ii];

      StateMachine.push(StateMachineTransitions.IDLE);

      for (let jj = 0; jj < value; jj++) {
        StateMachine.push(StateMachineTransitions.TRANSITION);
      }
    }

    StateMachine.push(StateMachineTransitions.IDLE);

    const StateMachineTransitioner: Transition[] = [];

    for(let ii = 0; ii < StateMachine.length - 2; ii++) {
      const current = StateMachine[ii];
      const next = StateMachine[ii + 1];

      if (current === 0 && next === 1) {
        StateMachineTransitioner.push(new Transition(ii, ii + 1, ii));
      } else if (current === 1 && next === 1) {
        StateMachineTransitioner.push(new Transition(ii, ii + 1, undefined));
      } else if (current === 1 && next === 0) {
        StateMachineTransitioner.push(new Transition(ii, undefined, ii + 1));
      }
    }

    StateMachineTransitioner.push(new Transition(StateMachine.length - 2, undefined, StateMachine.length - 2));

    StateMachineTransitioner.forEach(s => console.log(s.toString()));

    const StateMatrix: Array<Array<Array<number>>> = [];
    // Fill State matrix undefined elements
    for (let ii = 0; ii < StateMachineTransitioner.length; ii++) {
      const row = [];
      for (let jj = 0; jj < currentFieldArray.length; jj++) {
        row.push([]);
      }
      StateMatrix.push(row);
    }

    // Try to fill matrix
    // Start for available elements from 0;

    const couldBeInPosition = new Set<number>();
    couldBeInPosition.add(0);

    for (let column = 0; column < currentFieldArray.length; column++) {
      const currentFieldValue = currentFieldArray[column];
      const nextStateAvailablePositions: number[] = [];

      couldBeInPosition.forEach((statePositionIndex) => {
        debugger
        const stateMachineValueForPosition = StateMachineTransitioner[statePositionIndex as number];

        switch (currentFieldValue) {
          case FieldPossibleValues.UNDEFINED: {
            if (stateMachineValueForPosition.nextByO !== undefined) {
              if (stateMachineValueForPosition.currentPosition === stateMachineValueForPosition.nextByO) {
                StateMatrix[stateMachineValueForPosition.nextByO][column].push(StateMatrixTransitions.LEFT_O);
              } else {
                StateMatrix[stateMachineValueForPosition.nextByO][column].push(StateMatrixTransitions.LEFT_TOP_O);
              }
              nextStateAvailablePositions.push(stateMachineValueForPosition.nextByO);
            }

            if (stateMachineValueForPosition.nextByX !== undefined) {
              if (stateMachineValueForPosition.currentPosition === stateMachineValueForPosition.nextByX) {
                StateMatrix[stateMachineValueForPosition.nextByX][column].push(StateMatrixTransitions.LEFT_X);
              } else {
                StateMatrix[stateMachineValueForPosition.nextByX][column].push(StateMatrixTransitions.LEFT_TOP_X);
              }
              nextStateAvailablePositions.push(stateMachineValueForPosition.nextByX);
            }
            break;
          }
          case FieldPossibleValues.BLACK_SQUARE: {
            break;
          }
          case FieldPossibleValues.WHITE_SQUARE: {
            break;
          }
        }
      });

      couldBeInPosition.clear();

      nextStateAvailablePositions.forEach(v => couldBeInPosition.add(v));
    }

    console.log('Field', Field);
    console.log('StateMatrix', StateMatrix);
    let text = '';
    StateMatrix.forEach((row, rowIndex) => {
      row.forEach((col, colIndex) => {
        text += col.join(',');
        text += ';'
      });
      text += '\n';
    });

    console.log(text);
  }, []);
  return (
    <div className="app">
      App
    </div>
  );
}

export default App;
