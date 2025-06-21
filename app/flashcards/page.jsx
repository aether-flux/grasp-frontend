'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';

const flashcardSets = {
  A: [
    { question: 'What is a Turing Machine?', answer: 'A theoretical model of computation.' },
    { question: 'Define Regular Grammar.', answer: 'A grammar with simple production rules.' }
  ],
  B: [
    { question: 'Explain the Halting Problem.', answer: 'It determines whether a program halts or runs forever.' },
    { question: 'What is the Church-Turing Thesis?', answer: 'All computable functions can be computed by a Turing Machine.' }
  ]
};

export default function FlashcardsPage() {
  const [selectedKey, setSelectedKey] = useState('A');
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const cards = flashcardSets[selectedKey];
  const card = cards[index];

  const handleNext = () => {
    setFlipped(false);
    setIndex((prev) => (prev + 1) % cards.length);
  };

  return (
    <PanelGroup direction="horizontal" className="w-full h-[80dvh]">
      {/* Sidebar */}
      <Panel defaultSize={20} minSize={15} maxSize={25} className="bg-gray-100 border-r border-gray-300">
        <div className="p-4">
          <h2 className="font-semibold text-lg mb-6">📚 Syllabi</h2>
          {Object.keys(flashcardSets).map((key) => (
            <button
              key={key}
              onClick={() => {
                setSelectedKey(key);
                setIndex(0);
                setFlipped(false);
              }}
              className={`block w-full text-left px-3 py-2 mb-2 rounded transition cursor-pointer ${
                selectedKey === key ? 'bg-indigo-500 text-white' : 'hover:bg-gray-200 text-gray-700'
              }`}
            >
              Syllabus {key}
            </button>
          ))}
        </div>
      </Panel>

      <PanelResizeHandle className="w-4 flex items-center justify-center cursor-col-resize group transition-all duration-100 hover:bg-indigo-500/10">
        <div className="space-y-1">
          <span className="block w-1 h-1 bg-gray-500 rounded-full group-hover:bg-black" />
          <span className="block w-1 h-1 bg-gray-500 rounded-full group-hover:bg-black" />
          <span className="block w-1 h-1 bg-gray-500 rounded-full group-hover:bg-black" />
        </div>
      </PanelResizeHandle>

      {/* Flashcard Area */}
      <Panel>
        <div className="flex flex-col items-center justify-center h-full bg-white p-8">
          <h1 className="text-3xl font-bold mb-3">Flashcards</h1>
          <p className="text-lg font-light mb-8">Tap a card to flip it</p>

          <div className="relative w-96 h-64 perspective mb-6">
            <AnimatePresence initial={false}>
              <motion.div
                key={flipped ? 'answer' : 'question'}
                className="absolute w-full h-full rounded-2xl shadow-xl bg-white flex items-center justify-center text-center text-xl p-6 cursor-pointer border border-gray-200"
                initial={{ rotateY: flipped ? 180 : -180 }}
                animate={{ rotateY: 0 }}
                exit={{ rotateY: flipped ? -180 : 180 }}
                transition={{ duration: 0.6 }}
                onClick={() => setFlipped((f) => !f)}
              >
                {flipped ? card.answer : card.question}
              </motion.div>
            </AnimatePresence>
          </div>

          <button
        onClick={handleNext}
        className="mt-4 px-8 py-4 rounded-xl font-semibold text-white bg-[#4F46E5] hover:bg-[#4338CA] transition-all shadow-md hover:shadow-lg cursor-pointer"
      >
        Next →
      </button>
        </div>
      </Panel>
    </PanelGroup>
  );
}

