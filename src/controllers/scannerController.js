const db = require('../config/db');

exports.guardarRegistros = (req, res) => {
    const { registros } = req.body;
    
    if (!registros || !Array.isArray(registros)) {
        return res.status(400).json({ error: "Datos inválidos" });
    }

    // Preparamos la sentencia SQL
    const stmt = db.prepare(`
        INSERT OR IGNORE INTO registros (archivo, codigo, telefono) 
        VALUES (?, ?, ?)
    `);

    db.serialize(() => {
        db.run("BEGIN TRANSACTION");
        
        registros.forEach(reg => {
            stmt.run(reg.archivo, reg.codigo, reg.telefono);
        });

        db.run("COMMIT", (err) => {
            if (err) {
                return res.status(500).json({ error: "Error al guardar en la BD" });
            }
            res.json({ success: true, message: "Sincronización completada" });
        });
    });
    
    stmt.finalize();
};

exports.buscarRegistros = (req, res) => {
    const term = `%${req.query.q || ''}%`;
    const sql = `
        SELECT id, archivo, codigo, telefono, fecha_carga 
        FROM registros 
        WHERE codigo LIKE ? OR telefono LIKE ? 
        ORDER BY fecha_carga DESC LIMIT 100
    `;

    db.all(sql, [term, term], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
};