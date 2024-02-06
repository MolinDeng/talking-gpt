import { TextToSpeech } from '@/components/TextToSpeech';
import { ChatBotCanvas } from '@/components/ChatBotCanvas';
import { IsPlayingProvider } from '@/context/IsPlayingContext';

export default function Home() {
  return (
    <main className="h-screen">
      <IsPlayingProvider>
        <ChatBotCanvas />
        <TextToSpeech />
      </IsPlayingProvider>
      <div className="inline absolute bottom-0 left-0 m-2 text-[#b00c3f]">
        By{' '}
        <a
          className="underline text-blue-700"
          href="https://molin7.vercel.app/"
          target="_blank"
        >
          @molin
        </a>
        <br />
        View source on{' '}
        <a
          className="underline text-blue-700"
          href="https://github.com/MolinDeng/talking-gpt"
          target="_blank"
        >
          Github
        </a>
      </div>
    </main>
  );
}
