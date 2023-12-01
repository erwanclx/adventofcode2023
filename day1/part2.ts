import { readFileSync } from 'fs';

function getInput(): string {
  return readFileSync('./input.txt', 'utf8');
}

function getCorruptedCalibrations(input: string){
    const calibrations: string[] = input.split('\r\n');
    return calibrations;
}

function stringToNumber(input: string): string{
    return input
        .replace(/one/g, "o1e")
        .replace(/two/g, "t2o")
        .replace(/three/g, "th3ee")
        .replace(/four/g, "fo4ur")
        .replace(/five/g, "fi5ve")
        .replace(/six/g, "s6x")
        .replace(/seven/g, "se7en")
        .replace(/eight/g, "ei8th")
        .replace(/nine/g, "ni9ne");
}

function getDigits(input: Array<string>){

    interface DigitObject {
        first: string;
        last: string;
    }

    let all_digits: number[] = []
    input.map((value) => {
        let digits: number[] = []
        value = stringToNumber(value)

        value.split('').map((digit) => {
            let parsedDigit = parseInt(digit);
            if(!isNaN(parsedDigit)){
                digits.push(parsedDigit)
            }
        })

        if(digits.length === 1){
            digits = [digits[0], digits[0]]
        }

        let { first, last }: DigitObject = { 
            first: digits[0].toString(), 
            last: digits[digits.length - 1].toString() 
        }

        all_digits.push(parseInt(first + last))

    });
    return all_digits;
}

function getSumOfDigits(digits: number[]){
    let sum: number = 0;
    digits.map((digit) => {
        sum += digit;
    })
    return sum;
}

console.log(getSumOfDigits(getDigits(getCorruptedCalibrations(getInput()))));