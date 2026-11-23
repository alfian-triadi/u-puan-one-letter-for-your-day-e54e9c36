// One Letter for Your Day — entry program.
//
// The single letter this program writes is "Z".
// The word behind the letter is "zero sleep": an honest report of a day
// spent building make.fun bounty entries through the night without sleep.
// No grand adventure, no holiday — just a builder still awake at dawn,
// running on caffeine and stubbornness. That is the whole day, told in
// one letter.
//
// The program is deterministic: every run writes exactly the same byte.
// It reads nothing outside the repository, makes no network calls, and
// writes only entry.txt into the output directory.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The letter of the day, and the word it stands for.
const LETTER_OF_THE_DAY = "Z";
const WORD_BEHIND_THE_LETTER = "zero sleep";

const LETTER_PATTERN = /^[A-Z]$/;

function validateLetter(letter: string, word: string): void {
  // Guard 1: the entry must be exactly one character, a letter A–Z.
  if (!LETTER_PATTERN.test(letter)) {
    throw new Error(`entry must be a single letter A-Z, got ${JSON.stringify(letter)}`);
  }

  // Guard 2: the letter must be the initial of the word behind it.
  if (word[0].toUpperCase() !== letter) {
    throw new Error(
      `letter ${letter} does not match the word behind it: ${JSON.stringify(word)}`,
    );
  }

  // Guard 3: exactly one byte on disk — no newline, no hidden whitespace.
  if (Buffer.byteLength(letter, "utf8") !== 1) {
    throw new Error(`entry must be exactly 1 byte, got ${Buffer.byteLength(letter, "utf8")}`);
  }
}

function resolveOutputDir(): string {
  const fromEnv = process.env.MAKEFUN_OUTPUT_DIR;
  if (fromEnv !== undefined && fromEnv !== "") {
    return fromEnv;
  }
  return "/output";
}

function main(): void {
  validateLetter(LETTER_OF_THE_DAY, WORD_BEHIND_THE_LETTER);

  const outputDir = resolveOutputDir();
  mkdirSync(outputDir, { recursive: true });
  // No trailing newline: the gate requires exactly one character.
  writeFileSync(join(outputDir, "entry.txt"), LETTER_OF_THE_DAY, "utf8");
}

main();
