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

    // Tambahkan instruksi format jawaban
    const prompt = `
Anda adalah asisten AI untuk website SMK Syafi'i Akrom.
Tugas Anda:
1.Berikan jawaban yang sesuai dengan informasi yang sebelumnya kamu cari tahu terlebih dahulu di https://ponpes-smksa.sch.id/.
2. Jika user menanyakan tentang ppdb maka kamu cari tahu informasinya di website 
2. Gunakan bullet sederhana jika perlu.
3. Tidak perlu bold, italic, atau link panjang.
4. Fokus hanya pada pertanyaan user.
5. Jika tidak tahu, jawab: "Maaf, informasi ini belum tersedia. Silakan kunjungi website resmi SMK Syafi'i Akrom."
6. Berikan Jawaban dengan mengakses website resmi SMK Syafi'i Akrom di https://ponpes-smksa.sch.id/ untuk informasi yang akurat.
7. Jika pertanyaan tidak relevan, jawab: "Maaf, saya tidak dapat membantu dengan pertanyaan tersebut."
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