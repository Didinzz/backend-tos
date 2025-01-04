const User = require("../models/User");
const Matakuliah = require("../models/Matakuliah");

exports.countAllTable = async (req, res) => {
    try {
      // Menggunakan Promise.all untuk melakukan query secara paralel
      const [countUser, countDosen, countMahasiswa, countMatakuliah] = await Promise.all([
        User.count({
          where: {
            role: ["mahasiswa", "dosen"]
          }
        }),
        User.count({
          where: {
            role: "dosen"
          }
        }),
        User.count({
          where: {
            role: "mahasiswa"
          }
        }),
        Matakuliah.count({})
      ]);
  
      res.status(200).json({
        code: 200,
        status: "ok",
        message: "Berhasil mengambil data",
        pengguna: countUser,
        dosen: countDosen,
        mahasiswa: countMahasiswa,
        matakuliah: countMatakuliah
      });
    } catch (error) {
      res.status(500).json({ code: 500, status: 'internal_server_error', message: error.message });
    }
  };
  