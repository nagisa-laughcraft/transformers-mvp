# Love Lens

Love Lens is an MVP web experience built with Next.js and transformers.js that summarizes a user's relationship style. Visitors choose life-priority tags and receive warm, English-language feedback generated entirely in the browser.

## Getting started

```bash
npm install
```

## Run the development server

```bash
npm run dev
```

Then open `http://localhost:3000` in your browser. The first generation can take a few seconds while the model downloads into the session.

## Tech stack

- Next.js 14 (App Router)
- React 18 with TypeScript
- Tailwind CSS
- [@xenova/transformers](https://github.com/xenova/transformers.js) for on-device GPT-2 inference

## Feedback flow

1. The user selects English life-value tags on the page.
2. The selected tags feed directly into a GPT-2 prompt rendered with `@xenova/transformers`.
3. The generated text is cleaned to ensure it begins with `Feedback:` and then displayed to the user.

## Project structure

```
app/
 ├─ components/TagAdvisor.tsx  # Tag selection UI and feedback generation logic
 ├─ layout.tsx                 # Root layout and metadata
 └─ page.tsx                   # Landing page
```

## License

This repository is provided for educational MVP purposes.
