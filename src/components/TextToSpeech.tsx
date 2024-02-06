'use client';
import { AppContext } from '@/context/IsPlayingContext';
import React, { FormEvent, useContext, useRef, useState } from 'react';
import { Loader2, Send } from 'lucide-react';
// import Speaker from 'speaker';
// import ffmpeg from 'fluent-ffmpeg';
// import axios from 'axios';

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

// https://www.youtube.com/watch?v=6AiVUcDV5FE
// const tts = async () => {
//   //   const mp3 = await openai.audio.speech.create({
//   //     model: 'tts-1',
//   //     voice: 'alloy',
//   //     input: 'Today is a wonderful day to build something people love!',
//   //   });
//   const headers = {
//     Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//   };
//   const data = {
//     model: 'tts-1',
//     input: 'Today is a wonderful day to build something people love!',
//     voice: 'alloy',
//     response_format: 'mp3',
//   };
//   const url = 'https://api.openai.com/v1/audio/speech';
//   const response = await axios.post(url, data, {
//     headers: headers,
//     responseType: 'stream',
//   });
//   const speaker = new Speaker({
//     channels: 2,
//     bitDepth: 16,
//     sampleRate: 22050,
//   });
//   ffmpeg(response.data)
//     .toFormat('s16le')
//     .audioChannels(2)
//     .audioFrequency(22050)
//     .pipe(speaker);
// };

export const TextToSpeech = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [userText, setUserText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { isPlaying, setIsPlaying } = useContext(AppContext);
  const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
  const voices = synth?.getVoices();

  const seletedVoice = voices?.find((voice) => voice.name === 'Karen'); // Other voice that sounds good Karen, Tessa, Trinoids

  const speak = (textToSpeak: string) => {
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.8;
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
      if (message === '') speak('I am sorry, I did not understand that');
      else {
        const audio = new Audio(message);
        audio.play();
        speak(message);
      }
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
    <div className="relative min-h-full">
      <div className="absolute bottom-0 left-0 w-full">
        <div className="mx-2 flex flex-row gap-3 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl">
          <div className="relative flex h-full flex-1 items-stretch md:flex-col">
            <div className="relative flex flex-col w-full flex-grow">
              <div className="relative">
                <form onSubmit={handleUserText} className="space-x-2 flex">
                  <input
                    type="text"
                    value={userText}
                    className="bg-transparent w-full border border-[#b00c3f]/80 outline-none rounded-lg placeholder:text-[#b00c3f] p-2 text-[#b00c3f]"
                    onChange={(e) => setUserText(e.target.value)}
                    placeholder="It's your turn...."
                  />
                  <button
                    disabled={isLoading}
                    className="text-[#b00c3f] my-auto p-2 disabled:text-blue-100 disabled:cursor-not-allowedhover:scale-110 hover:bg-[#b00c3f] hover:text-black duration-300 transition-all"
                  >
                    {/* {isLoading ? 'thinking...' : 'Ask'} */}
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
