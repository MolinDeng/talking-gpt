'use client';
import { AppContext } from '@/context/IsPlayingContext';
import React, { FormEvent, useContext, useRef, useState } from 'react';
import { Loader2, Send } from 'lucide-react';

const sendTextToOpenAi = async (userText: string): Promise<string> => {
  const response = await fetch('/api/openai', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({ userText }),
  });
  const { message }: { message: string } = await response.json();
  return message;
};

export const TextToSpeech = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [userText, setUserText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { isPlaying, setIsPlaying } = useContext(AppContext);
  const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
  const voices = synth?.getVoices();

  const seletedVoice = voices?.find((voice) => voice.name === 'Albert'); // Other voice that sounds good Karen, Tessa, Trinoids

  const speak = (textToSpeak: string) => {
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.2;
    utterance.voice = seletedVoice!;

    synth?.speak(utterance);
    setIsPlaying(true);
    utterance.onend = () => {
      setIsPlaying(false);
    };
  };

  async function handleUserText(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (userText === '') return alert('Please enter text');
    setIsLoading(true);
    try {
      const message = await sendTextToOpenAi(userText);
      speak(message);
    } catch (error) {
      let message = '';
      if (error instanceof Error) message = error.message;
      console.log(message);
    } finally {
      setIsLoading(false);
      setUserText('');
    }
  }

  return (
    <div className="w-full h-auto absolute bottom-0 grid">
      <form onSubmit={handleUserText} className="mx-auto space-x-2 pt-2 ">
        <input
          type="text"
          value={userText}
          className="bg-transparent w-[510px] border border-[#b00c3f]/80 outline-none  rounded-lg placeholder:text-[#b00c3f] p-2 text-[#b00c3f]"
          onChange={(e) => setUserText(e.target.value)}
          placeholder="What do you want to know human...."
        />
        <button
          disabled={isLoading}
          className="text-[#b00c3f] p-2 disabled:text-blue-100 disabled:cursor-not-allowedhover:scale-110 hover:bg-[#b00c3f] hover:text-black duration-300 transition-all"
        >
          {/* {isLoading ? 'thinking...' : 'Ask'} */}
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </button>
      </form>
    </div>
  );
};
