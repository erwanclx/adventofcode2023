import { readFileSync } from 'node:fs';

type Position = {
  x: number,
  y: number, 
  value: number,
  groupIndex?: number
}

function getInput(): string[] {
  const input = readFileSync('./input.txt', 'utf8');
  const rows: string[] = input.split('\r\n');
  return rows;
}

function getMatrix(): string[][] {
  const input = getInput();
  const matrix: string[][] = input.map((row) => row.split(''));
  return matrix;
}
const matrix = getMatrix();

function getNumbersPositions(matrix: string[][]): Position[] {
  const positions: Position[] = [];
  matrix.map((row, rowIndex) => {
    row.map((value, columnIndex) => {
      if (isNumber(value)) {
        let axis = { x: rowIndex, y: columnIndex, value: parseInt(value)};
        positions.push(axis);
      }
    });
  });
  return positions;
}

function joinAdjacentNumbers(positions: Position[]): Position[][] {
  let joinedPositions: Position[][] = [];
  let currentGroup: Position[] = [];
  let groupIndex = 0;

  for (let i = 0; i < positions.length; i++) {
    if (i === 0 || positions[i].y === positions[i - 1].y + 1) {
      currentGroup.push(positions[i]);
    } else {
      joinedPositions.push([...currentGroup]);
      currentGroup = [positions[i]];
    }
  }
  if (currentGroup.length > 0) {
    joinedPositions.push([...currentGroup]);
  }

  for (const group of joinedPositions) {
    group.map((value) => {
      value.groupIndex = groupIndex;
    });
    groupIndex++;
  }

  return joinedPositions;
}

const numbersPositions = joinAdjacentNumbers(getNumbersPositions(getMatrix()))

function isNumber(value: string): boolean {  
return !isNaN(Number(value))
}

function getSymbolsPositions(matrix: string[][]): { [key: string]: number }[] {
  const positions: { [key: string]: number }[] = [];
  matrix.map((row, rowIndex) => {
    row.map((value, columnIndex) => {
      if (!isNumber(value) && value !== '.') {
        let axis = { x: rowIndex, y: columnIndex };
        positions.push(axis);
      }
    });
  });
  return positions;
}

const symbolsPositions = getSymbolsPositions(getMatrix());

function getPartsNumber(numbersPositions: { [key: string]: number }[][], symbolsPositions: { [key: string]: number }[] ): number {
  let array_of_matches: { [key: string]: number }[][] = [];
  for (const number of numbersPositions) {
    for (const numberPart of number) {
      for (const symbol of symbolsPositions) {
        if (numberPart.x === symbol.x && numberPart.y === symbol.y + 1
            || numberPart.x === symbol.x && numberPart.y === symbol.y - 1
            || numberPart.x === symbol.x + 1 && numberPart.y === symbol.y
            || numberPart.x === symbol.x - 1 && numberPart.y === symbol.y
            || numberPart.x === symbol.x + 1 && numberPart.y === symbol.y + 1
            || numberPart.x === symbol.x + 1 && numberPart.y === symbol.y - 1
            || numberPart.x === symbol.x - 1 && numberPart.y === symbol.y + 1
            || numberPart.x === symbol.x - 1 && numberPart.y === symbol.y - 1
          ) {

          array_of_matches.push(number);

        }
      }
    }
  }

  array_of_matches = removeDuplicates(array_of_matches);
  console.log(array_of_matches);
  
  let values_of_matches: number[] = [];

  for (const match of array_of_matches) {
    values_of_matches.push(joinNumbersOfGroup(match));
  }

  return values_of_matches.reduce((acc, value) => acc + value, 0);
}

function joinNumbersOfGroup(group: { [key: string]: number }[]): number {
  let number: string = '';
  group.map((value) => number += value.value);
  return parseInt(number);
}

function removeDuplicates(array: { [key: string]: number }[][]): { [key: string]: number }[][] {
  const seenGroups = new Set<number>();
  
  return array.filter(group => {
    const groupIndex = group[0].groupIndex;

    if (!seenGroups.has(groupIndex)) {
      seenGroups.add(groupIndex);
      return true;
    }

    return false;
  });
}

console.log(getPartsNumber(numbersPositions, symbolsPositions));