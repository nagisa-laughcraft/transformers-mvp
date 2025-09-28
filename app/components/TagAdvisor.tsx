'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { env, pipeline } from '@xenova/transformers';

env.allowLocalModels = false;
if (env.backends?.onnx?.wasm && !env.backends.onnx.wasm.wasmPaths) {
  env.backends.onnx.wasm.wasmPaths =
    'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.14.0/dist/';
}

interface TagAdvisorProps {
  tags: string[];
}

type GenerationResult = { generated_text: string };
type TextGenerator = (
  prompt: string,
  options?: Record<string, unknown>,
) => Promise<GenerationResult | GenerationResult[]>;
type TranslationResult = { translation_text: string };
type Translator = (
  text: string,
  options?: Record<string, unknown>,
) => Promise<TranslationResult | TranslationResult[]>;

const englishTemplate = (originalTags: string[], translatedTags: string[]) => {
  const combinedTags = originalTags.map((tag, index) => {
    const translated = translatedTags[index]?.trim();
    return translated && translated !== tag ? `${translated} (${tag})` : tag;
  });

  return `You are a thoughtful relationship coach. Based on the following life-value tags selected by the user, describe their romantic tendencies and suggest an ideal partner match in under 150 words. Start the response with "Feedback:" and write in warm, encouraging English.\n\nTags: ${
    combinedTags.length > 0 ? combinedTags.join(', ') : 'None selected'
  }\n\nProvide a concise summary that highlights the user's values and how those values influence their love life.`;
};

const TagAdvisor = ({ tags }: TagAdvisorProps) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const pipelineRef = useRef<TextGenerator | null>(null);
  const translationRefs = useRef<{
    jaToEn: Translator | null;
    enToJa: Translator | null;
  }>({ jaToEn: null, enToJa: null });

  const getTranslationPipeline = useCallback(async (direction: 'ja-en' | 'en-ja') => {
    if (direction === 'ja-en') {
      if (!translationRefs.current.jaToEn) {
        translationRefs.current.jaToEn = (await pipeline(
          'translation',
          'Xenova/opus-mt-ja-en',
        )) as unknown as Translator;
      }
      return translationRefs.current.jaToEn;
    }

    if (!translationRefs.current.enToJa) {
      translationRefs.current.enToJa = (await pipeline(
        'translation',
        'Xenova/opus-mt-en-ja',
      )) as unknown as Translator;
    }
    return translationRefs.current.enToJa;
  }, []);

  const translateText = useCallback(
    async (text: string, direction: 'ja-en' | 'en-ja') => {
      try {
        const translator = await getTranslationPipeline(direction);
        const result = await translator(text);
        const translation = Array.isArray(result) ? result[0]?.translation_text : result.translation_text;
        return translation?.trim() ?? text;
      } catch (translationError) {
        console.error(translationError);
        return text;
      }
    },
    [getTranslationPipeline],
  );

  const toggleTag = useCallback((tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag],
    );
  }, []);

  const sortedTags = useMemo(() => [...tags].sort(), [tags]);

  const handleGenerate = useCallback(async () => {
    if (selectedTags.length === 0) {
      setError('タグを最低1つ選択してください。');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (!pipelineRef.current) {
        pipelineRef.current = (await pipeline(
          'text-generation',
          'Xenova/gpt2',
        )) as TextGenerator;
      }

      const translatedTags = await Promise.all(
        selectedTags.map((tag) => translateText(tag, 'ja-en')),
      );
      const promptEn = englishTemplate(selectedTags, translatedTags);
      const result = await pipelineRef.current(promptEn, {
        max_new_tokens: 120,
        temperature: 0.7,
        top_p: 0.9,
      });

      const generated = Array.isArray(result) ? result[0].generated_text : result.generated_text;
      const cleanedEnglish = generated.replace(promptEn, '').trim();
      const withoutPrefix = cleanedEnglish.replace(/^Feedback:\s*/i, '').trim();
      const englishBody = withoutPrefix || 'Unable to generate feedback. Please try again later.';
      const translatedFeedback = await translateText(englishBody, 'en-ja');
      const normalized = translatedFeedback.startsWith('フィードバック:')
        ? translatedFeedback
        : `フィードバック: ${translatedFeedback}`;
      setFeedback(normalized.trim());
    } catch (generationError) {
      console.error(generationError);
      setError('フィードバックの生成に失敗しました。時間をおいて再度お試しください。');
    } finally {
      setIsLoading(false);
    }
  }, [selectedTags, translateText]);

  const resetSelections = useCallback(() => {
    setSelectedTags([]);
    setFeedback('');
    setError(null);
  }, []);

  return (
    <section className="w-full rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">価値観タグ</h2>
          <p className="text-sm text-slate-500">
            当てはまるものを自由に選んでください。選択内容はモデルにそのまま渡されます。
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span className="rounded-full bg-indigo-100 px-3 py-1 font-medium text-indigo-700">
            {selectedTags.length} 個選択中
          </span>
          {selectedTags.length > 0 && (
            <button
              type="button"
              onClick={resetSelections}
              className="text-indigo-600 underline-offset-4 hover:underline"
            >
              リセット
            </button>
          )}
        </div>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {sortedTags.map((tag) => {
          const isSelected = selectedTags.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`rounded-full border px-4 py-2 text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                isSelected
                  ? 'border-transparent bg-indigo-600 text-white shadow'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-200 hover:text-indigo-600'
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={handleGenerate}
          disabled={isLoading}
          className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed"
        >
          {isLoading ? '分析中…' : '恋愛タイプを生成'}
        </button>
        <p className="text-xs text-slate-500">
          初回はモデルを読み込むため数十秒かかる場合があります。
        </p>
      </div>

      {error && (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {feedback && !error && (
        <article className="mt-6 space-y-3 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-5 text-sm text-slate-700">
          <h3 className="text-base font-semibold text-indigo-700">AIからのフィードバック</h3>
          <p className="whitespace-pre-line leading-relaxed">{feedback}</p>
        </article>
      )}
    </section>
  );
};

export default TagAdvisor;
