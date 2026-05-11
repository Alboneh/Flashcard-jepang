// Database untuk halaman Fasih Kanji.
// Struktur entry:
// {
//   kanji: "日",
//   meaning: "Matahari, hari",
//   kunyomi: ["ひ", "-び", "-か"],            // cara baca Jepang
//   onyomi: ["ニチ", "ニ", "(-ジツ)"],        // cara baca Mandarin (on'yomi)
//   examples: [                              // じゅくご
//     "日本 (に・ほん) — Jepang",
//     "日曜日 (にち・よう・び) — Hari Minggu"
//   ],
//   bab: "Bab 1"
// }

const fasihKanjiDatabase = [
  {
    kanji: "日",
    meaning: "Matahari, hari",
    kunyomi: ["ひ", "-び", "-か"],
    onyomi: ["ニチ", "ニ", "(-ジツ)"],
    examples: [
      "日本 (に・ほん) — Jepang",
      "日曜日 (にち・よう・び) — Hari Minggu",
      "三日 (みっ・か) — Tanggal 3"
    ],
    bab: "Bab 1"
  },
  {
    kanji: "月",
    meaning: "Bulan, bulan (dalam kalender)",
    kunyomi: ["つき"],
    onyomi: ["ゲツ", "ガツ"],
    examples: [
      "1月 (いち・がつ) — Januari",
      "月曜日 (げつ・よう・び) — Hari Senin",
      "1か月 (いっ・か・げつ) — Sebulan"
    ],
    bab: "Bab 1"
  },
  {
    kanji: "木",
    meaning: "Pohon",
    kunyomi: ["き"],
    onyomi: ["モク", "ボク"],
    examples: [
      "木村 (き・むら) — Nama marga orang Jepang",
      "木曜日 (もく・よう・び) — Hari Kamis"
    ],
    bab: "Bab 1"
  },
  {
    kanji: "山",
    meaning: "Gunung",
    kunyomi: ["やま"],
    onyomi: ["サン"],
    examples: [
      "富士山 (ふ・じ・さん) — Gunung Fuji",
      "火山 (か・ざん) — Gunung berapi"
    ],
    bab: "Bab 1"
  },
  {
    kanji: "川",
    meaning: "Sungai",
    kunyomi: ["かわ", "-がわ"],
    onyomi: ["(セン)"],
    examples: [
      "ナイル川 (ないる・がわ) — Sungai Nil",
      "川村 (かわ・むら) — Nama marga orang Jepang"
    ],
    bab: "Bab 1"
  },
  {
    kanji: "田",
    meaning: "Sawah",
    kunyomi: ["た", "-だ"],
    onyomi: ["デン"],
    examples: [
      "田んぼ (た・ん・ぼ) — Sawah",
      "山田 (やま・だ) — Nama marga orang Jepang"
    ],
    bab: "Bab 1"
  },
  {
    kanji: "人",
    meaning: "Orang",
    kunyomi: ["ひと"],
    onyomi: ["ジン", "ニン"],
    examples: [
      "3人 (さん・にん) — 3 orang",
      "日本人 (に・ほん・じん) — Orang Jepang"
    ],
    bab: "Bab 1"
  },
  {
    kanji: "口",
    meaning: "Mulut",
    kunyomi: ["くち", "-ぐち"],
    onyomi: ["コウ"],
    examples: [
      "入口 (いり・ぐち) — Pintu masuk",
      "出口 (で・ぐち) — Pintu keluar",
      "人口 (じん・こう) — Populasi"
    ],
    bab: "Bab 1"
  },
  {
    kanji: "車",
    meaning: "Mobil",
    kunyomi: ["くるま"],
    onyomi: ["シャ"],
    examples: [
      "自動車 (じ・どう・しゃ) — Mobil",
      "電車 (でん・しゃ) — Kereta listrik"
    ],
    bab: "Bab 1"
  },
  {
    kanji: "門",
    meaning: "Gerbang",
    kunyomi: ["(かど)"],
    onyomi: ["モン"],
    examples: [
      "門 (もん) — Gerbang",
      "専門 (せん・もん) — Keahlian, jurusan"
    ],
    bab: "Bab 1"
  }
];
