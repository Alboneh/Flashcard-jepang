const KANJI_N5_EXTRA = [
  {
    bab: "Bab 1",
    char: "入",
    mean: "Masuk",
    desc: "Arah masuk ke dalam",
    vocab: [
      { w: "入る", f: "はいる (hairu)", r: "hairu", m: "Masuk" },
      { w: "入口", f: "いりぐち (iriguchi)", r: "iriguchi", m: "Pintu masuk" },
      { w: "入学", f: "にゅうがく (nyugaku)", r: "nyugaku", m: "Masuk sekolah" },
      { w: "入国", f: "にゅうこく (nyukoku)", r: "nyukoku", m: "Masuk negara" },
      { w: "入院", f: "にゅういん (nyuin)", r: "nyuin", m: "Masuk rumah sakit" }
    ]
  },
  {
    bab: "Bab 1",
    char: "田",
    mean: "Sawah",
    desc: "Petak sawah dilihat dari atas",
    vocab: [
      { w: "田", f: "た (ta)", r: "ta", m: "Sawah" },
      { w: "田んぼ", f: "たんぼ (tanbo)", r: "tanbo", m: "Sawah" },
      { w: "山田", f: "やまだ (yamada)", r: "yamada", m: "Nama keluarga Yamada" },
      { w: "田中", f: "たなか (tanaka)", r: "tanaka", m: "Nama keluarga Tanaka" },
      { w: "水田", f: "すいでん (suiden)", r: "suiden", m: "Sawah berair" }
    ]
  },
  {
    bab: "Bab 1",
    char: "門",
    mean: "Gerbang",
    desc: "Pintu gerbang besar",
    vocab: [
      { w: "門", f: "もん (mon)", r: "mon", m: "Gerbang" },
      { w: "正門", f: "せいもん (seimon)", r: "seimon", m: "Gerbang utama" },
      { w: "専門", f: "せんもん (senmon)", r: "senmon", m: "Spesialis / bidang" },
      { w: "門前", f: "もんぜん (monzen)", r: "monzen", m: "Depan gerbang" },
      { w: "門出", f: "かどで (kadode)", r: "kadode", m: "Awal perjalanan" }
    ]
  },
  {
    bab: "Bab 2",
    char: "私",
    mean: "Saya",
    desc: "Diri sendiri / pribadi",
    vocab: [
      { w: "私", f: "わたし (watashi)", r: "watashi", m: "Saya" },
      { w: "私達", f: "わたしたち (watashitachi)", r: "watashitachi", m: "Kami" },
      { w: "私立", f: "しりつ (shiritsu)", r: "shiritsu", m: "Swasta" },
      { w: "私語", f: "しご (shigo)", r: "shigo", m: "Mengobrol saat kelas" },
      { w: "私見", f: "しけん (shiken)", r: "shiken", m: "Pendapat pribadi" }
    ]
  },
  {
    bab: "Bab 4",
    char: "何",
    mean: "Apa",
    desc: "Kata tanya untuk benda/hal",
    vocab: [
      { w: "何", f: "なに / なん (nani/nan)", r: "nani/nan", m: "Apa" },
      { w: "何ですか", f: "なんですか (nan desu ka)", r: "nan desu ka", m: "Apa ini?" },
      { w: "何時", f: "なんじ (nanji)", r: "nanji", m: "Jam berapa" },
      { w: "何人", f: "なんにん (nannin)", r: "nannin", m: "Berapa orang" },
      { w: "何日", f: "なんにち (nannichi)", r: "nannichi", m: "Tanggal berapa" }
    ]
  },
  {
    bab: "Bab 5",
    char: "休",
    mean: "Istirahat",
    desc: "Orang bersandar pada pohon",
    vocab: [
      { w: "休む", f: "やすむ (yasumu)", r: "yasumu", m: "Beristirahat" },
      { w: "休み", f: "やすみ (yasumi)", r: "yasumi", m: "Libur" },
      { w: "休日", f: "きゅうじつ (kyujitsu)", r: "kyujitsu", m: "Hari libur" },
      { w: "休校", f: "きゅうこう (kyuko)", r: "kyuko", m: "Sekolah libur" },
      { w: "昼休み", f: "ひるやすみ (hiruyasumi)", r: "hiruyasumi", m: "Istirahat siang" }
    ]
  },
  {
    bab: "Bab 5",
    char: "好",
    mean: "Suka",
    desc: "Rasa suka / favorit",
    vocab: [
      { w: "好き", f: "すき (suki)", r: "suki", m: "Suka" },
      { w: "大好き", f: "だいすき (daisuki)", r: "daisuki", m: "Sangat suka" },
      { w: "好み", f: "このみ (konomi)", r: "konomi", m: "Selera" },
      { w: "好物", f: "こうぶつ (kobutsu)", r: "kobutsu", m: "Makanan favorit" },
      { w: "好意", f: "こうい (koi)", r: "koi", m: "Niat baik" }
    ]
  },
  {
    bab: "Bab 5",
    char: "岩",
    mean: "Batu besar",
    desc: "Batu di gunung",
    vocab: [
      { w: "岩", f: "いわ (iwa)", r: "iwa", m: "Batu besar" },
      { w: "岩山", f: "いわやま (iwayama)", r: "iwayama", m: "Gunung berbatu" },
      { w: "岩石", f: "がんせき (ganseki)", r: "ganseki", m: "Batuan" },
      { w: "岩場", f: "いわば (iwaba)", r: "iwaba", m: "Area berbatu" },
      { w: "溶岩", f: "ようがん (yogan)", r: "yogan", m: "Lava" }
    ]
  },
  {
    bab: "Bab 5",
    char: "明",
    mean: "Terang",
    desc: "Matahari dan bulan memberi cahaya",
    vocab: [
      { w: "明るい", f: "あかるい (akarui)", r: "akarui", m: "Terang" },
      { w: "説明", f: "せつめい (setsumei)", r: "setsumei", m: "Penjelasan" },
      { w: "明日", f: "あした (ashita)", r: "ashita", m: "Besok" },
      { w: "発明", f: "はつめい (hatsumei)", r: "hatsumei", m: "Penemuan" },
      { w: "明白", f: "めいはく (meihaku)", r: "meihaku", m: "Jelas" }
    ]
  },
  {
    bab: "Bab 5",
    char: "林",
    mean: "Hutan kecil",
    desc: "Dua pohon berdampingan",
    vocab: [
      { w: "林", f: "はやし (hayashi)", r: "hayashi", m: "Hutan kecil" },
      { w: "森林", f: "しんりん (shinrin)", r: "shinrin", m: "Hutan" },
      { w: "林業", f: "りんぎょう (ringyo)", r: "ringyo", m: "Kehutanan" },
      { w: "竹林", f: "ちくりん (chikurin)", r: "chikurin", m: "Hutan bambu" },
      { w: "山林", f: "さんりん (sanrin)", r: "sanrin", m: "Hutan pegunungan" }
    ]
  },
  {
    bab: "Bab 5",
    char: "畑",
    mean: "Ladang",
    desc: "Ladang kering",
    vocab: [
      { w: "畑", f: "はたけ (hatake)", r: "hatake", m: "Ladang" },
      { w: "畑仕事", f: "はたけしごと (hatakeshigoto)", r: "hatakeshigoto", m: "Pekerjaan ladang" },
      { w: "野菜畑", f: "やさいばたけ (yasaibatake)", r: "yasaibatake", m: "Ladang sayur" },
      { w: "花畑", f: "はなばたけ (hanabatake)", r: "hanabatake", m: "Kebun bunga" },
      { w: "田畑", f: "たはた (tahata)", r: "tahata", m: "Sawah dan ladang" }
    ]
  },
  {
    bab: "Bab 5",
    char: "間",
    mean: "Antara",
    desc: "Jarak/celah di antara",
    vocab: [
      { w: "間", f: "あいだ (aida)", r: "aida", m: "Antara" },
      { w: "時間", f: "じかん (jikan)", r: "jikan", m: "Waktu" },
      { w: "人間", f: "にんげん (ningen)", r: "ningen", m: "Manusia" },
      { w: "仲間", f: "なかま (nakama)", r: "nakama", m: "Teman satu kelompok" },
      { w: "間違い", f: "まちがい (machigai)", r: "machigai", m: "Kesalahan" }
    ]
  },
  {
    bab: "Bab 6",
    char: "石",
    mean: "Batu",
    desc: "Batu keras",
    vocab: [
      { w: "石", f: "いし (ishi)", r: "ishi", m: "Batu" },
      { w: "石油", f: "せきゆ (sekiyu)", r: "sekiyu", m: "Minyak bumi" },
      { w: "宝石", f: "ほうせき (hoseki)", r: "hoseki", m: "Permata" },
      { w: "石炭", f: "せきたん (sekitan)", r: "sekitan", m: "Batu bara" },
      { w: "岩石", f: "がんせき (ganseki)", r: "ganseki", m: "Batuan" }
    ]
  },
  {
    bab: "Bab 6",
    char: "竹",
    mean: "Bambu",
    desc: "Dua batang bambu",
    vocab: [
      { w: "竹", f: "たけ (take)", r: "take", m: "Bambu" },
      { w: "竹林", f: "ちくりん (chikurin)", r: "chikurin", m: "Hutan bambu" },
      { w: "竹刀", f: "しない (shinai)", r: "shinai", m: "Pedang bambu" },
      { w: "竹馬", f: "たけうま (takeuma)", r: "takeuma", m: "Egrang" },
      { w: "竹やぶ", f: "たけやぶ (takeyabu)", r: "takeyabu", m: "Rumpun bambu" }
    ]
  },
  {
    bab: "Bab 6",
    char: "糸",
    mean: "Benang",
    desc: "Serat benang",
    vocab: [
      { w: "糸", f: "いと (ito)", r: "ito", m: "Benang" },
      { w: "毛糸", f: "けいと (keito)", r: "keito", m: "Benang wol" },
      { w: "赤糸", f: "あかいと (akaito)", r: "akaito", m: "Benang merah" },
      { w: "糸口", f: "いとぐち (itoguchi)", r: "itoguchi", m: "Petunjuk awal" },
      { w: "製糸", f: "せいし (seishi)", r: "seishi", m: "Pemintalan benang" }
    ]
  },
  {
    bab: "Bab 6",
    char: "貝",
    mean: "Kerang",
    desc: "Kerang/cangkang",
    vocab: [
      { w: "貝", f: "かい (kai)", r: "kai", m: "Kerang" },
      { w: "貝殻", f: "かいがら (kaigara)", r: "kaigara", m: "Cangkang kerang" },
      { w: "貝類", f: "かいるい (kairui)", r: "kairui", m: "Jenis kerang" },
      { w: "赤貝", f: "あかがい (akagai)", r: "akagai", m: "Kerang merah" },
      { w: "貝柱", f: "かいばしら (kaibashira)", r: "kaibashira", m: "Daging kerang" }
    ]
  },
  {
    bab: "Bab 7",
    char: "文",
    mean: "Tulisan",
    desc: "Huruf dan kalimat",
    vocab: [
      { w: "文", f: "ぶん (bun)", r: "bun", m: "Kalimat" },
      { w: "作文", f: "さくぶん (sakubun)", r: "sakubun", m: "Mengarang" },
      { w: "文化", f: "ぶんか (bunka)", r: "bunka", m: "Budaya" },
      { w: "文学", f: "ぶんがく (bungaku)", r: "bungaku", m: "Sastra" },
      { w: "文法", f: "ぶんぽう (bunpo)", r: "bunpo", m: "Tata bahasa" }
    ]
  },
  {
    bab: "Bab 7",
    char: "牛",
    mean: "Sapi",
    desc: "Hewan sapi",
    vocab: [
      { w: "牛", f: "うし (ushi)", r: "ushi", m: "Sapi" },
      { w: "牛肉", f: "ぎゅうにく (gyuniku)", r: "gyuniku", m: "Daging sapi" },
      { w: "牛乳", f: "ぎゅうにゅう (gyunyu)", r: "gyunyu", m: "Susu sapi" },
      { w: "子牛", f: "こうし (koshi)", r: "koshi", m: "Anak sapi" },
      { w: "水牛", f: "すいぎゅう (suigyu)", r: "suigyu", m: "Kerbau" }
    ]
  },
  {
    bab: "Bab 7",
    char: "物",
    mean: "Benda",
    desc: "Barang/objek",
    vocab: [
      { w: "物", f: "もの (mono)", r: "mono", m: "Benda" },
      { w: "食べ物", f: "たべもの (tabemono)", r: "tabemono", m: "Makanan" },
      { w: "買い物", f: "かいもの (kaimono)", r: "kaimono", m: "Belanja" },
      { w: "飲み物", f: "のみもの (nomimono)", r: "nomimono", m: "Minuman" },
      { w: "動物", f: "どうぶつ (dobutsu)", r: "dobutsu", m: "Hewan" }
    ]
  },
  {
    bab: "Bab 7",
    char: "馬",
    mean: "Kuda",
    desc: "Hewan kuda",
    vocab: [
      { w: "馬", f: "うま (uma)", r: "uma", m: "Kuda" },
      { w: "馬車", f: "ばしゃ (basha)", r: "basha", m: "Kereta kuda" },
      { w: "競馬", f: "けいば (keiba)", r: "keiba", m: "Balap kuda" },
      { w: "木馬", f: "もくば (mokuba)", r: "mokuba", m: "Kuda kayu" },
      { w: "乗馬", f: "じょうば (joba)", r: "joba", m: "Menunggang kuda" }
    ]
  },
  {
    bab: "Bab 8",
    char: "低",
    mean: "Rendah",
    desc: "Posisi lebih rendah",
    vocab: [
      { w: "低い", f: "ひくい (hikui)", r: "hikui", m: "Rendah" },
      { w: "最低", f: "さいてい (saitei)", r: "saitei", m: "Paling rendah" },
      { w: "低温", f: "ていおん (teion)", r: "teion", m: "Suhu rendah" },
      { w: "低学年", f: "ていがくねん (teigakunen)", r: "teigakunen", m: "Kelas rendah" },
      { w: "低気圧", f: "ていきあつ (teikiatsu)", r: "teikiatsu", m: "Tekanan rendah" }
    ]
  },
  {
    bab: "Bab 8",
    char: "多",
    mean: "Banyak",
    desc: "Jumlah banyak",
    vocab: [
      { w: "多い", f: "おおい (ooi)", r: "ooi", m: "Banyak" },
      { w: "多分", f: "たぶん (tabun)", r: "tabun", m: "Mungkin" },
      { w: "多数", f: "たすう (tasu)", r: "tasu", m: "Mayoritas" },
      { w: "多少", f: "たしょう (tasho)", r: "tasho", m: "Kurang lebih" },
      { w: "多国籍", f: "たこくせき (takokuseki)", r: "takokuseki", m: "Multinasional" }
    ]
  },
  {
    bab: "Bab 8",
    char: "安",
    mean: "Murah / Aman",
    desc: "Tenang dan aman",
    vocab: [
      { w: "安い", f: "やすい (yasui)", r: "yasui", m: "Murah" },
      { w: "安心", f: "あんしん (anshin)", r: "anshin", m: "Tenang" },
      { w: "安全", f: "あんぜん (anzen)", r: "anzen", m: "Aman" },
      { w: "安定", f: "あんてい (antei)", r: "antei", m: "Stabil" },
      { w: "円安", f: "えんやす (enyasu)", r: "enyasu", m: "Yen melemah" }
    ]
  },
  {
    bab: "Bab 8",
    char: "少",
    mean: "Sedikit",
    desc: "Jumlah kecil",
    vocab: [
      { w: "少ない", f: "すくない (sukunai)", r: "sukunai", m: "Sedikit" },
      { w: "少し", f: "すこし (sukoshi)", r: "sukoshi", m: "Sedikit" },
      { w: "少年", f: "しょうねん (shonen)", r: "shonen", m: "Anak laki-laki" },
      { w: "少女", f: "しょうじょ (shojo)", r: "shojo", m: "Anak perempuan" },
      { w: "減少", f: "げんしょう (gensho)", r: "gensho", m: "Penurunan" }
    ]
  },
  {
    bab: "Bab 8",
    char: "短",
    mean: "Pendek",
    desc: "Panjang yang singkat",
    vocab: [
      { w: "短い", f: "みじかい (mijikai)", r: "mijikai", m: "Pendek" },
      { w: "短文", f: "たんぶん (tanbun)", r: "tanbun", m: "Kalimat pendek" },
      { w: "短所", f: "たんしょ (tansho)", r: "tansho", m: "Kekurangan" },
      { w: "短期", f: "たんき (tanki)", r: "tanki", m: "Jangka pendek" },
      { w: "短時間", f: "たんじかん (tanjikan)", r: "tanjikan", m: "Waktu singkat" }
    ]
  },
  {
    bab: "Bab 8",
    char: "暗",
    mean: "Gelap",
    desc: "Kurang cahaya",
    vocab: [
      { w: "暗い", f: "くらい (kurai)", r: "kurai", m: "Gelap" },
      { w: "暗記", f: "あんき (anki)", r: "anki", m: "Menghafal" },
      { w: "暗号", f: "あんごう (ango)", r: "ango", m: "Kode rahasia" },
      { w: "真っ暗", f: "まっくら (makkura)", r: "makkura", m: "Gelap gulita" },
      { w: "暗室", f: "あんしつ (anshitsu)", r: "anshitsu", m: "Ruang gelap" }
    ]
  },
  {
    bab: "Bab 9",
    char: "買",
    mean: "Membeli",
    desc: "Kerang (uang) dan jaring: membeli dengan uang",
    vocab: [
      { w: "買う", f: "かう (kau)", r: "kau", m: "Membeli" },
      { w: "買い物", f: "かいもの (kaimono)", r: "kaimono", m: "Belanja" },
      { w: "購入", f: "こうにゅう (konyu)", r: "konyu", m: "Pembelian" },
      { w: "予約購入", f: "よやくこうにゅう (yoyakukonyu)", r: "yoyakukonyu", m: "Beli pre-order" },
      { w: "買主", f: "かいぬし (kainushi)", r: "kainushi", m: "Pembeli" }
    ]
  },
  {
    bab: "Bab 10",
    char: "朝",
    mean: "Pagi",
    desc: "Waktu pagi hari",
    vocab: [
      { w: "朝", f: "あさ (asa)", r: "asa", m: "Pagi" },
      { w: "朝ご飯", f: "あさごはん (asagohan)", r: "asagohan", m: "Sarapan" },
      { w: "今朝", f: "けさ (kesa)", r: "kesa", m: "Pagi ini" },
      { w: "朝日", f: "あさひ (asahi)", r: "asahi", m: "Matahari pagi" },
      { w: "毎朝", f: "まいあさ (maiasa)", r: "maiasa", m: "Setiap pagi" }
    ]
  },
  {
    bab: "Bab 10",
    char: "昼",
    mean: "Siang",
    desc: "Waktu siang hari",
    vocab: [
      { w: "昼", f: "ひる (hiru)", r: "hiru", m: "Siang" },
      { w: "昼ご飯", f: "ひるごはん (hirugohan)", r: "hirugohan", m: "Makan siang" },
      { w: "昼休み", f: "ひるやすみ (hiruyasumi)", r: "hiruyasumi", m: "Istirahat siang" },
      { w: "昼間", f: "ひるま (hiruma)", r: "hiruma", m: "Waktu siang" },
      { w: "真昼", f: "まひる (mahiru)", r: "mahiru", m: "Tengah hari" }
    ]
  },
  {
    bab: "Bab 10",
    char: "夜",
    mean: "Malam",
    desc: "Waktu malam hari",
    vocab: [
      { w: "夜", f: "よる (yoru)", r: "yoru", m: "Malam" },
      { w: "今夜", f: "こんや (konya)", r: "konya", m: "Malam ini" },
      { w: "夜中", f: "よなか (yonaka)", r: "yonaka", m: "Tengah malam" },
      { w: "夜空", f: "よぞら (yozora)", r: "yozora", m: "Langit malam" },
      { w: "毎夜", f: "まいよ (maiyo)", r: "maiyo", m: "Setiap malam" }
    ]
  },
  {
    bab: "Bab 10",
    char: "晩",
    mean: "Malam / Petang",
    desc: "Waktu malam, biasanya akhir hari",
    vocab: [
      { w: "晩", f: "ばん (ban)", r: "ban", m: "Malam" },
      { w: "今晩", f: "こんばん (konban)", r: "konban", m: "Malam ini" },
      { w: "晩ご飯", f: "ばんごはん (bangohan)", r: "bangohan", m: "Makan malam" },
      { w: "昨晩", f: "さくばん (sakuban)", r: "sakuban", m: "Tadi malam" },
      { w: "毎晩", f: "まいばん (maiban)", r: "maiban", m: "Setiap malam" }
    ]
  },
  {
    bab: "Bab 10",
    char: "夕",
    mean: "Petang",
    desc: "Sore menuju malam",
    vocab: [
      { w: "夕方", f: "ゆうがた (yugata)", r: "yugata", m: "Sore / petang" },
      { w: "夕日", f: "ゆうひ (yuhi)", r: "yuhi", m: "Matahari terbenam" },
      { w: "夕食", f: "ゆうしょく (yushoku)", r: "yushoku", m: "Makan malam" },
      { w: "夕立", f: "ゆうだち (yudachi)", r: "yudachi", m: "Hujan sore" },
      { w: "七夕", f: "たなばた (tanabata)", r: "tanabata", m: "Festival Tanabata" }
    ]
  },
  {
    bab: "Bab 10",
    char: "方",
    mean: "Arah",
    desc: "Menunjukkan arah/sisi",
    vocab: [
      { w: "方", f: "ほう (ho)", r: "ho", m: "Arah / cara" },
      { w: "方向", f: "ほうこう (hoko)", r: "hoko", m: "Arah" },
      { w: "夕方", f: "ゆうがた (yugata)", r: "yugata", m: "Petang" },
      { w: "北方", f: "ほっぽう (hoppo)", r: "hoppo", m: "Arah utara" },
      { w: "右方", f: "うほう (uho)", r: "uho", m: "Arah kanan" }
    ]
  },
  {
    bab: "Bab 10",
    char: "午",
    mean: "Tengah Hari",
    desc: "Penanda siang (noon)",
    vocab: [
      { w: "午前", f: "ごぜん (gozen)", r: "gozen", m: "Sebelum tengah hari (AM)" },
      { w: "午後", f: "ごご (gogo)", r: "gogo", m: "Sesudah tengah hari (PM)" },
      { w: "正午", f: "しょうご (shogo)", r: "shogo", m: "Tepat tengah hari" },
      { w: "午", f: "ご (go)", r: "go", m: "Noon / tengah hari" },
      { w: "午睡", f: "ごすい (gosui)", r: "gosui", m: "Tidur siang" }
    ]
  },
  {
    bab: "Bab 10",
    char: "前",
    mean: "Sebelum / Depan",
    desc: "Posisi sebelum atau di depan",
    vocab: [
      { w: "前", f: "まえ (mae)", r: "mae", m: "Depan / sebelum" },
      { w: "午前", f: "ごぜん (gozen)", r: "gozen", m: "Sebelum tengah hari" },
      { w: "名前", f: "なまえ (namae)", r: "namae", m: "Nama" },
      { w: "駅前", f: "えきまえ (ekimae)", r: "ekimae", m: "Depan stasiun" },
      { w: "以前", f: "いぜん (izen)", r: "izen", m: "Sebelumnya" }
    ]
  },
  {
    bab: "Bab 10",
    char: "後",
    mean: "Belakang / Sesudah",
    desc: "Posisi belakang atau sesudah",
    vocab: [
      { w: "後", f: "あと / うしろ (ato/ushiro)", r: "ato/ushiro", m: "Sesudah / belakang" },
      { w: "午後", f: "ごご (gogo)", r: "gogo", m: "Sesudah tengah hari" },
      { w: "後ろ", f: "うしろ (ushiro)", r: "ushiro", m: "Bagian belakang" },
      { w: "最後", f: "さいご (saigo)", r: "saigo", m: "Terakhir" },
      { w: "後日", f: "ごじつ (gojitsu)", r: "gojitsu", m: "Hari berikutnya" }
    ]
  },
  {
    bab: "Bab 10",
    char: "毎",
    mean: "Setiap",
    desc: "Pengulangan rutin setiap waktu",
    vocab: [
      { w: "毎日", f: "まいにち (mainichi)", r: "mainichi", m: "Setiap hari" },
      { w: "毎週", f: "まいしゅう (maishu)", r: "maishu", m: "Setiap minggu" },
      { w: "毎月", f: "まいつき (maitsuki)", r: "maitsuki", m: "Setiap bulan" },
      { w: "毎年", f: "まいとし (maitoshi)", r: "maitoshi", m: "Setiap tahun" },
      { w: "毎晩", f: "まいばん (maiban)", r: "maiban", m: "Setiap malam" }
    ]
  },
  {
    bab: "Bab 10",
    char: "曜",
    mean: "Hari",
    desc: "いみ: hari, くんよみ: -, オンヨミ: ヨウ",
    vocab: [
      { w: "曜日", f: "ようび (yobi)", r: "yobi", m: "Nama hari" },
      { w: "月曜日", f: "げつようび (getsuyobi)", r: "getsuyobi", m: "Senin" },
      { w: "水曜日", f: "すいようび (suiyobi)", r: "suiyobi", m: "Rabu" },
      { w: "金曜日", f: "きんようび (kinyobi)", r: "kinyobi", m: "Jumat" },
      { w: "土曜日", f: "どようび (doyobi)", r: "doyobi", m: "Sabtu" }
    ]
  }
];
