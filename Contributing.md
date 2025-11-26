

````markdown
# Contributing to LocalMind 🤖

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)  
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)  
[![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)

Thank you for your interest in contributing to **LocalMind — AI Without Limits**!  
Your contributions — whether code, documentation, bug reports, or feature suggestions — help make LocalMind better, more reliable, and accessible to everyone.  

Please read this guide carefully to ensure smooth collaboration.

---

## 🐞 Before You Start – Create an Issue

To avoid duplicate work and ensure clarity:

1. **Check existing issues** to see if your idea or bug is already reported.  
2. If not, **open a new issue** with:
   - A **clear title**  
   - **Steps to reproduce** (for bugs)  
   - **Screenshots or references** (if applicable)  
3. Wait for maintainers to **review and approve** the issue before starting a PR.  

> ✅ This keeps contributions organized and ensures efficient collaboration.

---

## 🛠️ How to Contribute

1. **Star ⭐ the repository**  
2. **Fork 🍴** the repository to your GitHub account  
3. **Create a new branch** for each issue or feature  
4. Make your changes with **clean and maintainable code**  
5. **Push** your branch to your fork  
6. Open a **Pull Request (PR)** against the `main` branch of the original repo  

---

## 💻 Coding Guidelines

- Follow **TypeScript & React conventions**  
- Write **clean, readable code**  
- Add **comments** for complex logic  
- Use **meaningful commit messages**  
- Test your changes locally before submission  

---

## 🚀 Contribution Workflow

### 1️⃣ Setup Your Local Environment

Clone your fork:

```bash
git clone https://github.com/<your-username>/LocalMind.git
cd LocalMind
````

Connect to the upstream (original repository):

```bash
git remote add upstream https://github.com/NexGenStudioDev/LocalMind.git
```

---

### 2️⃣ Keep Your Fork Updated

Before starting new work, sync your fork:

```bash
git checkout main
git fetch upstream
git merge upstream/main
git push origin main
```

---

### 3️⃣ Create a Branch for Your Work

```bash
git checkout -b feature/<short-description>
```

Examples:

* `feature/add-gemini-support`
* `bugfix/fix-chat-history`

> Always create a new branch per issue or feature.

---

### 4️⃣ Commit Your Changes

```bash
git add .
git commit -m "Type: Short, descriptive message"
git push origin feature/<short-description>
```

* **Type** can be `Feature`, `Fix`, `Docs`, etc.
* Keep messages concise and descriptive.

---

### 5️⃣ Open a Pull Request (PR)

1. Navigate to your fork on GitHub
2. Click **Compare & Pull Request**
3. Target the **main branch** of the original repo
4. Provide a **clear description** of your changes
5. Mention the **issue number** if applicable

> Maintainers will review, give feedback, and merge when ready.

---

### 6️⃣ Cleanup After Merge

Update your local main branch:

```bash
git checkout main
git fetch upstream
git merge upstream/main
git push origin main
```

Remove old branches locally:

```bash
git branch -d feature/<short-description>
```

Remove old branches remotely:

```bash
git push origin --delete feature/<short-description>
```

---

## 💡 Best Practices

* One branch per issue or feature
* Test all changes before submission
* Use descriptive commit messages
* Avoid pushing directly to `main`
* Provide screenshots, demos, or references for UI changes

---

## 🤝 Contributing Without Code

Not a developer? You can still help:

* Improve **documentation**
* Suggest **new AI features or models**
* Report **bugs or inconsistencies**
* Add **usage examples or tutorials**

---

## ⚙️ Supported Platforms

✅ Works with:

* Local & cloud AI models
* Windows, macOS, Linux
* Node.js + React development environment

> LocalMind is open-source, privacy-first, and designed for global collaboration — your contributions make it stronger!
