const fs = require('fs');

const argv = process.argv.slice(1);

const filename = argv[1];
console.log(filename);
if (!filename.endsWith('.ls8')) {
  console.log('usage: [filename].ls8');
  process.exit(1);
}

const filedata = fs.readFileSync(filename, 'utf8');

let lines = filedata.toString().split('\n');
let newLines = lines.map((line, index) => {
  if (index < 2) return null;
  return line.slice(0, 7);
});

newLines.shift();
newLines.shift();

const RAM = require('./ram');
const CPU = require('./cpu');

/**
 * Load an LS8 program into memory
 *
 * TODO: load this from a file on disk instead of having it hardcoded
 */
function loadMemory() {
  // Hardcoded program to print the number 8 on the console

  console.log(newLines, 'newLines');
  const program = newLines;
  // [
  //   // print8.ls8
  //   '10011001', // LDI R0,8  Store 8 into R0
  //   '00000000',
  //   '00001000',
  //   '01000011', // PRN R0    Print the value in R0
  //   '00000000',
  //   '00000001', // HLT       Halt and quit
  // ];

  // Load the program into the CPU's memory a byte at a time
  for (let i = 0; i < program.length; i++) {
    cpu.poke(i, parseInt(program[i], 2));
  }
}

/**
 * Main
 */

let ram = new RAM(256);
let cpu = new CPU(ram);

// TODO: get name of ls8 file to load from command line

loadMemory(cpu);

cpu.startClock();
