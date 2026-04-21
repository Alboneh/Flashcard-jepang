const bunpoDatabase = [
  {
    pattern: "KB1 は KB2 です",
    explanation: "Pola kalimat nominal dasar. Menyatakan KB1 adalah KB2.",
    examples: [
      "わたし は がくせい です。 (Saya adalah pelajar.)",
      "たなかさん は せんせい です。 (Tanaka-san adalah guru.)"
    ]
  },
  {
    pattern: "KB1 は KB2 では ありません / じゃ ありません",
    explanation: "Bentuk negatif dari kalimat nominal. Menyatakan KB1 bukan KB2.",
    examples: [
      "わたし は いしゃ では ありません。 (Saya bukan dokter.)",
      "あのひと は がくせい じゃ ありません。 (Orang itu bukan pelajar.)"
    ]
  },
  {
    pattern: "KB1 は KB2 ですか",
    explanation: "Kalimat tanya nominal. Akhiran か menandai pertanyaan.",
    examples: [
      "あなた は せんせい ですか。 (Apakah Anda guru?)",
      "ミラーさん は アメリカじん ですか。 (Apakah Miller-san orang Amerika?)"
    ]
  },
  {
    pattern: "KB1 は KB2 の KB3 です",
    explanation: "の menunjukkan hubungan kepemilikan/asal/keterangan antar kata benda.",
    examples: [
      "わたし は IMC の しゃいん です。 (Saya karyawan IMC.)",
      "これは にほん の ほん です。 (Ini buku Jepang.)"
    ]
  },
  {
    pattern: "KB1 は KB2 です。KB3 も KB2 です",
    explanation: "も berarti juga. Digunakan untuk menyatakan kesamaan dengan informasi sebelumnya.",
    examples: [
      "サントスさん は がくせい です。わたし も がくせい です。",
      "たなかさん は にほんじん です。やまださん も にほんじん です。"
    ]
  },
  {
    pattern: "KB1 は KB2 さい です",
    explanation: "Menyatakan umur. さい dipakai setelah angka umur.",
    examples: [
      "わたし は 20さい です。 (Saya 20 tahun.)",
      "むすめ は 7さい です。 (Anak perempuan saya 7 tahun.)"
    ]
  },
  {
    pattern: "これ / それ / あれ は KB1 です",
    explanation: "Kore: dekat pembicara, sore: dekat lawan bicara, are: jauh dari keduanya.",
    examples: [
      "これ は じしょ です。 (Ini kamus.)",
      "あれ は かさ です。 (Itu payung di sana.)"
    ]
  },
  {
    pattern: "それ は KB1 ですか、KB2 ですか",
    explanation: "Pertanyaan pilihan: A atau B.",
    examples: [
      "それ は かばん ですか、にもつ ですか。",
      "これは てちょう ですか、ノート ですか。"
    ]
  },
  {
    pattern: "これ / それ / あれ は KB1 の KB2 です",
    explanation: "Menyatakan benda dengan keterangan asal/jenis menggunakan の.",
    examples: [
      "これは にほん の カメラ です。",
      "それ は わたし の ほん です。"
    ]
  },
  {
    pattern: "この / その / あの KB1 は KB2 の です",
    explanation: "Kono/sono/ano langsung menerangkan kata benda setelahnya.",
    examples: [
      "この かばん は わたし の です。",
      "あの くるま は しゃちょう の です。"
    ]
  },
  {
    pattern: "ここ / そこ / あそこ は KB (Tempat) です",
    explanation: "Menunjukkan lokasi: di sini, di situ, di sana.",
    examples: [
      "ここ は きょうしつ です。",
      "あそこ は しょくどう です。"
    ]
  },
  {
    pattern: "KB / Orang / Tempat は ここ / そこ / あそこ です",
    explanation: "Subjek diletakkan dulu, lalu lokasinya.",
    examples: [
      "トイレ は あそこ です。",
      "やまださん は そこ です。"
    ]
  },
  {
    pattern: "KB / Orang / Tempat は Ket.Tempat です",
    explanation: "Menjelaskan posisi suatu objek/orang menggunakan keterangan tempat.",
    examples: [
      "じむしょ は 2かい です。",
      "エレベーター は うけつけ の となり です。"
    ]
  },
  {
    pattern: "Orang / Tempat は こちら / そちら / あちら です",
    explanation: "Versi sopan dari ここ/そこ/あそこ atau kore/sore/are untuk arah/tempat/orang.",
    examples: [
      "うけつけ は こちら です。",
      "やまださん は あちら です。"
    ]
  },
  {
    pattern: "これ / それ / あれ は Negara / Perusahaan の Benda です",
    explanation: "Menyatakan asal negara/perusahaan dari sebuah benda.",
    examples: [
      "これは にほん の くるま です。",
      "それ は IMC の コンピューター です。"
    ]
  },
  {
    pattern: "Benda は Bilangan + えん です",
    explanation: "Menyatakan harga suatu benda dalam yen.",
    examples: [
      "この ほん は 1200えん です。",
      "その かさ は 800えん です。"
    ]
  },
  {
    pattern: "いま KW です",
    explanation: "Menyatakan waktu saat ini.",
    examples: [
      "いま 7じ です。",
      "いま 9じ はん です。"
    ]
  },
  {
    pattern: "〜 は Ket.Hari です",
    explanation: "Menyatakan hari pelaksanaan kegiatan/peristiwa.",
    examples: [
      "しけん は げつようび です。",
      "やすみ は にちようび です。"
    ]
  },
  {
    pattern: "〜 は KW1 から KW2 まで です",
    explanation: "Menyatakan rentang waktu: dari ... sampai ...",
    examples: [
      "ぎんこう は 9じ から 3じ まで です。",
      "べんきょう は 7じ から 9じ まで です。"
    ]
  },
  {
    pattern: "〜 は KW に KK",
    explanation: "Partikel に dipakai untuk titik waktu terjadinya kegiatan.",
    examples: [
      "わたし は 6じ に おきます。",
      "まいにち 11じ に ねます。"
    ]
  },
  {
    pattern: "〜 は KW1 から KW2 まで KK",
    explanation: "Kegiatan berlangsung dari waktu 1 sampai waktu 2.",
    examples: [
      "わたし は 8じ から 5じ まで はたらきます。",
      "べんきょう は 7じ から 10じ まで します。"
    ]
  },
  {
    pattern: "KK ます / ません / ました / ませんでした",
    explanation: "Konjugasi kata kerja bentuk sopan: sekarang-positif, sekarang-negatif, lampau-positif, lampau-negatif.",
    examples: [
      "きょう べんきょうします。きのう べんきょうしました。",
      "あした はたらきません。おととい はたらきませんでした。"
    ]
  },
  {
    pattern: "KK ます / ません / ました / ませんでした か",
    explanation: "Bentuk tanya untuk setiap bentuk kata kerja sopan.",
    examples: [
      "きのう べんきょうしましたか。",
      "けさ あさごはん を たべましたか。"
    ]
  },
  {
    pattern: "KB (Tempat) へ いきます / きます / かえります",
    explanation: "Partikel へ menunjukkan arah tujuan.",
    examples: [
      "がっこう へ いきます。",
      "うち へ かえります。"
    ]
  },
  {
    pattern: "KB (Kendaraan) で KB (Tempat) へ いきます / きます / かえります",
    explanation: "Partikel で untuk alat/cara transportasi.",
    examples: [
      "でんしゃ で えき へ いきます。",
      "バス で だいがく へ きます。"
    ]
  },
  {
    pattern: "KB と KB (Tempat) へ いきます / きます / かえります",
    explanation: "Partikel と berarti bersama (dengan orang/teman).",
    examples: [
      "ともだち と デパート へ いきます。",
      "かぞく と うち へ かえります。"
    ]
  },
  {
    pattern: "KB (Waktu) に KB (Tempat) へ いきます / きます / かえります",
    explanation: "Waktu kejadian + tujuan pergerakan.",
    examples: [
      "7じ に がっこう へ いきます。",
      "にちようび に うち へ かえります。"
    ]
  },
  {
    pattern: "K.Benda を K.Kerja Transitif",
    explanation: "Partikel を menandai objek langsung dari kata kerja transitif.",
    examples: [
      "ほん を よみます。",
      "みず を のみます。"
    ]
  },
  {
    pattern: "K.Benda を します",
    explanation: "Untuk kegiatan tertentu: olahraga, pekerjaan, aktivitas umum.",
    examples: [
      "テニス を します。",
      "しゅくだい を します。"
    ]
  },
  {
    pattern: "なに を しますか",
    explanation: "Pertanyaan: melakukan apa?.",
    examples: [
      "にちようび なに を しますか。",
      "こんばん なに を しますか。"
    ]
  },
  {
    pattern: "なん dan なに",
    explanation: "なに dipakai umum; なん sering dipakai sebelum counter/kelompok bunyi t, d, n atau partikel tertentu agar mudah diucapkan.",
    examples: [
      "これは なに ですか。",
      "なんさい ですか。なんようび ですか。"
    ]
  },
  {
    pattern: "K.Benda (Tempat) で K.Kerja",
    explanation: "Partikel で juga dipakai untuk lokasi terjadinya aktivitas.",
    examples: [
      "わたし は とうきょうで おみやげを かいました。",
      "レストラン で ごはん を たべます。"
    ]
  },
  {
    pattern: "K.Kerja ませんか",
    explanation: "Ajakan halus: mau ...?.",
    examples: [
      "いっしょに えいが を みませんか。",
      "コーヒー を のみませんか。"
    ]
  },
  {
    pattern: "K.Kerja ましょう",
    explanation: "Ajakan: mari kita ...",
    examples: [
      "ちょっと やすみましょう。",
      "いっしょに かえりましょう。"
    ]
  },
  {
    pattern: "KB (Alat/Cara) で K.Kerja",
    explanation: "Menyatakan alat/cara melakukan tindakan.",
    examples: [
      "はし で たべます。 (Makan dengan sumpit.)",
      "にほんご で かきます。 (Menulis dengan bahasa Jepang.)"
    ]
  },
  {
    pattern: "Kata/Kalimat は 〜ご で Kata/Kalimat です",
    explanation: "Menanyakan/menyatakan padanan kata dalam bahasa tertentu.",
    examples: [
      "ありがとう は インドネシアご で なん ですか。",
      "Thank you は にほんご で ありがとう です。"
    ]
  },
  {
    pattern: "KB1 (Pemberi) は KB2 (Penerima) に 〜 を あげます",
    explanation: "Pola memberi: pemberi memberikan sesuatu kepada penerima.",
    examples: [
      "わたし は ともだち に はな を あげます。",
      "せんせい は わたし に ほん を あげました。"
    ]
  },
  {
    pattern: "KB1 (Penerima) は KB2 (Pemberi) に 〜 を もらいます",
    explanation: "Pola menerima: penerima menerima sesuatu dari pemberi.",
    examples: [
      "わたし は ちち に とけい を もらいました。",
      "マリアさん は たなかさん に プレゼント を もらいました。"
    ]
  },
  {
    pattern: "もう K.Kerja ました",
    explanation: "もう + ました berarti sudah melakukan.",
    examples: [
      "もう しゅくだい を しました。",
      "もう ひるごはん を たべました。"
    ]
  },
  {
    pattern: "K.Benda は K.Sifat な です / K.Benda は K.Sifat い です",
    explanation: "Predikat sifat: na-adjective butuh な saat menerangkan kata benda, dan です saat jadi predikat. i-adjective langsung + です.",
    examples: [
      "この へや は しずか です。",
      "この ほん は おもしろい です。"
    ]
  },
  {
    pattern: "K.Sifat な + K.Benda / K.Sifat い + K.Benda",
    explanation: "Sifat langsung menerangkan kata benda. Na-adjective wajib pakai な.",
    examples: [
      "しんせつな ひと です。",
      "あたらしい くるま です。"
    ]
  },
  {
    pattern: "とても / あまり",
    explanation: "とても untuk sangat (umumnya kalimat positif). あまり dipakai dengan kalimat negatif untuk makna tidak begitu.",
    examples: [
      "この えいが は とても おもしろい です。",
      "にほんご は あまり むずかしく ありません。"
    ]
  },
  {
    pattern: "K.Benda は どうですか",
    explanation: "Menanyakan pendapat atau kondisi tentang benda/tempat/orang.",
    examples: [
      "にほん の せいかつ は どうですか。",
      "この くるま は どうですか。"
    ]
  },
  {
    pattern: "K.Benda1 は どんな K.Benda2 ですか",
    explanation: "どんな dipakai untuk menanyakan jenis/sifat dari kata benda.",
    examples: [
      "にほんご は どんな ことば ですか。",
      "たなかさん は どんな ひと ですか。"
    ]
  },
  {
    pattern: "Kalimat 1 が、Kalimat 2",
    explanation: "が sebagai penghubung bermakna tetapi / namun.",
    examples: [
      "この へや は きれい ですが、せまい です。",
      "この えいが は おもしろい ですが、ちょっと ながい です。"
    ]
  },
  {
    pattern: "どれ",
    explanation: "Digunakan untuk menanyakan yang mana di antara tiga atau lebih pilihan.",
    examples: [
      "あなた の かばん は どれ ですか。",
      "どれ が すき ですか。"
    ]
  }
];
