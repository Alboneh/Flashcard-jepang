const bunpoDatabase = [
  {
    pattern: "KB1 は KB2 です",
    explanation: "Ini pola kalimat nominal paling dasar dalam bahasa Jepang. Pola ini dipakai untuk menyatakan identitas atau kategori, jadi artinya KB1 adalah KB2.",
    examples: [
      "わたし は がくせい です。 (Saya adalah pelajar.)",
      "たなかさん は せんせい です。 (Tanaka-san adalah guru.)"
    ],
    bab: "Bab 1",
  },
  {
    pattern: "KB1 は KB2 では ありません / じゃ ありません",
    explanation: "Ini bentuk negatif dari kalimat nominal dasar. Pola ini dipakai saat ingin menyangkal informasi, jadi artinya KB1 bukan KB2.",
    examples: [
      "わたし は いしゃ では ありません。 (Saya bukan dokter.)",
      "あのひと は がくせい じゃ ありません。 (Orang itu bukan pelajar.)"
    ],
    bab: "Bab 1",
  },
  {
    pattern: "KB1 は KB2 ですか",
    explanation: "Ini bentuk tanya dari kalimat nominal. Tambahkan か di akhir kalimat untuk menandai bahwa kalimat tersebut adalah pertanyaan.",
    examples: [
      "あなた は せんせい ですか。 (Apakah Anda guru?)",
      "ミラーさん は アメリカじん ですか。 (Apakah Miller-san orang Amerika?)"
    ],
    bab: "Bab 1",
  },
  {
    pattern: "KB1 は KB2 の KB3 です",
    explanation: "Partikel の dipakai untuk menghubungkan dua kata benda dalam satu frasa. Fungsinya biasanya untuk menunjukkan milik, asal, afiliasi, atau jenis dari kata benda yang dijelaskan.",
    examples: [
      "わたし は IMC の しゃいん です。 (Saya karyawan IMC.)",
      "これは にほん の ほん です。 (Ini buku Jepang.)"
    ],
    bab: "Bab 1",
  },
  {
    pattern: "KB1 は KB2 です。KB3 も KB2 です",
    explanation: "Partikel も artinya juga. Dipakai ketika informasi pada kalimat berikutnya sama atau sejenis dengan informasi pada kalimat sebelumnya.",
    examples: [
      "サントスさん は がくせい です。わたし も がくせい です。 (Santos seorang mahasiswa. Saya juga seorang mahasiswa.)",
      "たなかさん は にほんじん です。やまださん も にほんじん です。 (Tanaka orang Jepang. Yamada juga orang Jepang.)"
    ],
    bab: "Bab 1",
  },
  {
    pattern: "KB1 は KB2 さい です",
    explanation: "Pola ini dipakai untuk menyebut umur seseorang. Angka umur diletakkan sebelum さい, lalu diakhiri です untuk bentuk sopan.",
    examples: [
      "わたし は 20さい です。 (Saya 20 tahun.)",
      "むすめ は 7さい です。 (Anak perempuan saya 7 tahun.)"
    ],
    bab: "Bab 1",
  },
  {
    pattern: "これ / それ / あれ は KB1 です",
    explanation: "Pola ini dipakai untuk menunjuk benda. これ dipakai untuk benda yang dekat pembicara, それ untuk benda yang dekat lawan bicara, dan あれ untuk benda yang jauh dari keduanya.",
    examples: [
      "これ は じしょ です。 (Ini kamus.)",
      "あれ は かさ です。 (Itu payung di sana.)"
    ],
    bab: "Bab 2",
  },
  {
    pattern: "それ は KB1 ですか、KB2 ですか",
    explanation: "Ini pola pertanyaan pilihan. Dipakai saat penanya memberi dua opsi dan menanyakan apakah sesuatu itu A atau B.",
    examples: [
      "それ は かばん ですか、にもつ ですか。 (Itu tas atau barang/bagasi?)",
      "これは てちょう ですか、ノート ですか。 (Ini buku saku/agenda atau buku catatan?)"
    ],
    bab: "Bab 2",
  },
  {
    pattern: "これ / それ / あれ は KB1 の KB2 です",
    explanation: "Pola ini dipakai untuk menyebut suatu benda sekaligus keterangan asal, pemilik, atau jenisnya menggunakan partikel の. Bagian sebelum の berfungsi sebagai penjelas untuk benda setelahnya.",
    examples: [
      "これは にほん の カメラ です。 (Ini kamera buatan/dari Jepang.)",
      "それ は わたし の ほん です。 (Itu buku saya.)"
    ],
    bab: "Bab 2",
  },
  {
    pattern: "この / その / あの KB1 は KB2 の です",
    explanation: "この/その/あの selalu dipakai langsung di depan kata benda, tidak berdiri sendiri. Pola ini dipakai untuk menunjuk benda tertentu, lalu KB2 の です menjelaskan pemilik atau asal benda itu.",
    examples: [
      "この かばん は わたし の です。 (Tas ini milik saya.)",
      "あの くるま は しゃちょう の です。 (Mobil itu (jauh) milik direktur.)"
    ],
    bab: "Bab 2",
  },
  {
    pattern: "ここ / そこ / あそこ は KB (Tempat) です",
    explanation: "Pola ini dipakai untuk menyebutkan lokasi suatu tempat. ここ berarti di sini, そこ di situ, dan あそこ di sana.",
    examples: [
      "ここ は きょうしつ です。 (Di sini adalah ruang kelas.)",
      "あそこ は しょくどう です。 (Di sana (jauh) adalah kantin.)"
    ],
    bab: "Bab 3",
  },
  {
    pattern: "KB / Orang / Tempat は ここ / そこ / あそこ です",
    explanation: "Pada pola ini, topiknya adalah benda/orang/tempat yang dibicarakan, lalu diikuti keterangan lokasinya. Jadi urutannya: sebut objek dulu, baru sebut di mana posisinya.",
    examples: [
      "トイレ は あそこ です。 (Toiletnya di sana (jauh).)",
      "やまださん は そこ です。 (Yamada ada di situ.)"
    ],
    bab: "Bab 3",
  },
  {
    pattern: "KB / Orang / Tempat は Ket.Tempat です",
    explanation: "Pola ini dipakai untuk menjelaskan posisi suatu benda atau orang secara lebih spesifik, misalnya di lantai berapa, di samping apa, atau di depan apa.",
    examples: [
      "じむしょ は 2かい です。 (Kantornya di lantai 2.)",
      "エレベーター は うけつけ の となり です。 (Liftnya di sebelah meja resepsionis.)"
    ],
    bab: "Bab 3",
  },
  {
    pattern: "Orang / Tempat は こちら / そちら / あちら です",
    explanation: "こちら/そちら/あちら adalah bentuk yang lebih sopan daripada ここ/そこ/あそこ. Pola ini sering dipakai saat berbicara dengan tamu, pelanggan, atau situasi formal.",
    examples: [
      "うけつけ は こちら です。 (Meja resepsionisnya ke arah sini.)",
      "やまださん は あちら です。 (Yamada ada di sebelah sana (sopan).)"
    ],
    bab: "Bab 3",
  },
  {
    pattern: "これ / それ / あれ は Negara / Perusahaan の Benda です",
    explanation: "Pola ini dipakai untuk menyebut asal suatu benda, misalnya dari negara atau perusahaan tertentu. Keterangan asal diletakkan sebelum partikel の.",
    examples: [
      "これは にほん の くるま です。 (Ini mobil buatan Jepang.)",
      "それ は IMC の コンピューター です。 (Itu komputer (buatan) IMC.)"
    ],
    bab: "Bab 3",
  },
  {
    pattern: "Benda は Bilangan + えん です",
    explanation: "Pola ini dipakai untuk menyebut harga barang. Bilangan diletakkan sebelum えん untuk menyatakan nilai dalam mata uang yen.",
    examples: [
      "この ほん は 1200えん です。 (Buku ini harganya 1.200 yen.)",
      "その かさ は 800えん です。 (Payung itu harganya 800 yen.)"
    ],
    bab: "Bab 3",
  },
  {
    pattern: "いま KW です",
    explanation: "Pola ini dipakai untuk memberitahu waktu sekarang. Biasanya digunakan saat menjawab pertanyaan jam berapa sekarang.",
    examples: [
      "いま 7じ です。 (Sekarang pukul 7.)",
      "いま 9じ はん です。 (Sekarang pukul setengah 10 / jam 9:30.)"
    ],
    bab: "Bab 4",
  },
  {
    pattern: "〜 は Ket.Hari です",
    explanation: "Pola ini dipakai untuk menyebut hari pelaksanaan suatu kegiatan, jadwal, atau acara. Bagian sebelum は adalah kegiatan, bagian setelahnya adalah harinya.",
    examples: [
      "しけん は げつようび です。 (Ujian (diadakan) hari Senin.)",
      "やすみ は にちようび です。 (Hari liburnya hari Minggu.)"
    ],
    bab: "Bab 4",
  },
  {
    pattern: "〜 は KW1 から KW2 まで です",
    explanation: "Pola ini dipakai untuk menyebut rentang waktu. から berarti dari dan まで berarti sampai.",
    examples: [
      "ぎんこう は 9じ から 3じ まで です。 (Bank buka dari jam 9 sampai jam 3.)",
      "べんきょう は 7じ から 9じ まで です。 (Belajarnya dari jam 7 sampai jam 9.)"
    ],
    bab: "Bab 4",
  },
  {
    pattern: "〜 は KW に KK",
    explanation: "Partikel に dipakai untuk menunjukkan titik waktu terjadinya kegiatan, seperti jam atau tanggal tertentu. Pola ini umum dipakai untuk kebiasaan atau jadwal.",
    examples: [
      "わたし は 6じ に おきます。 (Saya bangun jam 6.)",
      "まいにち 11じ に ねます。 (Setiap hari saya tidur jam 11.)"
    ],
    bab: "Bab 4",
  },
  {
    pattern: "〜 は KW1 から KW2 まで KK",
    explanation: "Pola ini menjelaskan kegiatan yang berlangsung dalam rentang waktu tertentu. Gunakan から untuk waktu mulai dan まで untuk waktu selesai.",
    examples: [
      "わたし は 8じ から 5じ まで はたらきます。 (Saya bekerja dari jam 8 sampai jam 5.)",
      "べんきょう は 7じ から 10じ まで します。 (Belajar dilakukan dari jam 7 sampai jam 10.)"
    ],
    bab: "Bab 4",
  },
  {
    pattern: "KK ます / ません / ました / ませんでした",
    explanation: "Ini empat bentuk dasar kata kerja sopan yang harus dikuasai pemula: sekarang positif, sekarang negatif, lampau positif, dan lampau negatif. Pola ini dipakai untuk menyatakan aktivitas pada waktu yang berbeda.",
    examples: [
      "きょう べんきょうします。きのう べんきょうしました。 (Hari ini belajar. Kemarin (sudah) belajar.)",
      "あした はたらきません。おととい はたらきませんでした。 (Besok tidak akan bekerja. Kemarin lusa tidak bekerja.)"
    ],
    bab: "Bab 4",
  },
  {
    pattern: "KK ます / ません / ました / ませんでした か",
    explanation: "Ini bentuk tanya dari keempat pola kata kerja sopan. Cara membuatnya sederhana: gunakan pola verb yang sesuai, lalu tambahkan か di akhir.",
    examples: [
      "きのう べんきょうしましたか。 (Apakah kemarin (kamu) belajar?)",
      "けさ あさごはん を たべましたか。 (Apakah tadi pagi (kamu) sudah sarapan?)"
    ],
    bab: "Bab 4",
  },
  {
    pattern: "KB (Tempat) へ いきます / きます / かえります",
    explanation: "Partikel へ dipakai untuk menunjukkan arah tujuan pergerakan. Pola ini dipakai bersama kata kerja pergi, datang, dan pulang.",
    examples: [
      "がっこう へ いきます。 (Pergi ke sekolah.)",
      "うち へ かえります。 (Pulang ke rumah.)"
    ],
    bab: "Bab 5",
  },
  {
    pattern: "KB (Kendaraan) で KB (Tempat) へ いきます / きます / かえります",
    explanation: "Partikel で pada pola ini menunjukkan alat transportasi yang dipakai untuk bergerak ke suatu tempat. Misalnya naik kereta, bus, atau taksi.",
    examples: [
      "でんしゃ で えき へ いきます。 (Pergi ke stasiun naik kereta.)",
      "バス で だいがく へ きます。 (Datang ke kampus naik bus.)"
    ],
    bab: "Bab 5",
  },
  {
    pattern: "KB と KB (Tempat) へ いきます / きます / かえります",
    explanation: "Partikel と pada pola ini berarti bersama atau dengan seseorang. Dipakai untuk menyebut teman perjalanan saat pergi, datang, atau pulang.",
    examples: [
      "ともだち と デパート へ いきます。 (Pergi ke department store bersama teman.)",
      "かぞく と うち へ かえります。 (Pulang ke rumah bersama keluarga.)"
    ],
    bab: "Bab 5",
  },
  {
    pattern: "KB (Waktu) に KB (Tempat) へ いきます / きます / かえります",
    explanation: "Pola ini menggabungkan dua informasi penting dalam satu kalimat: kapan pergerakan terjadi dan ke mana tujuannya. Waktu biasanya ditandai dengan に.",
    examples: [
      "7じ に がっこう へ いきます。 (Pergi ke sekolah jam 7.)",
      "にちようび に うち へ かえります。 (Pulang ke rumah hari Minggu.)"
    ],
    bab: "Bab 5",
  },
  {
    pattern: "K.Benda を K.Kerja Transitif",
    explanation: "Partikel を menandai objek langsung yang dikenai tindakan. Pola ini dipakai saat kata kerja membutuhkan objek, seperti membaca buku atau minum air.",
    examples: [
      "ほん を よみます。 (Membaca buku.)",
      "みず を のみます。 (Minum air.)"
    ],
    bab: "Bab 6",
  },
  {
    pattern: "K.Benda を します",
    explanation: "Pola ini dipakai untuk aktivitas umum yang berpasangan dengan します, seperti olahraga, belajar, atau mengerjakan tugas. Kata benda aktivitas diletakkan sebelum を します.",
    examples: [
      "テニス を します。 (Bermain tenis.)",
      "しゅくだい を します。 (Mengerjakan PR.)"
    ],
    bab: "Bab 6",
  },
  {
    pattern: "なに を しますか",
    explanation: "Ini pola pertanyaan untuk menanyakan aktivitas yang dilakukan atau akan dilakukan. Jawabannya biasanya berupa K.Benda を します atau kata kerja aktivitas lain.",
    examples: [
      "にちようび なに を しますか。 (Hari Minggu mau melakukan apa?)",
      "こんばん なに を しますか。 (Malam ini mau melakukan apa?)"
    ],
    bab: "Bab 6",
  },
  {
    pattern: "なん dan なに",
    explanation: "なに dan なん sama-sama berarti apa, tetapi pemakaiannya tergantung kata setelahnya. なん sering dipakai sebelum kata hitung atau bunyi tertentu agar pengucapan lebih alami.",
    examples: [
      "これは なに ですか。 (Ini apa? — menanyakan jenis benda.)",
      "なんさい ですか。なんようび ですか。 (Berapa umurmu? Hari apa? — pertanyaan dengan unit/penggolong.)"
    ],
    bab: "Bab 6",
  },
  {
    pattern: "K.Benda (Tempat) で K.Kerja",
    explanation: "Partikel で pada pola ini menunjukkan lokasi terjadinya aktivitas, bukan arah tujuan. Jadi fokusnya adalah tempat melakukan tindakan.",
    examples: [
      "わたし は とうきょうで おみやげを かいました。 (Saya membeli oleh-oleh di Tokyo.)",
      "レストラン で ごはん を たべます。 (Makan di restoran.)"
    ],
    bab: "Bab 6",
  },
  {
    pattern: "K.Kerja ませんか",
    explanation: "K.Kerja ませんか adalah bentuk ajakan yang halus dan sopan. Nuansanya seperti menawarkan: mau ...? atau bagaimana kalau ...?",
    examples: [
      "いっしょに えいが を みませんか。 (Maukah nonton film bersama? — ajakan sopan.)",
      "コーヒー を のみませんか。 (Maukah minum kopi? — tawaran sopan.)"
    ],
    bab: "Bab 6",
  },
  {
    pattern: "K.Kerja ましょう",
    explanation: "K.Kerja ましょう adalah bentuk ajakan yang lebih langsung. Nuansanya seperti ayo atau mari kita melakukan sesuatu bersama.",
    examples: [
      "ちょっと やすみましょう。 (Ayo istirahat sebentar.)",
      "いっしょに かえりましょう。 (Ayo pulang bersama.)"
    ],
    bab: "Bab 6",
  },
  {
    pattern: "KB (Alat/Cara) で K.Kerja",
    explanation: "Pola ini dipakai untuk menyebut alat, sarana, atau cara yang dipakai saat melakukan tindakan. Bagian sebelum で menjawab pertanyaan pakai apa.",
    examples: [
      "はし で たべます。 (Makan dengan sumpit.)",
      "にほんご で かきます。 (Menulis dengan bahasa Jepang.)"
    ],
    bab: "Bab 6",
  },
  {
    pattern: "Kata/Kalimat は 〜ご で Kata/Kalimat です",
    explanation: "Pola ini dipakai untuk menanyakan atau menyebutkan bagaimana suatu kata diucapkan dalam bahasa lain. Struktur ini sering dipakai saat belajar kosakata lintas bahasa.",
    examples: [
      "ありがとう は インドネシアご で なん ですか。 ('Arigatou' dalam bahasa Indonesia apa?)",
      "Thank you は にほんご で ありがとう です。 ('Thank you' dalam bahasa Jepang adalah 'arigatou'.)"
    ],
    bab: "Bab 6",
  },
  {
    pattern: "KB1 (Pemberi) は KB2 (Penerima) に 〜 を あげます",
    explanation: "Ini pola memberi dengan kata kerja あげます. Urutannya jelas: pemberi は penerima に benda を あげます.",
    examples: [
      "わたし は ともだち に はな を あげます。 (Saya memberi bunga kepada teman.)",
      "せんせい は わたし に ほん を あげました。 (Guru memberi buku kepada saya.)"
    ],
    bab: "Bab 7",
  },
  {
    pattern: "KB1 (Penerima) は KB2 (Pemberi) に 〜 を もらいます",
    explanation: "Ini pola menerima dengan kata kerja もらいます. Urutannya: penerima は pemberi に benda を もらいます.",
    examples: [
      "わたし は ちち に とけい を もらいました。 (Saya menerima jam tangan dari ayah.)",
      "マリアさん は たなかさん に プレゼント を もらいました。 (Maria menerima hadiah dari Tanaka.)"
    ],
    bab: "Bab 7",
  },
  {
    pattern: "もう K.Kerja ました",
    explanation: "もう + ました dipakai untuk menyatakan bahwa suatu tindakan sudah selesai dilakukan. Nuansanya menekankan bahwa aksinya sudah terjadi sekarang.",
    examples: [
      "もう しゅくだい を しました。 (Sudah mengerjakan PR.)",
      "もう ひるごはん を たべました。 (Sudah makan siang.)"
    ],
    bab: "Bab 7",
  },
  {
    pattern: "K.Benda は K.Sifat な です / K.Benda は K.Sifat い です",
    explanation: "Pola ini dipakai saat kata sifat berfungsi sebagai predikat kalimat. Perhatikan pengecualian penting: きれい dan ゆうめい tetap termasuk na-adjective walaupun berakhiran い.",
    examples: [
      "この へや は しずか です。 (Ruangan ini tenang.)",
      "この まち は きれい です。 (Kota ini indah/bersih. — きれい tetap na-adjective)",
      "あの ひと は ゆうめい です。 (Orang itu terkenal. — ゆうめい tetap na-adjective)",
      "この ほん は おもしろい です。 (Buku ini menarik.)"
    ],
    bab: "Bab 8",
  },
  {
    pattern: "K.Sifat な + K.Benda / K.Sifat い + K.Benda",
    explanation: "Pola ini dipakai saat kata sifat langsung digabungkan dengan kata benda. Jika kata sifatnya na-adjective, tambahkan な sebelum kata benda. Jika kata sifatnya i-adjective, langsung sambung tanpa な. Pengecualian yang harus diingat: きれい dan ゆうめい tetap pakai な walaupun berakhiran い.",
    examples: [
      "しんせつな ひと です。 (Orang yang ramah/baik hati.)",
      "きれいな へや です。 (Ruangan yang indah/bersih.)",
      "ゆうめいな だいがく です。 (Universitas yang terkenal.)",
      "あたらしい くるま です。 (Mobil yang baru.)"
    ],
    bab: "Bab 8",
  },
  {
    pattern: "Bentuk negatif sifat: な-adjective / い-adjective",
    explanation: "Untuk membuat bentuk negatif kata sifat, aturannya berbeda tergantung jenisnya. Na-adjective memakai じゃ ありません, sedangkan i-adjective diubah dengan mengganti akhiran い menjadi くない です.",
    examples: [
      "この へや は しずか じゃ ありません。 (Ruangan ini tidak tenang.)",
      "この まち は きれい じゃ ありません。 (Kota ini tidak indah. — きれい = na-adjective)",
      "あの ひと は ゆうめい じゃ ありません。 (Orang itu tidak terkenal. — ゆうめい = na-adjective)",
      "この ほん は おもしろくない です。 (Buku ini tidak menarik.)",
      "この くるま は たかくない です。 (Mobil ini tidak mahal.)"
    ],
    bab: "Bab 8",
  },
  {
    pattern: "とても / あまり",
    explanation: "とても dipakai untuk memperkuat makna positif, setara dengan sangat. あまり biasanya dipakai bersama bentuk negatif dan artinya menjadi tidak begitu.",
    examples: [
      "この えいが は とても おもしろい です。 (Film ini sangat menarik.)",
      "にほんご は あまり むずかしく ありません。 (Bahasa Jepang tidak terlalu sulit.)"
    ],
    bab: "Bab 8",
  },
  {
    pattern: "K.Benda は どうですか",
    explanation: "Pola ini dipakai untuk menanyakan pendapat, kesan, atau kondisi tentang sesuatu. Bisa dipakai untuk benda, orang, tempat, maupun situasi.",
    examples: [
      "にほん の せいかつ は どうですか。 (Bagaimana kehidupan di Jepang?)",
      "この くるま は どうですか。 (Bagaimana mobil ini?)"
    ],
    bab: "Bab 8",
  },
  {
    pattern: "K.Benda1 は どんな K.Benda2 ですか",
    explanation: "どんな dipakai untuk menanyakan seperti apa jenis, karakter, atau sifat dari kata benda yang disebut setelahnya. Jawaban biasanya berisi kata sifat atau deskripsi.",
    examples: [
      "にほんご は どんな ことば ですか。 (Bahasa Jepang itu bahasa yang seperti apa?)",
      "たなかさん は どんな ひと ですか。 (Tanaka itu orang yang seperti apa?)"
    ],
    bab: "Bab 8",
  },
  {
    pattern: "Kalimat 1 が、Kalimat 2",
    explanation: "Partikel が pada pola ini berfungsi sebagai penghubung antarkalimat dengan makna tetapi atau namun. Dipakai saat bagian belakang kalimat berisi kontras terhadap bagian depan.",
    examples: [
      "この へや は きれい ですが、せまい です。 (Ruangan ini bersih, tapi sempit.)",
      "この えいが は おもしろい ですが、ちょっと ながい です。 (Film ini menarik, tapi agak panjang.)"
    ],
    bab: "Bab 8",
  },
  {
    pattern: "どれ",
    explanation: "どれ dipakai untuk menanyakan yang mana di antara tiga pilihan atau lebih. Jika hanya dua pilihan, biasanya digunakan pola pertanyaan pilihan lain.",
    examples: [
      "あなた の かばん は どれ ですか。 (Tasmu yang mana?)",
      "どれ が すき ですか。 (Suka yang mana?)"
    ],
    bab: "Bab 8",
  },
  {
    pattern: "K.Benda が あります / わかります",
    explanation: "Pada pola ini, objek ditandai partikel が, bukan を. Partikel が dipakai untuk menandai hal yang sedang dijelaskan atau dideskripsikan dalam kalimat. あります dipakai untuk menyatakan keberadaan atau kepemilikan, sedangkan わかります dipakai untuk menyatakan paham atau tidak paham.",
    examples: [
      "わたし は おかね が あります。 (Saya memiliki uang.)",
      "わたし は げつようび に やくそく が あります。 (Saya ada janji di hari Senin.)",
      "わたし は にほんご が わかります。 (Saya paham bahasa Jepang.)",
      "わたし は えいご が わかりません。 (Saya tidak paham bahasa Inggris.)"
    ],
    bab: "Bab 9",
  },
  {
    pattern: "K.Benda が すきです / きらいです / じょうずです / へたです",
    explanation: "Pola ini dipakai untuk menyatakan suka, tidak suka, pandai, atau tidak pandai terhadap suatu hal. Objek hal yang dibicarakan ditandai dengan partikel が. Dalam pola ini, が menandai hal yang sedang dijelaskan atau dideskripsikan oleh kata sifat seperti すき, きらい, じょうず, dan へた.",
    examples: [
      "わたし は スポーツ が すき です。 (Saya suka olahraga.)",
      "おかあさん は やきゅう が きらい です。 (Ibu tidak suka baseball.)",
      "サントスさん は りょうり が じょうず です。 (Santos pandai memasak.)",
      "わたし は すうがく が へた です。 (Saya tidak pandai matematika.)"
    ],
    bab: "Bab 9",
  },
  {
    pattern: "よく / だいたい / すこし / あまり / ぜんぜん + K.Kerja (tingkat)",
    explanation: "Kata keterangan ini dipakai sebelum kata kerja untuk menyatakan seberapa tinggi atau rendah tingkat pemahaman atau kemampuan seseorang. よく dan だいたい dipakai untuk kalimat positif, artinya dengan baik dan kira-kira. すこし untuk positif tapi sedikit. あまり dan ぜんぜん dipakai untuk kalimat negatif, artinya tidak begitu dan sama sekali tidak.",
    examples: [
      "ジョンさん は スペインご が よく わかります。 (John memahami bahasa Spanyol dengan baik.)",
      "にほんご が だいたい わかります。 (Bahasa Jepang kira-kira mengerti.)",
      "すこし わかります。 (Sedikit mengerti.)",
      "まつもとさん は ドイツご が ぜんぜん わかりません。 (Matsumoto sama sekali tidak mengerti bahasa Jerman.)",
      "ちゅうごくご が あまり わかりません。 (Bahasa Mandarin tidak begitu mengerti.)"
    ],
    bab: "Bab 9",
  },
  {
    pattern: "たくさん / すこし / あまり / ぜんぜん + K.Kerja (kuantitas)",
    explanation: "Kata keterangan ini dipakai sebelum kata kerja untuk menyatakan banyak atau sedikitnya sesuatu. たくさん dipakai untuk kalimat positif artinya banyak. すこし untuk positif artinya sedikit. あまり dan ぜんぜん dipakai untuk kalimat negatif artinya tidak begitu banyak dan sama sekali tidak ada.",
    examples: [
      "タワポンさん は おかね が たくさん あります。 (Tawapon mempunyai banyak uang.)",
      "ここ に ほん が すこし あります。 (Di sini ada sedikit buku.)",
      "ここ は もり が あまり ありません。 (Di sini tidak begitu banyak hutan.)",
      "じかん が ぜんぜん ありません。 (Tidak ada waktu sama sekali.)"
    ],
    bab: "Bab 9",
  },
  {
    pattern: "Kalimat 1 から、Kalimat 2",
    explanation: "から artinya karena atau sebab. Bagian sebelum から berisi alasan, sedangkan bagian setelahnya berisi hasil, akibat, atau keputusan.",
    examples: [
      "いそがしい です から、テレビ を みません。 (Tidak menonton TV, karena sibuk.)",
      "にほんご が わかりません から、アニメ を みません。 (Tidak menonton anime, karena tidak paham bahasa Jepang.)",
      "じかん が ありません から、りょこう を しません。 (Tidak bertamasya, karena tidak ada waktu.)"
    ],
    bab: "Bab 9",
  },
  {
    pattern: "どうして + Kalimat? / ... から",
    explanation: "どうして dipakai untuk menanyakan alasan terjadinya sesuatu. Jawaban yang natural biasanya menyebut alasan lalu diakhiri dengan から.",
    examples: [
      "どうして きょうと へ いきませんか。 (Mengapa tidak pergi ke Kyoto?)",
      "やくそく が あります から。 (Karena ada janji.)",
      "どうして あさ しんぶん を よみませんか。 (Mengapa tidak baca koran saat pagi?)",
      "じかん が ありません から。 (Karena tidak ada waktu.)",
      "どうして はやく かえりますか。 (Mengapa pulang lebih awal?)",
      "こども の たんじょうび です から。 (Karena anak saya ulang tahun.)"
    ],
    bab: "Bab 9",
  },

  // ===== BAB 10 =====
  {
    pattern: "[KB] が あります / います",
    explanation: "あります dipakai untuk menyatakan keberadaan benda mati dan tumbuhan. います dipakai untuk orang atau hewan yang bergerak sendiri. Objeknya ditandai dengan partikel が.",
    examples: [
      "あそこ に こうえん が あります。 (Di sana ada taman.)",
      "にわ に ねこ が います。 (Di halaman ada kucing.)",
      "きょうしつ に せんせい が います。 (Di kelas ada guru.)",
      "あそこ に ポスト が あります。 (Di sana ada kotak pos.)"
    ],
    bab: "Bab 10",
  },
  {
    pattern: "[Posisi/Tempat] に [KB] が あります / います",
    explanation: "Pola ini menyatakan keberadaan benda atau orang di suatu tempat. Tempat keberadaan ditandai dengan partikel に. Untuk menanyakan benda gunakan なに が ありますか, untuk orang gunakan だれ が いますか.",
    examples: [
      "スーパー の となり に きっさてん が あります。 (Di sebelah supermarket ada coffee shop.)",
      "ドア の みぎ に スイッチ が あります。 (Di sebelah kanan pintu ada saklar.)",
      "さとうさん の まえ に カリナさん が います。 (Di depan Sato ada Karina.)"
    ],
    bab: "Bab 10",
  },
  {
    pattern: "[KB] は [Tempat] に あります / います",
    explanation: "Pola ini menyatakan keberadaan suatu benda atau orang di suatu tempat. KB sebagai topik diletakkan sebelum は, lalu tempat ditandai dengan に. Bentuk lain: [KB] は [Tempat] です.",
    examples: [
      "グプタさん は かいぎしつ に います。 (Gupta ada di ruang rapat.)",
      "きむらさん は あそこ に います。 (Kimura ada di sana.)",
      "じしょ は じむしょ に あります。 (Kamus ada di kantor.)"
    ],
    bab: "Bab 10",
  },
  {
    pattern: "❓ [KB] は どこ に あります / いますか",
    explanation: "Pertanyaan untuk menanyakan letak atau keberadaan suatu benda atau orang. どこ berarti 'di mana'.",
    examples: [
      "じしょ は どこ に ありますか。 (Kamus ada di mana?)",
      "グプタさん は どこ に いますか。 (Gupta ada di mana?)"
    ],
    bab: "Bab 10",
  },
  {
    pattern: "[KB1, Orang, Tempat] の [Posisi] に [KB2] が あります / います",
    explanation: "Pola ini menyatakan posisi KB2 relatif terhadap KB1. Kata posisi yang sering dipakai: うえ、した、まえ、うしろ、みぎ、ひだり、なか、そと、となり、ちかく、あいだ. Catatan: jika diikuti aksi, tempat diberi partikel で, bukan に.",
    examples: [
      "ゆうびんきょく の となり に ぎんこう が あります。 (Di sebelah kantor pos ada bank.)",
      "まつもとさん の うしろ に いしかわさん が います。 (Di belakang Matsumoto ada Ishikawa.)",
      "テーブル と たな の あいだ に いす が あります。 (Di antara meja dan lemari ada kursi.)",
      "えき の ちかく で ともだち に あいます。 (Saya bertemu teman di dekat stasiun.)"
    ],
    bab: "Bab 10",
  },
  {
    pattern: "[KB1] や [KB2] (など)",
    explanation: "Partikel や dipakai untuk menyebutkan beberapa benda secara setara sebagai perwakilan dari banyak hal lain (tidak semuanya disebutkan). Berbeda dengan と yang menyebutkan semua secara lengkap. Tambahkan など di akhir untuk menegaskan masih ada benda lain yang tidak disebutkan, artinya 'dan lainnya'.",
    examples: [
      "はこ の なか に てがみ や しゃしん など が あります。 (Di dalam kotak ada surat, foto, dan lainnya.)",
      "ベッド の うえ に かみ や じしょ が あります。 (Di atas kasur ada kertas dan kamus.)",
      "かいぎしつ の なか に ミラーさん や やまださん など が います。 (Di dalam ruang rapat ada Miller, Yamada, dan lainnya.)"
    ],
    bab: "Bab 10",
  },

  // ===== BAB 11 =====
  {
    pattern: "(KB) が (Ket. jumlah) あります",
    explanation: "Pola ini dipakai untuk bilang jumlah benda yang tidak terlalu besar (hitungan buah). Benda diberi partikel が, lalu jumlahnya diletakkan sebelum あります.",
    examples: [
      "りんご が とお あります。 (Ada 10 buah apel.)",
      "みかん が むっつ あります。 (Ada 6 buah jeruk.)",
      "スイカ が ひとつ あります。 (Ada 1 buah semangka.)",
      "❓ KB が いくつ ありますか。 (Ada berapa buah KB?)"
    ],
    bab: "Bab 11",
  },
  {
    pattern: "(Ket) の (KB) を (Ket. jumlah) かいました",
    explanation: "Pola ini dipakai untuk bilang jenis barang dan jumlah yang dibeli. Partikel を dipakai karena diikuti kata kerja かいました (membeli).",
    examples: [
      "りんご の ジュース を 2ほん かいました。 (Saya membeli 2 botol jus apel.)",
      "きって を 5まい かいました。 (Saya membeli 5 lembar perangko.)",
      "くるま を 1だい かいました。 (Saya membeli 1 unit mobil.)"
    ],
    bab: "Bab 11",
  },
  {
    pattern: "(KB) が (Jumlah orang) 人 です / います",
    explanation: "Pola ini dipakai untuk menyebut jumlah orang dalam kelompok atau di suatu tempat. Kalau mau bilang kira-kira, tambahkan ぐらい setelah angka.",
    examples: [
      "この クラス に りゅうがくせい が 4人 います。 (Di kelas ini ada 4 pelajar asing.)",
      "かぞく が 6人 います。 (Keluarga saya ada 6 orang.)",
      "かいしゃ の しゃいん が 100人 ぐらい います。 (Ada kira-kira 100 karyawan perusahaan.)",
      "❓ なんにん ぐらい いますか。 (Ada kira-kira berapa orang?)"
    ],
    bab: "Bab 11",
  },
  {
    pattern: "(Ket waktu) に (berapa kali) かい (KB) を (KK)",
    explanation: "Pola ini dipakai untuk bilang frekuensi kegiatan dalam kurun waktu tertentu. 回(かい) artinya kali, jadi angka + かい menunjukkan berapa kali aktivitas dilakukan.",
    examples: [
      "1しゅうかん に 1かい えいが を みます。 (Menonton film 1 kali dalam seminggu.)",
      "1かげつ に 8かい ぐらい ほん を かります。 (Meminjam buku kira-kira 8 kali dalam sebulan.)",
      "1ねん に 5かい ワイン を のみます。 (Minum wine 5 kali dalam setahun.)",
      "❓ Ket. waktu に なんかい KB を KK か。 (Dalam Ket. waktu, berapa kali melakukan KK?)"
    ],
    bab: "Bab 11",
  },
  {
    pattern: "(Ket durasi) (KB) を (KK)",
    explanation: "Pola ini dipakai untuk bilang lamanya melakukan aktivitas. Keterangan durasi bisa tahun, bulan, minggu, hari, jam, menit, dan seterusnya.",
    examples: [
      "くに で 5しゅうかん にほんご を べんきょうしました。 (Di negara saya belajar bahasa Jepang selama 5 minggu.)",
      "こうこう で 3ねんかん クラブ に さんかしました。 (Ikut klub di SMA selama 3 tahun.)",
      "7にちかん りょこう を します。 (Bertamasya selama 7 hari.)",
      "❓ くに で どのくらい Ket. durasi KB を KK か。 (Di negara, melakukan KB selama berapa lama?)"
    ],
    bab: "Bab 11",
  },
  {
    pattern: "(A) から (B) まで (Transportasi) で (Durasi) かかります",
    explanation: "Pola ini dipakai untuk bilang waktu tempuh dari titik awal ke titik tujuan dengan alat transportasi tertentu. から artinya dari, まで artinya sampai, dan かかります artinya memerlukan waktu.",
    examples: [
      "わたし の くに から にほん まで ひこうき で 5じかんはん かかります。 (Dari negara saya sampai Jepang perlu 5 jam setengah dengan pesawat.)",
      "おおさか から なら まで くるま で 1じかん かかります。 (Dari Osaka sampai Nara perlu 1 jam dengan mobil.)",
      "❓ A から B まで Transportasi で どのくらい かかりますか。 (Dari A ke B dengan transportasi itu butuh berapa lama?)"
    ],
    bab: "Bab 11",
  },

  // ===== BAB 12 =====
  {
    pattern: "～は [K.Benda]/[K.Sifat(な)] ～です/でした/じゃありません/じゃありませんでした",
    explanation: "Pola ini untuk menyatakan sifat, keadaan, atau karakter dari subjek. Digunakan mengubah kata sifat [な] (na-adjective) dan kata benda menurut bentuk dan waktunya. Pertanyaan: どうでしたか?",
    examples: [
      "サントスさん は 元気(げんき) です。 (Santos sehat.)",
      "きのう は 雨(あめ) でした。 (Kemarin hujan.)",
      "セーター は とても すてき でした。 (Sweater sangat bagus.)",
      "雨(あめ) じゃ ありません でした。 (Tidak hujan.)"
    ],
    bab: "Bab 12",
  },
  {
    pattern: "～は [K.Sifat(い)] ～いです/かったです/くないです/くなかったです",
    explanation: "Pola ini untuk menyatakan sifat, keadaan, atau karakter dari subjek. Digunakan mengubah kata sifat [い] (i-adjective) menurut bentuk dan waktunya. Pertanyaan: どうでしたか?",
    examples: [
      "先週(せんしゅう) の りょこう は たのしかった です。 (Liburan minggu lalu menyenangkan.)",
      "パーティー の 料理(りょうり) は おいしかった です。 (Masakan di pesta enak.)",
      "さむい です。 (Dingin.)",
      "おいしくない です。 (Tidak enak.)"
    ],
    bab: "Bab 12",
  },
  {
    pattern: "[K.Benda 1]は [K.Benda 2]より [K.Sifat]です",
    explanation: "Pola ini untuk menyatakan perbandingan keadaan/kualitas antara dua benda. 「より」 berarti lebih ~ dibandingkan ~, sebagai penanda perbandingan.",
    examples: [
      "とうきょう は おおさか より 大(おお)きい です。 (Tokyo lebih besar dibandingkan Osaka.)",
      "ボゴール は ソロ より すずしい です。 (Bogor lebih sejuk dibandingkan Solo.)",
      "この シャツ は その シャツ より やすい です。 (Kemeja ini lebih murah dibandingkan kemeja itu.)"
    ],
    bab: "Bab 12",
  },
  {
    pattern: "[K.Benda 1] と [K.Benda 2] と どちらが [K.Sifat]ですか",
    explanation: "Pola ini untuk membandingkan 2 hal (benda, tempat, atau orang). Partikel 「と」 setelah kedua benda menandai perbandingan. Jawaban pakai 「～の ほうが」 untuk memilih salah satu, atau 「どちらも」 untuk menyatakan sama.",
    examples: [
      "ほん と えいが と どちらが おもしろい ですか。 (Yang mana lebih menarik, buku atau film?)",
      "えいが の ほうが おもしろい です。 (Film yang lebih menarik.)",
      "どちらも にぎやか です。 (Dua-duanya ramai.)",
      "どちらも ひま じゃ ありません。 (Dua-duanya tidak senggang.)"
    ],
    bab: "Bab 12",
  },
  {
    pattern: "[K.Benda]の 中(なか)で なに/どこ/だれ/いつが いちばん [K.Sifat]ですか",
    explanation: "Pola ini untuk memilih salah satu dari kelompok benda/tempat/orang/waktu yang memiliki tingkatan 'paling' dari kategori itu. 「の 中で」 artinya di antara ~. 「いちばん」 artinya paling.",
    examples: [
      "お母(かあ)さん の 料理(りょうり) の なか で なに が いちばん おいしい ですか。 (Di antara masakan ibu, masakan apa paling enak?)",
      "カレー が いちばん おいしい です。 (Kare paling enak.)",
      "せかい の なか で どこ が いちばん きれい ですか。 (Di manakah tempat paling indah di dunia?)",
      "おきなわ が いちばん きれい です。 (Okinawa paling indah.)"
    ],
    bab: "Bab 12",
  },

  // ===== BAB 13 =====
  {
    pattern: "[K.Benda] が ほしい",
    explanation: "Pola ini dipakai untuk menyatakan keinginan memiliki suatu benda. Benda yang diinginkan ditandai dengan partikel が, lalu diikuti ほしい (ingin).",
    examples: [
      "わたし は あたらしい コンピューター が ほしい です。 (Saya ingin punya komputer baru.)",
      "きむらさん は すうじゅつ が ほしい です。 (Kimura ingin punya jam tangan.)",
      "むすこ は あたらしい おもちゃ が ほしい です。 (Anak saya ingin punya mainan baru.)"
    ],
    bab: "Bab 13",
  },
  {
    pattern: "[K.Kerja-~~ます~~] たい",
    explanation: "Pola ini dipakai untuk menyatakan keinginan melakukan suatu aktivitas. Gunakan bentuk kata kerja tanpa ます, lalu tambahkan たい. Untuk bentuk sopan, gunakan たいです.",
    examples: [
      "わたし は にほん へ いきたい です。 (Saya ingin pergi ke Jepang.)",
      "ともだち と えいが を みたい です。 (Saya ingin nonton film dengan teman.)",
      "らいねん りょこう を したい です。 (Tahun depan saya ingin bertamasya.)"
    ],
    bab: "Bab 13",
  },
  {
    pattern: "[KB Tempat] へ [K.Kerja non-~~ます~~] に",
    explanation: "Pola ini menyatakan tujuan aktivitas (bukan hanya tujuan tempat). Partikel へ menunjukkan ke mana, partikel に menunjukkan untuk apa pergi ke sana.",
    examples: [
      "がっこう へ べんきょう に いきます。 (Pergi ke sekolah untuk belajar.)",
      "きっさてん へ コーヒー を のみ に きました。 (Datang ke kafe untuk minum kopi.)",
      "こうえん へ あそび に いきましょう。 (Mari pergi ke taman untuk bermain.)"
    ],
    bab: "Bab 13",
  },
  {
    pattern: "[K.Benda に K.Kerja] / [K.Benda を K.Kerja]",
    explanation: "Pola ini menunjukkan arah masuk (に) atau keluar (を) dari tempat atau kendaraan. Partikel に untuk memasuki, partikel を untuk keluar.",
    examples: [
      "へや に はいります。 (Masuk ke ruangan.)",
      "へや を でます。 (Keluar dari ruangan.)",
      "でんしゃ に のります。 (Naik kereta.)",
      "でんしゃ を おります。 (Turun dari kereta.)"
    ],
    bab: "Bab 13",
  },
  {
    pattern: "どこか / なにか",
    explanation: "どこか berarti suatu tempat yang tidak spesifik (di mana saja, di mana-mana), sedangkan なにか berarti sesuatu yang tidak spesifik. Keduanya digunakan saat tidak tahu atau tidak penting tempat/benda yang spesifik.",
    examples: [
      "どこか へ いきたい です。 (Saya ingin pergi ke mana-mana.)",
      "なにか を たべたい です。 (Saya ingin makan sesuatu.)",
      "きのう どこか で ともだち に あいました。 (Kemarin saya bertemu teman di suatu tempat.)"
    ],
    bab: "Bab 13",
  },

  // ===== BAB 14 =====
  {
    pattern: "[K.Kerja] → 形(-て)",
    explanation: "📌 APA ITU BENTUK -て?\nBentuk -て adalah salah satu bentuk perubahan kata kerja Jepang. Bentuk ini TIDAK dipakai sendirian — ia selalu digabung dengan kata/pola lain.\n\n🎯 UNTUK APA DIPAKAI?\nBentuk -て adalah 'lem' untuk menyambung kata kerja ke pola lain. Beberapa fungsi utamanya:\n  1. Meminta dengan sopan → V-て ください ('Tolong ~')\n  2. Menyatakan sedang berlangsung → V-て います ('sedang ~')\n  3. Meminta izin → V-て も いいですか ('Bolehkah ~?')\n  4. Larangan → V-て は いけません ('Tidak boleh ~')\n  5. Menyambung 2 aktivitas berurutan → V-て, V (lakukan A lalu B)\n\nIntinya: kalau ingin pakai pola-pola di atas, kata kerjanya WAJIB diubah ke bentuk -て dulu.\n\n📝 ATURAN PERUBAHAN (lihat golongan kata kerja):\n\n● GOLONGAN 1 (akhiran bentuk kamus: う/つ/る/む/ぶ/ぬ/く/ぐ/す):\n  • ～う・～つ・～る → ～って\n  • ～む・～ぶ・～ぬ → ～んで\n  • ～く → ～いて  (*kecuali いく → いって, khusus)\n  • ～ぐ → ～いで\n  • ～す → ～して\n\n● GOLONGAN 2 (umumnya akhiran -iru / -eru):\n  • る → て  (たべる→たべて, みる→みて)\n\n● GOLONGAN 3 (tak beraturan, hanya 2 kata):\n  • する → して\n  • くる → きて",
    examples: [
      "[Gol 1・の む] まいあさ コーヒー を のんで、しんぶん を よみます。 (Setiap pagi minum kopi lalu baca koran — menyambung 2 aktivitas)",
      "[Gol 1・か く] ノート に なまえ を かいて ください。 (Tolong tulis nama Anda di buku catatan — permintaan sopan)",
      "[Gol 1・い く] あした わたし は がっこう へ いって、ともだち に あいます。 (Besok saya pergi ke sekolah lalu bertemu teman — いく khusus → いって)",
      "[Gol 1・か う] スーパー で たまご を かって ください。 (Tolong belikan telur di supermarket — pola ～う→～って)",
      "[Gol 1・およ ぐ] こども が プール で およいで います。 (Anak-anak sedang berenang di kolam — pola ～ぐ→～いで, sedang berlangsung)",
      "[Gol 2・た べる] いま ばんごはん を たべて います。 (Sekarang saya sedang makan malam — る→て + います)",
      "[Gol 2・み る] この えいが を みて ください。 (Tolong tonton film ini — る→て + ください)",
      "[Gol 2・ね る] はやく ねて ください。 (Tolong tidur lebih awal — る→て + ください)",
      "[Gol 3・す る] ここ で べんきょう して も いいですか。 (Bolehkah saya belajar di sini? — する→して + も いいですか, minta izin)",
      "[Gol 3・く る] あした 9じ に きて ください。 (Tolong datang besok jam 9 — くる→きて + ください)"
    ],
    bab: "Bab 14",
  },
  {
    pattern: "[K.Kerja-て] ください",
    explanation: "Pola ini dipakai untuk membuat permintaan atau perintah dengan sopan. Gunakan bentuk -て dari kata kerja, lalu tambahkan ください (silakan / tolong).",
    examples: [
      "ここ に すわって ください。 (Silakan duduk di sini.)",
      "ほん を よんで ください。 (Tolong baca buku itu.)",
      "もう いちど いって ください。 (Silakan ulangi/katakan sekali lagi.)"
    ],
    bab: "Bab 14",
  },
  {
    pattern: "[K.Kerja-て] ます",
    explanation: "Pola ini dipakai untuk menyatakan tindakan yang sedang berlangsung atau sudah dimulai dan masih terus berlanjut. Bentuk ini menunjukkan keadaan/kondisi yang sedang terjadi.",
    examples: [
      "なに を して いますか。 (Apa yang sedang Anda lakukan?)",
      "いま しごと を して います。 (Sekarang saya sedang bekerja.)",
      "ともだち は えいが を みて います。 (Teman sedang menonton film.)"
    ],
    bab: "Bab 14",
  },
  {
    pattern: "[K.Kerja-ます] ましょうか",
    explanation: "Pola ini dipakai untuk menawarkan atau menyarankan sesuatu dengan sopan. Artinya seperti 'bagaimana kalau ~?' atau 'mari kita ~?' bersama-sama.",
    examples: [
      "コーヒー を のみましょうか。 (Bagaimana kalau kita minum kopi?)",
      "一緒(いっしょ) に いきましょうか。 (Bagaimana kalau kita pergi bersama?)",
      "ちょっと やすみましょうか。 (Mari kita istirahat sebentar.)"
    ],
    bab: "Bab 14",
  },
  {
    pattern: "KB が～ (Fenomena/Fakta Objektif)",
    explanation: "Pola ini dipakai untuk menyatakan fenomena atau fakta yang sedang terjadi. Partikel が menandai subjek yang sedang dijelaskan. Berbeda dengan は yang menandai topik, が lebih menunjuk pada apa yang sedang terjadi.",
    examples: [
      "はる が きました。 (Musim semi sudah tiba.)",
      "ゆき が ふっています。 (Salju sedang turun.)",
      "はな が さいています。 (Bunga sedang mekar.)",
      "ともだち が きました。 (Ada teman yang datang.)"
    ],
    bab: "Bab 14",
  },

  // ===== BAB 15 =====
  {
    pattern: "[K.Kerja-て] も いいですか",
    explanation: "Pola ini dipakai untuk meminta izin dengan sopan. Artinya 'bolehkah saya ~?' atau 'apakah OK jika saya ~?'",
    examples: [
      "このペンを つかっても いいですか。 (Bolehkah saya gunakan pena ini?)",
      "ここに すわっても いいですか。 (Bolehkah saya duduk di sini?)",
      "もう いちど いってもいいですか。 (Bolehkah saya ulangi/katakan sekali lagi?)"
    ],
    bab: "Bab 15",
  },
  {
    pattern: "[K.Kerja-て] は いけません",
    explanation: "Pola ini dipakai untuk mengekspresikan larangan atau melarang sesuatu. Artinya 'tidak boleh ~' atau 'jangan ~'.",
    examples: [
      "ここに くるまを とめては いけません。 (Tidak boleh memarkirkan mobil di sini.)",
      "おさけを のんでは いけません。 (Tidak boleh minum alkohol.)",
      "ここで しゃしんを とっては いけません。 (Tidak boleh memfoto di sini.)"
    ],
    bab: "Bab 15",
  },
  {
    pattern: "[K.Benda] に [K.Kerja: はいります / すわります / のります]",
    explanation: "Tiga kata kerja ini selalu memakai partikel に: はいります (masuk), すわります (duduk), のります (naik). Di Bab 15 pola ini sering digabung dengan bentuk izin/larangan (〜てもいいですか, 〜てはいけません) atau permintaan (〜てください) supaya kata kerjanya berfungsi penuh dalam konteks aturan dan instruksi.",
    examples: [
      "ここ に はいっては いけません。 (Tidak boleh masuk di sini.)",
      "ここ に すわっても いいですか。 (Bolehkah saya duduk di sini?)",
      "とうきょうえき から 4ばん の バス に のって ください。 (Silakan naik bus nomor 4 dari stasiun Tokyo.)"
    ],
    bab: "Bab 15",
  },
  {
    pattern: "[K.Kerja-て] います",
    explanation: "Pola ini punya 2 fungsi: (1) Keadaan/state - aktivitas sedang berlangsung. (2) Kebiasaan/status pekerjaan - menunjukkan pekerjaan atau status saat ini.",
    examples: [
      "わたし は かながわ に すんで います。 (Saya tinggal di Kanagawa. = state)",
      "わたし は げっこん して います。 (Saya sudah menikah. = state)",
      "わたし は かいしゃ で はたらいて います。 (Saya bekerja di perusahaan. = job status)"
    ],
    bab: "Bab 15",
  }
];

