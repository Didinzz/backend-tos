const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  createModul,
  getAllModul,
  getModulById,
  updateModul,
  deleteModul,
  // getModulByPertemuan,
  getModulByMatakuliah,
  readModulFile,
  downloadModulFile,
  searchModul
} = require('../controllers/modulController');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .post(authorize('admin', 'dosen'),upload.single('file'), createModul)
  .get(getAllModul);

router
  .route('/:id')
  .get(getModulById)
  .put(authorize('admin', 'dosen'),upload.single('file'), updateModul)
  .delete(authorize('admin', 'dosen'),deleteModul);

  // router.get('/pertemuan/:pertemuan', getModulByPertemuan);
  router.get('/matkul/:matakuliah', getModulByMatakuliah);
  
router.get('/:modulId/read', readModulFile);
router.get('/:modulId/download', downloadModulFile);

module.exports = router;