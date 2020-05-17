import React, { useEffect } from 'react';
import './App.scss';

class Transition {
  black: number | undefined;
  white: number | undefined;
  position: number;
  nextPosition: number | undefined;
  constructor(current: number, black: number | undefined, white: number | undefined, next: number | undefined) {
    this.position = current;
    this.black = black;
    this.white = white;
    this.nextPosition = next;
  }

  toString() {
    return `Current: ${this.position}; By Black: ${this.black}; By white: ${this.white}; Next: ${this.nextPosition}`;
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
  LEFT_O_TOP_X = 16,
  LEFT_X_TOP_O = 32,
  LEFT_O_TOP_O = 64,
  LEFT_X_TOP_X = 128,
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
    const currentDefinition = rows[0];
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

    const StateMachineTransitioner = [];

    for(let ii = 0; ii < StateMachine.length - 2; ii++) {
      const current = StateMachine[ii];
      const next = StateMachine[ii + 1];

      if (current === 0 && next === 1) {
        StateMachineTransitioner.push(new Transition(ii, 1, 0, ii + 1));
      } else if (current === 1 && next === 1) {
        StateMachineTransitioner.push(new Transition(ii, 1, undefined, ii + 1));
      } else if (current === 1 && next === 0) {
        StateMachineTransitioner.push(new Transition(ii, undefined, 0, ii + 1));
      }
    }

    StateMachineTransitioner.push(new Transition(StateMachine.length - 2, undefined, 0, undefined));

    StateMachineTransitioner.forEach(s => console.log(s.toString()));

    const StateMatrix = [];
    // Fill State matrix undefined elements
    for (let ii = 0; ii < currentFieldArray.length; ii++) {
      const row = [];
      for (let jj = 0; jj < StateMachine.length; jj++) {
        row.push(StateMatrixTransitions.UNDEFINED);
      }
      StateMatrix.push(row);
    }


    console.log(Field);
    console.log(StateMatrix);
  }, []);
  return (
    <div className="app">
      App
    </div>
  );
}

export default App;
