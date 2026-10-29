# lovlyDev — портфолио

Личный сайт-визитка Артёма (lovlyDev): проекты, стек, услуги и контакты. React + Vite + TypeScript, чёрно-белый liquid glass, RU/EN.

## Запуск

```bash
npm install
npm run dev
```

## Сборка

```bash
npm run build
```

Готовый сайт — в `dist/`. Пути относительные (`base: './'`), поэтому он работает и на `lovlydev.github.io`, и на странице проекта `lovlydev.github.io/<repo>/`.

## Деплой на GitHub Pages

1. Запушь проект в репозиторий на GitHub, ветка `main`.
2. В репозитории: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Workflow `.github/workflows/deploy.yml` соберёт и опубликует сайт при каждом пуше в `main`.

## Где что менять

- `src/data/projects.ts` — проекты: тексты RU/EN, стек, ссылки, подписи к скриншотам.
- `versionSource` в проекте задаёт источник версии на GitHub: без `path` — последний стабильный релиз, с `path` — поле `version` JSON-файла в основной ветке репозитория. Версия обновляется при открытии страницы без пересборки сайта; при недоступности GitHub, таймауте или исчерпании API-лимита остаётся проверенная версия из `version`. Токены не нужны. Получение и проверка — в `src/data/projectVersions.ts`.
- `public/shots/<project>/NN.jpg` — скриншоты (порядок = порядок подписей в `shots`).
- `src/data/profile.ts` — ссылки, стек, услуги, этапы работы.
- `src/App.tsx` — секции страницы, `src/styles.css` — стили.
