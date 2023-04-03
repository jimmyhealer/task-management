# Task Manager

![](https://img.shields.io/badge/-Next.js-000000?style=flat-square&logo=next.js&logoColor=white)

###### Author: jimmyhealer

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
export CLIENT_ID={YOUR GITHUB CLIENT ID}
export CLIENT_SECRET={YOUR GITHUB CLIENT SECRET}

npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 架構

### 程式碼架構

```bash
├── components
│   ├── EditModal.tsx
├── pages
│   ├── _app.tsx
│   ├── _document.tsx
│   ├── index.tsx // 登入頁面
│   ├── task
│   │   ├── index.tsx // 顯示所有 project
│   │   ├── [username]
│   │       ├── index.tsx // 跳轉所有 project
│   │       ├── [projectName]3
│   │           ├── index.tsx // 顯示所有 task
│   │           ├── [issueNumber].tsx // 顯示 task 的詳細資訊
├── context
│   ├── AlertContext.tsx // 用來顯示 alert 的 context
├── utils
│   ├── index.ts // 一些常用的函式
├── api
│   ├── index.ts // 用來跟 Github API 互動的函式
```

## 使用流程

Step 1. 使用 Github 登入

![](https://media.discordapp.net/attachments/1084488208076771349/1092387374836756480/image.png?width=1360&height=662)

Step 2. 選擇要作為 Task 的 Project\
Step 3. 顯示所有 Task\
Step 4. 點擊 Task 顯示詳細資訊

### 篩選、排序及搜尋

提供篩選 Task 的狀態 (Open, In Progress, Done)。\
排序可以依照 Task 的建立時間分為由新到舊、由舊到新。\
搜尋則是依照 Task 的標題和內文，並從輸入框輸入關鍵字後按下 Enter。

![](https://media.discordapp.net/attachments/1084488208076771349/1092387912185806878/image.png?width=1440&height=168)

## 問題

在改變 Task 的狀態時 (修改 Issue 的 Labels)，如果使用 API 馬上獲取該 Task 的詳細資料，依舊會是舊的資料。\
但是在 Github 頁面卻是已經是新的資料，猜測是 Github 的 API 有快取之類的。
