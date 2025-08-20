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

function pesan() {
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

    // Cek apakah pertanyaan berkaitan dengan sekolah
    const schoolResponse = getSchoolInfo(pesanInput);
    if (schoolResponse) {
        typingIndicator.remove(); // Hapus indikator mengetik
        const aiMessage = document.createElement("p");
        aiMessage.className = "ai-message";
        aiMessage.textContent = `[AI] > ${schoolResponse}`;
        document.getElementById("out").appendChild(aiMessage);
    } else {
        // Jika tidak ada informasi sekolah, panggil API Gemini
        geminiChatAi(pesanInput).then((balas) => {
            typingIndicator.remove(); // Hapus indikator mengetik
            const aiMessage = document.createElement("p");
            aiMessage.className = "ai-message";
            aiMessage.textContent = `[AI] > ${balas}`;
            document.getElementById("out").appendChild(aiMessage);
        });
    }

    document.getElementById("pesan").value = "";
}

function getSchoolInfo(prompt) {
    // Daftar pertanyaan dan jawaban terkait sekolah
    const responses = {
        'PPDB': 'Informasi PPDB dapat ditemukan di halaman resmi PPDB.',
        'Jurusan': 'Kami memiliki beberapa jurusan, termasuk IPA, IPS, dan Bahasa.',
        'Jadwal': 'Jadwal sekolah dapat dilihat di halaman jadwal resmi.',
        'Fasilitas': 'Fasilitas sekolah kami termasuk laboratorium, perpustakaan, dan lapangan olahraga.',
        'Kegiatan ekstrakurikuler': 'Kami memiliki berbagai kegiatan ekstrakurikuler seperti olahraga, seni, dan klub akademik.',
        'Visi dan Misi': 'Visi kami adalah menciptakan generasi yang berakhlak mulia dan berprestasi.'
    };

    // Cek apakah prompt ada dalam responses
    for (const key in responses) {
        if (prompt.toLowerCase().includes(key.toLowerCase())) {
            return responses[key];
        }
    }

    return null; // Jika tidak ada jawaban yang cocok
}

function geminiChatAi(prompt) {
    const apiKey = "AIzaSyD2etqul10Rk5JHCU3Qr3DI5vXAP5KHa-0"; // Ganti dengan API Key Anda
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
                            text: prompt,
                        }, ],
                    }, ],
                }),
            }
        )
        .then((res) => res.json())
        .then((data) => {
            if (data.candidates && data.candidates.length > 0) {
                return data.candidates[0].content.parts[0].text;
            } else {
                console.error("API error:", data);
                return "Maaf, saya tidak dapat memberikan jawaban saat ini.";
            }
        })
        .catch((err) => {
            console.error(err);
            return "Terjadi kesalahan, silakan coba lagi.";
        });
}
