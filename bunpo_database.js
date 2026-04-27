const bunpoDatabase = [
  {
    pattern: "KB1 は KB2 です",
    explanation: "KB1 adalah topik utama kalimat — hal yang sedang dibicarakan. は menandai topik itu. Lalu KB2 adalah penjelasan tentang topik tersebut. Contoh: わたし は イブラヒム です — 'watashi' (saya) adalah topik utama kalimat, dan 'Ibrahim' adalah penjelasannya.",
    examples: [
      "わたし は がくせい です。 (Saya adalah pelajar. — 'saya' topik utama, 'pelajar' penjelasannya.)",
      "たなかさん は せんせい です。 (Tanaka-san adalah guru. — 'Tanaka-san' topik utama, 'guru' penjelasannya.)"
    ]
  },
  {
    pattern: "KB1 は KB2 では ありません / じゃ ありません",
    explanation: "Kebalikan dari pola は です. KB1 tetap topik utama kalimat, tapi penjelasannya dinegasikan. Artinya: KB1 bukan KB2. じゃ ありません lebih santai, では ありません lebih formal — artinya sama.",
    examples: [
      "わたし は いしゃ では ありません。 (Saya bukan dokter. — 'saya' topik utama, 'dokter' dinegasikan.)",
      "あのひと は がくせい じゃ ありません。 (Orang itu bukan pelajar.)"
    ]
  },
  {
    pattern: "KB1 は KB2 ですか",
    explanation: "Sama seperti pola は です, tapi diubah jadi pertanyaan dengan menambahkan か di akhir. KB1 tetap topik utama kalimat. か = tanda tanya bahasa Jepang.",
    examples: [
      "あなた は せんせい ですか。 (Apakah Anda guru? — 'Anda' topik utama, ditanyakan apakah 'guru'.)",
      "ミラーさん は アメリカじん ですか。 (Apakah Miller-san orang Amerika?)"
    ]
  },
  {
    pattern: "KB1 は KB2 の KB3 です",
    explanation: "KB1 adalah topik utama kalimat. の menghubungkan dua kata benda — KB2 menerangkan KB3. Bisa menunjukkan milik, asal, jenis, atau afiliasi.",
    examples: [
      "わたし は IMC の しゃいん です。 (Saya adalah karyawan IMC. — 'saya' topik utama, 'karyawan IMC' penjelasannya.)",
      "これは にほん の ほん です。 (Ini adalah buku Jepang. — 'ini' topik utama, 'buku Jepang' penjelasannya.)"
    ]
  },
  {
    pattern: "KB1 は KB2 です。KB3 も KB2 です",
    explanation: "も menggantikan は ketika topik baru memiliki penjelasan yang sama dengan kalimat sebelumnya. Artinya: KB3 juga memiliki penjelasan yang sama dengan KB1.",
    examples: [
      "サントスさん は がくせい です。わたし も がくせい です。 (Santos adalah pelajar. Saya juga pelajar.)",
      "たなかさん は にほんじん です。やまださん も にほんじん です。 (Tanaka-san orang Jepang. Yamada-san juga orang Jepang.)"
    ]
  },
  {
    pattern: "KB1 は KB2 さい です",
    explanation: "KB1 adalah topik utama kalimat — orang yang sedang dibicarakan umurnya. さい adalah satuan umur. Angka diletakkan sebelum さい.",
    examples: [
      "わたし は 20さい です。 (Saya berumur 20 tahun. — 'saya' topik utama, '20 tahun' penjelasannya.)",
      "むすめ は 7さい です。 (Anak perempuan saya berumur 7 tahun.)"
    ]
  },
  {
    pattern: "これ / それ / あれ は KB1 です",
    explanation: "これ/それ/あれ menjadi topik utama kalimat — benda yang sedang ditunjuk dan dibicarakan. KB1 adalah penjelasan tentang benda itu. これ = benda dekat pembicara, それ = dekat lawan bicara, あれ = jauh dari keduanya.",
    examples: [
      "これ は じしょ です。 (Ini adalah kamus. — 'ini' topik utama, 'kamus' penjelasannya.)",
      "あれ は かさ です。 (Itu adalah payung.)"
    ]
  },
  {
    pattern: "それ は KB1 ですか、KB2 ですか",
    explanation: "Pertanyaan pilihan. Topik utama kalimat adalah benda yang ditunjuk (それ), lalu penanya memberi dua opsi penjelasan dan bertanya yang mana yang benar.",
    examples: [
      "それ は かばん ですか、にもつ ですか。 (Itu tas atau barang bawaan?)",
      "これは てちょう ですか、ノート ですか。 (Ini buku agenda atau buku catatan?)"
    ]
  },
  {
    pattern: "これ / それ / あれ は KB1 の KB2 です",
    explanation: "Benda yang ditunjuk (これ/それ/あれ) menjadi topik utama kalimat. Penjelasannya berupa KB1 の KB2 — menyebut benda sekaligus asal, pemilik, atau jenisnya.",
    examples: [
      "これは にほん の カメラ です。 (Ini adalah kamera Jepang. — 'ini' topik utama.)",
      "それ は わたし の ほん です。 (Itu adalah buku saya.)"
    ]
  },
  {
    pattern: "この / その / あの KB1 は KB2 の です",
    explanation: "KB1 yang ditunjuk dengan この/その/あの menjadi topik utama kalimat. Penjelasannya adalah KB2 の です — menyatakan pemilik atau asal benda itu. Catatan: この/その/あの harus selalu diikuti kata benda, tidak bisa berdiri sendiri.",
    examples: [
      "この かばん は わたし の です。 (Tas ini adalah milik saya. — 'tas ini' topik utama.)",
      "あの くるま は しゃちょう の です。 (Mobil itu adalah milik direktur.)"
    ]
  },
  {
    pattern: "ここ / そこ / あそこ は KB (Tempat) です",
    explanation: "Lokasi yang ditunjuk (ここ/そこ/あそこ) menjadi topik utama kalimat. Penjelasannya adalah nama atau jenis tempat tersebut. ここ = di sini, そこ = di situ, あそこ = di sana.",
    examples: [
      "ここ は きょうしつ です。 (Di sini adalah ruang kelas. — 'di sini' topik utama.)",
      "あそこ は しょくどう です。 (Di sana adalah kafetaria.)"
    ]
  },
  {
    pattern: "KB / Orang / Tempat は ここ / そこ / あそこ です",
    explanation: "Benda, orang, atau tempat yang ingin diketahui lokasinya menjadi topik utama kalimat. Penjelasannya adalah lokasi keberadaannya.",
    examples: [
      "トイレ は あそこ です。 (Toilet ada di sana. — 'toilet' topik utama, lokasinya penjelasannya.)",
      "やまださん は そこ です。 (Yamada-san ada di situ.)"
    ]
  },
  {
    pattern: "KB / Orang / Tempat は Ket.Tempat です",
    explanation: "Benda, orang, atau tempat menjadi topik utama kalimat. Penjelasannya adalah posisi lebih spesifik — lantai berapa, di sebelah apa, di depan apa, dan sebagainya.",
    examples: [
      "じむしょ は 2かい です。 (Kantor ada di lantai 2. — 'kantor' topik utama.)",
      "エレベーター は うけつけ の となり です。 (Lift ada di sebelah resepsionis.)"
    ]
  },
  {
    pattern: "Orang / Tempat は こちら / そちら / あちら です",
    explanation: "Orang atau tempat menjadi topik utama kalimat. Penjelasannya adalah arah keberadaannya menggunakan こちら/そちら/あちら — versi lebih sopan dari ここ/そこ/あそこ. Dipakai dalam situasi formal atau saat melayani tamu.",
    examples: [
      "うけつけ は こちら です。 (Resepsionis ada di sini. — 'resepsionis' topik utama.)",
      "やまださん は あちら です。 (Yamada-san ada di sana.)"
    ]
  },
  {
    pattern: "これ / それ / あれ は Negara / Perusahaan の Benda です",
    explanation: "Benda yang ditunjuk menjadi topik utama kalimat. Penjelasannya menyebut asal negara atau perusahaan dari benda itu menggunakan の.",
    examples: [
      "これは にほん の くるま です。 (Ini adalah mobil Jepang. — 'ini' topik utama.)",
      "それ は IMC の コンピューター です。 (Itu adalah komputer IMC.)"
    ]
  },
  {
    pattern: "Benda は Bilangan + えん です",
    explanation: "Benda yang ingin diketahui harganya menjadi topik utama kalimat. Penjelasannya adalah harganya dalam satuan yen (えん).",
    examples: [
      "この ほん は 1200えん です。 (Buku ini harganya 1200 yen. — 'buku ini' topik utama.)",
      "その かさ は 800えん です。 (Payung itu harganya 800 yen.)"
    ]
  },
  {
    pattern: "いま KW です",
    explanation: "いま (sekarang) menjadi topik utama kalimat. Penjelasannya adalah waktu saat ini. Pola ini dipakai untuk memberitahu jam berapa sekarang.",
    examples: [
      "いま 7じ です。 (Sekarang jam 7. — 'sekarang' topik utama, 'jam 7' penjelasannya.)",
      "いま 9じ はん です。 (Sekarang jam setengah 10.)"
    ]
  },
  {
    pattern: "〜 は Ket.Hari です",
    explanation: "Kegiatan atau acara menjadi topik utama kalimat. Penjelasannya adalah hari pelaksanaannya.",
    examples: [
      "しけん は げつようび です。 (Ujian adalah hari Senin. — 'ujian' topik utama, 'hari Senin' penjelasannya.)",
      "やすみ は にちようび です。 (Hari libur adalah hari Minggu.)"
    ]
  },
  {
    pattern: "〜 は KW1 から KW2 まで です",
    explanation: "Kegiatan atau tempat menjadi topik utama kalimat. Penjelasannya adalah rentang waktunya. から = mulai dari, まで = sampai.",
    examples: [
      "ぎんこう は 9じ から 3じ まで です。 (Bank buka dari jam 9 sampai jam 3. — 'bank' topik utama.)",
      "べんきょう は 7じ から 9じ まで です。 (Belajar dari jam 7 sampai jam 9.)"
    ]
  },
  {
    pattern: "〜 は KW に KK",
    explanation: "Topik utama kalimat melakukan aktivitas pada waktu yang ditandai に. に dipakai untuk waktu spesifik seperti jam atau tanggal. Tidak dipakai untuk kata waktu umum seperti まいにち atau きのう.",
    examples: [
      "わたし は 6じ に おきます。 (Saya bangun jam 6. — 'saya' topik utama, aktivitasnya terjadi 'jam 6'.)",
      "まいにち 11じ に ねます。 (Setiap hari tidur jam 11.)"
    ]
  },
  {
    pattern: "〜 は KW1 から KW2 まで KK",
    explanation: "Topik utama kalimat melakukan aktivitas dalam rentang waktu tertentu. から = mulai, まで = sampai.",
    examples: [
      "わたし は 8じ から 5じ まで はたらきます。 (Saya bekerja dari jam 8 sampai jam 5. — 'saya' topik utama.)",
      "べんきょう は 7じ から 10じ まで します。 (Belajar dari jam 7 sampai jam 10.)"
    ]
  },
  {
    pattern: "KK ます / ません / ました / ませんでした",
    explanation: "Empat bentuk kata kerja sopan. ます = sekarang/akan (positif). ません = sekarang/akan (negatif). ました = sudah terjadi (positif). ませんでした = sudah terjadi (negatif). Hanya akhirannya yang berubah.",
    examples: [
      "きょう べんきょうします。きのう べんきょうしました。 (Hari ini belajar. Kemarin belajar.)",
      "あした はたらきません。おととい はたらきませんでした。 (Besok tidak kerja. Kemarin lusa tidak kerja.)"
    ]
  },
  {
    pattern: "KK ます / ません / ました / ませんでした か",
    explanation: "Bentuk tanya dari keempat pola kata kerja sopan. Tambahkan か di akhir untuk menjadikannya pertanyaan.",
    examples: [
      "きのう べんきょうしましたか。 (Apakah kemarin belajar?)",
      "けさ あさごはん を たべましたか。 (Apakah tadi pagi sarapan?)"
    ]
  },
  {
    pattern: "KB (Tempat) へ いきます / きます / かえります",
    explanation: "Topik utama kalimat bergerak menuju tempat yang ditandai へ. へ menunjukkan arah tujuan. Dipakai bersama tiga kata kerja: いきます (pergi), きます (datang), かえります (pulang).",
    examples: [
      "がっこう へ いきます。 (Pergi ke sekolah.)",
      "うち へ かえります。 (Pulang ke rumah.)"
    ]
  },
  {
    pattern: "KB (Kendaraan) で KB (Tempat) へ いきます / きます / かえります",
    explanation: "Topik utama kalimat menggunakan kendaraan (ditandai で) untuk pergi ke suatu tempat (ditandai へ). で di sini menunjukkan alat atau cara yang dipakai.",
    examples: [
      "でんしゃ で えき へ いきます。 (Pergi ke stasiun naik kereta.)",
      "バス で だいがく へ きます。 (Datang ke kampus naik bus.)"
    ]
  },
  {
    pattern: "KB と KB (Tempat) へ いきます / きます / かえります",
    explanation: "Topik utama kalimat pergi bersama seseorang yang ditandai と. と di sini berarti 'bersama' atau 'dengan'.",
    examples: [
      "ともだち と デパート へ いきます。 (Pergi ke department store bersama teman.)",
      "かぞく と うち へ かえります。 (Pulang ke rumah bersama keluarga.)"
    ]
  },
  {
    pattern: "KB (Waktu) に KB (Tempat) へ いきます / きます / かえります",
    explanation: "Topik utama kalimat bergerak ke suatu tempat (ditandai へ) pada waktu tertentu (ditandai に). Satu kalimat memuat dua informasi sekaligus: kapan dan ke mana.",
    examples: [
      "7じ に がっこう へ いきます。 (Pergi ke sekolah jam 7.)",
      "にちようび に うち へ かえります。 (Pulang ke rumah hari Minggu.)"
    ]
  },
  {
    pattern: "K.Benda を K.Kerja Transitif",
    explanation: "Topik utama kalimat melakukan tindakan pada benda yang ditandai を. を menandai benda yang dikenai tindakan. Kata kerja setelahnya harus membutuhkan objek.",
    examples: [
      "ほん を よみます。 (Membaca buku. — 'buku' dikenai tindakan membaca.)",
      "みず を のみます。 (Minum air. — 'air' dikenai tindakan minum.)"
    ]
  },
  {
    pattern: "K.Benda を します",
    explanation: "Topik utama kalimat melakukan aktivitas yang dinyatakan dengan kata benda + を + します. Pola ini dipakai untuk aktivitas umum seperti olahraga atau mengerjakan tugas.",
    examples: [
      "テニス を します。 (Bermain tenis.)",
      "しゅくだい を します。 (Mengerjakan PR.)"
    ]
  },
  {
    pattern: "なに を しますか",
    explanation: "Pertanyaan untuk menanyakan aktivitas apa yang dilakukan topik utama kalimat. Jawabannya berupa kata benda aktivitas + を します.",
    examples: [
      "にちようび なに を しますか。 (Hari Minggu mau ngapain?)",
      "こんばん なに を しますか。 (Malam ini mau ngapain?)"
    ]
  },
  {
    pattern: "なん dan なに",
    explanation: "Keduanya berarti 'apa'. なに dipakai secara umum. なん dipakai sebelum kata hitung atau bunyi tertentu agar lebih mudah diucapkan — seperti なんさい (umur berapa), なんようび (hari apa).",
    examples: [
      "これは なに ですか。 (Ini apa?)",
      "なんさい ですか。なんようび ですか。 (Umur berapa? Hari apa?)"
    ]
  },
  {
    pattern: "K.Benda (Tempat) で K.Kerja",
    explanation: "Topik utama kalimat melakukan aktivitas di tempat yang ditandai で. で di sini menunjukkan lokasi terjadinya aktivitas. Berbeda dari へ yang menunjukkan tujuan pergerakan.",
    examples: [
      "わたし は とうきょうで おみやげを かいました。 (Saya membeli oleh-oleh di Tokyo. — 'Tokyo' tempat aktivitas membeli.)",
      "レストラン で ごはん を たべます。 (Makan di restoran.)"
    ]
  },
  {
    pattern: "K.Kerja ませんか",
    explanation: "Mengajak lawan bicara melakukan sesuatu dengan sopan. Nuansanya seperti menawarkan pilihan — tidak memaksa. Secara harfiah seperti bertanya 'tidak mau ... kah?'",
    examples: [
      "いっしょに えいが を みませんか。 (Mau nonton film bersama?)",
      "コーヒー を のみませんか。 (Mau minum kopi?)"
    ]
  },
  {
    pattern: "K.Kerja ましょう",
    explanation: "Mengajak lawan bicara melakukan sesuatu secara langsung. Nuansanya seperti 'ayo kita ...' — lebih langsung dari ませんか. Biasanya dipakai saat sudah ada kesepakatan atau dengan teman dekat.",
    examples: [
      "ちょっと やすみましょう。 (Ayo istirahat sebentar.)",
      "いっしょに かえりましょう。 (Ayo pulang bersama.)"
    ]
  },
  {
    pattern: "KB (Alat/Cara) で K.Kerja",
    explanation: "Topik utama kalimat melakukan tindakan menggunakan alat atau cara yang ditandai で. で di sini menjawab pertanyaan 'pakai apa' atau 'dengan cara apa'.",
    examples: [
      "はし で たべます。 (Makan dengan sumpit. — 'sumpit' alat yang dipakai.)",
      "にほんご で かきます。 (Menulis dengan bahasa Jepang.)"
    ]
  },
  {
    pattern: "Kata/Kalimat は 〜ご で Kata/Kalimat です",
    explanation: "Kata atau ungkapan menjadi topik utama kalimat. Penjelasannya adalah padanan kata tersebut dalam bahasa lain yang ditandai で setelah nama bahasanya.",
    examples: [
      "ありがとう は インドネシアご で なん ですか。 ('Arigatou' dalam bahasa Indonesia apa? — 'arigatou' topik utama.)",
      "Thank you は にほんご で ありがとう です。 ('Thank you' dalam bahasa Jepang adalah 'arigatou'.)"
    ]
  },
  {
    pattern: "KB1 (Pemberi) は KB2 (Penerima) に 〜 を あげます",
    explanation: "KB1 (pemberi) adalah topik utama kalimat. Penerima ditandai に, benda yang diberikan ditandai を, dan kata kerjanya あげます. Urutan: pemberi は penerima に benda を あげます.",
    examples: [
      "わたし は ともだち に はな を あげます。 (Saya memberikan bunga kepada teman. — 'saya' topik utama.)",
      "せんせい は わたし に ほん を あげました。 (Guru memberikan buku kepada saya.)"
    ]
  },
  {
    pattern: "KB1 (Penerima) は KB2 (Pemberi) に 〜 を もらいます",
    explanation: "KB1 (penerima) adalah topik utama kalimat. Pemberi ditandai に, benda yang diterima ditandai を, dan kata kerjanya もらいます. Urutan: penerima は pemberi に benda を もらいます.",
    examples: [
      "わたし は ちち に とけい を もらいました。 (Saya mendapat jam tangan dari ayah. — 'saya' topik utama.)",
      "マリアさん は たなかさん に プレゼント を もらいました。 (Maria mendapat hadiah dari Tanaka-san.)"
    ]
  },
  {
    pattern: "もう K.Kerja ました",
    explanation: "もう + ました menyatakan bahwa topik utama kalimat sudah selesai melakukan tindakan tersebut. もう menegaskan bahwa aksinya sudah terjadi.",
    examples: [
      "もう しゅくだい を しました。 (PR sudah dikerjakan.)",
      "もう ひるごはん を たべました。 (Makan siang sudah.)"
    ]
  },
  {
    pattern: "K.Benda は K.Sifat な です / K.Benda は K.Sifat い です",
    explanation: "Kata benda menjadi topik utama kalimat. Penjelasannya adalah kata sifat yang menggambarkan benda tersebut. Catatan penting: きれい dan ゆうめい termasuk na-adjective meski berakhiran い.",
    examples: [
      "この へや は しずか です。 (Kamar ini tenang. — 'kamar ini' topik utama, 'tenang' penjelasannya.)",
      "この まち は きれい です。 (Kota ini indah. — きれい adalah na-adjective.)",
      "あの ひと は ゆうめい です。 (Orang itu terkenal. — ゆうめい adalah na-adjective.)",
      "この ほん は おもしろい です。 (Buku ini menarik.)"
    ]
  },
  {
    pattern: "K.Sifat な + K.Benda / K.Sifat い + K.Benda",
    explanation: "Kata sifat langsung menerangkan kata benda. Na-adjective tambahkan な sebelum kata benda. I-adjective langsung sambung tanpa tambahan. Pengecualian: きれい dan ゆうめい tetap pakai な meski berakhiran い.",
    examples: [
      "しんせつな ひと です。 (Orang yang baik hati. — na-adjective + な + benda.)",
      "きれいな へや です。 (Kamar yang indah. — きれい pakai な.)",
      "ゆうめいな だいがく です。 (Universitas yang terkenal. — ゆうめい pakai な.)",
      "あたらしい くるま です。 (Mobil baru. — i-adjective langsung sambung.)"
    ]
  },
  {
    pattern: "Bentuk negatif sifat: な-adjective / い-adjective",
    explanation: "Cara membuat negatif kata sifat berbeda tergantung jenisnya. Na-adjective: ganti です dengan じゃ ありません. I-adjective: ubah akhiran い menjadi くない です. Ingat: きれい dan ゆうめい adalah na-adjective, jadi pakai じゃ ありません.",
    examples: [
      "この へや は しずか じゃ ありません。 (Kamar ini tidak tenang. — na-adjective.)",
      "この まち は きれい じゃ ありません。 (Kota ini tidak indah. — きれい adalah na-adjective.)",
      "あの ひと は ゆうめい じゃ ありません。 (Orang itu tidak terkenal. — ゆうめい adalah na-adjective.)",
      "この ほん は おもしろくない です。 (Buku ini tidak menarik. — i-adjective: い → くない.)",
      "この くるま は たかくない です。 (Mobil ini tidak mahal. — i-adjective: い → くない.)"
    ]
  },
  {
    pattern: "とても / あまり",
    explanation: "とても dipakai sebelum kata sifat positif, artinya 'sangat'. あまり dipakai sebelum kata sifat negatif, artinya 'tidak begitu'. Jangan pakai あまり dengan kalimat positif.",
    examples: [
      "この えいが は とても おもしろい です。 (Film ini sangat menarik.)",
      "にほんご は あまり むずかしく ありません。 (Bahasa Jepang tidak begitu sulit.)"
    ]
  },
  {
    pattern: "K.Benda は どうですか",
    explanation: "Benda, tempat, atau situasi menjadi topik utama kalimat. Penanya menanyakan pendapat atau kesan lawan bicara tentang topik tersebut dengan どうですか.",
    examples: [
      "にほん の せいかつ は どうですか。 (Kehidupan di Jepang bagaimana? — 'kehidupan di Jepang' topik utama.)",
      "この くるま は どうですか。 (Mobil ini bagaimana menurut kamu?)"
    ]
  },
  {
    pattern: "K.Benda1 は どんな K.Benda2 ですか",
    explanation: "KB1 menjadi topik utama kalimat. Penanya menanyakan seperti apa jenis atau karakter dari topik tersebut menggunakan どんな. Jawaban biasanya berisi kata sifat.",
    examples: [
      "にほんご は どんな ことば ですか。 (Bahasa Jepang itu bahasa yang seperti apa? — 'bahasa Jepang' topik utama.)",
      "たなかさん は どんな ひと ですか。 (Tanaka-san itu orang yang seperti apa?)"
    ]
  },
  {
    pattern: "Kalimat 1 が、Kalimat 2",
    explanation: "Dua kalimat dihubungkan dengan が yang berarti 'tetapi'. Bagian pertama berisi satu fakta tentang topik, bagian kedua berisi fakta lain yang kontras.",
    examples: [
      "この へや は きれい ですが、せまい です。 (Kamar ini indah, tapi sempit.)",
      "この えいが は おもしろい ですが、ちょっと ながい です。 (Film ini seru, tapi agak panjang.)"
    ]
  },
  {
    pattern: "どれ",
    explanation: "どれ dipakai untuk menanyakan 'yang mana' di antara tiga pilihan atau lebih. Topik utama pertanyaan adalah benda yang ingin dipilih.",
    examples: [
      "あなた の かばん は どれ ですか。 (Tas kamu yang mana? — 'tas kamu' topik utama.)",
      "どれ が すき ですか。 (Yang mana yang kamu suka?)"
    ]
  },
  {
    pattern: "K.Benda が あります / わかります",
    explanation: "Topik utama kalimat (ditandai は) memiliki atau memahami sesuatu yang ditandai が. あります = mempunyai / ada. わかります = memahami. Benda yang dimiliki atau dipahami ditandai が, bukan を.",
    examples: [
      "わたし は おかね が あります。 (Saya mempunyai uang. — 'saya' topik utama, 'uang' yang dimiliki ditandai が.)",
      "わたし は げつようび に やくそく が あります。 (Saya ada janji hari Senin.)",
      "わたし は にほんご が わかります。 (Saya memahami bahasa Jepang. — 'bahasa Jepang' yang dipahami ditandai が.)",
      "わたし は えいご が わかりません。 (Saya tidak memahami bahasa Inggris.)"
    ]
  },
  {
    pattern: "K.Benda が すきです / きらいです / じょうずです / へたです",
    explanation: "Topik utama kalimat (ditandai は) memiliki perasaan atau kemampuan tertentu terhadap sesuatu yang ditandai が. Benda yang disukai, tidak disukai, atau yang menjadi bidang kemampuan selalu ditandai が.",
    examples: [
      "わたし は スポーツ が すき です。 (Saya suka olahraga. — 'saya' topik utama, 'olahraga' yang disukai ditandai が.)",
      "おかあさん は やきゅう が きらい です。 (Ibu tidak suka baseball.)",
      "サントスさん は りょうり が じょうず です。 (Santos pandai memasak.)",
      "わたし は すうがく が へた です。 (Saya tidak pandai matematika.)"
    ]
  },
  {
    pattern: "よく / だいたい / すこし / あまり / ぜんぜん + K.Kerja (tingkat)",
    explanation: "Kata keterangan ini menyatakan seberapa tinggi atau rendah kemampuan atau pemahaman topik utama kalimat. よく dan だいたい untuk kalimat positif. すこし untuk positif tapi sedikit. あまり dan ぜんぜん harus diikuti bentuk negatif.",
    examples: [
      "ジョンさん は スペインご が よく わかります。 (John memahami bahasa Spanyol dengan baik.)",
      "にほんご が だいたい わかります。 (Bahasa Jepang kira-kira mengerti.)",
      "すこし わかります。 (Sedikit mengerti.)",
      "まつもとさん は ドイツご が ぜんぜん わかりません。 (Matsumoto sama sekali tidak mengerti bahasa Jerman.)",
      "ちゅうごくご が あまり わかりません。 (Bahasa Mandarin tidak begitu mengerti.)"
    ]
  },
  {
    pattern: "たくさん / すこし / あまり / ぜんぜん + K.Kerja (kuantitas)",
    explanation: "Kata keterangan ini menyatakan banyak atau sedikitnya sesuatu yang dimiliki atau ada. たくさん untuk kalimat positif artinya banyak. すこし untuk positif artinya sedikit. あまり dan ぜんぜん harus diikuti bentuk negatif.",
    examples: [
      "タワポンさん は おかね が たくさん あります。 (Tawapon mempunyai banyak uang.)",
      "ここ に ほん が すこし あります。 (Di sini ada sedikit buku.)",
      "ここ は もり が あまり ありません。 (Di sini tidak begitu banyak hutan.)",
      "じかん が ぜんぜん ありません。 (Tidak ada waktu sama sekali.)"
    ]
  },
  {
    pattern: "Kalimat 1 から、Kalimat 2",
    explanation: "Kalimat pertama berisi alasan, kalimat kedua berisi akibat atau keputusan. から artinya 'karena'. Urutan di bahasa Jepang: alasan dulu baru akibatnya — kebalikan dari bahasa Indonesia.",
    examples: [
      "いそがしい です から、テレビ を みません。 (Tidak nonton TV, karena sibuk. — alasan dulu, akibat belakangan.)",
      "にほんご が わかりません から、アニメ を みません。 (Tidak nonton anime, karena tidak mengerti bahasa Jepang.)",
      "じかん が ありません から、りょこう を しません。 (Tidak jalan-jalan, karena tidak ada waktu.)"
    ]
  },
  {
    pattern: "どうして + Kalimat? / ... から",
    explanation: "どうして dipakai untuk menanyakan alasan. Jawabannya selalu diakhiri から. Pasangan yang tidak terpisahkan: tanya pakai どうして, jawab pakai から.",
    examples: [
      "どうして きょうと へ いきませんか。 (Kenapa tidak pergi ke Kyoto?)",
      "やくそく が あります から。 (Karena ada janji.)",
      "どうして はやく かえりますか。 (Kenapa pulang lebih awal?)",
      "こども の たんじょうび です から。 (Karena ulang tahun anak saya.)"
    ]
  },

  // ===== BAB 10 =====
  {
    pattern: "[KB] が あります / います",
    explanation: "Menyatakan keberadaan sesuatu di suatu tempat. Benda yang ada ditandai が. あります untuk benda mati dan tumbuhan. います untuk orang dan hewan yang bisa bergerak sendiri.",
    examples: [
      "あそこ に こうえん が あります。 (Di sana ada taman. — taman = benda mati → あります.)",
      "にわ に ねこ が います。 (Di halaman ada kucing. — kucing = hewan → います.)",
      "きょうしつ に せんせい が います。 (Di kelas ada guru. — guru = orang → います.)",
      "あそこ に ポスト が あります。 (Di sana ada kotak pos. — kotak pos = benda mati → あります.)"
    ]
  },
  {
    pattern: "[Posisi/Tempat] に [KB] が あります / います",
    explanation: "Tempat keberadaan ditandai に, benda atau orang yang ada ditandai が. Pola ini menjawab pertanyaan 'di tempat ini ada apa / ada siapa?'",
    examples: [
      "スーパー の となり に きっさてん が あります。 (Di sebelah supermarket ada kafe.)",
      "ドア の みぎ に スイッチ が あります。 (Di sebelah kanan pintu ada saklar.)",
      "さとうさん の まえ に カリナさん が います。 (Di depan Sato ada Karina.)"
    ]
  },
  {
    pattern: "[KB] は [Tempat] に あります / います",
    explanation: "KB menjadi topik utama kalimat. Penjelasannya adalah lokasi keberadaannya yang ditandai に. Pola ini menjawab pertanyaan 'benda/orang ini ada di mana?'",
    examples: [
      "グプタさん は かいぎしつ に います。 (Gupta ada di ruang rapat. — 'Gupta' topik utama.)",
      "きむらさん は あそこ に います。 (Kimura ada di sana.)",
      "じしょ は じむしょ に あります。 (Kamus ada di kantor. — 'kamus' topik utama.)"
    ]
  },
  {
    pattern: "❓ [KB] は どこ に あります / いますか",
    explanation: "KB menjadi topik utama kalimat. Penanya menanyakan lokasi keberadaan topik tersebut dengan どこ (di mana).",
    examples: [
      "じしょ は どこ に ありますか。 (Kamus ada di mana? — 'kamus' topik utama.)",
      "グプタさん は どこ に いますか。 (Gupta ada di mana? — 'Gupta' topik utama.)"
    ]
  },
  {
    pattern: "[KB1] の [Posisi] に [KB2] が あります / います",
    explanation: "Posisi KB2 dijelaskan relatif terhadap KB1. Kata posisi yang sering dipakai: うえ (atas), した (bawah), まえ (depan), うしろ (belakang), みぎ (kanan), ひだり (kiri), なか (dalam), そと (luar), となり (sebelah), ちかく (dekat), あいだ (antara). Catatan: jika diikuti aktivitas, tempat pakai で bukan に.",
    examples: [
      "ゆうびんきょく の となり に ぎんこう が あります。 (Di sebelah kantor pos ada bank.)",
      "まつもとさん の うしろ に いしかわさん が います。 (Di belakang Matsumoto ada Ishikawa.)",
      "テーブル と たな の あいだ に いす が あります。 (Di antara meja dan lemari ada kursi.)",
      "えき の ちかく で ともだち に あいます。 (Bertemu teman di dekat stasiun. — aktivitas → pakai で.)"
    ]
  },
  {
    pattern: "[KB1] や [KB2] (など)",
    explanation: "や menyebutkan beberapa benda sebagai contoh — tidak semuanya disebutkan. Berbeda dari と yang menyebutkan semua benda secara lengkap. Tambahkan など di akhir untuk menegaskan masih ada benda lain.",
    examples: [
      "はこ の なか に てがみ や しゃしん など が あります。 (Di dalam kotak ada surat, foto, dan lainnya. — masih ada benda lain yang tidak disebutkan.)",
      "ベッド の うえ に かみ や じしょ が あります。 (Di atas kasur ada kertas dan kamus.)",
      "かいぎしつ の なか に ミラーさん や やまださん など が います。 (Di dalam ruang rapat ada Miller, Yamada, dan lainnya.)"
    ]
  }
];