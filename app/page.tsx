import TagAdvisor from './components/TagAdvisor';

const TAG_OPTIONS = [
  '仕事優先',
  '貯金したい',
  '恋人との時間優先',
  'ペットを飼いたい',
  '一軒家に住みたい',
  '子供が欲しい',
  '海外に住みたい',
  '趣味を共有したい',
  'キャリアアップ志向',
  '家族を大切にしたい',
  '旅行が好き',
  '都会で暮らしたい',
  '地方でスローライフ',
  '柔軟な働き方をしたい',
  '健康志向',
];

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col items-center px-6 py-12">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Love Lens
        </h1>
        <p className="mt-4 max-w-2xl text-base text-slate-600">
          人生観に近いタグを選択すると、AIが恋愛タイプを言語化してフィードバックします。
        </p>
      </header>

      <TagAdvisor tags={TAG_OPTIONS} />
    </main>
  );
}
