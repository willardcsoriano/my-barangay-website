# Barangay Marikina Heights Information System  
**Modern, mobile-responsive community portal built with Next.js 16 and Supabase**

**Live Site:** https://wcsoriano-barangay-website.vercel.app/  

This project serves as the official digital portal for **Barangay Marikina Heights**, providing residents with easy access to announcements, services, and barangay directory information. The system also includes an **admin dashboard** for barangay staff to manage announcements, officials, and resident service requests.

---

## 📌 Features

### 👥 **Resident Features**
- Browse latest barangay announcements  
- View full announcement details  
- Check barangay officials directory  
- Request barangay services (clearance, permits, etc.)  
- Track status of submitted requests  
- Secure resident login & account creation  

### 🛠️ **Admin Features**
- Admin login with role-based access control  
- Manage announcements (create, update, delete, publish/unpublish)  
- Manage barangay officials (CRUD + ordering + committees)  
- Manage resident service requests (approve, deny, update status)  
- Centralized dashboard for quick access to modules  

---

## 🧰 Tech Stack

| Category | Technology Used |
|---------|-----------------|
| Framework | **Next.js 16 (App Router, Server Actions, Turbopack)** |
| Backend | **Supabase** (PostgreSQL + RLS + Auth) |
| Authentication | Supabase Auth |
| UI Components | Tailwind CSS + shadcn/ui |
| Rich Text Editor | Tiptap |
| Deployment | Vercel |
| Programming Language | TypeScript |

---

## 🏗️ System Architecture Overview

The system uses:

- **Next.js Server Components** for data-fetching pages  
- **Next.js Client Components** for interactive admin tools  
- **Supabase** as the backend for:
  - Database (PostgreSQL)
  - Storage
  - Authentication
  - Row-Level Security (RLS)

The architecture ensures a clean separation between **public pages**, **resident-only pages**, and **admin-authenticated workflows**.

---

## 🗃️ Database ERD Summary

The system uses Supabase PostgreSQL.  
Main tables include:

### **announcements**
Stores announcement content published by barangay officials.

### **users**
Supabase-managed authentication table.

### **officials**
Stores barangay officials, SK officers, and public safety personnel.

### **requests**
Stores resident service requests (clearance, permit, etc.)

### **audit_logs**
Tracks admin actions for security & transparency.

**Relations:**  
- Each announcement references an admin `author_id`.  
- Each service request references a resident `user_id`.  
- Officials have an `ordering` field for sorting.

---

## 🗺️ Resident Sitemap (User Perspective)

```

Home
├── Announcements
│     └── Announcement Details
├── Officials Directory
├── Login
│     └── Sign Up
└── (After Login)
├── Services
│     ├── Request Clearance/Permit
│     └── My Request Status
└── Logout → Returns to Home

```

---

## 📂 Project Structure

```

my-barangay-website/
│   app/
│   components/
│   lib/
│   init-officials.js
│   create_test_users.js
│   package.json
│   tailwind.config.ts
│   tsconfig.json
│   .env.local
│   README.md

````

---

## 🚀 Installation

1. Clone the repository:
```sh
git clone https://github.com/<your-username>/my-barangay-website.git
cd my-barangay-website
````

2. Install dependencies:

```sh
npm install
```

3. Create your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_URL=your-url
```

4. Run the development server:

```sh
npm run dev
```

5. Visit:
   [http://localhost:3000](http://localhost:3000)

---

## 🗄️ Database Initialization Scripts

### **Insert Dummy Officials**

```
node init-officials.js
```

### **Generate Test Users**

```
node create_test_users.js
```

---

## 🌐 Deployment (Vercel)

This project is fully optimized for deployment on **Vercel**:

* Automatic builds
* Server components optimized by Turbopack
* Environment variables configured under Vercel dashboard
* API routes handled by Server Actions (no backend server needed)

---

## 🔮 Future Enhancements

* Barangay map with geolocation
* Notification system (email/SMS)
* Resident profile pages
* Multi-language support
* Admin analytics dashboard

---

## 📜 License

This project is licensed for **Barangay Marikina Heights use only**.
Not intended for commercial redistribution.

---

## 👨‍💻 Author

**Willard Soriano**
GitHub: [https://github.com/willardcsoriano](https://github.com/willardcsoriano)
Live Deployment: [https://wcsoriano-barangay-website.vercel.app/](https://wcsoriano-barangay-website.vercel.app/)
