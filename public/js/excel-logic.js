const ExcelProcessor = {
    async readFiles(files) {
        let allData = [];
        for (let file of files) {
            const data = await this.parse(file);
            allData = [...allData, ...data];
        }
        return allData;
    },

    parse(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const workbook = XLSX.read(new Uint8Array(e.target.result), { type: 'array' });
                const sheet = workbook.Sheets[workbook.SheetNames[0]];
                const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
                
                const results = rows.map((row) => ({
                    archivo: file.name,
                    codigo: String(row[1] || '').trim(),
                    telefono: String(row[2] || '').trim()
                })).filter(r => r.codigo || r.telefono); // Evitar filas vacías
                
                resolve(results);
            };
            reader.readAsArrayBuffer(file);
        });
    }
};