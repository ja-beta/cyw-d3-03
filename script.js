

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
  ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '+', '='],
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '{', '}'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ':', ';'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '<', '>', '?', '/']
];

const kbContainer = document.createElement('div');
kbContainer.className = 'keyboard';
kbLayout.forEach((row, rowIndex) => {
  const rowDiv = document.createElement('div');
  rowDiv.className = 'keyboard-row';
  row.forEach(char => {
    const keyDiv = document.createElement('div');
    const upperDiv = document.createElement('div');
    const lowerDiv = document.createElement('div');

    keyDiv.className = 'keyboard-key';
    upperDiv.className = 'upper-case';
    lowerDiv.className = 'lower-case';

    const upperChar = char.toUpperCase();
    const lowerChar = char.toLowerCase();

    upperDiv.id = encodeCharForId(upperChar);
    lowerDiv.id = encodeCharForId(lowerChar);

    upperDiv.textContent = upperChar;
    lowerDiv.textContent = lowerChar;

    keyDiv.appendChild(upperDiv);
    keyDiv.appendChild(lowerDiv);
    rowDiv.appendChild(keyDiv);
  });
  kbContainer.appendChild(rowDiv);
});


document.getElementById('main').appendChild(kbContainer);

function getMaxOccurrence(occurrences) {
  return Math.max(...Object.values(occurrences));
}

function colorKeysByOccurrence(charCounts) {
  const maxOccurrence = getMaxOccurrence(charCounts);

  kbLayout.flat().forEach(char => {
    const upperChar = char.toUpperCase();
    const lowerChar = char.toLowerCase();

    const upperCount = charCounts[upperChar] || 0;
    const lowerCount = charCounts[lowerChar] || 0;

    const upperIntensity = upperCount === 0 ? 255 : Math.floor(255 * (1 - (upperCount / maxOccurrence)));
    const lowerIntensity = lowerCount === 0 ? 255 : Math.floor(255 * (1 - (lowerCount / maxOccurrence)));

    const upperColorValue = `rgb(${upperIntensity},${upperIntensity},${upperIntensity})`;
    const lowerColorValue = `rgb(${lowerIntensity},${lowerIntensity},${lowerIntensity})`;

    const upperDiv = document.getElementById(encodeCharForId(upperChar));
    const lowerDiv = document.getElementById(encodeCharForId(lowerChar));

    if (upperDiv) { 
      upperDiv.style.backgroundColor = upperColorValue;
      upperDiv.style.color = upperIntensity < 128 ? 'white' : 'black';
    }
    
    if (lowerDiv) { 
      lowerDiv.style.backgroundColor = lowerColorValue;
      lowerDiv.style.color = lowerIntensity < 128 ? 'white' : 'black';
    }
  });
}


//#endregion


function encodeCharForId(char) {
  return `key-${char.charCodeAt(0)}`;
}
