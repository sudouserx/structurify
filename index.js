#!/usr/bin/env node
const readline = require('readline');

async function main() {
  const rl = readline.createInterface({ input: process.stdin });
  const stack = ['.'];
  for await (const raw of rl) {
    const line = raw.replace(/^[\s│\|]*/g, '')                     // strip guides
                   .replace(/^[├└]\s*──\s*/, '')                    // strip utf chars
                   .replace(/^[+\\|-]{1,2}\s*/, '');                // strip ASCII chars
    if (!line.trim()) continue;

    // depth by leading spaces
    const indent = raw.match(/^\s*/)[0].length;
    const level = Math.floor(indent / 4);  // assume 4-space tabs

    // adjust stack
    stack.length = level + 1;
    const name = line.trim();
    const full = stack.join('/') + '/' + name.replace(/\/$/, '');
    if (name.endsWith('/')) {
      console.log(`mkdir -p "${full}"`);
    } else {
      console.log(`mkdir -p "${full.split('/').slice(0, -1).join('/')}" && touch "${full}"`);
    }
    stack[level + 1] = name.replace(/\/$/, '');
  }
}

main().catch(err => console.error(err));
