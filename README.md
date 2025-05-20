## セットアップ手順

### 1. リポジトリのクローン

```
git clone https://github.com/TakeshiWada1980/web-sec-playground-1.git
cd nextjs-render-compare
```

### 2. 依存関係のインストール

```bash
npm i
```

### 3. データベースの初期化

```bash
npx prisma db push
npx prisma generate
npx prisma db seed
```

### 4. 開発サーバの起動

```bash
npm run dev
```

### 5. ビルド

```bash
npm run build
```

