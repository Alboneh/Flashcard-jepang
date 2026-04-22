const bunpoDatabase = [
  {
    pattern: "KB1 は KB2 です",
    explanation: "Pola paling dasar: KB1 adalah KB2.",
    examples: [
      "わたし は がくせい です。 (Saya adalah pelajar.)",
      "たなかさん は せんせい です。 (Tanaka-san adalah guru.)"
    ]
  },
  {
    pattern: "KB1 は KB2 では ありません / じゃ ありません",
    explanation: "Bentuk negatif: KB1 bukan KB2.",
    examples: [
      "わたし は いしゃ では ありません。 (Saya bukan dokter.)",
      "あのひと は がくせい じゃ ありません。 (Orang itu bukan pelajar.)"
    ]
  },
  {
    pattern: "KB1 は KB2 ですか",
    explanation: "Bentuk tanya. Tambahkan か di akhir kalimat.",
    examples: [
      "あなた は せんせい ですか。 (Apakah Anda guru?)",
      "ミラーさん は アメリカじん ですか。 (Apakah Miller-san orang Amerika?)"
    ]
  },
  {
    pattern: "KB1 は KB2 の KB3 です",
    explanation: "の dipakai untuk menghubungkan dua kata benda (milik, asal, atau jenis).",
    examples: [
      "わたし は IMC の しゃいん です。 (Saya karyawan IMC.)",
      "これは にほん の ほん です。 (Ini buku Jepang.)"
    ]
  },
  {
    pattern: "KB1 は KB2 です。KB3 も KB2 です",
    explanation: "も artinya juga. Dipakai saat informasinya sama dengan kalimat sebelumnya.",
    examples: [
      "サントスさん は がくせい です。わたし も がくせい です。",
      "たなかさん は にほんじん です。やまださん も にほんじん です。"
    ]
  },
  {
    pattern: "KB1 は KB2 さい です",
    explanation: "Untuk menyebut umur. Angka diikuti さい.",
    examples: [
      "わたし は 20さい です。 (Saya 20 tahun.)",
      "むすめ は 7さい です。 (Anak perempuan saya 7 tahun.)"
    ]
  },
  {
    pattern: "これ / それ / あれ は KB1 です",
    explanation: "これ untuk benda dekat saya, それ dekat lawan bicara, あれ jauh dari dua-duanya.",
    examples: [
      "これ は じしょ です。 (Ini kamus.)",
      "あれ は かさ です。 (Itu payung di sana.)"
    ]
  },
  {
    pattern: "それ は KB1 ですか、KB2 ですか",
    explanation: "Pertanyaan pilihan: ini A atau B.",
    examples: [
      "それ は かばん ですか、にもつ ですか。",
      "これは てちょう ですか、ノート ですか。"
    ]
  },
  {
    pattern: "これ / それ / あれ は KB1 の KB2 です",
    explanation: "Menyebut benda beserta asal/jenisnya pakai の.",
    examples: [
      "これは にほん の カメラ です。",
      "それ は わたし の ほん です。"
    ]
  },
  {
    pattern: "この / その / あの KB1 は KB2 の です",
    explanation: "この/その/あの langsung diikuti kata benda.",
    examples: [
      "この かばん は わたし の です。",
      "あの くるま は しゃちょう の です。"
    ]
  },
  {
    pattern: "ここ / そこ / あそこ は KB (Tempat) です",
    explanation: "Menunjukkan lokasi: di sini, di situ, atau di sana.",
    examples: [
      "ここ は きょうしつ です。",
      "あそこ は しょくどう です。"
    ]
  },
  {
    pattern: "KB / Orang / Tempat は ここ / そこ / あそこ です",
    explanation: "Sebut dulu benda/orangnya, lalu sebut lokasinya.",
    examples: [
      "トイレ は あそこ です。",
      "やまださん は そこ です。"
    ]
  },
  {
    pattern: "KB / Orang / Tempat は Ket.Tempat です",
    explanation: "Menjelaskan posisi benda/orang dengan keterangan tempat.",
    examples: [
      "じむしょ は 2かい です。",
      "エレベーター は うけつけ の となり です。"
    ]
  },
  {
    pattern: "Orang / Tempat は こちら / そちら / あちら です",
    explanation: "Versi sopan untuk menunjuk arah/tempat/orang.",
    examples: [
      "うけつけ は こちら です。",
      "やまださん は あちら です。"
    ]
  },
  {
    pattern: "これ / それ / あれ は Negara / Perusahaan の Benda です",
    explanation: "Menyebut asal benda dari negara atau perusahaan.",
    examples: [
      "これは にほん の くるま です。",
      "それ は IMC の コンピューター です。"
    ]
  },
  {
    pattern: "Benda は Bilangan + えん です",
    explanation: "Untuk menyebut harga benda dalam yen.",
    examples: [
      "この ほん は 1200えん です。",
      "その かさ は 800えん です。"
    ]
  },
  {
    pattern: "いま KW です",
    explanation: "Untuk menyebut jam sekarang.",
    examples: [
      "いま 7じ です。",
      "いま 9じ はん です。"
    ]
  },
  {
    pattern: "〜 は Ket.Hari です",
    explanation: "Untuk menyebut hari terjadinya kegiatan.",
    examples: [
      "しけん は げつようび です。",
      "やすみ は にちようび です。"
    ]
  },
  {
    pattern: "〜 は KW1 から KW2 まで です",
    explanation: "Untuk menyebut rentang waktu: dari ... sampai ...",
    examples: [
      "ぎんこう は 9じ から 3じ まで です。",
      "べんきょう は 7じ から 9じ まで です。"
    ]
  },
  {
    pattern: "〜 は KW に KK",
    explanation: "に dipakai untuk menunjukkan waktu terjadinya kegiatan.",
    examples: [
      "わたし は 6じ に おきます。",
      "まいにち 11じ に ねます。"
    ]
  },
  {
    pattern: "〜 は KW1 から KW2 まで KK",
    explanation: "Kegiatan dilakukan dari jam A sampai jam B.",
    examples: [
      "わたし は 8じ から 5じ まで はたらきます。",
      "べんきょう は 7じ から 10じ まで します。"
    ]
  },
  {
    pattern: "KK ます / ません / ました / ませんでした",
    explanation: "Empat bentuk kata kerja sopan: sekarang (+), sekarang (-), lampau (+), lampau (-).",
    examples: [
      "きょう べんきょうします。きのう べんきょうしました。",
      "あした はたらきません。おととい はたらきませんでした。"
    ]
  },
  {
    pattern: "KK ます / ません / ました / ませんでした か",
    explanation: "Bentuk tanya dari pola kata kerja sopan di atas.",
    examples: [
      "きのう べんきょうしましたか。",
      "けさ あさごはん を たべましたか。"
    ]
  },
  {
    pattern: "KB (Tempat) へ いきます / きます / かえります",
    explanation: "へ dipakai untuk menunjukkan arah tujuan.",
    examples: [
      "がっこう へ いきます。",
      "うち へ かえります。"
    ]
  },
  {
    pattern: "KB (Kendaraan) で KB (Tempat) へ いきます / きます / かえります",
    explanation: "で dipakai untuk alat atau cara pergi (transportasi).",
    examples: [
      "でんしゃ で えき へ いきます。",
      "バス で だいがく へ きます。"
    ]
  },
  {
    pattern: "KB と KB (Tempat) へ いきます / きます / かえります",
    explanation: "と artinya bersama/dengan seseorang.",
    examples: [
      "ともだち と デパート へ いきます。",
      "かぞく と うち へ かえります。"
    ]
  },
  {
    pattern: "KB (Waktu) に KB (Tempat) へ いきます / きます / かえります",
    explanation: "Pola ini menggabungkan waktu berangkat dan tujuan.",
    examples: [
      "7じ に がっこう へ いきます。",
      "にちようび に うち へ かえります。"
    ]
  },
  {
    pattern: "K.Benda を K.Kerja Transitif",
    explanation: "を menandai objek yang dikenai tindakan.",
    examples: [
      "ほん を よみます。",
      "みず を のみます。"
    ]
  },
  {
    pattern: "K.Benda を します",
    explanation: "Dipakai untuk aktivitas umum seperti olahraga atau tugas.",
    examples: [
      "テニス を します。",
      "しゅくだい を します。"
    ]
  },
  {
    pattern: "なに を しますか",
    explanation: "Pertanyaan: sedang/akan melakukan apa?",
    examples: [
      "にちようび なに を しますか。",
      "こんばん なに を しますか。"
    ]
  },
  {
    pattern: "なん dan なに",
    explanation: "なに dipakai secara umum. なん sering dipakai sebelum kata hitung atau bunyi tertentu supaya lebih mudah diucap.",
    examples: [
      "これは なに ですか。",
      "なんさい ですか。なんようび ですか。"
    ]
  },
  {
    pattern: "K.Benda (Tempat) で K.Kerja",
    explanation: "で juga dipakai untuk tempat terjadinya aktivitas.",
    examples: [
      "わたし は とうきょうで おみやげを かいました。",
      "レストラン で ごはん を たべます。"
    ]
  },
  {
    pattern: "K.Kerja ませんか",
    explanation: "Ajakan halus: mau ...?",
    examples: [
      "いっしょに えいが を みませんか。",
      "コーヒー を のみませんか。"
    ]
  },
  {
    pattern: "K.Kerja ましょう",
    explanation: "Ajakan: ayo/mari kita ...",
    examples: [
      "ちょっと やすみましょう。",
      "いっしょに かえりましょう。"
    ]
  },
  {
    pattern: "KB (Alat/Cara) で K.Kerja",
    explanation: "Menyebut alat atau cara yang dipakai saat melakukan tindakan.",
    examples: [
      "はし で たべます。 (Makan dengan sumpit.)",
      "にほんご で かきます。 (Menulis dengan bahasa Jepang.)"
    ]
  },
  {
    pattern: "Kata/Kalimat は 〜ご で Kata/Kalimat です",
    explanation: "Menanyakan atau memberi tahu cara mengucapkan kata dalam bahasa lain.",
    examples: [
      "ありがとう は インドネシアご で なん ですか。",
      "Thank you は にほんご で ありがとう です。"
    ]
  },
  {
    pattern: "KB1 (Pemberi) は KB2 (Penerima) に 〜 を あげます",
    explanation: "Pola memberi: siapa memberi apa kepada siapa.",
    examples: [
      "わたし は ともだち に はな を あげます。",
      "せんせい は わたし に ほん を あげました。"
    ]
  },
  {
    pattern: "KB1 (Penerima) は KB2 (Pemberi) に 〜 を もらいます",
    explanation: "Pola menerima: siapa menerima apa dari siapa.",
    examples: [
      "わたし は ちち に とけい を もらいました。",
      "マリアさん は たなかさん に プレゼント を もらいました。"
    ]
  },
  {
    pattern: "もう K.Kerja ました",
    explanation: "もう + ました berarti sudah melakukan sesuatu.",
    examples: [
      "もう しゅくだい を しました。",
      "もう ひるごはん を たべました。"
    ]
  },
  {
    pattern: "K.Benda は K.Sifat な です / K.Benda は K.Sifat い です",
    explanation: "Saat kata sifat jadi predikat, pakai pola ini. Ingat: きれい dan ゆうめい tetap na-adjective walau berakhiran い.",
    examples: [
      "この へや は しずか です。",
      "この まち は きれい です。 (きれい tetap na-adjective)",
      "あの ひと は ゆうめい です。 (ゆうめい tetap na-adjective)",
      "この ほん は おもしろい です。"
    ]
  },
  {
    pattern: "K.Sifat な + K.Benda / K.Sifat い + K.Benda",
    explanation: "Kalau kata sifat digabungkan dengan kata benda, kata sifat diletakkan di depan kata benda. Na-adjective harus pakai な, i-adjective tidak pakai な. Contoh: しんせつな ひと, あたらしい くるま. Khusus きれい dan ゆうめい, tetap pakai な.",
    examples: [
      "しんせつな ひと です。",
      "きれいな へや です。",
      "ゆうめいな だいがく です。",
      "あたらしい くるま です。"
    ]
  },
  {
    pattern: "Bentuk negatif sifat: な-adjective / い-adjective",
    explanation: "Bentuk negatif: na-adjective pakai じゃ ありません, i-adjective ubah い menjadi くない です.",
    examples: [
      "この へや は しずか じゃ ありません。",
      "この まち は きれい じゃ ありません。 (きれい = na-adjective)",
      "あの ひと は ゆうめい じゃ ありません。 (ゆうめい = na-adjective)",
      "この ほん は おもしろくない です。",
      "この くるま は たかくない です。"
    ]
  },
  {
    pattern: "とても / あまり",
    explanation: "とても artinya sangat (biasanya kalimat positif). あまり dipakai dengan kalimat negatif (artinya tidak begitu).",
    examples: [
      "この えいが は とても おもしろい です。",
      "にほんご は あまり むずかしく ありません。"
    ]
  },
  {
    pattern: "K.Benda は どうですか",
    explanation: "Untuk menanyakan pendapat atau kondisi tentang sesuatu.",
    examples: [
      "にほん の せいかつ は どうですか。",
      "この くるま は どうですか。"
    ]
  },
  {
    pattern: "K.Benda1 は どんな K.Benda2 ですか",
    explanation: "どんな dipakai untuk bertanya: seperti apa jenis/sifatnya.",
    examples: [
      "にほんご は どんな ことば ですか。",
      "たなかさん は どんな ひと ですか。"
    ]
  },
  {
    pattern: "Kalimat 1 が、Kalimat 2",
    explanation: "が dipakai untuk menghubungkan dua kalimat dengan makna tetapi/namun.",
    examples: [
      "この へや は きれい ですが、せまい です。",
      "この えいが は おもしろい ですが、ちょっと ながい です。"
    ]
  },
  {
    pattern: "どれ",
    explanation: "Dipakai untuk menanyakan yang mana dari tiga pilihan atau lebih.",
    examples: [
      "あなた の かばん は どれ ですか。",
      "どれ が すき ですか。"
    ]
  },
  {
    pattern: "K.Benda が あります / わかります",
    explanation: "Pada pola ini, objek ditandai が. あります artinya ada/punya, わかります artinya paham.",
    examples: [
      "わたし は おかね が あります。 (Saya memiliki uang.)",
      "わたし は げつようび に やくそく が あります。 (Saya ada janji di hari Senin.)",
      "わたし は にほんご が わかります。 (Saya paham bahasa Jepang.)",
      "わたし は えいご が わかりません。 (Saya tidak paham bahasa Inggris.)"
    ]
  },
  {
    pattern: "K.Benda が すきです / きらいです / じょうずです / へたです",
    explanation: "Dipakai untuk menyatakan suka/tidak suka dan pandai/tidak pandai. Objeknya pakai partikel が.",
    examples: [
      "わたし は スポーツ が すき です。 (Saya suka olahraga.)",
      "おかあさん は やきゅう が きらい です。 (Ibu tidak suka baseball.)",
      "サントスさん は りょうり が じょうず です。 (Santos pandai memasak.)",
      "わたし は すうがく が へた です。 (Saya tidak pandai matematika.)"
    ]
  },
  {
    pattern: "よく / だいたい / たくさん / すこし / あまり / ぜんぜん + K.Kerja",
    explanation: "Kata keterangan diletakkan sebelum kata kerja. あまり dan ぜんぜん biasanya dipakai dengan bentuk negatif.",
    examples: [
      "ジョンさん は スペインご が よく わかります。 (John memahami bahasa Spanyol dengan baik.)",
      "タワポンさん は おかね が たくさん あります。 (Tawapon mempunyai banyak uang.)",
      "まつもとさん は ドイツご が ぜんぜん わかりません。 (Matsumoto sama sekali tidak mengerti bahasa Jerman.)",
      "ここ は もり が あまり ありません。 (Di sini tidak begitu banyak hutan.)"
    ]
  },
  {
    pattern: "Kalimat 1 から、Kalimat 2",
    explanation: "から artinya karena/sebab. Bagian depan = alasan, bagian belakang = akibat/keputusan.",
    examples: [
      "いそがしい です から、テレビ を みません。 (Tidak menonton TV, karena sibuk.)",
      "にほんご が わかりません から、アニメ を みません。 (Tidak menonton anime, karena tidak paham bahasa Jepang.)",
      "じかん が ありません から、りょこう を しません。 (Tidak bertamasya, karena tidak ada waktu.)"
    ]
  },
  {
    pattern: "どうして + Kalimat? / ... から",
    explanation: "どうして dipakai untuk bertanya alasan. Jawaban biasanya diakhiri から.",
    examples: [
      "どうして きょうと へ いきませんか。 (Mengapa tidak pergi ke Kyoto?)",
      "やくそく が あります から。 (Karena ada janji.)",
      "どうして あさ しんぶん を よみませんか。 (Mengapa tidak baca koran saat pagi?)",
      "じかん が ありません から。 (Karena tidak ada waktu.)",
      "どうして はやく かえりますか。 (Mengapa pulang lebih awal?)",
      "こども の たんじょうび です から。 (Karena anak saya ulang tahun.)"
    ]
  }
];
