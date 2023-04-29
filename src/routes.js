// import React from 'react'
import lazyWithRetry from './lazyWithRetry'

// Page
const Dashboard = lazyWithRetry(() => import('./views/dashboard/Dashboard'))
const Profile = lazyWithRetry(() => import('./views/pages/Profile'))

// Pemetaan
const FinalisasiPemetaan = lazyWithRetry(() => import('./views/pemetaan/finalisasi/Finalisasi'))
const Perangkingan = lazyWithRetry(() => import('./views/pemetaan/perangkingan/Perangkingan'))
const HasilPemetaan = lazyWithRetry(() => import('./views/pemetaan/hasilPemetaan'))

// CV
const DetailCV = lazyWithRetry(() => import('./views/rekap/CV/detailCV'))
const RekapCV = lazyWithRetry(() => import('./views/rekap/CV/rekapCV'))
const PengumpulanCV = lazyWithRetry(() => import('./views/rekap/CV/pengumpulanCV'))
const DataCV = lazyWithRetry(() => import('./views/rekap/CV/dataMahasiswa'))
const UpdateCV = lazyWithRetry(() => import('./views/rekap/CV/updateCV'))

// Minat
const DetailMinat = lazyWithRetry(() => import('./views/rekap/minat/detailMinat'))
const RekapMinat = lazyWithRetry(() => import('./views/rekap/minat/rekapMinat'))
const PengumpulanMinat = lazyWithRetry(() => import('./views/rekap/minat/pengumpulanMinat'))
const UpdateMinat = lazyWithRetry(() => import('./views/rekap/minat/updateMinat'))

// Perusahaan
const ListPerusahaan = lazyWithRetry(() => import('./views/rekap/perusahaan/listPerusahaan'))
const UpdatePerusahaan = lazyWithRetry(() => import('./views/rekap/perusahaan/updatePerusahaan'))
const DetailPerusahaan = lazyWithRetry(() => import('./views/rekap/perusahaan/detailPerusahaan'))
const DetailPrerequisitePerusahaan = lazyWithRetry(() => import('./views/rekap/perusahaan/detailPrerequisite'))
const IdentitasPerusahaan = lazyWithRetry(() => import('./views/rekap/perusahaan/identitasPerusahaan'))
const PrerequisitePerusahaan = lazyWithRetry(() => import('./views/rekap/perusahaan/prerequisitePerusahaan'))
const UpdatePrerequisite = lazyWithRetry(() => import('./views/rekap/perusahaan/updatePrerequisite'))
const TabelPrerequisite = lazyWithRetry(() => import('./views/rekap/perusahaan/tabelPrerequisite'))
const CreatePerusahaan = lazyWithRetry(() => import('./views/rekap/perusahaan/createPerusahaan'))
const TabelPengajuanPerusahaan = lazyWithRetry(() => import('./views/rekap/perusahaan/tabelPengajuanPerusahaan'))
const DetailPengajuanPerusahaan = lazyWithRetry(() => import('./views/rekap/perusahaan/detailPengajuanPerusahaan'))
const EvaluasiPerusahaan = lazyWithRetry(() => import('./views/rekap/perusahaan/evaluasiPerusahaan'))
const FeedbackPerusahaan = lazyWithRetry(() => import('./views/rekap/perusahaan/feedbackPerusahaan'))
const DetailEvaluasiPerusahaan = lazyWithRetry(() => import('./views/rekap/perusahaan/detailEvaluasiPerusahaan'))
const CardEvaluasiPerusahaan = lazyWithRetry(() => import('./views/rekap/perusahaan/cardEvaluasiPerusahaan'))
const FormulirEvaluasiPerusahaan = lazyWithRetry(() => import('./views/rekap/perusahaan/formulirEvaluasiPerusahaan'))
const DetailFeedbackPerusahaan = lazyWithRetry(() => import('./views/rekap/perusahaan/detailFeedbackPerusahaan'))
const CardFeedbackPerusahaan = lazyWithRetry(() => import('./views/rekap/perusahaan/cardFeedbackPerusahaan'))
const FormulirFeedbackPerusahaan = lazyWithRetry(() => import('./views/rekap/perusahaan/formulirFeedbackPerusahaan'))

// Pengelolaan
const PengelolaanAkun = lazyWithRetry(() => import('./views/pengelolaan/pengelolaanAkun'))
const PengelolaanKegiatan = lazyWithRetry(() => import('./views/pengelolaan/pengelolaanKegiatan'))
const PengelolaanBobotKriteria = lazyWithRetry(() => import('./views/pengelolaan/pengelolaanBobotKriteria'))
const PengelolaanKriteriaPerusahaan = lazyWithRetry(() => import('./views/pengelolaan/pengelolaanKriteriaPerusahaan'))
const PengelolaanKompetensi = lazyWithRetry(() => import('./views/pengelolaan/pengelolaanKompetensi'))
const PengelolaanAspekPenilaianEvaluasi = lazyWithRetry(() => import('./views/pengelolaan/pengelolaanAspekPenilaianEvaluasi'))
const pengelolaanPertanyaanFeedback = lazyWithRetry(() => import('./views/pengelolaan/pengelolaanPertanyaanFeedback'))


//Monitoring
const MonitoringPelaksanaan = lazyWithRetry(() => import('./views/monitoring/dashboard/MonitoringPelaksanaan'))
const PemetaanPembimbingJurusan = lazyWithRetry(() => import('./views/monitoring/pemetaanPembimbing/PemetaanPembimbingJurusan'))
const FormPengisianRPP = lazyWithRetry(() => import('./views/monitoring/pengisianDokumen/rpp/pengisianRpp'))
const FormPengisianLogbook = lazyWithRetry(() => import('./views/monitoring/pengisianDokumen/logbook/pengisianLogbook'))
const FormEditLogbook = lazyWithRetry(() => import('./views/monitoring/pengisianDokumen/logbook/editLogbook'))
const FormPengisianSelfAssessment = lazyWithRetry(() => import('./views/monitoring/pengisianDokumen/selfassessment/pengisianSelfAssessment'))
const UploadLaporan = lazyWithRetry(() => import('./views/monitoring/pengisianDokumen/laporan/uploadLaporan'))
const RekapLogbook = lazyWithRetry(() => import('./views/monitoring/pengisianDokumen/logbook/rekapLogbook'))
const PembobotanSelfAssessment = lazyWithRetry(() => import('./views/monitoring/pengelolaanBobot/pengaturanPoinPenilaianSelfAssessment')) 
const routes = [
  // Page
  { path: '/', exact: true, name: 'Beranda' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/profile', name: 'Profile', component: Profile },

  // Pemetaan
  { path: '/hasilPemetaan', name: 'Hasil Pemetaan', component: HasilPemetaan, exact: true },

  { path: '/pemetaan', name: 'Pemetaan', component: FinalisasiPemetaan, exact: true },
  { path: '/pemetaan/perangkingan', name: 'Perangkingan Mahasiswa', component: Perangkingan, exact: true  },
  { path: '/pemetaan/finalisasi', name: 'Pemilihan Mahasiswa', component: FinalisasiPemetaan, exact: true  },

  // CV
  { path: '/CV', name: 'CV', component: PengumpulanCV, exact: true },
  { path: '/CV/detailCV', name: 'Detail CV', component: DetailCV, exact: true },
  { path: '/CV/detailCV/:id', name: ':id', component: DetailCV },
  { path: '/CV/updateCV', name: 'Ubah Data CV', component: UpdateCV, exact: true },
  { path: '/CV/updateCV/:id', name: ':id', component: UpdateCV },

  { path: '/dataMahasiswa', name: 'Data Mahasiswa', component: DataCV, exact: true },
  { path: '/dataMahasiswa/detailCV', name: 'Detail CV', component: DetailCV, exact: true },
  { path: '/dataMahasiswa/detailCV/:id', name: ':id', component: DetailCV, exact: true },

  { path: '/rekapCV', name: 'Rekap CV', component: RekapCV, exact: true },
  { path: '/rekapCV/detailCV', name: 'Detail CV', component: DetailCV },

  // Minat
  { path: '/pemilihanPerusahaan', name: 'Pemilihan Perusahaan', component: PengumpulanMinat, exact: true },
  { path: '/pemilihanPerusahaan/detailMinat', name: 'Detail Pemilihan Perusahaan', component: DetailMinat },
  { path: '/pemilihanPerusahaan/updateMinat', name: 'Ubah Data Pemilihan Perusahaan', component: UpdateMinat },

  { path: '/rekapMinat', name: 'Rekap Minat', component: RekapMinat, exact: true },


  // Perusahaan
  { path: '/dataEvaluasiPerusahaan', name: 'Data Evaluasi Perusahaan', component: CardEvaluasiPerusahaan, exact: true },
  { path: '/dataEvaluasiPerusahaan/formulirEvaluasiPerusahaan', name: 'Formulir Evaluasi Perusahaan', component: FormulirEvaluasiPerusahaan, exact: true },
  { path: '/dataEvaluasiPerusahaan/formulirEvaluasiPerusahaan/:id', name: ':id', component: FormulirEvaluasiPerusahaan, exact: true },
  { path: '/dataEvaluasiPerusahaan/detailEvaluasiPerusahaan', name: 'Detail Evaluasi Perusahaan', component: DetailEvaluasiPerusahaan, exact: true },
  { path: '/dataEvaluasiPerusahaan/detailEvaluasiPerusahaan/:id', name: ':id', component: DetailEvaluasiPerusahaan, exact: true },

  { path: '/evaluasiPeserta', name: 'Evaluasi Peserta', component: EvaluasiPerusahaan, exact: true },
  { path: '/evaluasiPeserta/detailEvaluasi', name: 'Detail Evaluasi Peserta', component: DetailEvaluasiPerusahaan, exact: true },
  { path: '/evaluasiPeserta/detailEvaluasi/:id', name: ':id', component: DetailEvaluasiPerusahaan, exact: true },

  { path: '/feedbackPerusahaan', name: 'Feedback Perusahaan', component: FeedbackPerusahaan, exact: true },
  { path: '/feedbackPerusahaan/detailFeedback', name: 'Detail Feedback Perusahaan', component: DetailFeedbackPerusahaan, exact: true },
  { path: '/feedbackPerusahaan/detailFeedback/:id', name: ':id', component: DetailFeedbackPerusahaan, exact: true },
  { path: '/dataFeedbackPerusahaan', name: 'Formulir Feedback Pelaksanaan Magang', component: CardFeedbackPerusahaan, exact: true },
  { path: '/dataFeedbackPerusahaan/formulirFeedbackPerusahaan', name: 'Isi Formulir Feedback Pelaksanaan Magang', component: FormulirFeedbackPerusahaan, exact: true },
  { path: '/dataFeedbackPerusahaan/formulirFeedbackPerusahaan/:id', name: ':id', component: FormulirFeedbackPerusahaan, exact: true },
  { path: '/dataFeedbackPerusahaan/detailFeedbackPerusahaan', name: 'Detail Formulir Feedback Pelaksanaan Magang', component: DetailFeedbackPerusahaan, exact: true },
  { path: '/dataFeedbackPerusahaan/detailFeedbackPerusahaan/:id', name: ':id', component: DetailFeedbackPerusahaan, exact: true },

  { path: '/formulirKesediaan', name: 'Formulir Kesediaan Perusahaan', component: PrerequisitePerusahaan, exact: true },
  { path: '/formulirKesediaan/prerequisite', name: 'Prerequisite', component: DetailPrerequisitePerusahaan, exact: true },
  { path: '/formulirKesediaan/prerequisite/:id', name: ':id', component: DetailPrerequisitePerusahaan, exact: true },
  { path: '/formulirKesediaan/updatePrerequisite', name: 'Ubah Data Prerequisite', component: UpdatePrerequisite, exact: true },
  { path: '/formulirKesediaan/updatePrerequisite/:id', name: ':id', component: UpdatePrerequisite, exact: true },

  { path: '/hasilEvaluasiPerusahaan', name: 'Hasil Evaluasi Perusahaan', component: DetailEvaluasiPerusahaan, exact: true },

  { path: '/listPerusahaan', name: 'List Perusahaan', component: ListPerusahaan, exact: true },
  { path: '/listPerusahaan/createPerusahaan', name: 'Tambah Perusahaan', component: CreatePerusahaan },
  { path: '/listPerusahaan/detailPerusahaan', name: 'Detail Perusahaan', component: DetailPerusahaan, exact: true },
  { path: '/listPerusahaan/detailPerusahaan/:id', name: ':id', component: DetailPerusahaan, exact: true },
  { path: '/listPerusahaan/detailPerusahaan/prerequisite', name: 'Prerequisite', component: DetailPrerequisitePerusahaan, exact: true },
  { path: '/listPerusahaan/detailPerusahaan/prerequisite/:id', name: ':id', component: DetailPrerequisitePerusahaan, exact: true },
  { path: '/listPerusahaan/detailPerusahaan/updatePrerequisite', name: 'Ubah Data Prerequisite', component: UpdatePrerequisite, exact: true },
  { path: '/listPerusahaan/detailPerusahaan/updatePrerequisite/:id', name: ':id', component: UpdatePrerequisite, exact: true },
  { path: '/listPerusahaan/detailPerusahaan/updatePerusahaan', name: 'Ubah Data Perusahaan', component: UpdatePerusahaan, exact: true },
  { path: '/listPerusahaan/detailPerusahaan/updatePerusahaan/:id', name: ':id', component: UpdatePerusahaan, exact: true },

  { path: '/pengajuanPerusahaan', name: 'Pengajuan Perusahaan', component: TabelPengajuanPerusahaan, exact: true },
  { path: '/pengajuanPerusahaan/detailPengajuanPerusahaan', name: 'Detail Pengajuan Perusahaan', component: DetailPengajuanPerusahaan, exact: true  },
  { path: '/pengajuanPerusahaan/detailPengajuanPerusahaan/:id', name: ':id', component: DetailPengajuanPerusahaan, exact: true  },

  { path: '/profilPerusahaan', name: 'Profil Perusahaan', component: IdentitasPerusahaan, exact: true },
  { path: '/profilPerusahaan/updatePerusahaan', name: 'Ubah Data Perusahaan', component: UpdatePerusahaan, exact: true },
  { path: '/profilPerusahaan/updatePerusahaan/:id', name: ':id', component: UpdatePerusahaan },

  { path: '/prerequisitePerusahaan', name: 'Prerequisite Perusahaan', component: TabelPrerequisite, exact: true },

  // Pengelolaan
  { path: '/pengelolaanAkun', name: 'Pengelolaan Akun', component: PengelolaanAkun },
  { path: '/pengelolaanKegiatan', name: 'Pengelolaan Kegiatan', component: PengelolaanKegiatan },
  { path: '/pengelolaanBobotKriteria', name: 'Pengelolaan Bobot Kriteria Perangkingan', component: PengelolaanBobotKriteria, exact: true },
  { path: '/pengelolaanKriteriaPerusahaan', name: 'Pengelolaan Kriteria Perusahaan', component: PengelolaanKriteriaPerusahaan, exact: true },
  { path: '/pengelolaanKompetensi', name: 'Pengelolaan Kompetensi', component: PengelolaanKompetensi, exact: true },
  { path: '/pengelolaanAspekPenilaianEvaluasi', name: 'Pengelolaan Aspek Penilaian Evaluasi', component: PengelolaanAspekPenilaianEvaluasi, exact: true },
  { path: '/pengelolaanPertanyaanFeedback', name: 'Pengelolaan Pertanyaan Feedback', component: pengelolaanPertanyaanFeedback, exact: true },


  //MONITORING
  { path: '/monitoringPelaksanaan', name: 'Monitoring Pelaksanaan', component: MonitoringPelaksanaan, exact:true },
  { path: '/pemetaanPembimbingJurusan', name: 'Pemetaan Pembimbing Jurusan', component: PemetaanPembimbingJurusan, exact:true },
  { path: '/rencanaPenyelesaianProyek', name: 'Dokumen RPP', component: FormPengisianRPP, exact:true},
  // { path: '/logbook', name: 'Dokumen Logbook', component: FormPengisianLogbook, exact:true},
  { path: '/logbook', name: 'Dokumen Logbook', component: RekapLogbook, exact:true},
  { path: '/logbook/formlogbook', name: 'Form Logbook', component: FormPengisianLogbook, exact:true},
  { path: '/logbook/formlogbook/:id', name: ':id', component: FormPengisianLogbook, exact:true},
  { path: '/logbook/formEditLogbook/:id', name: ':id', component: FormEditLogbook, exact:true},
  
  { path: '/formSelfAssessment', name: 'Dokumen Self Assessment', component: FormPengisianSelfAssessment, exact:true},
  { path: '/uploadLaporan', name: 'Dokumen Laporan KP/PKL', component: UploadLaporan, exact:true},
  { path: '/rekapLogbook', name: 'Logbook', component: RekapLogbook, exact:true},
  //PEMBOBOTAN
  { path: '/pembobotanSelfAssessment', name: 'Poin Penilaian Self Assessment', component: PembobotanSelfAssessment, exact:true},

]

export default routes
