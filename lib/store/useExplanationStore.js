import { create } from 'zustand';

export const useExplanationStore = create((set, get) => ({
  explanations: {},

  getExplanation: async (subject, topic) => {
    const key = `${subject}-${topic}`;
    const existing = get().explanations[key];
    if (existing) return existing;

    try {
      const res = await fetch("http://localhost:5000/api/syllabus/explain", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          summarize: { topic, sub: subject }
        })
      });

      const data = await res.json();
      const explanation = data?.explanation || "No explanation found.";

      set((state) => ({
        explanations: { ...state.explanations, [key]: explanation }
      }));

      return explanation;
    } catch (err) {
      console.error("❌ Error fetching explanation:", err);
      return "Error fetching explanation.";
    }
  }
}));

