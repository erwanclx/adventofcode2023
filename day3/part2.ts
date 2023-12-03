import { readFileSync } from 'node:fs';

type Position = {
  x: number,
  y: number, 
  value: number,
  groupIndex?: number,
  hitBy?: number
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
      if (value === '*') {
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
        let symbolIndex = symbolsPositions.indexOf(symbol);
        if (numberPart.x === symbol.x && numberPart.y === symbol.y + 1
            || numberPart.x === symbol.x && numberPart.y === symbol.y - 1
            || numberPart.x === symbol.x + 1 && numberPart.y === symbol.y
            || numberPart.x === symbol.x - 1 && numberPart.y === symbol.y
            || numberPart.x === symbol.x + 1 && numberPart.y === symbol.y + 1
            || numberPart.x === symbol.x + 1 && numberPart.y === symbol.y - 1
            || numberPart.x === symbol.x - 1 && numberPart.y === symbol.y + 1
            || numberPart.x === symbol.x - 1 && numberPart.y === symbol.y - 1
          ) {
          let hitBy = symbolIndex;
          let groupIndex = numberPart.groupIndex;

          for (const group of numbersPositions) {
            for (const part of group) {
              if (part.groupIndex === groupIndex) {
                part.hitBy = hitBy;
              }
            }
          }
          
          array_of_matches.push(number);

        }
      }
    }
  }

  array_of_matches = removeDuplicates(array_of_matches);
  
  let values_of_matches: { joinedNumbers: number, hitBy: number }[] = [];

  for (const match of array_of_matches) {
    values_of_matches.push({
      joinedNumbers: joinNumbersOfGroup(match),
      hitBy: match[0].hitBy
    });
  }

  let hit_dict: { 
    [key: string]: number[]
   } = {};

  for (const match of values_of_matches) {
    let currentHit: string = String(match.hitBy);
    let currentNumber: number = match.joinedNumbers;
    hit_dict[currentHit] = [...hit_dict[currentHit] || [], currentNumber];
  }

  let array_of_gears: number[] = [];

  for (const key in hit_dict) {
    if (hit_dict[key].length === 2) {
      let gear = hit_dict[key][0] * hit_dict[key][1];
      array_of_gears.push(gear);
    }
    else {
      delete hit_dict[key];
    }
  }

  return array_of_gears.reduce((acc, value) => acc + value, 0);
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