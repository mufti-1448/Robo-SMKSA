document.addEventListener("DOMContentLoaded", () => {
    showRecommendedQuestions();
});

function showRecommendedQuestions() {
    const recommendedQuestions = [
        "Apa itu PPDB?",
        "Jurusan apa saja yang tersedia?",
        "Bagaimana jadwal sekolah?",
        "Apa saja fasilitas yang ada di sekolah?",
        "Kegiatan ekstrakurikuler apa yang ditawarkan?"
    ];

    const recommendations = document.createElement("p");
    recommendations.className = "ai-message";
    recommendations.textContent = "Berikut adalah beberapa pertanyaan yang sering ditanyakan:";
    document.getElementById("out").appendChild(recommendations);

    recommendedQuestions.forEach(question => {
        const questionItem = document.createElement("p");
        questionItem.className = "ai-message";
        questionItem.textContent = `- ${question}`;
        document.getElementById("out").appendChild(questionItem);
    });
}

// Ubah getSchoolInfo menjadi async dan ambil data dari endpoint backend
async function getSchoolInfo(prompt) {
    try {
        const response = await fetch('https://ponpes-smksa.sch.id/');
        const data = await response.json();

        if (prompt.toLowerCase().includes('ppdb')) {
            return data.ppdb;
        }
        if (prompt.toLowerCase().includes('jurusan')) {
            return data.jurusan;
        }
        if (prompt.toLowerCase().includes('jadwal')) {
            return data.jadwal;
        }
        if (prompt.toLowerCase().includes('fasilitas')) {
            return data.fasilitas;
        }
        if (prompt.toLowerCase().includes('ekstrakurikuler')) {
            return data.ekstrakurikuler;
        }
        if (prompt.toLowerCase().includes('visi') || prompt.toLowerCase().includes('misi')) {
            return data.visi_misi;
        }
        return null;
    } catch (err) {
        console.error(err);
        return null;
    }
}

async function pesan() {
    const pesanInput = document.getElementById("pesan").value.trim();
    if (pesanInput === "") return;

    const userMessage = document.createElement("p");
    userMessage.className = "user-message";
    userMessage.textContent = `[Kamu] > ${pesanInput}`;
    document.getElementById("out").appendChild(userMessage);

    const typingIndicator = document.createElement("p");
    typingIndicator.className = "typing-indicator";
    typingIndicator.textContent = "AI sedang mengetik....";
    document.getElementById("out").appendChild(typingIndicator);

    // Panggil getSchoolInfo yang baru (async)
    const schoolResponse = await getSchoolInfo(pesanInput);
    if (schoolResponse) {
        typingIndicator.remove();
        const aiMessage = document.createElement("pre"); // gunakan <pre> agar format bullet tetap terlihat
        aiMessage.className = "ai-message";
        aiMessage.textContent = `[AI] > ${schoolResponse}`;
        document.getElementById("out").appendChild(aiMessage);
    } else {
        geminiChatAi(pesanInput).then((balas) => {
            typingIndicator.remove();
            const aiMessage = document.createElement("pre"); // gunakan <pre> agar format bullet tetap terlihat
            aiMessage.className = "ai-message";
            aiMessage.textContent = `[AI] > ${balas}`;
            document.getElementById("out").appendChild(aiMessage);
        });
    }

    document.getElementById("pesan").value = "";
}

function geminiChatAi(userPrompt) {
    const apiKey = "AIzaSyD2etqul10Rk5JHCU3Qr3DI5vXAP5KHa-0"; // Ganti dengan API Key Anda

    // Prompt agar AI tetap menjawab pertanyaan umum/ilmu pengetahuan dengan baik
    const prompt = `
Anda adalah asisten AI untuk website SMK Syafi'i Akrom.

Petunjuk penting:
- Jika pertanyaan berkaitan dengan SMK Syafi'i Akrom, prioritaskan jawaban berdasarkan informasi yang tersedia di https://ponpes-smksa.sch.id/.
- Jika pertanyaan tentang PPDB, cari dan rangkum informasi terbaru dari https://ppdb.ponpes-smksa.sch.id/, lalu berikan jawaban singkat dan sertakan link tersebut di akhir jawaban.
- Jika pertanyaan tentang BKK atau Bursa Kerja Khusus, cari dan rangkum informasi dari https://bkk.ponpes-smksa.sch.id/, lalu berikan jawaban singkat dan sertakan link tersebut di akhir jawaban.
- Jika pertanyaan user seputar ilmu pengetahuan umum, pendidikan, atau hal bermanfaat lainnya (misal: sains, matematika, kimia, fisika, teknologi, motivasi, dan sebagainya), jawab sesuai pengetahuan Anda secara ringkas, jelas, dan mudah dipahami.
- Jangan membatasi jawaban hanya pada informasi sekolah saja jika pertanyaan user bersifat umum atau edukatif.
- Gunakan bullet sederhana jika perlu, tanpa bold, italic, atau link panjang.
- Jawab hanya sesuai pertanyaan user, jangan menambah informasi di luar permintaan user.
- Jika informasi seputar SMK Syafi'i Akrom tidak ditemukan, jawab: "Maaf, informasi ini belum tersedia. Silakan kunjungi website resmi SMK Syafi'i Akrom."
- Jika pertanyaan tidak relevan atau tidak jelas, jawab: "Maaf, saya tidak dapat membantu dengan pertanyaan tersebut."

Pertanyaan user: "${userPrompt}"
`;

    return fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [{
                        role: "user",
                        parts: [{
                            text: prompt
                        }]
                    }]
                })
            }
        )
        .then(res => res.json())
        .then(data => {
            if (data.candidates && data.candidates.length > 0) {
                return data.candidates[0].content.parts[0].text;
            } else {
                console.error("API error:", data);
                return "Maaf, saya tidak dapat memberikan jawaban saat ini.";
            }
        })
        .catch(err => {
            console.error(err);
            return "Terjadi kesalahan, silakan coba lagi.";
        });
}