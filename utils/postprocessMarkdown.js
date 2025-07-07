/**
 * Normalize and clean extracted Markdown text into GPT-friendly structure.
 * 
 * @param {string} markdown - Raw markdown or extracted text
 * @param {'pdf' | 'pptx' | 'docx'} sourceType - Type of source file
 * @returns {string} - Cleaned, normalized Markdown
 */



function isCaptionLine(line) {
  if (!line || line.length > 100) return false;

  const patterns = [
    /^Figure\s+\d+(\.\d+)?[:\-]/i,
    /^Image\s+\d+[:\-]?/i,
    /^Chart\s+\d+[:\-]?/i,
    /^Diagram\s+\d+[:\-]?/i,
    /^\(?Figure\s+\d+.*\)?$/i,
  ];

  return patterns.some((pat) => pat.test(line.trim()));
}

export function postprocessMarkdown(markdown, sourceType) {
  let text = markdown;

  // Step 1: Normalize line endings
  text = text.replace(/\r\n/g, '\n');

    // Step 1.5: Remove figure/image/chart lines (for .docx only)
  if (sourceType === 'docx') {
    text = text
      .split('\n')
      .filter((line) => !isCaptionLine(line))
      .join('\n');
  }


    // Step 2: Normalize bullet symbols to Markdown dash
  text = text.replace(/^[\s•‣–-]{1,3}(?=\S)/gm, '- ');

    // Step 3: Normalize numbered and lettered list items (1), 1., a), i. → 1.)
  text = text.replace(/^(\s*)(\(?[0-9a-zA-Z]{1,3}[\).\]])(\s+)/gm, (match, indent, marker, space) => {
    // Always convert to "1. " style for Markdown
    let normalized = marker
      .replace(/^[\(\[]?/, '')     // Remove opening ( or [
      .replace(/[\)\]\.]$/, '');   // Remove closing ) or . or ]
    
    // If it's a letter like a, b, i, ii — convert to lowercase
    if (/^[a-zA-Z]+$/.test(normalized)) {
      normalized = normalized.toLowerCase();
    }

    
    return `${indent}${normalized}. `;
  });


      // Step 4: Merge broken lines into full paragraphs
  text = text.replace(/([^\n])\n(?=[^\n])/g, (match, prevChar) => {
    // If the line doesn't end in punctuation, merge it with a space
    if (!/[.?!:;"”)]$/.test(prevChar)) {
      return prevChar + ' ';
    }
    return match;
  });

    // Step 5: Ensure proper space after heading markers (e.g., ##Heading → ## Heading)
  text = text.replace(/^(#{1,6})([^\s#])/gm, '$1 $2');

  // Step 6: Remove extra blank lines (max 2 newlines in a row)
  text = text.replace(/\n{3,}/g, '\n\n');



  return text.trim();
}



