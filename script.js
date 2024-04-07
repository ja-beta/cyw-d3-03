
function countCharOccurrences(wordList) {
  const charCounts = {};
  wordList.forEach(word => {
    for (const char of word) {
      if (charCounts[char]) {
        charCounts[char]++;
      } else {
        charCounts[char] = 1;
      }
    }
  });
  return charCounts;
}

function countFirstChar(wordList) {
  const firstCharCounts = {};
  wordList.forEach(word => {
    const firstChar = word[0];
    if (firstCharCounts[firstChar]) {
      firstCharCounts[firstChar]++;
    } else {
      firstCharCounts[firstChar] = 1;
    }
  });
  return firstCharCounts;
}

d3.csv("assets/passwords.csv").then
  (data => {

    // console.log(d);
    const words = data.map(d => d.string);
    const charOccurrences = countCharOccurrences(words);
    console.log(charOccurrences);

    const firstChars = countFirstChar(words);
    console.log(firstChars);

    colorKeysByOccurrence(charOccurrences);


  });


//#region KEYBOARD VIS

const kbLayout = [
  [{ char1: '1', char2: '!' },
  { char1: '2', char2: '@' },
  { char1: '3', char2: '#' },
  { char1: '4', char2: '$' },
  { char1: '5', char2: '%' },
  { char1: '6', char2: '^' },
  { char1: '7', char2: '&' },
  { char1: '8', char2: '*' },
  { char1: '9', char2: '(' },
  { char1: '0', char2: ')' },
  { char1: '-', char2: '_' },
  { char1: '=', char2: '+' }],

  [{ char1: 'q', char2: 'Q' },
  { char1: 'w', char2: 'W' },
  { char1: 'e', char2: 'E' },
  { char1: 'r', char2: 'R' },
  { char1: 't', char2: 'T' },
  { char1: 'y', char2: 'Y' },
  { char1: 'u', char2: 'U' },
  { char1: 'i', char2: 'I' },
  { char1: 'o', char2: 'O' },
  { char1: 'p', char2: 'P' },
  { char1: '[', char2: '{' },
  { char1: ']', char2: '}' }],

  [{ char1: 'a', char2: 'A' },
  { char1: 's', char2: 'S' },
  { char1: 'd', char2: 'D' },
  { char1: 'f', char2: 'F' },
  { char1: 'g', char2: 'G' },
  { char1: 'h', char2: 'H' },
  { char1: 'j', char2: 'J' },
  { char1: 'k', char2: 'K' },
  { char1: 'l', char2: 'L' },
  { char1: ';', char2: ':' }],

  [{ char1: 'z', char2: 'Z' },
  { char1: 'x', char2: 'X' },
  { char1: 'c', char2: 'C' },
  { char1: 'v', char2: 'V' },
  { char1: 'b', char2: 'B' },
  { char1: 'n', char2: 'N' },
  { char1: 'm', char2: 'M' },
  { char1: ',', char2: '<' },
  { char1: '.', char2: '>' },
  { char1: '/', char2: '?' }]

];

const kbContainer = document.createElement('div');
kbContainer.className = 'keyboard';

kbLayout.forEach(row => {
  const rowDiv = document.createElement('div');
  rowDiv.className = 'keyboard-row';
  row.forEach(key => {
    const keyDiv = document.createElement('div');
    const char1Div = document.createElement('div');
    const char2Div = document.createElement('div');

    keyDiv.className = 'keyboard-key';
    char1Div.className = 'char1';
    char2Div.className = 'char2';

    char1Div.id = encodeCharForId(key.char1);
    char2Div.id = encodeCharForId(key.char2);

    char1Div.textContent = key.char1;
    char2Div.textContent = key.char2;

    keyDiv.appendChild(char1Div);
    keyDiv.appendChild(char2Div);
    rowDiv.appendChild(keyDiv);
  });
  kbContainer.appendChild(rowDiv);
});

document.getElementById('main').appendChild(kbContainer);


function getMaxOccurrence(occurrences) {
  return Math.max(...Object.values(occurrences));
}

function encodeCharForId(char) {
  return `key-${char.charCodeAt(0)}`;
}


function colorKeysByOccurrence(charCounts) {
  const maxOccurrence = getMaxOccurrence(charCounts);

  // const colorScale = d3.scaleSequential()
  //   .domain([0, getMaxOccurrence(charCounts)])
  //   .interpolator(d3.interpolateBlues);

  const colorScale = d3.scaleSequential(d3.interpolateOrRd)
  .domain([0, getMaxOccurrence(charCounts)]);

  kbLayout.forEach(row => {
    row.forEach(key => {
      const char1 = key.char1;
      const char2 = key.char2;
      const count1 = charCounts[char1] || 0;
      const count2 = charCounts[char2] || 0;

      const color1 = colorScale(count1);
      const color2 = colorScale(count2);

      const intensity1 = count1 === 0 ? 255 : Math.floor(255 * (1 - (count1 / maxOccurrence)));
      const intensity2 = count2 === 0 ? 255 : Math.floor(255 * (1 - (count2 / maxOccurrence)));
      // const colorValue1 = `rgb(${intensity1},${intensity1},${intensity1})`;
      // const colorValue2 = `rgb(${intensity2},${intensity2},${intensity2})`;

      const char1Div = document.getElementById(encodeCharForId(char1));
      const char2Div = document.getElementById(encodeCharForId(char2));

      if (char1Div) {
        char1Div.style.backgroundColor = color1;
        char1Div.style.color = intensity1 < 128 ? 'white' : 'black';
      }

      if (char2Div) {
        char2Div.style.backgroundColor = color2;
        char2Div.style.color = intensity2 < 128 ? 'white' : 'black';
      }
    });
  });
}
//#endregion



