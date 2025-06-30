import path from 'path';
import fs from 'fs';
import { handlePdfUpload, handlePptxUpload, handleDocxUpload } from './uploadController.js';

export const summarizeFeature = async (req, res) => {
  try {
    let markdown = '';
    let filename = '';
    
    // CASE 1: File upload
    if (req.file) {
      filename = req.file.originalname;
      const ext = path.extname(filename).toLowerCase();

      // Process file type
      if (ext === '.pdf') {
        const fakeRes = await simulateRes();
        await handlePdfUpload(req, fakeRes);
        markdown = fakeRes._markdown;
      } else if (ext === '.pptx') {
        const fakeRes = await simulateRes();
        await handlePptxUpload(req, fakeRes);
        markdown = fakeRes._markdown;
      } else if (ext === '.docx') {
        const fakeRes = await simulateRes();
        await handleDocxUpload(req, fakeRes);
        markdown = fakeRes._markdown;
      } else {
        return res.status(400).json({ error: 'Unsupported file type' });
      }

    // CASE 2: Markdown string directly
    } else if (req.body.markdown) {
      markdown = req.body.markdown;
      filename = 'Text Input';
    } else {
      return res.status(400).json({ error: 'No file or markdown provided' });
    }

    // 🔧 MOCK GPT OUTPUT
    const dummySummary = {
      id: 'std1',
      title: filename,
      sections: [
        {
          title: 'Introduction',
          bullets: [
            'This is a mock summary point.',
            'It will later come from GPT.'
          ]
        },
        {
          title: 'Conclusion',
          bullets: [
            'Another key point.',
            'Summarization done.'
          ]
        }
      ]
    };

    res.json(dummySummary);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Summarization failed.' });
  }
};

// Simulate a dummy response wrapper so you can reuse upload logic
function simulateRes() {
  const res = {};
  res.json = (data) => { res._markdown = data.markdown; };
  return res;
}




export const explainFeature = async (req, res) => {
  try {
    let markdown = '';
    let filename = '';

    if (req.file) {
      filename = req.file.originalname;
      const ext = path.extname(filename).toLowerCase();

      const fakeRes = simulateRes();
      if (ext === '.pdf') {
        await handlePdfUpload(req, fakeRes);
      } else if (ext === '.pptx') {
        await handlePptxUpload(req, fakeRes);
      } else if (ext === '.docx') {
        await handleDocxUpload(req, fakeRes);
      } else {
        return res.status(400).json({ error: 'Unsupported file type' });
      }

      markdown = fakeRes._markdown;

    } else if (req.body.markdown) {
      markdown = req.body.markdown;
      filename = 'Text Input';
    } else {
      return res.status(400).json({ error: 'No file or markdown provided' });
    }

    //  Mock GPT output (AI-style explanations)
    const dummyExplained = {
      id: 'std3',
      title: filename,
      sections: [
        {
          title: 'Memory Management',
          bullets: [
            'AI: Memory management ensures processes don’t overwrite each other.',
            'AI: Paging helps organize memory into small, manageable blocks.'
          ]
        },
        {
          title: 'Process Scheduling',
          bullets: [
            'AI: The OS decides which task runs next — like a queue!',
            'AI: Priorities help ensure urgent tasks run sooner.'
          ]
        }
      ]
    };

    res.json(dummyExplained);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Explanation feature failed.' });
  }
};



export const termsFeature = async (req, res) => {
  try {
    let markdown = '';
    let filename = '';

    if (req.file) {
      filename = req.file.originalname;
      const ext = path.extname(filename).toLowerCase();

      const fakeRes = simulateRes();
      if (ext === '.pdf') {
        await handlePdfUpload(req, fakeRes);
      } else if (ext === '.pptx') {
        await handlePptxUpload(req, fakeRes);
      } else if (ext === '.docx') {
        await handleDocxUpload(req, fakeRes);
      } else {
        return res.status(400).json({ error: 'Unsupported file type' });
      }

      markdown = fakeRes._markdown;
    } else if (req.body.markdown) {
      markdown = req.body.markdown;
      filename = 'Text Input';
    } else {
      return res.status(400).json({ error: 'No file or markdown provided' });
    }

    //  Dummy GPT-style Flashcards (terms + definitions)
    const dummyTerms = {
      id: 'td1',
      title: filename,
      questions: [
        {
          id: 'q1',
          question: 'What is a function in JavaScript?',
          answer: 'A reusable block of code designed to perform a task.'
        },
        {
          id: 'q2',
          question: 'Define variable.',
          answer: 'A container for storing data values.'
        }
      ]
    };

    res.json(dummyTerms);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Term extraction failed.' });
  }
};



export const acronymFeature = async (req, res) => {
  try {
    let markdown = '';
    let filename = '';

    if (req.file) {
      filename = req.file.originalname;
      const ext = path.extname(filename).toLowerCase();

      const fakeRes = simulateRes();
      if (ext === '.pdf') {
        await handlePdfUpload(req, fakeRes);
      } else if (ext === '.pptx') {
        await handlePptxUpload(req, fakeRes);
      } else if (ext === '.docx') {
        await handleDocxUpload(req, fakeRes);
      } else {
        return res.status(400).json({ error: 'Unsupported file type' });
      }

      markdown = fakeRes._markdown;
    } else if (req.body.markdown) {
      markdown = req.body.markdown;
      filename = 'Text Input';
    } else {
      return res.status(400).json({ error: 'No file or markdown provided' });
    }

    // Dummy GPT-style Acronym Flashcard
    const dummyAcronym = {
      id: 'ac1',
      title: filename,
      Desc: 'AcronymFlashcards',
      content: [
        {
          id: 'q1',
          title: 'Phases of UP',
          contents: [
            { letter: 'I', word: 'Inception' },
            { letter: 'E', word: 'Elaboration' },
            { letter: 'C', word: 'Construction' },
            { letter: 'T', word: 'Transition' }
          ],
          keyPhrase: 'Imagine Every Challenge Triumphs'
        }
      ]
    };

    res.json(dummyAcronym);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Acronym feature failed.' });
  }
};
