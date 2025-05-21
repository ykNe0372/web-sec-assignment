## ⚠️ 重要な注意事項

このプロジェクトは **ウェブアプリのセキュリティ実験用のコンテンツ** です。学習と検証を目的として、あえて脆弱性を含む設計となっています。

- このウェブアプリを公開サーバーやインターネット上でホストしないでください。
- 自分以外がアクセス可能な環境にデプロイしないでください。
- ローカル環境（localhost）でのみ実行してください。

このコードには意図的に組み込まれたセキュリティの脆弱性💀があります。セキュティ学習用の教材としてのみ利用してください。

## セットアップ手順

### 1. リポジトリのクローン

```
git clone https://github.com/TakeshiWada1980/web-sec-playground-1.git
cd web-sec-playground-1
```

上記でクローンすると、カレントフォルダのなかに `web-sec-playground-1` というフォルダが新規作成されて展開されます。別名にしたいときは、たとえば `hoge` というフォルダにクローンしたいときは、次のようにしてください。

```
git clone https://github.com/TakeshiWada1980/web-sec-playground-1.git hoge
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

### 5. ビルドと実行

```bash
npm run build
npm run start
```

- データベースの状態確認

```bash
npx prisma studio
```

