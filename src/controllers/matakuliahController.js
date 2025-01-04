const Matakuliah = require('../models/Matakuliah');
const User = require('../models/User');
const Modul = require('../models/Modul');
const { Op } = require('sequelize');
const MatakuliahDosen = require('../models/MatakuliahDosen');
const cloudinary = require('../config/cloudinary');


exports.createMatakuliah = async (req, res) => {
  try {
    const { nama, kode, semester, dosenIds } = req.body;

    // Verify all dosens exist and have dosen role
    const dosens = await User.findAll({
      where: {
        id: dosenIds,
        role: 'dosen'
      }
    });


    if (dosens.length !== dosenIds.length) {
      return res.status(404).json({code: 404, status: 'not found', message: 'masukan setidaknya satu dosen atau id dosen tidak ditemukan' });
    }

    const matakuliah = await Matakuliah.create({
      nama,
      kode,
      semester
    });

    // Associate dosens with matakuliah
    await matakuliah.setDosens(dosens);

    // Fetch the created matakuliah with its relations
    const result = await Matakuliah.findByPk(matakuliah.id, {
      include: [
        {
          model: User,
          as: 'dosens',
          attributes: ['id', 'nama', 'email'],
          through: { attributes: [] }
        },
        {
          model: Modul,
          as: 'moduls',
          attributes: ['id', 'title', 'fileUrl', 'pertemuanKe']
        }
      ]
    });

    res.status(201).json({
      code: 201,
      status: 'created',
      message: 'Matakuliah berhasil ditambahkan',
      data: result || { moduls: [] }
    });
  } catch (error) {
    res.status(500).json({code: 500, status: 'internal_server_error', status: 500, message: error.message });
  }
};

exports.getAllMatakuliah = async (req, res) => {
  try {
    const matakuliah = await Matakuliah.findAll({
      include: [
        {
          model: User,
          as: 'dosens',
          attributes: ['id', 'nama', 'email'],
          through: { attributes: [] }
        },
        {
          model: Modul,
          as: 'moduls',
          attributes: ['id', 'title',  'fileUrl', 'pertemuanKe']
        }
      ]
    });

    res.status(200).json({code: 200, status: 'success', message: 'Matakuliah ditemukan', data: matakuliah });
  } catch (error) {
    res.status(500).json({code: 500, status: 'internal_server_error', message: error.message });
  }
};

exports.getMatakuliahById = async (req, res) => {
  try {
    const { id } = req.params;
    const matakuliah = await Matakuliah.findByPk(id, {
      include: [
        {
          model: User,
          as: 'dosens',
          attributes: ['id', 'nama', 'email'],
          through: { attributes: [] }
        },
        {
          model: Modul,
          as: 'moduls',
          attributes: ['id', 'title',  'fileUrl', 'pertemuanKe', 'createdAt', 'updatedAt']
        }
      ]
    });

    if (!matakuliah) {
      return res.status(404).json({code: 404, status: 'not found', message: 'Matakuliah not found' });
    }

    res.status(200).json({code: 200, status: 'success', message: 'Matakuliah ditemukan', data: matakuliah });
  } catch (error) {
    res.status(500).json({code: 500, status: 'internal_server_error', message: error.message });
  }
};

exports.updateMatakuliah = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, kode, semester, dosenIds } = req.body;
    const matakuliah = await Matakuliah.findByPk(id);

    if (!matakuliah) {
      return res.status(404).json({code: 404, status: 'not found', message: 'Matakuliah tidak ditemukan' });
    }

    if (dosenIds) {
      // Verify all dosens exist and have dosen role
      const dosens = await User.findAll({
        where: {
          id: dosenIds,
          role: 'dosen'
        }
      });

      if (dosens.length !== dosenIds.length) {
        return res.status(404).json({code: 404, status: 'not found', message: 'masukan setidaknya satu dosen atau id dosen tidak ditemukan' });
      }

      // Update dosen associations4c.\
      await matakuliah.setDosens(dosens);
    }

    // Update matakuliah details
    await matakuliah.update({
      nama,
      kode,
      semester
    });

    // Fetch updated matakuliah with relations
    const updatedMatakuliah = await Matakuliah.findByPk(matakuliah.id, {
      include: [
        {
          model: User,
          as: 'dosens',
          attributes: ['id', 'nama', 'email'],
          through: { attributes: [] }
        },
        {
          model: Modul,
          as: 'moduls',
          attributes: ['id', 'title',  'fileUrl', 'pertemuanKe']
        }
      ]
    });

    res.json({
      code: 200,
      status: 'ok',
      message: 'Matakuliah berhasil diupdate',
      data: updatedMatakuliah
    });
  } catch (error) {
    res.status(500).json({code: 500, status: 'internal_server_error', message: error.message });
  }
};

exports.deleteMatakuliah = async (req, res) => {
  try {
    const { id } = req.params;
    const matakuliah = await Matakuliah.findByPk(id, {
      include: [
        {
          model: Modul,
          as: 'moduls'
        }
      ]
    });

    if (!matakuliah) {
      return res.status(404).json({code: 404, status: 'not found', message: 'Matakuliah tidak ditemukan' });
    }

    // Remove all dosen associations
    await matakuliah.setDosens([]);

    // Delete associated modules and their files
    for (const modul of matakuliah.moduls) {
      if (modul.publicId) {
         await cloudinary.uploader.destroy(modul.publicId);
      }
      await modul.destroy();
    }

    // Delete the matakuliah
    await matakuliah.destroy();

    return res.status(200).json({ code: 200, status: 'ok', message: 'Matakuliah berhasil dihapus' });
  } catch (error) {
    res.status(500).json({code: 500, status: 'internal_server_error', message: error.message });
  }
};

exports.searchMatakuliah = async (req, res) => {
  try {
    const { keyword } = req.query;

    if (!keyword) {
      return res.status(400).json({code: 400, status: 'bad request', message: 'Keyword wajib di isi' });
    }

    const matakuliahList = await Matakuliah.findAll({
      where: {
        // mencari matakuliah berdasarkan query yang di cari
        nama: { [Op.like]: `%${keyword}%` }
      },
      include: [
        {
          model: User,
          as: 'dosens',
          attributes: ['id', 'nama', 'email'],
          through: { attributes: [] }
        },
        {
          model: Modul,
          as: 'moduls',
          attributes: ['id', 'title',  'fileUrl', 'pertemuanKe']
        }
      ]
    })

    if(matakuliahList.length === 0 ){
      return res.status(404).json({code: 404, status: 'not found', message: 'Tidak dapat menemukan matakuliah' });
    }

      res.status(200).json({
        code: 200,
        status: 'ok',
        message: 'Matakuliah ditemukan',
        data: matakuliahList
      });

  } catch (error) {
    res.status(500).json({code: 500, status: 'internal_server_error', message: error.message });
  }
}

exports.getMatakuliahDosen =  async (req, res) => {
  try {
    const dosenId = req.user.id;
    const matakuliah = await MatakuliahDosen.findAll({
      where: {
        dosenId
      },
      include: [
        {
          model: Matakuliah,
          as: 'matakuliah',
          attributes: ['id', 'nama', 'kode', 'semester'],
        }
      ],
      attributes: [],
    })

    const matakuliahDosen = matakuliah.map(matakuliah => matakuliah.matakuliah);

    if(!matakuliah || matakuliah.length === 0){
      res.status(200).json({code: 200, status: 'ok', message: 'Dosen ini belum menampung matakuliah' });
    }
    return res.status(200).json({code: 200, status: 'ok', message: 'Matakuliah ditemukan', data: matakuliahDosen });
  } catch (error) {
    res.status(500).json({code: 500, status: 'internal_server_error', message: error.message });
  }
}

