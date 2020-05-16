import React, { useEffect } from 'react';
import './App.scss';

enum FieldPossibleValues {
  UNDEFINED = 0,
  WHITE_SQUARE = -1,
  BLACK_SQUARE = 1,
}

enum StateMachineTransitions {
  IDLE = 0,
  TRANSITION = 1,
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

    const StateMachine = [];

    for (let ii = 0; ii < currentDefinition.length; ii++) {
      const value = currentDefinition[ii];

      StateMachine.push(StateMachineTransitions.IDLE);

      for (let jj = 0; jj < value; jj++) {
        StateMachine.push(StateMachineTransitions.TRANSITION);
      }
    }

    StateMachine.push(StateMachineTransitions.IDLE);

    for(let ii = 0; ii < StateMachine.length - 2; ii++) {
      const current = StateMachine[ii];
      const next = StateMachine[ii + 1];

      if (current === 0 && next === 1) {
        console.log('Переход');
      } else if (current === 1 && next === 1) {
        console.log('переход с пред X');
      } else if (current === 1 && next === 0) {
        console.log('Обратный переход');
      }
    }

    console.log(StateMachine);
  }, []);
  return (
    <div className="app">
      App
    </div>
  );
}

export default App;
