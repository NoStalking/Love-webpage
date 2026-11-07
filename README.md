# ❤️ Romantic Anniversary Website for Girlfriend (6 Months of Talking) — A + D

This website was crafted specially to celebrate your **6-month anniversary (May 17 — November 17)**.  
It is interactive, filled with smooth animations, romantic kalimba/music box melody (via Web Audio API, zero external files required), falling rose petals, a dropping 3D gift box, a live relationship timer, a secret code padlock, a scattered polaroid memory gallery, an interactive distance map with your exact coordinates, an ultra-realistic notebook love letter, and a grand finale with a giant falling heart.

---

## 📱 How to view the website:
1. Double-click on **`index.html`** — it opens in any browser (Chrome, Safari, Edge, etc.).
2. **To view on a smartphone:**
   - You can host it for free in 1 minute:
     - **[Netlify Drop](https://app.netlify.com/drop)**: Drag and drop the `Love page` folder into your browser and get an instant link to send to her!
     - **GitHub Pages** or **Vercel**
     - Or send the files through Telegram / WhatsApp to your phone and open them.

---

## 🎁 Journey & Interactive Scenes:

1. **The Falling Gift Box («A + D»)**:
   - When the website loads, a festive gift box with a golden silk bow and glowing **A ❤️ D** medallion drops from the sky with bouncy physics.
   - Rose petals and twinkling stars drift softly in the background.
   - Page scrolling is locked until the gift is opened.
   - Tapping the gift box: the lid pops off, confetti and hearts burst out, romantic music starts playing, and a celebration card appears with heartfelt words for your 6 months together.
   - **Live Relationship Counter**: Inside the opened card, a live digital counter tracks your time together since **May 17** (Days, Hours, Minutes, and live-ticking Seconds) with the message: *«Every single second with you is precious ❤️»*.
   - Unlocks smooth scrolling downwards with an animated arrow.

2. **The Lock of Memories (Secret Passcode)**:
   - Scrolling down reveals a realistic golden padlock with **A & D** engraving and an on-screen touch keypad (`1 2 3 4 5 6 7 8 9 0`, delete `⌫`, and hint `💡`).
   - Glowing heart indicator slots light up as numbers are entered.
   - **Default passcode:** `1711` (November 17 — your anniversary date).
   - Tapping `💡` displays the clue: *"💡 Hint: Day and month of our anniversary (November 17 -> 1711) 💖"*.
   - When entered correctly, the padlock clicks open, sparks fly, and the gallery is smoothly unlocked!

3. **Scattered Polaroid Gallery (Divided into 2 Sections)**:
   - **Section 1: «Наша первая переписка 😭»**:
     - Includes real chat screenshots from `photos/1.jpg` through `photos/6.jpg`.
     - Taller frames tailored for phone chat screenshots.
   - **Section 2: «Наши рисунки и прочее 👽»**:
     - Includes photos, drawings, and art memories (`a.jpg`, `b.jpg`, `c.jpg`, `d.jpg`, `e.jpg`, `g.jpg`, `h.jpg`, `i.png`, `j.jpg`).
   - **Full Image Display & Zoom (Tap to Enlarge)**:
     - All photos are displayed completely (`object-fit: contain`) without awkward cropping.
     - Tapping any photo opens an elegant full-screen Lightbox Modal displaying the high-resolution image with handwritten caption and close button.
   - Underneath the gallery is your exact emotional note:
     > **“It’s a pity we don’t have our photos together yet.<br>But I know for sure we soon will :)”**
   - Followed by: **«to be continued...»** with twinkling dots.

4. **Interactive Distance Map (Her & His Locations)**:
   - Positioned right before the letter button:
     - **Her Location (D):** `40°13'54.6"N, 69°16'13.5"E`
     - **His Location (A):** `41°20'22.9"N, 69°13'54.0"E`
     - **Distance:** `~123 km` direct path.
   - Features CartoDB Dark Matter night map styling, custom glowing markers for **D** and **A**, a neon dashed flight path, and a heart traveling between the two cities!
   - Badges: *«~123 km between our cities • 0 km between our hearts ❤️»*.
   - And the action button: **«I have something to tell you 💌»**.

5. **Realistic Notebook Love Letter**:
   - Tapping the button unfolds a realistic ruled notebook paper with top spiral binding holes, a red vertical margin line, and handwritten ink typography.
   - The letter reflects on your 6 months of talking, late-night conversations, and future moments together.
   - At the bottom of the letter:
     > *“If you also want to say that you love me, just press this button — I’ll understand everything...”*
   - Followed by the pulsing button: **`💖 I love you 💖`**.

6. **The Grand Finale**:
   - When she presses `I love you`:
     - An enormous glowing heart drops from above: **«I LOVE YOU! More than anything in this world ❤️ A + D»**.
     - A shower of dozens of floating hearts fills the screen.
     - A 5-second countdown begins: *“Closing in: 5... 4... 3... 2... 1...”*.
     - The site attempts `window.close()` and transitions into a dreamy, starry screen:
       *“Our story continues... I have saved your ‘I love you’ inside my heart forever ❤️”*.

---

## ✍️ How to customize the letter or passcode:

### 1. Change the secret passcode:
Open **`script.js`** and look at line 12:
```javascript
const CONFIG = {
  PASSCODE: '1711', // Change to any 4-digit code you want
```

### 2. Customize the letter text:
Open **`index.html`** and locate the `<div class="letter-body-text">` block (around line 430). You can change or add any personal words you want to share with her!

### 3. Replace illustrations with real photos:
In **`index.html`**, inside any `<div class="polaroid-image-box">`, replace the `<svg>...</svg>` with:
```html
<img src="my-photo.jpg" alt="Our moment" style="width:100%; height:100%; object-fit:cover;">
```
