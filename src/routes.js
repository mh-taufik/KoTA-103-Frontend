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
const DashboardPanitia = lazyWithRetry(() => import('./views/monitoring/dashboard/dashboardPanitia'))
const DaftarPeserta = lazyWithRetry(() => import('./views/monitoring/daftarPeserta/daftarPeserta')) 
const PemetaanPembimbingJurusan = lazyWithRetry(() => import('./views/monitoring/pemetaanPembimbing/PemetaanPembimbingJurusan'))
const DashboardPeserta = lazyWithRetry(() => import('./views/monitoring/dashboard/dashboardPeserta'))
const DashboardPembimbing = lazyWithRetry(() => import('./views/monitoring/dashboard/dashboardPembimbing'))
//DOKUMEN PESERTA 
const RekapDokumenPeserta = lazyWithRetry(() => import('./views/monitoring/pengisianDokumen/ListDokumenPeserta')) 
//RPP
const ContohPengisianRPP = lazyWithRetry(() => import('./views/monitoring/pengisianDokumen/rpp/contohRPP'))
const RekapRPP = lazyWithRetry(() => import('./views/monitoring/pengisianDokumen/rpp/rekapRpp'))
const FormPengisianRPP = lazyWithRetry(() => import('./views/monitoring/pengisianDokumen/rpp/pengisianRpp'))
const DetailRPP = lazyWithRetry(() => import('./views/monitoring/pengisianDokumen/rpp/detailRPP'))
//LOGBOOK
const ReviewLogbook = lazyWithRetry(() => import('./views/monitoring/pengisianDokumen/logbook/reviewLogbook')) 
// const FormPengisianRPP = lazyWithRetry(() => import('./views/monitoring/pengisianDokumen/rpp/contohRPP'))
const FormPengisianLogbook = lazyWithRetry(() => import('./views/monitoring/pengisianDokumen/logbook/pengisianLogbook'))
const FormEditLogbook = lazyWithRetry(() => import('./views/monitoring/pengisianDokumen/logbook/editLogbook'))
const FormPengisianSelfAssessment = lazyWithRetry(() => import('./views/monitoring/pengisianDokumen/selfassessment/pengisianSelfAssessment'))
const FormEditRPP =  lazyWithRetry(() => import('./views/monitoring/pengisianDokumen/rpp/editRPP'))
const RekapSelfAssessment = lazyWithRetry(() => import('./views/monitoring/pengisianDokumen/selfassessment/rekapSelfAssessment')) 
const DetailSelfAssessment = lazyWithRetry(() => import('./views/monitoring/pengisianDokumen/selfassessment/detailSelfAssessment')) 
const UploadLaporan = lazyWithRetry(() => import('./views/monitoring/pengisianDokumen/laporan/uploadLaporan'))
const TambahLaporan= lazyWithRetry(() => import('./views/monitoring/pengisianDokumen/laporan/tambahLaporan'))
const RekapLogbook = lazyWithRetry(() => import('./views/monitoring/pengisianDokumen/logbook/rekapLogbook'))
const PenilaianLogbook = lazyWithRetry(() => import('./views/monitoring/penilaianArtifakPeserta/logbook/penilaianLogbook'))
const PembobotanSelfAssessment = lazyWithRetry(() => import('./views/monitoring/pengelolaanMonitoring/pengaturanPoinPenilaianSelfAssessment')) 
const PengelolaanBobotFormPembimbing = lazyWithRetry(() => import('./views/monitoring/pengelolaanMonitoring/pengaturanBobotFormPembimbingJurusan')) 
const PengeloaanDeadline = lazyWithRetry(() => import('./views/monitoring/pengelolaanMonitoring/pengaturanDeadline')) 
//PENILAIAN
const RekapPenilaianPembimbingJurusan = lazyWithRetry(() => import('./views/monitoring/penilaianArtifakPeserta/rekapPenilaianPeserta')) 
const RekapPenilaianSelfAssessment = lazyWithRetry(() => import('./views/monitoring/penilaianArtifakPeserta/selfAssessment/rekapNilaiSelfAssessment')) 
const RekapLaporan= lazyWithRetry(() => import('./views/monitoring/pengisianDokumen/laporan/rekapLaporanPeserta')) 
const FormPenilaianPembimbingJurusan= lazyWithRetry(() => import('./views/monitoring/penilaianArtifakPeserta/laporan/formPenilaianPembimbingJurusan')) 
const RekapPenilaianLogbook= lazyWithRetry(() => import('./views/monitoring/penilaianArtifakPeserta/logbook/rekapNilaiLogbook')) 
const PenilaianSelfAssessment= lazyWithRetry(() => import('./views/monitoring/penilaianArtifakPeserta/selfAssessment/penilaianSelfAssessment')) 
const RekapPenilaianLaporan= lazyWithRetry(() => import('./views/monitoring/penilaianArtifakPeserta/laporan/rekapNilaiLaporan')) 
const PenilaianDetailRPP= lazyWithRetry(() => import('./views/monitoring/penilaianArtifakPeserta/penilaianDokumenDetailRPP')) 


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
  { path: '/dashboardPeserta', name: 'Dashboard Peserta', component: DashboardPeserta, exact:true },
  { path: '/monitoringPelaksanaan', name: 'Monitoring Pelaksanaan', component: MonitoringPelaksanaan, exact:true },
  { path: '/dashboardPanitia', name: 'Monitoring Dashboard', component: DashboardPanitia, exact:true },
  { path: '/dashboardPembimbing', name: 'Monitoring Dashboard', component: DashboardPembimbing, exact:true },
  { path: '/daftarPeserta', name: 'Daftar Peserta', component: DaftarPeserta, exact:true },
  { path: '/daftarPeserta/dashboardPeserta/:nim', name: ':nim', component: DashboardPeserta, exact:true },

  //PEMETAAN PEMBIMBING JURUSAN
  { path: '/pemetaanPembimbingJurusan', name: 'Pemetaan Pembimbing Jurusan', component: PemetaanPembimbingJurusan, exact:true },

  /** RPP */
  { path: '/rencanaPenyelesaianProyek', name: 'Rencana Penyelesaian Proyek', component: RekapRPP, exact:true},
  // { path: '/rencanaPenyelesaianProyek/:id?', name: 'Rekap Rencana Penye', component: RekapRPP, exact:true},
  { path: '/rencanaPenyelesaianProyek/:id/formPengisianRPP', name: 'FormPengisianRPP', component: FormPengisianRPP, exact:true},
  { path: '/rencanaPenyelesaianProyek/:id/formPengisianRPP/contohPengisianRPP', name: 'Contoh RPP', component: ContohPengisianRPP, exact:true},
  { path: '/rencanaPenyelesaianProyek/detail/:id?', name: ':id', component: DetailRPP, exact:true},
  { path: '/rencanaPenyelesaianProyek/edit/:id?', name: ':id', component: FormEditRPP, exact:true},

/**LOGBOOK  */
  { path: '/logbook', name: 'Logbook', component: RekapLogbook, exact:true},
  { path: '/logbook/detaillogbook/:id', name: ':id', component: ReviewLogbook, exact:true},
  { path: '/logbook/formlogbook', name: 'Form Logbook', component: FormPengisianLogbook, exact:true},
  { path: '/logbook/formlogbook/:id', name: ':id', component: FormPengisianLogbook, exact:true},
  { path: '/logbook/formEditLogbook/:id', name: ':id', component: FormEditLogbook, exact:true},
  { path: '/logbook/formEditLogbook/reviewEdit/:id', name: ':id', component: ReviewLogbook, exact:true},

  /** SELF ASSESSMENT */
  { path: '/selfAssessment', name: 'Self Assessment', component: RekapSelfAssessment, exact:true},
  { path: '/selfAssessment/formSelfAssessment', name: 'Form Self Assessment', component:  FormPengisianSelfAssessment, exact:true},
  { path: '/selfAssessment/formSelfAssessment/detail/:id', name: ':id', component:  DetailSelfAssessment, exact:true},

  /** LAPORAN */
  { path: '/laporan', name: 'Laporan', component:  RekapLaporan, exact:true},
  { path: '/laporan/submissionLaporan', name: 'Pengumpulan Laporan', component:  TambahLaporan, exact:true},
  { path: '/laporan/submissionLaporan/:id', name: ':id', component:  UploadLaporan, exact:true},

  //DOKUMEN PESERTA (PANITIA DAN PEMBIMBING)
  { path: '/rekapDokumenPeserta', name: 'Rekap Dokumen Peserta', component: RekapDokumenPeserta, exact:true},
  { path: '/rekapDokumenPeserta/logbookPeserta/:id', name: ':id', component: RekapLogbook, exact:true},
  { path: '/rekapDokumenPeserta/logbookPeserta/:nim/detail/:id', name: ':id', component: ReviewLogbook, exact:true},
  { path: '/rekapDokumenPeserta/logbookPeserta/:nim/nilai/:id', name: 'Penilaian Logbook', component: PenilaianLogbook, exact:true},
  { path: '/rekapDokumenPeserta/logbookPeserta/:nim/nilai/:idlogbook/detailRPP/:id', name: ':id', component: PenilaianDetailRPP, exact:true},
  { path: '/rekapDokumenPeserta/rppPeserta/:id', name: ':id', component: RekapRPP, exact:true},
  { path: '/rekapDokumenPeserta/rppPeserta/:nim/detail/:id', name: ':id', component: DetailRPP, exact:true},
  { path: '/rekapDokumenPeserta/selfAssessmentPeserta/:id', name: ':id', component: RekapSelfAssessment, exact:true},
  { path: '/rekapDokumenPeserta/selfAssessmentPeserta/:nim/rekapPenilaianSelfAssessment', name: ':nim', component: RekapPenilaianSelfAssessment, exact:true},
  { path: '/rekapDokumenPeserta/selfAssessmentPeserta/:nim/detail/:id', name: ':id', component: DetailSelfAssessment, exact:true},
  { path: '/rekapDokumenPeserta/selfAssessmentPeserta/:nim/penilaian/:id', name: ':id', component: PenilaianSelfAssessment, exact:true},
  { path: '/rekapDokumenPeserta/selfAssessmentPeserta/:nim/penilaian/:idsa/detailRPP/:id', name: ':id', component: PenilaianDetailRPP, exact:true},
  { path: '/rekapDokumenPeserta/laporan/:id', name: ':id', component: RekapLaporan, exact:true},
  { path: '/rekapDokumenPeserta/laporan/:nim/nilai/:id', name: ':id', component: FormPenilaianPembimbingJurusan, exact:true},
  
  /** REKAP PENILAIAN (PANITIA DAN PEMBIMBING) */
  { path: '/rekapPenilaianPeserta', name: 'Rekap Penilaian Peserta', component: RekapPenilaianPembimbingJurusan, exact:true},
  { path: '/rekapPenilaianPeserta/logbook/:id', name: ':id', component: RekapPenilaianLogbook, exact:true},
  { path: '/rekapPenilaianPeserta/selfassessment/:id', name: ':id', component: RekapPenilaianSelfAssessment, exact:true},
  { path: '/rekapPenilaianPeserta/laporan/:id', name: ':id', component: RekapPenilaianLaporan, exact:true},


  { path: '/rekapFormPenilaianPembimbingJurusan', name: 'Rekap Penilaian Pembimbing Jurusan', component: RekapPenilaianPembimbingJurusan, exact:true},
  { path: '/uploadLaporan', name: 'Dokumen Laporan KP/PKL', component: UploadLaporan, exact:true},
  { path: '/rekapLogbook', name: 'Logbook', component: RekapLogbook, exact:true},
  { path: '/rekapLogbook/detailLogbook/:id', name: ':id', component: ReviewLogbook, exact:true},

  /** PENILAIAN */
  { path: '/rekapLogbook/penilaianLogbook', name: 'Penilaian Logbook', component: PenilaianLogbook, exact:true},


  /** PENGATURAN MONITORING */
  { path: '/pembobotanSelfAssessment', name: 'Poin Penilaian Self Assessment', component: PembobotanSelfAssessment, exact:true},
  { path: '/pengelolaanPoinFormPembimbing', name: 'Poin Penilaian Pembimbing Jurusan', component: PengelolaanBobotFormPembimbing, exact:true},
  { path: '/pengelolaanDeadline', name: 'Pengeloaan Deadline', component: PengeloaanDeadline, exact:true},



]

export default routes
