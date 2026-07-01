"use client";

import { useState, useEffect } from "react";

// Internal singleton store state
const store = {
  documents: [
    { id: 1, name: "Machine Learning.pdf", type: "PDF", size: "4.2 MB", date: "Jul 01, 2026", status: "Parsed", qs: 28 },
    { id: 2, name: "Operating Systems Notes.pdf", type: "PDF", size: "2.8 MB", date: "Jun 28, 2026", status: "Parsed", qs: 15 },
    { id: 3, name: "Data Structures Chapter 5.docx", type: "Word", size: "1.1 MB", date: "Jun 25, 2026", status: "Parsed", qs: 8 },
    { id: 4, name: "Computer Networks.pdf", type: "PDF", size: "3.6 MB", date: "Jun 20, 2026", status: "Parsed", qs: 22 },
    { id: 5, name: "Database Systems Chapter 3.txt", type: "Text", size: "185 KB", date: "Jun 18, 2026", status: "Parsed", qs: 10 },
  ],
  papers: [
    { id: 1, title: "Operating Systems Mid Sem", subject: "Computer Science", code: "CS-204", marks: "100 Marks", date: "Jul 01, 2026", compliance: "96% Index", status: "Approved" },
    { id: 2, title: "Machine Learning Final Exam", subject: "Artificial Intelligence", code: "AI-301", marks: "75 Marks", date: "Jun 28, 2026", compliance: "94% Index", status: "Draft" },
    { id: 3, title: "Data Structures Quiz 4", subject: "Computer Science", code: "CS-101", marks: "25 Marks", date: "Jun 25, 2026", compliance: "90% Index", status: "Approved" },
    { id: 4, title: "Database Systems End Sem", subject: "Information Technology", code: "IT-220", marks: "100 Marks", date: "Jun 22, 2026", compliance: "95% Index", status: "Review" },
    { id: 5, title: "Linear Algebra Assessment", subject: "Mathematics", code: "MATH-150", marks: "50 Marks", date: "Jun 18, 2026", compliance: "92% Index", status: "Approved" },
    { id: 6, title: "Compiler Design Quiz 2", subject: "Computer Science", code: "CS-310", marks: "30 Marks", date: "Jun 10, 2026", compliance: "88% Index", status: "Approved" }
  ],
  questions: [
    { id: 1, text: "Write a function in Python to verify if a binary tree is BST.", level: "L3 - Applying", subject: "Data Structures", format: "Short Answer", marks: "5 M" },
    { id: 2, text: "Compare the worst-case space complexity of Quicksort and Merge Sort.", level: "L4 - Analyzing", subject: "Algorithms", format: "Short Answer", marks: "6 M" },
    { id: 3, text: "Define virtual memory paging and list the primary page-replacement policies.", level: "L1 - Remembering", subject: "Operating Systems", format: "MCQ", marks: "1 M" },
    { id: 4, text: "Design a relational database schema for an e-commerce platform ensuring 3NF.", level: "L6 - Creating", subject: "DBMS", format: "Descriptive", marks: "10 M" },
    { id: 5, text: "Critique the layout of the TCP sliding window flow-control protocol.", level: "L5 - Evaluating", subject: "Computer Networks", format: "Descriptive", marks: "8 M" },
    { id: 6, text: "List the differences between a stack and a queue data structure.", level: "L2 - Understanding", subject: "Data Structures", format: "MCQ", marks: "2 M" }
  ],
  listeners: new Set(),
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  },
  notify() {
    this.listeners.forEach(l => l());
  },
  addDocument(doc) {
    this.documents = [doc, ...this.documents];
    this.notify();
  },
  deleteDocument(id) {
    this.documents = this.documents.filter(d => d.id !== id);
    this.notify();
  },
  addPaper(paper) {
    this.papers = [paper, ...this.papers];
    this.notify();
  },
  deletePaper(id) {
    this.papers = this.papers.filter(p => p.id !== id);
    this.notify();
  },
  addQuestion(q) {
    this.questions = [q, ...this.questions];
    this.notify();
  },
  deleteQuestion(id) {
    this.questions = this.questions.filter(q => q.id !== id);
    this.notify();
  }
};

export function useDashboardStore() {
  const [state, setState] = useState({
    documents: store.documents,
    papers: store.papers,
    questions: store.questions
  });

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setState({
        documents: store.documents,
        papers: store.papers,
        questions: store.questions
      });
    });
    return unsubscribe;
  }, []);

  return {
    ...state,
    addDocument: (doc) => store.addDocument(doc),
    deleteDocument: (id) => store.deleteDocument(id),
    addPaper: (paper) => store.addPaper(paper),
    deletePaper: (id) => store.deletePaper(id),
    addQuestion: (q) => store.addQuestion(q),
    deleteQuestion: (id) => store.deleteQuestion(id),
  };
}
