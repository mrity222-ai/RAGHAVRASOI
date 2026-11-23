# RAGHAVRASOI

# 🍲 राघव रसोई (Raghav Rasoi) — Taste of Tradition
### Modern Restaurant Digital Menu, Dine-In QR Ordering & Kitchen Management System

> **Official Domain**: [https://raghavrasoi.com](https://raghavrasoi.com)  
> **Official Address**: Gunderdehi Town Rd, Gundardehi, Chainganj, Chhattisgarh 491223  
> **Helpline / Phone**: +91 88396-75538  
> **Official Email**: info@raghavrasoi.com • catering@raghavrasoi.com  

---

## ✨ मुख्य विशेषताएँ (Key Features)

### 1. 🍽️ टेबल क्यूआर कोड व डिजिटल मेनू (Table QR Dine-In Ordering)
- रेस्टोरेंट की प्रत्येक टेबल के लिए डायनामिक QR कोड और 1-क्लिक प्रिंटेबल स्टैंडी कार्ड।
- टेबल अवेलेबिलिटी स्टेटस (🟢 **Available** / 🟡 **Occupied**)।
- ग्राहक द्वारा QR स्कैन करते ही उसी टेबल के लिए लाइव डिजिटल मेनू खुलता है।
- डाइन-इन ऑर्डर होते ही टेबल स्वतः **Occupied** हो जाती है और ऑर्डर पूरा होते ही तुरंत **Available** (फ्री) हो जाती है।

### 2. 📱 आधुनिक स्टोरफ्रंट मेनू (Storefront Digital Menu)
- **12 श्रेणियां (Categories)** और **80 प्रामाणिक व्यंजन (Products)**।
- विज़ुअल कैटेगरी कैरोसेल (Category Carousel) और त्वरित खोज (Live Dish Search)।
- शुद्ध शाकाहारी / जैन / वेज फ़िल्टर्स और प्राइस सॉर्टिंग।
- कस्टमाइज़र मोडल (हाफ/फुल पोर्शन, एक्स्ट्रा मक्खन, चटनी आदि)।
- स्लाइड-आउट कार्ट ड्रॉवर (Slide-out Cart Drawer) और कूपन डिस्काउंट सपोर्ट।

### 3. 👨‍🍳 एडमिन व लाइव किचन कानबन कंसोल (Kitchen Kanban & KOT)
- रियल-टाइम 3-कॉलम कानबन बोर्ड (**Pending** ➔ **Preparing** ➔ **Ready** ➔ **Completed**)।
- नए ऑर्डर पर ऑटोमैटिक साउंड अलर्ट (Audio Alert Chime)।
- 1-क्लिक किचन ऑर्डर टिकट (**KOT**) और ग्राहक बिल थर्मल रिसिप्ट प्रिंटिंग।
- लाइव टेबल मैनेजर: टेबल जोड़ना/हटाना, खाली करना, और स्टैंडी कार्ड प्रिंटिंग।
- सेल्स व रेवेन्यू डैशबोर्ड (Gross Sales, Daily Orders, Top Dishes CSV Export)।

### 4. 🔐 बहुस्तरीय लॉगिन व परमिशन्स (Staff & Customer Auth)
- **स्टाफ व एडमिन पोर्टल** (`/admin/login`):
  - **Super Admin (Owner)**: `admin@raghavrasoi.com` (फुल कंट्रोल)।
  - **Staff RBAC**: मैनेजर, शेफ, कैशियर को उनकी निर्धारित परमिशन (केवल KOT, केवल मेनू या सेटिंग्स)।
- **ग्राहक पोर्टल** (`/login` व `/register`):
  - ईमेल/मोबाइल + पासवर्ड लॉगिन।
  - 1-क्लिक मोबाइल OTP लॉगिन।
  - गेस्ट ऑर्डरिंग (बिना लॉगिन के केवल नाम व मोबाइल से तुरंत ऑर्डर)।

### 5. 📍 गूगल मैप्स व लोकेशन इंटीग्रेशन (Live Google Maps)
- कॉन्टैक्ट पेज (`/contact`) पर गुंडरदेही (छत्तीसगढ़) का आधिकारिक लाइव Google Maps Iframe Embed।
- 1-क्लिक "Directions" बटन जो सीधे मोबाइल पर गूगल मैप्स नेविगेशन शुरू करता है।

---

## 🛠️ तकनीकी स्टैक (Tech Stack)

- **Frontend & Fullstack**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS, Lucide React Icons
- **Database & ORM**: Prisma ORM with SQLite (`dev.db`), PostgreSQL/MySQL Ready
- **QR Engine**: node-qrcode with High-Res Printable Standee Framing
- **SEO & Search**: Dynamic Sitemap (`/sitemap.xml`) & Robots (`/robots.txt`) for `raghavrasoi.com`

---

## 🚀 लोकल डेवलपमेंट सेटअप (Getting Started)

```bash
# 1. रिपॉजिटरी क्लोन करें
git clone https://github.com/mrity222-ai/RAGHAVRASOI.git
cd RAGHAVRASOI

# 2. डिपेंडेंसीज इंस्टॉल करें
npm install

# 3. डेटाबेस सिंक करें
npx prisma db push
npx prisma generate

# 4. डेवलपमेंट सर्वर शुरू करें
npm run dev
```

ब्राउज़र में खोलें:
- **होमपेज**: `http://localhost:3000/`
- **डिजिटल मेनू**: `http://localhost:3000/menu`
- **टेबल 1 डिजिटल मेनू**: `http://localhost:3000/table/Table-1`
- **एडमिन कंसोल**: `http://localhost:3000/admin`
- **एडमिन लॉगिन**: `http://localhost:3000/admin/login`

---

## 📄 लाइसेंस (License)

© 2026 राघव रसोई (Raghav Rasoi). All rights reserved.
