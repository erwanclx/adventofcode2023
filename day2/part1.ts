import { readFileSync } from 'fs';

function getInput(): string[] {
  const input = readFileSync('./input.txt', 'utf8');
  const rows: string[] = input.split('\r\n');
  return rows;
}

function rawToCubes(raw: string) {
  const colors: string[][] = raw.split(',').map((value) => value.trim().split(' '));
  
  const cubes: { [key:string] : number } = colors.reduce((acc: { [key:string] : number } , color) => {
    const [num, colorName] : string[] = color;
    acc[colorName] = parseInt(num);
    return acc;
  }, {});

  const orderedColors = ['red', 'green', 'blue']
  const orderedCubes : { [key: string]: number } = {
        red: 0,
        green: 0,
        blue: 0,
  };
  
  orderedColors.map((color) => {
        if(cubes.hasOwnProperty(color)){
            orderedCubes[color] = cubes[color];
        }
    });

  return orderedCubes;
}

let array_of_games: number[] = [];
const bag_limit: { red: number, green: number, blue: number } = { red: 12, green: 13, blue: 14 };

function isInBagLimit(cubes: { [key: string]: number }): boolean {
  const { red, green, blue } = cubes;
  return red <= bag_limit.red && green <= bag_limit.green && blue <= bag_limit.blue;
}

getInput().map((value) => {
    let array_of_cubes: { [key: string]: number }[] = [];
    let array_of_results: boolean[] = [];
    const gameId: string = value.split(':')[0].split(' ')[1];
    const setsOfCubes: string[] = value.split(':')[1].split(';').map((value) => value.trim());
    setsOfCubes.map((setOfCubes) => {
        const cubes = rawToCubes(setOfCubes);
        array_of_cubes.push(cubes);
    })
    array_of_cubes.map((cubes) => {
        array_of_results.push(isInBagLimit(cubes));
    })

    if(array_of_results.indexOf(false) === -1){
        array_of_games.push(parseInt(gameId));
    }
})

console.log(array_of_games.reduce((acc, value) => acc + value, 0))