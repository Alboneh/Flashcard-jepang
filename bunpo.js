const bunpoSearch = document.getElementById('bunpoSearch');
const bunpoList = document.getElementById('bunpoList');
const bunpoEmptyState = document.getElementById('bunpoEmptyState');

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function normalize(value) {
  return String(value || '').toLowerCase();
}

function expandShorthand(text) {
  return String(text || '')
    .replace(/KB1/g, 'Kata Benda 1')
    .replace(/KB2/g, 'Kata Benda 2')
    .replace(/KB3/g, 'Kata Benda 3')
    .replace(/KW1/g, 'Keterangan Waktu 1')
    .replace(/KW2/g, 'Keterangan Waktu 2')
    .replace(/Ket\.Tempat/g, 'Keterangan Tempat')
    .replace(/Ket\.Hari/g, 'Keterangan Hari')
    .replace(/K\.Kerja Transitif/g, 'Kata Kerja Transitif')
    .replace(/K\.Kerja/g, 'Kata Kerja')
    .replace(/K\.Benda/g, 'Kata Benda')
    .replace(/K\.Sifat/g, 'Kata Sifat')
    .replace(/KK/g, 'Kata Kerja')
    .replace(/KW/g, 'Keterangan Waktu')
    .replace(/KB/g, 'Kata Benda');
}

function simplifyExplanation(text) {
  let out = String(text || '');
  const replacements = [
    [/Menyatakan/g, 'Dipakai untuk bilang'],
    [/menyatakan/gi, 'dipakai untuk bilang'],
    [/Partikel/g, 'Kata bantu'],
    [/partikel/g, 'kata bantu'],
    [/menandai/gi, 'menunjukkan'],
    [/digunakan/gi, 'dipakai'],
    [/menunjukkan/gi, 'untuk menunjukkan'],
    [/Bentuk negatif/gi, 'Versi negatif'],
    [/kalimat nominal/gi, 'kalimat kata benda'],
    [/Konjugasi kata kerja bentuk sopan/gi, 'Perubahan bentuk kata kerja sopan'],
    [/rentang waktu/gi, 'jangka waktu'],
    [/arah tujuan/gi, 'tujuan arah'],
    [/objek langsung/gi, 'objek utama'],
    [/terjadinya kegiatan/gi, 'waktu terjadinya kegiatan'],
    [/keterangan tempat/gi, 'info tempat'],
    [/keterangan waktu/gi, 'info waktu'],
    [/namun/gi, 'tetapi']
  ];

  replacements.forEach(([pattern, replacement]) => {
    out = out.replace(pattern, replacement);
  });

  if (!out.endsWith('.')) {
    out += '.';
  }

  return out;
}

function parseExample(exampleText) {
  const raw = String(exampleText || '').trim();
  const translationMap = {
    'サントスさん は がくせい です。わたし も がくせい です。': 'Santos-san adalah pelajar. Saya juga pelajar.',
    'たなかさん は にほんじん です。やまださん も にほんじん です。': 'Tanaka-san orang Jepang. Yamada-san juga orang Jepang.',
    'それ は かばん ですか、にもつ ですか。': 'Itu tas atau barang bawaan?',
    'これは てちょう ですか、ノート ですか。': 'Ini buku agenda atau buku catatan?',
    'これは にほん の カメラ です。': 'Ini kamera Jepang.',
    'それ は わたし の ほん です。': 'Itu buku saya.',
    'この かばん は わたし の です。': 'Tas ini milik saya.',
    'あの くるま は しゃちょう の です。': 'Mobil itu milik direktur.',
    'ここ は きょうしつ です。': 'Di sini adalah ruang kelas.',
    'あそこ は しょくどう です。': 'Di sana adalah kantin.',
    'トイレ は あそこ です。': 'Toilet ada di sana.',
    'やまださん は そこ です。': 'Yamada-san ada di situ.',
    'じむしょ は 2かい です。': 'Kantor ada di lantai 2.',
    'エレベーター は うけつけ の となり です。': 'Lift ada di sebelah resepsionis.',
    'うけつけ は こちら です。': 'Resepsionis di sebelah sini.',
    'やまださん は あちら です。': 'Yamada-san di sebelah sana.',
    'これは にほん の くるま です。': 'Ini mobil Jepang.',
    'それ は IMC の コンピューター です。': 'Itu komputer milik IMC.',
    'この ほん は 1200えん です。': 'Buku ini harganya 1200 yen.',
    'その かさ は 800えん です。': 'Payung itu harganya 800 yen.',
    'いま 7じ です。': 'Sekarang jam 7.',
    'いま 9じ はん です。': 'Sekarang jam 9 lewat setengah.',
    'しけん は げつようび です。': 'Ujian hari Senin.',
    'やすみ は にちようび です。': 'Hari libur hari Minggu.',
    'ぎんこう は 9じ から 3じ まで です。': 'Bank buka dari jam 9 sampai jam 3.',
    'べんきょう は 7じ から 9じ まで です。': 'Belajar dari jam 7 sampai jam 9.',
    'わたし は 6じ に おきます。': 'Saya bangun jam 6.',
    'まいにち 11じ に ねます。': 'Setiap hari saya tidur jam 11.',
    'わたし は 8じ から 5じ まで はたらきます。': 'Saya bekerja dari jam 8 sampai jam 5.',
    'べんきょう は 7じ から 10じ まで します。': 'Saya belajar dari jam 7 sampai jam 10.',
    'きょう べんきょうします。きのう べんきょうしました。': 'Hari ini belajar. Kemarin juga belajar.',
    'あした はたらきません。おととい はたらきませんでした。': 'Besok tidak bekerja. Kemarin lusa juga tidak bekerja.',
    'きのう べんきょうしましたか。': 'Kemarin belajar?',
    'けさ あさごはん を たべましたか。': 'Tadi pagi sudah makan sarapan?',
    'がっこう へ いきます。': 'Pergi ke sekolah.',
    'うち へ かえります。': 'Pulang ke rumah.',
    'でんしゃ で えき へ いきます。': 'Pergi ke stasiun naik kereta.',
    'バス で だいがく へ きます。': 'Datang ke kampus naik bus.',
    'ともだち と デパート へ いきます。': 'Pergi ke department store bersama teman.',
    'かぞく と うち へ かえります。': 'Pulang ke rumah bersama keluarga.',
    '7じ に がっこう へ いきます。': 'Jam 7 pergi ke sekolah.',
    'にちようび に うち へ かえります。': 'Hari Minggu pulang ke rumah.',
    'ほん を よみます。': 'Membaca buku.',
    'みず を のみます。': 'Minum air.',
    'テニス を します。': 'Bermain tenis.',
    'しゅくだい を します。': 'Mengerjakan PR.',
    'にちようび なに を しますか。': 'Hari Minggu melakukan apa?',
    'こんばん なに を しますか。': 'Malam ini melakukan apa?',
    'これは なに ですか。': 'Ini apa?',
    'なんさい ですか。なんようび ですか。': 'Umurnya berapa? Hari apa?',
    'わたし は とうきょうで おみやげを かいました。': 'Saya membeli oleh-oleh di Tokyo.',
    'レストラン で ごはん を たべます。': 'Makan di restoran.',
    'いっしょに えいが を みませんか。': 'Mau nonton film bareng?',
    'コーヒー を のみませんか。': 'Mau minum kopi?',
    'ちょっと やすみましょう。': 'Mari istirahat sebentar.',
    'いっしょに かえりましょう。': 'Mari pulang bersama.',
    'ありがとう は インドネシアご で なん ですか。': 'Apa bahasa Indonesianya arigatou?',
    'Thank you は にほんご で ありがとう です。': 'Thank you dalam bahasa Jepang adalah arigatou.',
    'わたし は ともだち に はな を あげます。': 'Saya memberi bunga kepada teman.',
    'せんせい は わたし に ほん を あげました。': 'Guru memberi saya buku.',
    'わたし は ちち に とけい を もらいました。': 'Saya menerima jam tangan dari ayah.',
    'マリアさん は たなかさん に プレゼント を もらいました。': 'Maria-san menerima hadiah dari Tanaka-san.',
    'もう しゅくだい を しました。': 'Saya sudah mengerjakan PR.',
    'もう ひるごはん を たべました。': 'Saya sudah makan siang.',
    'この へや は しずか です。': 'Kamar ini tenang.',
    'この ほん は おもしろい です。': 'Buku ini menarik.',
    'しんせつな ひと です。': 'Dia orang yang baik hati.',
    'きれいな へや です。': 'Ini kamar yang bersih/cantik.',
    'ゆうめいな だいがく です。': 'Ini universitas yang terkenal.',
    'あたらしい くるま です。': 'Ini mobil baru.',
    'この へや は しずか じゃ ありません。': 'Kamar ini tidak tenang.',
    'この ほん は おもしろくない です。': 'Buku ini tidak menarik.',
    'この くるま は たかくない です。': 'Mobil ini tidak mahal.',
    'この えいが は とても おもしろい です。': 'Film ini sangat menarik.',
    'にほんご は あまり むずかしく ありません。': 'Bahasa Jepang tidak terlalu sulit.',
    'にほん の せいかつ は どうですか。': 'Bagaimana kehidupan di Jepang?',
    'この くるま は どうですか。': 'Bagaimana mobil ini?',
    'にほんご は どんな ことば ですか。': 'Bahasa Jepang itu bahasa seperti apa?',
    'たなかさん は どんな ひと ですか。': 'Tanaka-san orang yang seperti apa?',
    'この へや は きれい ですが、せまい です。': 'Kamar ini bersih/cantik, tetapi sempit.',
    'この えいが は おもしろい ですが、ちょっと ながい です。': 'Film ini menarik, tetapi agak panjang.',
    'あなた の かばん は どれ ですか。': 'Tas kamu yang mana?',
    'どれ が すき ですか。': 'Yang mana yang kamu suka?'
  };
  const match = raw.match(/^(.*)\s\(([^()]*)\)\s*$/);

  if (!match) {
    return {
      jp: raw,
      id: translationMap[raw] || 'Belum ditambahkan.'
    };
  }

  return {
    jp: match[1].trim(),
    id: match[2].trim() || 'Belum ditambahkan.'
  };
}

function getBabByIndex(index) {
  if (index <= 5) return 'Bab 1';
  if (index <= 10) return 'Bab 2';
  if (index <= 16) return 'Bab 3';
  if (index <= 22) return 'Bab 4';
  if (index <= 26) return 'Bab 5';
  if (index <= 35) return 'Bab 6';
  if (index <= 38) return 'Bab 7';
  if (index <= 46) return 'Bab 8';
  if (index <= 51) return 'Bab 9';
  return 'Bab 10';
}

function renderBunpo() {
  const q = normalize(bunpoSearch.value);
  const filtered = bunpoDatabase.filter((item, index) => {
    const bab = getBabByIndex(index);
    return (
      !q ||
      normalize(bab).includes(q) ||
      normalize(item.pattern).includes(q) ||
      normalize(item.explanation).includes(q) ||
      (item.examples || []).some((ex) => normalize(ex).includes(q))
    );
  });

  bunpoList.innerHTML = filtered
    .map((item) => {
      const examples = (item.examples || [])
        .map((ex) => {
          const parsed = parseExample(ex);
          return `<li><div class="ex-jp">${escapeHtml(parsed.jp)}</div><div class="ex-id">Arti: ${escapeHtml(parsed.id)}</div></li>`;
        })
        .join('');

      const rawPattern = item.pattern || '-';
      const easyPattern = expandShorthand(rawPattern);
      const easyExplanation = simplifyExplanation(item.explanation || '-');
      const dataIndex = bunpoDatabase.indexOf(item);
      const bab = getBabByIndex(dataIndex);

      return `
        <article class="item">
          <div class="item-top">
            <h3>Pola Asli</h3>
            <span class="bab-badge">${escapeHtml(bab)}</span>
          </div>
          <p class="pattern-main">${escapeHtml(rawPattern)}</p>
          <p class="easy-read"><strong>Cara Baca:</strong> ${escapeHtml(easyPattern)}</p>
          <p class="core-meaning"><strong>Penjelasan Gampang:</strong> ${escapeHtml(easyExplanation)}</p>
          <p><strong>Contoh:</strong></p>
          <ul>${examples}</ul>
        </article>
      `;
    })
    .join('');

  bunpoEmptyState.style.display = filtered.length ? 'none' : '';
}

bunpoSearch.addEventListener('input', renderBunpo);
renderBunpo();
