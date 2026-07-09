import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { BrainCircuits, Send, Sparkles, BookOpen, ClipboardList, PenTool, Bot } from 'luicide-react';

interface ChatMessage {
    id: string;
    sender: 'user' | 'ai';
    text: string;
    timestamp: string;
}

export const AiStudyHelper: React.FC = () => {
    const { currentUser, setCompanionState } = useApp();
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: "welcome",
            sender: "ai",
            text
        }