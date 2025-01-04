const LastSeen = require('../models/LastSeen');
const Matakuliah = require('../models/Matakuliah');

exports.getLastSeen = async (req, res) => {
    try {
        const userId = req.user.id;// ID pengguna dari middleware autentikasi

        const lastSeenData = await LastSeen.findAll({
            where: { userId },
            include: [
                {
                    model: Matakuliah,
                    as: 'matakuliah',
                    attributes: ['id', 'nama', 'kode', 'semester'],
                }
            ],
            order: [['viewedAt', 'DESC']],
        });

        if (!lastSeenData || lastSeenData.length === 0) {
            return res.status(200).json({ code: 200, status: 'ok', message: 'Belum pernah melihat matakuliah' });
        }

        res.status(200).json({ code: 200, status: 'ok', message: 'Berhasil mengambil data last seen', data: lastSeenData });
    } catch (error) {
        res.status(500).json({code: 500, status: 'internal_server_error', message: 'Error fetching last seen' });
    }
}

exports.saveLastSeen = async (req, res, next) => {
    try {
        const userId = req.user.id;// ID pengguna dari middleware autentikasi
        const roleUser = req.user.role;
        const matakuliahId = req.params.id;  // ID matakuliah dari parameter rute

        if (roleUser === 'mahasiswa') {
            // Simpan atau perbarui data LastSeen
            await LastSeen.upsert({
                userId,
                matakuliahId,
                viewedAt: new Date(),
            });

            // dapatkan semua lastSEeng untuk user tersebut, diurutkan dari yang terbaru
            const lastSeenData = await LastSeen.findAll({
                where: { userId },
                order: [['viewedAt', 'DESC']],
            });

            // Jika data melebihi batas 5, hapus yang lama
            if (lastSeenData.length > 4) {
                const toDelete = lastSeenData.slice(4); // Ambil data dari indeks ke-4 ke belakang
                const toDeleteIds = toDelete.map((item) => item.id); // Ambil ID yang akan dihapus
                await LastSeen.destroy({ where: { id: toDeleteIds } }); // Hapus data lama
            }
        }


        next();
    } catch (error) {
        res.status(500).json({code: 500, status: 'internal_server_error', message: 'Error saving last seen' });
    }
}
