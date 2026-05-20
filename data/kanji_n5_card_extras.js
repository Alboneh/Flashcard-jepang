// Tambahan contoh on/kun khusus card mode kanji-n5.
// Dipakai saat classifier dari KANJI_N5_EXTRA.vocab tidak menemukan
// contoh untuk salah satu sisi (on atau kun) padahal kanji punya reading itu.
// Format: { char: { on: [{w,f,r,m}, ...], kun: [{w,f,r,m}, ...] } }
const KANJI_CARD_EXTRAS = {
  "何": {
    on: [
      { w: "幾何", f: "きか (kika)", r: "kika", m: "Geometri (singkatan dari 幾何学)" }
    ]
  },
  "川": {
    on: [
      { w: "河川", f: "かせん (kasen)", r: "kasen", m: "Sungai-sungai (istilah formal)" }
    ]
  },
  "口": {
    kun: [
      { w: "口紅", f: "くちべに (kuchibeni)", r: "kuchibeni", m: "Lipstik" },
      { w: "早口", f: "はやくち (hayakuchi)", r: "hayakuchi", m: "Bicara cepat" }
    ]
  },
  "子": {
    on: [
      { w: "帽子", f: "ぼうし (bōshi)", r: "boshi", m: "Topi" },
      { w: "様子", f: "ようす (yōsu)", r: "yosu", m: "Keadaan, situasi" }
    ]
  },
  "本": {
    kun: [
      { w: "山本", f: "やまもと (Yamamoto)", r: "yamamoto", m: "Yamamoto (nama keluarga)" }
    ]
  },
  "半": {
    kun: [
      { w: "半ば", f: "なかば (nakaba)", r: "nakaba", m: "Pertengahan, separuh" }
    ]
  },
  "耳": {
    on: [
      { w: "耳鼻科", f: "じびか (jibika)", r: "jibika", m: "Klinik THT (telinga-hidung-tenggorokan)" },
      { w: "中耳", f: "ちゅうじ (chūji)", r: "chuji", m: "Telinga tengah" }
    ]
  },
  "貝": {
    kun: [
      { w: "貝", f: "かい (kai)", r: "kai", m: "Kerang (on=kun, dibaca sama)" }
    ]
  },
  "花": {
    on: [
      { w: "花瓶", f: "かびん (kabin)", r: "kabin", m: "Vas bunga" },
      { w: "開花", f: "かいか (kaika)", r: "kaika", m: "Berbunga, mekar" }
    ]
  },
  "文": {
    kun: [
      { w: "恋文", f: "こいぶみ (koibumi)", r: "koibumi", m: "Surat cinta (sastra/klasik)" }
    ]
  },
  "字": {
    kun: [
      { w: "大字", f: "おおあざ (ōaza)", r: "oaza", m: "Bagian desa (istilah administratif)" }
    ]
  },
  "買": {
    on: [
      { w: "売買", f: "ばいばい (baibai)", r: "baibai", m: "Jual-beli, perdagangan" },
      { w: "購買", f: "こうばい (kōbai)", r: "kobai", m: "Pembelian" }
    ]
  },
  "朝": {
    on: [
      { w: "朝食", f: "ちょうしょく (chōshoku)", r: "choshoku", m: "Sarapan (formal)" },
      { w: "早朝", f: "そうちょう (sōchō)", r: "socho", m: "Dini hari, pagi-pagi sekali" }
    ]
  },
  "昼": {
    on: [
      { w: "昼食", f: "ちゅうしょく (chūshoku)", r: "chushoku", m: "Makan siang (formal)" },
      { w: "昼夜", f: "ちゅうや (chūya)", r: "chuya", m: "Siang dan malam" }
    ]
  },
  "夕": {
    on: [
      { w: "一朝一夕", f: "いっちょういっせき (icchō isseki)", r: "icchoisseki", m: "Dalam waktu singkat (idiom)" }
    ]
  },
  "方": {
    kun: [
      { w: "見方", f: "みかた (mikata)", r: "mikata", m: "Cara pandang, sudut pandang" },
      { w: "読み方", f: "よみかた (yomikata)", r: "yomikata", m: "Cara membaca" }
    ]
  },
  "毎": {
    kun: [
      { w: "毎に", f: "ごとに (goto ni)", r: "gotoni", m: "Setiap, masing-masing (akhiran)" }
    ]
  },
  "語": {
    kun: [
      { w: "語る", f: "かたる (kataru)", r: "kataru", m: "Berbicara, menceritakan" },
      { w: "物語", f: "ものがたり (monogatari)", r: "monogatari", m: "Cerita, kisah" }
    ]
  },
  "飯": {
    kun: [
      { w: "飯", f: "めし (meshi)", r: "meshi", m: "Nasi, makanan (kasar/informal)" }
    ]
  }
};
