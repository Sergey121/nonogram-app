export class Transition {
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

export type StateMachineMatrix = Array<Array<Array<number>>>;

export enum FieldPossibleValues {
  UNDEFINED = 0,
  WHITE_SQUARE = -1,
  BLACK_SQUARE = 1,
}

export enum StateMachineTransitions {
  IDLE = 0,
  TRANSITION = 1,
}

export enum StateMatrixTransitions {
  UNDEFINED = 0,
  LEFT_O = 1,
  LEFT_X = 2,
  LEFT_TOP_O = 4,
  LEFT_TOP_X = 8,
}

export type FieldType<T = number> = Array<Array<T>>;
export type StateMatrixType = Array<Array<Array<number>>>;

export enum Speed {
  slow = 100,
  medium = 60,
  fast = 30,
}
