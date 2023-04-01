# Task Manager

###### Author: jimmyhealer

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

User Story

- [ ] 先讓使用者登入 (github Oauth)  (index.tsx)
- [ ] 登入後看到自己有可讀寫的 project (task.tsx)
- [ ] 點進某projcet 後，可以看到該project的所有task (task/[username]/[project].tsx)
- [ ] 某個task 詳細資訊 (task/[username]/[project]/[issueNumber].tsx)

我先設計好一個有 search 的 layout

然後我在 task.tsx 和 task/[username]/[project].tsx 這兩個頁面都要用到