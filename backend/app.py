from flask import Flask, jsonify, request
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)

def scrape_school_info():
    url = 'https://ponpes-smksa.sch.id/'
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')

    # Contoh: Mengambil informasi PPDB
    ppdb_info = soup.find('div', class_='ppdb-info').text.strip() if soup.find('div', class_='ppdb-info') else "Informasi PPDB tidak ditemukan."
    
    return {
        'ppdb': ppdb_info,
        # Tambahkan informasi lain yang ingin diambil
    }

@app.route('/api/school-info', methods=['GET'])
def get_school_info():
    info = scrape_school_info()
    return jsonify(info)

if __name__ == '__main__':
    app.run(debug=True)
