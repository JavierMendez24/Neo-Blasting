const UI = {
    status: document.getElementById('status'),
    tableBody: document.getElementById('tableBody'),
    searchInput: document.getElementById('searchInput'),
    rowCount: document.getElementById('rowCount'),

    init() {
        document.getElementById('excelFiles').addEventListener('change', this.handleUpload.bind(this));
        this.searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
    },

    async handleUpload(e) {
        this.status.innerHTML = '<i class="fas fa-sync fa-spin"></i> Procesando y guardando...';
        const rawData = await ExcelProcessor.readFiles(e.target.files);
        
        // Enviar al servidor para guardar en SQLite
        const res = await fetch('/api/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ registros: rawData })
        });

        const result = await res.json();
        this.status.innerHTML = `<i class="fas fa-check-circle"></i> ${result.message}`;
        this.handleSearch(''); // Refrescar vista
    },

    async handleSearch(query) {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        this.renderTable(data);
    },

    renderTable(data) {
        this.rowCount.textContent = data.length;
        if (data.length === 0) {
            this.tableBody.innerHTML = '<tr><td colspan="4" class="empty-message">No se encontraron resultados</td></tr>';
            return;
        }

        this.tableBody.innerHTML = data.map(item => {
            // Formato de fecha a SQLite (DD/MM/YYYY HH:mm)
            const fecha = item.fecha_carga 
                ? new Date(item.fecha_carga).toLocaleString('es-SV') 
                : 'N/A';

            return `
                <tr>
                    <td title="${item.archivo}">${item.archivo}</td>
                    
                    <td><b>${item.codigo}</b></td>
                    <td>${item.telefono}</td>
                    <td style="color: #80b0ff; font-size: 0.85rem;">${fecha}</td>
                </tr>
            `;
        }).join('');
    }
};

UI.init();