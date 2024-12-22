// Kanji Database Integrity Checker (Browser Version)

// Define validation rules for each field
const rules = {
  kanji: value => typeof value === 'string' && value.length === 1,
  meaning: value => typeof value === 'string' && value.trim().length > 0,
  onyomi: value => typeof value === 'string' && /^[\u3040-\u309F ;]+$/.test(value),
  kunyomi: value => typeof value === 'string' && /^[\u3040-\u309F ;]+$/.test(value),
  mnemonic: value => typeof value === 'string' && value.trim().length > 0,
  onyomi_sentences: value => Array.isArray(value) && value.every(sentence => 
    sentence.word && 
    /^[{}\u3040-\u309F ;\w]+$/.test(sentence.word) &&
    sentence.sentence &&
    /^[{}\u3040-\u309F ;\w]+$/.test(sentence.sentence)
  ),
  kunyomi_sentences: value => Array.isArray(value) && value.every(sentence => 
    sentence.word &&
    /^[{}\u3040-\u309F ;\w]+$/.test(sentence.word) &&
    sentence.sentence &&
    /^[{}\u3040-\u309F ;\w]+$/.test(sentence.sentence)
  ),
  lookalike_kanji: value => typeof value === 'string' && /^[\u4E00-\u9FFF ;]+$/.test(value)
};

// Function to validate each kanji entry
function validateKanjiEntry(entry, lineNumber) {
  const errors = [];

  for (const [key, validate] of Object.entries(rules)) {
    if (!validate(entry[key])) {
      errors.push(`Line ${lineNumber}: Invalid or missing value for '${key}'.`);
    }
  }

  return errors;
}

// Main validation function
function validateKanjiDatabase(data) {
  const allErrors = [];

  data.forEach((entry, index) => {
    const lineNumber = index + 1;
    const entryErrors = validateKanjiEntry(entry, lineNumber);
    allErrors.push(...entryErrors);
  });

  return allErrors;
}

// HTML Elements
const fileInput = document.getElementById('fileInput');
const resultDiv = document.getElementById('result');

fileInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);

        if (!Array.isArray(data)) {
          resultDiv.textContent = 'Error: Database is not an array.';
          return;
        }

        const errors = validateKanjiDatabase(data);

        if (errors.length === 0) {
          resultDiv.textContent = 'No issues found. The database is valid.';
        } else {
          resultDiv.textContent = 'Issues found:\n' + errors.join('\n');
        }
      } catch (err) {
        resultDiv.textContent = 'Error: Failed to parse JSON. ' + err.message;
      }
    };
    reader.readAsText(file);
  }
});
