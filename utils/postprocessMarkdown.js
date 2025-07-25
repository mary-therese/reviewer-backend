/**
 * Normalize and clean extracted Markdown text before feeding to GPT.
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
  //For Debugging in terminal, to show the processed text. It is limited to 500. Can be changed. For preview purposes.
  console.log(`[postprocessMarkdown] Received (${sourceType}):`, markdown.slice(0, 2000)); // remove .slice(0, 2000)) if you don't want it but it could freeze you terminal if the text is huge.


  let text = markdown;

  // S1: Normalize line endings
  text = text.replace(/\r\n/g, '\n');

  // S1.5: Remove figure/image/chart lines/captions (for .docx only)
if (sourceType === 'docx') {
  text = text
    .split('\n')
    .map((line) => {
      if (isCaptionLine(line)) {
        return `[Caption] ${line.trim()}`;
      }
      return line;
    })
    .join('\n');
}



  // S2: Normalize bullet symbols to Markdown dash
  text = text.replace(/^[\s•‣–-]{1,3}(?=\S)/gm, '- ');

  // S3: Normalize numbered and lettered list items (1), 1., a), i. → 1.)
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


  // S4: Merge broken lines into full paragraphs
  text = text.replace(/([^\n])\n(?=[^\n])/g, (match, prevChar) => {
    // If the line doesn't end in punctuation, merge it with a space
    if (!/[.?!:;"”)]$/.test(prevChar)) {
      return prevChar + ' ';
    }
    return match;
  });

  // S5: Ensure proper space after heading markers (e.g., ##Heading → ## Heading)
  text = text.replace(/^(#{1,6})([^\s#])/gm, '$1 $2');

  // S6: Remove extra blank lines (max 2 newlines in a row)
  text = text.replace(/\n{3,}/g, '\n\n');

  //For Debugging in terminal, to show the processed text. It is limited to 500. Can be changed. For preview purposes.
  console.log(`[postprocessMarkdown] Final Output (${sourceType}):`, text.slice(0, 2000)); // remove .slice(0, 2000)) if you don't want it but it could freeze you terminal if the text is huge.

  return text.trim();
}



