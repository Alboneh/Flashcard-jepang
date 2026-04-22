const bunpoDatabase = [
  {
    pattern: "KB1 は KB2 です",
    explanation: "Ini pola kalimat nominal paling dasar dalam bahasa Jepang. Pola ini dipakai untuk menyatakan identitas atau kategori, jadi artinya KB1 adalah KB2.",
    examples: [
      "わたし は がくせい です。 (Saya adalah pelajar.)",
      "たなかさん は せんせい です。 (Tanaka-san adalah guru.)"
    ]
  },
  {
    pattern: "KB1 は KB2 では ありません / じゃ ありません",
    explanation: "Ini bentuk negatif dari kalimat nominal dasar. Pola ini dipakai saat ingin menyangkal informasi, jadi artinya KB1 bukan KB2.",
    examples: [
      "わたし は いしゃ では ありません。 (Saya bukan dokter.)",
      "あのひと は がくせい じゃ ありません。 (Orang itu bukan pelajar.)"
    ]
  },
  {
    pattern: "KB1 は KB2 ですか",
    explanation: "Ini bentuk tanya dari kalimat nominal. Tambahkan か di akhir kalimat untuk menandai bahwa kalimat tersebut adalah pertanyaan.",
    examples: [
      "あなた は せんせい ですか。 (Apakah Anda guru?)",
      "ミラーさん は アメリカじん ですか。 (Apakah Miller-san orang Amerika?)"
    ]
  },
  {
    pattern: "KB1 は KB2 の KB3 です",
    explanation: "Partikel の dipakai untuk menghubungkan dua kata benda dalam satu frasa. Fungsinya biasanya untuk menunjukkan milik, asal, afiliasi, atau jenis dari kata benda yang dijelaskan.",
    examples: [
      "わたし は IMC の しゃいん です。 (Saya karyawan IMC.)",
      "これは にほん の ほん です。 (Ini buku Jepang.)"
    ]
  },
  {
    pattern: "KB1 は KB2 です。KB3 も KB2 です",
    explanation: "Partikel も artinya juga. Dipakai ketika informasi pada kalimat berikutnya sama atau sejenis dengan informasi pada kalimat sebelumnya.",
    examples: [
      "サントスさん は がくせい です。わたし も がくせい です。",
      "たなかさん は にほんじん です。やまださん も にほんじん です。"
    ]
  },
  {
    pattern: "KB1 は KB2 さい です",
    explanation: "Pola ini dipakai untuk menyebut umur seseorang. Angka umur diletakkan sebelum さい, lalu diakhiri です untuk bentuk sopan.",
    examples: [
      "わたし は 20さい です。 (Saya 20 tahun.)",
      "むすめ は 7さい です。 (Anak perempuan saya 7 tahun.)"
    ]
  },
  {
    pattern: "これ / それ / あれ は KB1 です",
    explanation: "Pola ini dipakai untuk menunjuk benda. これ dipakai untuk benda yang dekat pembicara, それ untuk benda yang dekat lawan bicara, dan あれ untuk benda yang jauh dari keduanya.",
    examples: [
      "これ は じしょ です。 (Ini kamus.)",
      "あれ は かさ です。 (Itu payung di sana.)"
    ]
  },
  {
    pattern: "それ は KB1 ですか、KB2 ですか",
    explanation: "Ini pola pertanyaan pilihan. Dipakai saat penanya memberi dua opsi dan menanyakan apakah sesuatu itu A atau B.",
    examples: [
      "それ は かばん ですか、にもつ ですか。",
      "これは てちょう ですか、ノート ですか。"
    ]
  },
  {
    pattern: "これ / それ / あれ は KB1 の KB2 です",
    explanation: "Pola ini dipakai untuk menyebut suatu benda sekaligus keterangan asal, pemilik, atau jenisnya menggunakan partikel の. Bagian sebelum の berfungsi sebagai penjelas untuk benda setelahnya.",
    examples: [
      "これは にほん の カメラ です。",
      "それ は わたし の ほん です。"
    ]
  },
  {
    pattern: "この / その / あの KB1 は KB2 の です",
    explanation: "この/その/あの selalu dipakai langsung di depan kata benda, tidak berdiri sendiri. Pola ini dipakai untuk menunjuk benda tertentu, lalu KB2 の です menjelaskan pemilik atau asal benda itu.",
    examples: [
      "この かばん は わたし の です。",
      "あの くるま は しゃちょう の です。"
    ]
  },
  {
    pattern: "ここ / そこ / あそこ は KB (Tempat) です",
    explanation: "Pola ini dipakai untuk menyebutkan lokasi suatu tempat. ここ berarti di sini, そこ di situ, dan あそこ di sana.",
    examples: [
      "ここ は きょうしつ です。",
      "あそこ は しょくどう です。"
    ]
  },
  {
    pattern: "KB / Orang / Tempat は ここ / そこ / あそこ です",
    explanation: "Pada pola ini, topiknya adalah benda/orang/tempat yang dibicarakan, lalu diikuti keterangan lokasinya. Jadi urutannya: sebut objek dulu, baru sebut di mana posisinya.",
    examples: [
      "トイレ は あそこ です。",
      "やまださん は そこ です。"
    ]
  },
  {
    pattern: "KB / Orang / Tempat は Ket.Tempat です",
    explanation: "Pola ini dipakai untuk menjelaskan posisi suatu benda atau orang secara lebih spesifik, misalnya di lantai berapa, di samping apa, atau di depan apa.",
    examples: [
      "じむしょ は 2かい です。",
      "エレベーター は うけつけ の となり です。"
    ]
  },
  {
    pattern: "Orang / Tempat は こちら / そちら / あちら です",
    explanation: "こちら/そちら/あちら adalah bentuk yang lebih sopan daripada ここ/そこ/あそこ. Pola ini sering dipakai saat berbicara dengan tamu, pelanggan, atau situasi formal.",
    examples: [
      "うけつけ は こちら です。",
      "やまださん は あちら です。"
    ]
  },
  {
    pattern: "これ / それ / あれ は Negara / Perusahaan の Benda です",
    explanation: "Pola ini dipakai untuk menyebut asal suatu benda, misalnya dari negara atau perusahaan tertentu. Keterangan asal diletakkan sebelum partikel の.",
    examples: [
      "これは にほん の くるま です。",
      "それ は IMC の コンピューター です。"
    ]
  },
  {
    pattern: "Benda は Bilangan + えん です",
    explanation: "Pola ini dipakai untuk menyebut harga barang. Bilangan diletakkan sebelum えん untuk menyatakan nilai dalam mata uang yen.",
    examples: [
      "この ほん は 1200えん です。",
      "その かさ は 800えん です。"
    ]
  },
  {
    pattern: "いま KW です",
    explanation: "Pola ini dipakai untuk memberitahu waktu sekarang. Biasanya digunakan saat menjawab pertanyaan jam berapa sekarang.",
    examples: [
      "いま 7じ です。",
      "いま 9じ はん です。"
    ]
  },
  {
    pattern: "〜 は Ket.Hari です",
    explanation: "Pola ini dipakai untuk menyebut hari pelaksanaan suatu kegiatan, jadwal, atau acara. Bagian sebelum は adalah kegiatan, bagian setelahnya adalah harinya.",
    examples: [
      "しけん は げつようび です。",
      "やすみ は にちようび です。"
    ]
  },
  {
    pattern: "〜 は KW1 から KW2 まで です",
    explanation: "Pola ini dipakai untuk menyebut rentang waktu. から berarti dari dan まで berarti sampai.",
    examples: [
      "ぎんこう は 9じ から 3じ まで です。",
      "べんきょう は 7じ から 9じ まで です。"
    ]
  },
  {
    pattern: "〜 は KW に KK",
    explanation: "Partikel に dipakai untuk menunjukkan titik waktu terjadinya kegiatan, seperti jam atau tanggal tertentu. Pola ini umum dipakai untuk kebiasaan atau jadwal.",
    examples: [
      "わたし は 6じ に おきます。",
      "まいにち 11じ に ねます。"
    ]
  },
  {
    pattern: "〜 は KW1 から KW2 まで KK",
    explanation: "Pola ini menjelaskan kegiatan yang berlangsung dalam rentang waktu tertentu. Gunakan から untuk waktu mulai dan まで untuk waktu selesai.",
    examples: [
      "わたし は 8じ から 5じ まで はたらきます。",
      "べんきょう は 7じ から 10じ まで します。"
    ]
  },
  {
    pattern: "KK ます / ません / ました / ませんでした",
    explanation: "Ini empat bentuk dasar kata kerja sopan yang harus dikuasai pemula: sekarang positif, sekarang negatif, lampau positif, dan lampau negatif. Pola ini dipakai untuk menyatakan aktivitas pada waktu yang berbeda.",
    examples: [
      "きょう べんきょうします。きのう べんきょうしました。",
      "あした はたらきません。おととい はたらきませんでした。"
    ]
  },
  {
    pattern: "KK ます / ません / ました / ませんでした か",
    explanation: "Ini bentuk tanya dari keempat pola kata kerja sopan. Cara membuatnya sederhana: gunakan pola verb yang sesuai, lalu tambahkan か di akhir.",
    examples: [
      "きのう べんきょうしましたか。",
      "けさ あさごはん を たべましたか。"
    ]
  },
  {
    pattern: "KB (Tempat) へ いきます / きます / かえります",
    explanation: "Partikel へ dipakai untuk menunjukkan arah tujuan pergerakan. Pola ini dipakai bersama kata kerja pergi, datang, dan pulang.",
    examples: [
      "がっこう へ いきます。",
      "うち へ かえります。"
    ]
  },
  {
    pattern: "KB (Kendaraan) で KB (Tempat) へ いきます / きます / かえります",
    explanation: "Partikel で pada pola ini menunjukkan alat transportasi yang dipakai untuk bergerak ke suatu tempat. Misalnya naik kereta, bus, atau taksi.",
    examples: [
      "でんしゃ で えき へ いきます。",
      "バス で だいがく へ きます。"
    ]
  },
  {
    pattern: "KB と KB (Tempat) へ いきます / きます / かえります",
    explanation: "Partikel と pada pola ini berarti bersama atau dengan seseorang. Dipakai untuk menyebut teman perjalanan saat pergi, datang, atau pulang.",
    examples: [
      "ともだち と デパート へ いきます。",
      "かぞく と うち へ かえります。"
    ]
  },
  {
    pattern: "KB (Waktu) に KB (Tempat) へ いきます / きます / かえります",
    explanation: "Pola ini menggabungkan dua informasi penting dalam satu kalimat: kapan pergerakan terjadi dan ke mana tujuannya. Waktu biasanya ditandai dengan に.",
    examples: [
      "7じ に がっこう へ いきます。",
      "にちようび に うち へ かえります。"
    ]
  },
  {
    pattern: "K.Benda を K.Kerja Transitif",
    explanation: "Partikel を menandai objek langsung yang dikenai tindakan. Pola ini dipakai saat kata kerja membutuhkan objek, seperti membaca buku atau minum air.",
    examples: [
      "ほん を よみます。",
      "みず を のみます。"
    ]
  },
  {
    pattern: "K.Benda を します",
    explanation: "Pola ini dipakai untuk aktivitas umum yang berpasangan dengan します, seperti olahraga, belajar, atau mengerjakan tugas. Kata benda aktivitas diletakkan sebelum を します.",
    examples: [
      "テニス を します。",
      "しゅくだい を します。"
    ]
  },
  {
    pattern: "なに を しますか",
    explanation: "Ini pola pertanyaan untuk menanyakan aktivitas yang dilakukan atau akan dilakukan. Jawabannya biasanya berupa K.Benda を します atau kata kerja aktivitas lain.",
    examples: [
      "にちようび なに を しますか。",
      "こんばん なに を しますか。"
    ]
  },
  {
    pattern: "なん dan なに",
    explanation: "なに dan なん sama-sama berarti apa, tetapi pemakaiannya tergantung kata setelahnya. なん sering dipakai sebelum kata hitung atau bunyi tertentu agar pengucapan lebih alami.",
    examples: [
      "これは なに ですか。",
      "なんさい ですか。なんようび ですか。"
    ]
  },
  {
    pattern: "K.Benda (Tempat) で K.Kerja",
    explanation: "Partikel で pada pola ini menunjukkan lokasi terjadinya aktivitas, bukan arah tujuan. Jadi fokusnya adalah tempat melakukan tindakan.",
    examples: [
      "わたし は とうきょうで おみやげを かいました。",
      "レストラン で ごはん を たべます。"
    ]
  },
  {
    pattern: "K.Kerja ませんか",
    explanation: "K.Kerja ませんか adalah bentuk ajakan yang halus dan sopan. Nuansanya seperti menawarkan: mau ...? atau bagaimana kalau ...?",
    examples: [
      "いっしょに えいが を みませんか。",
      "コーヒー を のみませんか。"
    ]
  },
  {
    pattern: "K.Kerja ましょう",
    explanation: "K.Kerja ましょう adalah bentuk ajakan yang lebih langsung. Nuansanya seperti ayo atau mari kita melakukan sesuatu bersama.",
    examples: [
      "ちょっと やすみましょう。",
      "いっしょに かえりましょう。"
    ]
  },
  {
    pattern: "KB (Alat/Cara) で K.Kerja",
    explanation: "Pola ini dipakai untuk menyebut alat, sarana, atau cara yang dipakai saat melakukan tindakan. Bagian sebelum で menjawab pertanyaan pakai apa.",
    examples: [
      "はし で たべます。 (Makan dengan sumpit.)",
      "にほんご で かきます。 (Menulis dengan bahasa Jepang.)"
    ]
  },
  {
    pattern: "Kata/Kalimat は 〜ご で Kata/Kalimat です",
    explanation: "Pola ini dipakai untuk menanyakan atau menyebutkan bagaimana suatu kata diucapkan dalam bahasa lain. Struktur ini sering dipakai saat belajar kosakata lintas bahasa.",
    examples: [
      "ありがとう は インドネシアご で なん ですか。",
      "Thank you は にほんご で ありがとう です。"
    ]
  },
  {
    pattern: "KB1 (Pemberi) は KB2 (Penerima) に 〜 を あげます",
    explanation: "Ini pola memberi dengan kata kerja あげます. Urutannya jelas: pemberi は penerima に benda を あげます.",
    examples: [
      "わたし は ともだち に はな を あげます。",
      "せんせい は わたし に ほん を あげました。"
    ]
  },
  {
    pattern: "KB1 (Penerima) は KB2 (Pemberi) に 〜 を もらいます",
    explanation: "Ini pola menerima dengan kata kerja もらいます. Urutannya: penerima は pemberi に benda を もらいます.",
    examples: [
      "わたし は ちち に とけい を もらいました。",
      "マリアさん は たなかさん に プレゼント を もらいました。"
    ]
  },
  {
    pattern: "もう K.Kerja ました",
    explanation: "もう + ました dipakai untuk menyatakan bahwa suatu tindakan sudah selesai dilakukan. Nuansanya menekankan bahwa aksinya sudah terjadi sekarang.",
    examples: [
      "もう しゅくだい を しました。",
      "もう ひるごはん を たべました。"
    ]
  },
  {
    pattern: "K.Benda は K.Sifat な です / K.Benda は K.Sifat い です",
    explanation: "Pola ini dipakai saat kata sifat berfungsi sebagai predikat kalimat. Perhatikan pengecualian penting: きれい dan ゆうめい tetap termasuk na-adjective walaupun berakhiran い.",
    examples: [
      "この へや は しずか です。",
      "この まち は きれい です。 (きれい tetap na-adjective)",
      "あの ひと は ゆうめい です。 (ゆうめい tetap na-adjective)",
      "この ほん は おもしろい です。"
    ]
  },
  {
    pattern: "K.Sifat な + K.Benda / K.Sifat い + K.Benda",
    explanation: "Pola ini dipakai saat kata sifat langsung digabungkan dengan kata benda. Jika kata sifatnya na-adjective, tambahkan な sebelum kata benda. Jika kata sifatnya i-adjective, langsung sambung tanpa な. Pengecualian yang harus diingat: きれい dan ゆうめい tetap pakai な walaupun berakhiran い.",
    examples: [
      "しんせつな ひと です。",
      "きれいな へや です。",
      "ゆうめいな だいがく です。",
      "あたらしい くるま です。"
    ]
  },
  {
    pattern: "Bentuk negatif sifat: な-adjective / い-adjective",
    explanation: "Untuk membuat bentuk negatif kata sifat, aturannya berbeda tergantung jenisnya. Na-adjective memakai じゃ ありません, sedangkan i-adjective diubah dengan mengganti akhiran い menjadi くない です.",
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
    explanation: "とても dipakai untuk memperkuat makna positif, setara dengan sangat. あまり biasanya dipakai bersama bentuk negatif dan artinya menjadi tidak begitu.",
    examples: [
      "この えいが は とても おもしろい です。",
      "にほんご は あまり むずかしく ありません。"
    ]
  },
  {
    pattern: "K.Benda は どうですか",
    explanation: "Pola ini dipakai untuk menanyakan pendapat, kesan, atau kondisi tentang sesuatu. Bisa dipakai untuk benda, orang, tempat, maupun situasi.",
    examples: [
      "にほん の せいかつ は どうですか。",
      "この くるま は どうですか。"
    ]
  },
  {
    pattern: "K.Benda1 は どんな K.Benda2 ですか",
    explanation: "どんな dipakai untuk menanyakan seperti apa jenis, karakter, atau sifat dari kata benda yang disebut setelahnya. Jawaban biasanya berisi kata sifat atau deskripsi.",
    examples: [
      "にほんご は どんな ことば ですか。",
      "たなかさん は どんな ひと ですか。"
    ]
  },
  {
    pattern: "Kalimat 1 が、Kalimat 2",
    explanation: "Partikel が pada pola ini berfungsi sebagai penghubung antarkalimat dengan makna tetapi atau namun. Dipakai saat bagian belakang kalimat berisi kontras terhadap bagian depan.",
    examples: [
      "この へや は きれい ですが、せまい です。",
      "この えいが は おもしろい ですが、ちょっと ながい です。"
    ]
  },
  {
    pattern: "どれ",
    explanation: "どれ dipakai untuk menanyakan yang mana di antara tiga pilihan atau lebih. Jika hanya dua pilihan, biasanya digunakan pola pertanyaan pilihan lain.",
    examples: [
      "あなた の かばん は どれ ですか。",
      "どれ が すき ですか。"
    ]
  },
  {
    pattern: "K.Benda が あります / わかります",
    explanation: "Pada pola ini, objek ditandai partikel が, bukan を. Partikel が dipakai untuk menandai hal yang sedang dijelaskan atau dideskripsikan dalam kalimat. あります dipakai untuk menyatakan keberadaan atau kepemilikan, sedangkan わかります dipakai untuk menyatakan paham atau tidak paham.",
    examples: [
      "わたし は おかね が あります。 (Saya memiliki uang.)",
      "わたし は げつようび に やくそく が あります。 (Saya ada janji di hari Senin.)",
      "わたし は にほんご が わかります。 (Saya paham bahasa Jepang.)",
      "わたし は えいご が わかりません。 (Saya tidak paham bahasa Inggris.)"
    ]
  },
  {
    pattern: "K.Benda が すきです / きらいです / じょうずです / へたです",
    explanation: "Pola ini dipakai untuk menyatakan suka, tidak suka, pandai, atau tidak pandai terhadap suatu hal. Objek hal yang dibicarakan ditandai dengan partikel が. Dalam pola ini, が menandai hal yang sedang dijelaskan atau dideskripsikan oleh kata sifat seperti すき, きらい, じょうず, dan へた.",
    examples: [
      "わたし は スポーツ が すき です。 (Saya suka olahraga.)",
      "おかあさん は やきゅう が きらい です。 (Ibu tidak suka baseball.)",
      "サントスさん は りょうり が じょうず です。 (Santos pandai memasak.)",
      "わたし は すうがく が へた です。 (Saya tidak pandai matematika.)"
    ]
  },
  {
    pattern: "よく / だいたい / たくさん / すこし / あまり / ぜんぜん + K.Kerja",
    explanation: "Kata keterangan pada pola ini diletakkan sebelum kata kerja atau sebelum bagian predikat terkait. Khusus あまり dan ぜんぜん biasanya dipakai bersama bentuk negatif untuk menyatakan kadar yang rendah atau tidak sama sekali.",
    examples: [
      "ジョンさん は スペインご が よく わかります。 (John memahami bahasa Spanyol dengan baik.)",
      "タワポンさん は おかね が たくさん あります。 (Tawapon mempunyai banyak uang.)",
      "まつもとさん は ドイツご が ぜんぜん わかりません。 (Matsumoto sama sekali tidak mengerti bahasa Jerman.)",
      "ここ は もり が あまり ありません。 (Di sini tidak begitu banyak hutan.)"
    ]
  },
  {
    pattern: "Kalimat 1 から、Kalimat 2",
    explanation: "から artinya karena atau sebab. Bagian sebelum から berisi alasan, sedangkan bagian setelahnya berisi hasil, akibat, atau keputusan.",
    examples: [
      "いそがしい です から、テレビ を みません。 (Tidak menonton TV, karena sibuk.)",
      "にほんご が わかりません から、アニメ を みません。 (Tidak menonton anime, karena tidak paham bahasa Jepang.)",
      "じかん が ありません から、りょこう を しません。 (Tidak bertamasya, karena tidak ada waktu.)"
    ]
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
    ]
  }
];
