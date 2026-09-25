# 🛡️ QR Shield — "Scan Before You Trust."
> **Explainable QR Code Security Scanner & Threat Intelligence Engine**  
> Designed for College Mini-Hackathon 2026

![QR Shield Banner](https://img.shields.io/badge/Security-Explainable_AI-00f2fe?style=for-the-badge)
![React 19](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-8.3-646cff?style=for-the-badge&logo=vite)
![Status](https://img.shields.io/badge/Production-Ready-10b981?style=for-the-badge)

---

## 🎯 The Core Problem: Quishing (QR Phishing)
With contactless payments, smart menus, and digital check-ins, attackers increasingly stick malicious QR codes over legitimate ones. Because human eyes cannot read matrix pixels, traditional camera scanners blindly open destinations, leading to:
- Credential harvesting forms disguised as official brands (PayPal, Google, Banks)
- Fraudulent UPI payment requests asking for a PIN
- Drive-by exploits and open redirects to malware

**QR Shield acts as an isolated intermediate gatekeeper:** It decodes the payload, validates RFC syntax, inspects domain structure, checks 12 security heuristics, and calculates an **Explainable Risk Score (0–100)** before you ever navigate to the site.

---

## ✨ Key Features
- **Dual-Engine Scanner**: Live camera scanning with glowing laser HUD, image drag & drop (PNG, JPG, WEBP), clipboard paste (`Ctrl+V`), and manual sandbox input.
- **Explainable Risk Engine (0–100)**:
  - 🟢 **LOW RISK (0–29)**: Standard protocol & clean domain.
  - 🟡 **MEDIUM RISK (30–59)**: Caution flags (e.g. unencrypted HTTP, open redirect, suspicious TLD).
  - 🔴 **HIGH RISK (60–100)**: Critical indicators (brand mismatch, credential lure keywords, raw IP host).
- **Zero Auto-Navigation**: URLs are never automatically opened or executed.
- **Brand Mismatch & Lookalike Detection**: Catches spoofed domains imitating PayPal, Google, Apple, Microsoft, Amazon, SBI, HDFC, Binance, and more.
- **Financial Payment Safety**: Identifies UPI barcodes (`upi://pay`), extracts payee details, and reminds users that **PIN is never required to receive money**.
- **10-Step Animated Security Pipeline**: Visual cyberpunk terminal showing real-time heuristic checks.
- **LocalStorage Audit History**: Keeps an on-device audit log without storing sensitive credentials or passwords.
- **Pre-Built Safe Demo Suite**: 3 controlled test cases with scannable QR codes for live hackathon presentations.
- **Bonus QR Generator**: Generate custom test QR codes on the spot.

---

## 🚀 How to Run Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

### 3. Build for Production
```bash
npm run build
```

---

## 🌐 How to Push to GitHub & Deploy (Get a Live Link)

### Step 1: Create a Repository on GitHub
1. Go to [https://github.com/new](https://github.com/new).
2. Name your repository: `qr-shield` (or any name you prefer).
3. Keep it **Public** and **do NOT** check "Add README" (we already have one).
4. Click **Create repository**.

### Step 2: Link & Push from Your Terminal
Run these commands in your project folder (`c:\Users\ELCOT\Desktop\scanner`):
```bash
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/qr-shield.git
git push -u origin main
```
*(Replace `<YOUR_GITHUB_USERNAME>` with your actual GitHub username).*

---

## ⚡ 1-Click Free Deployment Options

### Option A: Vercel (Recommended — 60 seconds)
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
2. Click **Add New Project** → **Import** your `qr-shield` repository.
3. Framework Preset will automatically detect **Vite**.
4. Click **Deploy**.
5. You will get a live link like `https://qr-shield.vercel.app`! 🎉

### Option B: Netlify
1. Go to [netlify.com](https://netlify.com) and sign in with GitHub.
2. Click **Add new site** → **Import an existing project**.
3. Choose your `qr-shield` GitHub repo.
4. Build command: `npm run build`, Publish directory: `dist`.
5. Click **Deploy site** to get your live `.netlify.app` link!

---

## 👥 Hackathon Team Credentials
- **Team**: CyberSentinels
- **College Mini-Hackathon 2026**
- Customizable team profiles directly from the app interface.
