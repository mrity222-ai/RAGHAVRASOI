# 🍕 Ranel — Restaurant & Fast Food Web Application

एक आधुनिक, 100% हूबहू (Pixel-Perfect) **React & Next.js Full-Stack Web Application** जो आपके द्वारा दिए गए सभी 8 स्क्रीनशॉट्स (Shopify Ranel Theme) के आधार पर तैयार की गई है।

---

## ✨ विशेषताएँ (Key Features)

1. **Top Header & Navigation Bar (Screenshot 1):**
   - बाएं: `HOME`, `SHOPS`, `PRODUCTS`, `BLOG`, `PAGES`
   - मध्य: बोल्ड `RANEL` लोगो
   - दाएं: Language selector (`English ⌵`), Currency selector (`USD ⌵`), Search Bar, User Profile, Wishlist, और रियल-टाइम कार्ट काउंटर बैज।

2. **Hero Section (Screenshot 1):**
   - वॉर्म क्रीम बैकग्राउंड (`#FAF3E8`), फ्लेम और तुलसी की पत्तियों के साथ फ्रेश सीफूड पिज्जा।
   - बोल्ड टाइपोग्राफी: `FRESH SEAFOOD PIZZA` + सबटेक्स्ट + `SHOP NOW` बटन और स्लाइडर इंडिकेटर।

3. **6-Category Showcase Cards (Screenshot 2):**
   - क्लीन बॉर्डर्ड कार्ड्स: `FAST FOOD`, `COMBO`, `SANDWICH`, `BURRITO`, `SNACKS`, `CHICKEN`।

4. **Split Promo Story + Live Toast (Screenshot 3):**
   - डार्क चॉकलेट बर्गर कार्ड विथ 50% OFF गोल्डन बैज।
   - `WE MAKE THE BEST BURGER IN YOUR TOWN` + `EXPLORE ALL`।
   - बॉटम-लेफ्ट सोशल प्रूफ पॉपअप: *"Someone in Kyoto, Japan just bought Quick Wrap"*।
   - बॉटम-राइट फ्लोटिंग स्क्रॉल-टू-टॉप बटन (`⌃`)।

5. **3-Column Promo Banner Trio (Screenshot 4):**
   - 3 डाइनैमिक कार्ड्स: `FAST FOOD MEALS` (ऑरेंज), `CHEESE PIZZA` (ब्लैक चीज़ पुल), `FRIED CHICKEN` (डीप रेड)।

6. **"BEST SELLER" Product Grid (Screenshot 5):**
   - कोरल एक्सेंट लाइन, 4 प्रोडक्ट्स: `Flame Box`, `Urban Bite` (कलर स्वॉचेस और क्विक एक्शन पिल्स सहित), `Spice Zone` (बर्गर), `Spice Zone` (हॉट डॉग)।
   - रेड "Sale" कॉर्नर रिबन और डिस्काउंट प्राइसिंग।

7. **Special Deal / Countdown Banner (Screenshot 6):**
   - स्प्लिट बर्गर बॉर्डर्स, `QUESADILLA WITH TOMATOES`।
   - 4 रेड सर्कल्स में लाइव टिकिंग काउंटडाउन टाइमर: `DAYS`, `HOURS`, `MINS`, `SECS`।

8. **Tri-Grid Featured Banners (Screenshot 8):**
   - 3-टाइल असिमेट्रिक ग्रिड: `SUPER DELICIOUS`, `DELICIOUS CHEESE PIZZA`, और `TODAY'S SPECIAL DISH`।

9. **Complete 5-Column Footer (Screenshot 7):**
   - ब्रांड इंफॉर्मेशन, About Us, Categories, Information, Newsletter सब्सक्रिप्शन + सोशल आइकन्स और ओरिजिनल पेमेंट बैज (MasterCard, Amex, Visa, PayPal)।

10. **इंटरएक्टिव फुल-स्टैक फीचर्स:**
    - Slide-out Cart Drawer (क्वांटिटी इनक्रीज/डिक्रीज, रिमूव, सबटोटल और चेकआउट)।
    - Quick View Modal (जूम, इंग्रीडिएंट्स, स्वॉच सेलेक्शन)।
    - SQL डेटाबेस (Prisma ORM के साथ PostgreSQL / MySQL / SQLite सपोर्ट)।

---

## 🚀 कैसे चलाएं (How to Run)

### 1. डेवलपमेंट सर्वर शुरू करें:
```bash
npm run dev
```
ब्राउज़र में खोलें: [http://localhost:3000](http://localhost:3000)

### 2. प्रोडक्शन बिल्ड:
```bash
npm run build
npm run start
```

---

## 🗄️ SQL डेटाबेस कन्फिगरेशन (PostgreSQL / MySQL)

डिफ़ॉल्ट रूप से यह बिना किसी बाहरी सर्वर के तुरंत चलने के लिए SQLite (`dev.db`) पर सेट है।
यदि आप **PostgreSQL** या **MySQL** पर स्विच करना चाहते हैं:

1. `prisma/schema.prisma` खोलें और `provider` बदलें:
   - PostgreSQL के लिए: `provider = "postgresql"`
   - MySQL के लिए: `provider = "mysql"`

2. `.env` फ़ाइल में अपनी कनेक्शन स्ट्रिंग दर्ज करें:
   ```env
   # PostgreSQL:
   DATABASE_URL="postgresql://postgres:password@localhost:5432/ranel_restaurant?schema=public"

   # MySQL:
   # DATABASE_URL="mysql://root:password@localhost:3306/ranel_restaurant"
   ```

3. स्कीमा और डेटा को सिंक करें:
   ```bash
   npx prisma db push
   node prisma/seed.js
   ```
# Raghav-Rasoi
