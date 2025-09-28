import TagAdvisor from './components/TagAdvisor';

const TAG_OPTIONS = [
  'Career-first mindset',
  'Values financial stability',
  'Prioritizes quality time with partner',
  'Wants to raise pets',
  'Dreams of owning a home',
  'Wants children',
  'Open to living abroad',
  'Enjoys sharing hobbies',
  'Ambitious about career growth',
  'Family-oriented',
  'Loves to travel',
  'Prefers city living',
  'Prefers a slower lifestyle',
  'Seeks flexible work',
  'Health-conscious',
  'Values personal independence',
];

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col items-center px-6 py-12">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Love Lens
        </h1>
        <p className="mt-4 max-w-2xl text-base text-slate-600">
          Pick the life perspective tags that resonate with you and let the AI summarize your relationship style in natural language.
        </p>
      </header>

      <TagAdvisor tags={TAG_OPTIONS} />
    </main>
  );
}
