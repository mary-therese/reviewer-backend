import { db } from '../utils/firebaseAdmin.js';
import { simulateRes } from '../utils/simulateRes.js';
import { postprocessMarkdown } from '../utils/postprocessMarkdown.js';


// Function to update counter and return the next reviewerId (ex. ac1, td1, etc.)
const updateCounterAndGetId = async (uid, folderId, prefix) => {
  const metaRef = db.collection('users').doc(uid).collection('meta').doc('counters');

  await db.runTransaction(async (transaction) => {
    const metaDoc = await transaction.get(metaRef);
    if (!metaDoc.exists) {
      transaction.set(metaRef, {
        acronymCounter: 0,
        termCounter: 0,
        summarizationCounter: 0,
        aiCounter: 0
      });
    }
  });

  const counterField = {
    AcronymMnemonics: 'acronymCounter',
    TermsAndCondition: 'termCounter',
    SummarizedReviewers: 'summarizationCounter',
    SummarizedAIReviewers: 'aiCounter'
  }[folderId];

  const counterRef = db.collection('users').doc(uid).collection('meta').doc('counters');
  const counterSnapshot = await counterRef.get();
  const current = counterSnapshot.data()?.[counterField] || 0;
  const next = current + 1;

  await counterRef.update({ [counterField]: next });

  return `${prefix}${next}`;
};



//Acronym Feature
export const acronymFeature = async (req, res) => {
  try {
    const uid = req.user.uid;
    const folderId = 'AcronymMnemonics';
    const prefix = 'ac';

    let markdown = req.body.markdown || '';

    //FOr debugging purposes if it's working correctly at the backend
    if (!markdown && req.file) {
      markdown = await simulateRes(req.file.path, req.file.mimetype);
    }

    console.log('[Acronym] UID:', uid);
    console.log('[Acronym] Folder ID:', folderId);
    console.log('[Acronym] Markdown Length:', markdown.length);

    // Dummy acronym flashcard sets
    const acronymSets = [
      {
        title: "Phases of UP",
        contents: [
          { letter: "I", word: "Inception" },
          { letter: "E", word: "Elaboration" },
          { letter: "C", word: "Construction" },
          { letter: "T", word: "Transition" },
          { letter: "P", word: "Production" }
        ],
        keyPhrase: "Imagine Every Challenge Turns Possible"
      },
      {
        title: "Functions of Management",
        contents: [
          { letter: "P", word: "Planning" },
          { letter: "O", word: "Organizing" },
          { letter: "L", word: "Leading" },
          { letter: "C", word: "Controlling" }
        ],
        keyPhrase: "Please Observe Leaders Closely"
      },
      {
        title: "SMART Goals",
        contents: [
          { letter: "S", word: "Specific" },
          { letter: "M", word: "Measurable" },
          { letter: "A", word: "Achievable" },
          { letter: "R", word: "Relevant" },
          { letter: "T", word: "Time-bound" }
        ],
        keyPhrase: "Set Meaningful Aims Reaching Timelines"
      },
      {
        title: "DMAIC Methodology",
        contents: [
          { letter: "D", word: "Define" },
          { letter: "M", word: "Measure" },
          { letter: "A", word: "Analyze" },
          { letter: "I", word: "Improve" },
          { letter: "C", word: "Control" }
        ],
        keyPhrase: "Don't Miss Analyzing Improvements Clearly"
      },
      {
        title: "SDLC Phases",
        contents: [
          { letter: "F", word: "Feasibility Study" },
          { letter: "R", word: "Requirements Analysis" },
          { letter: "D", word: "Design" },
          { letter: "I", word: "Implementation" },
          { letter: "T", word: "Testing" },
          { letter: "M", word: "Maintenance" }
        ],
        keyPhrase: "FRaDIsTic Maintenance Plan"
      }
    ];

    const reviewerId = await updateCounterAndGetId(uid, folderId, prefix);

    const reviewerData = {
      id: reviewerId,
      reviewers: acronymSets
    };

    await db
      .collection('users')
      .doc(uid)
      .collection('folders')
      .doc(folderId)
      .collection('reviewers')
      .doc(reviewerId)
      .set(reviewerData);

    res.json({ reviewers: [reviewerData] });

  } catch (err) {
    console.error('acronymFeature error:', err);
    res.status(500).json({ error: 'Failed to process acronyms' });
  }
};



//  Terms Feature
export const termsFeature = async (req, res) => {
  try {
    const uid = req.user.uid;
    const folderId = 'TermsAndCondition';
    const prefix = 'td';
    const reviewerId = await updateCounterAndGetId(uid, folderId, prefix);

    //FOr debugging purposes if it's working correctly at the backend
    let markdown = req.body.markdown || '';
    if (!markdown && req.file) {
      markdown = await simulateRes(req.file.path, req.file.mimetype);
    }

    console.log('[Terms] UID:', uid);
    console.log('[Terms] Folder ID:', folderId);
    console.log('[Terms] Reviewer ID:', reviewerId);
    console.log('[Terms] Markdown Length:', markdown.length);

    const termsSets = [
      {
        title: "HTML Reviewer",
        questions: [
          { id: "q1", question: "What does HTML stand for?", answer: "HyperText Markup Language" },
          { id: "q2", question: "Which HTML tag is used to create a hyperlink?", answer: "<a>" },
          { id: "q3", question: "Which tag is used to insert an image in HTML?", answer: "<img>" },
          { id: "q4", question: "What is the purpose of the <head> tag in HTML?", answer: "It contains metadata and links to scripts and stylesheets." },
          { id: "q5", question: "What attribute is used to provide alternative text for an image?", answer: "alt" }
        ]
      }
    ];

    const reviewerData = {
      id: reviewerId,
      reviewers: termsSets
    };

    await db.collection('users')
      .doc(uid)
      .collection('folders')
      .doc(folderId)
      .collection('reviewers')
      .doc(reviewerId)
      .set(reviewerData);

    res.json({ reviewers: [reviewerData] });
  } catch (err) {
    console.error('termsFeature error:', err);
    res.status(500).json({ error: 'Failed to process terms' });
  }
};


//  Summarization Feature
export const summarizeFeature = async (req, res) => {
  try {
    const uid = req.user.uid;
    const folderId = 'SummarizedReviewers';
    const prefix = 'std';
    const reviewerId = await updateCounterAndGetId(uid, folderId, prefix);

    //FOr debugging purposes if it's working correctly at the backend
    let markdown = req.body.markdown || '';
    if (!markdown && req.file) {
      markdown = await simulateRes(req.file.path, req.file.mimetype);
    }

    console.log('[Summarize] UID:', uid);
    console.log('[Summarize] Folder ID:', folderId);
    console.log('[Summarize] Reviewer ID:', reviewerId);
    console.log('[Summarize] Markdown Length:', markdown.length);

    const summarySets = [
      {
        title: "Web Development Reviewer",
        sections: [
          {
            title: "JavaScript Overview",
            bullets: [
              "JavaScript is primarily used to add interactivity and dynamic behavior to websites.",
              "Common keywords for declaring variables: let, const, or var.",
              "Expression '2' + 2 results in '22' due to string concatenation.",
              "Functions can be defined using: function myFunction() { }",
              "The addEventListener method attaches an event handler to an element."
            ]
          },
          {
            title: "Web Accessibility Essentials",
            bullets: [
              "WCAG stands for Web Content Accessibility Guidelines.",
              "Alt text describes images for screen readers and improves accessibility.",
              "The aria-label attribute helps screen readers understand the purpose of a link.",
              "Use heading tags (h1–h6) in order to provide a logical structure for screen readers.",
              "Color contrast ensures readability for users with visual impairments."
            ]
          }
        ]
      }
    ];

    const reviewerData = {
      id: reviewerId,
      reviewers: summarySets
    };

    await db.collection('users')
      .doc(uid)
      .collection('folders')
      .doc(folderId)
      .collection('reviewers')
      .doc(reviewerId)
      .set(reviewerData);

    res.json({ reviewers: [reviewerData] });
  } catch (err) {
    console.error('summarizeFeature error:', err);
    res.status(500).json({ error: 'Failed to process summarization' });
  }
};


//  Explanation Feature
export const explainFeature = async (req, res) => {
  try {
    const uid = req.user.uid;
    const folderId = 'SummarizedAIReviewers';
    const prefix = 'ai';
    const reviewerId = await updateCounterAndGetId(uid, folderId, prefix);

    //FOr debugging purposes if it's working correctly at the backend
    let markdown = req.body.markdown || '';
    if (!markdown && req.file) {
      markdown = await simulateRes(req.file.path, req.file.mimetype); 
    }

    console.log('[Explain] UID:', uid);
    console.log('[Explain] Folder ID:', folderId);
    console.log('[Explain] Reviewer ID:', reviewerId);
    console.log('[Explain] Markdown Length:', markdown.length);

    const explanationSets = [
      {
        title: "Operating System Concepts (AI Summary)",
        sections: [
          {
            title: "Process Management",
            bullets: [
              "AI: A process is a program in execution, including program counter, registers, and variables.",
              "The OS uses process scheduling to maximize CPU usage and reduce wait times.",
              "Multitasking involves context switching between processes."
            ]
          },
          {
            title: "Memory Management",
            bullets: [
              "AI: Memory management ensures each process has enough memory and prevents overlap.",
              "Paging and segmentation help divide memory into manageable sections.",
              "Virtual memory allows larger programs by using disk space as RAM overflow."
            ]
          },
          {
            title: "File Systems",
            bullets: [
              "AI: File systems store and organize data on storage devices.",
              "Common types include FAT, NTFS, ext4.",
              "Each file has attributes like name, type, and access permissions."
            ]
          }
        ]
      }
    ];

    const reviewerData = {
      id: reviewerId,
      reviewers: explanationSets
    };

    await db.collection('users')
      .doc(uid)
      .collection('folders')
      .doc(folderId)
      .collection('reviewers')
      .doc(reviewerId)
      .set(reviewerData);

    res.json({ reviewers: [reviewerData] });
  } catch (err) {
    console.error('explainFeature error:', err);
    res.status(500).json({ error: 'Failed to process explanation' });
  }
};

