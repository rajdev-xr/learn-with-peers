# 🚀 Live Demo

👉 [Check out the live app here](https://learn-with-peers.vercel.app/)



# 🚀 SkillSync – Curated Learning with XP & Badges

SkillSync is a full-stack web app that helps learners master real-world skills through curated learning paths, track progress with XP, and stay motivated with gamified badges.

### 🧠 Built with:
- **Next.js (App Router)** – frontend & server routes
- **Supabase** – PostgreSQL, Auth, RLS, and Realtime DB
- **Tailwind CSS** – responsive UI styling
- **PostgreSQL Triggers + Policies** – secure automation

---

## 📚 Features

### 👤 Authentication
- Email/password login and signup via Supabase Auth
- Secure, role-based access to skill progress and badges

### 🧩 Skill Library
- 15 diverse skills across categories: Programming, Design, AI, Career & Business
- Each skill contains 3 curated learning modules (video, blog, docs)
- Learners earn XP for completing modules

### 🧠 XP Tracking System
- Each module gives XP (10–35 points)
- Profile stores real-time XP tally

### 🏅 Badge Rewards System
- Auto-awarded badges as XP grows:
  - 🟢 Novice – 100 XP  
  - 🔵 Intermediate – 300 XP  
  - 🟠 Advanced – 600 XP  
  - 🔴 Expert – 1000 XP
- Users can view earned badges on dashboard

### 🔐 Security
- Full Supabase RLS (Row Level Security)
- Policies restrict badge access to rightful users
- Secure XP mutation triggers badge automation

---


## 🛠️ How to Run Locally

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/skill-sync.git
cd skill-sync

# 2. Install dependencies
npm install

# 3. Set up .env.local
cp .env.example .env.local
# Add your Supabase project URL and anon/public keys

# 4. Run the app
npm run dev

🧪 Database Schema Summary
skills
List of skills (id, title, description, category)

modules
Each skill contains multiple ordered modules with resource links

profiles
Extended user profile with XP

user_badges
Tracks badge type (Novice → Expert), linked to profiles

🔁 Automated XP → Badge Flow
award_badges() PostgreSQL function checks XP on every profile update

Triggers award new badges only if not already earned

Badge data is securely stored and queryable per user

✨ Future Ideas (Not Yet Implemented)
✅ Peer discussion under each module

✅ Social leaderboard (XP based)

✅ Admin panel to add/edit skills and modules

