import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import {
  Plus,
  Upload,
  Download,
  FileText,
  Target,
  Calendar,
} from "lucide-react";
import CascadingPerformance from "../../components/CascadingPerformance";
import PerformanceTree from "../../components/PerformanceTree";

const PlanningOverview = () => {
  const [activeTab, setActiveTab] = useState("renstra");

  const planningData = {
    renstra: {
      status: "active",
      period: "2021-2026",
      last_updated: "2024-01-15",
      tujuan_count: 5,
      sasaran_count: 15,
      program_count: 25,
      kegiatan_count: 120,
    },
    renaksi: {
      status: "draft",
      year: "2024",
      last_updated: "2024-12-01",
      kegiatan_count: 85,
      completed: 68,
      in_progress: 12,
      not_started: 5,
    },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Modul Perencanaan
          </h1>
          <p className="text-gray-600">
            Kelola dokumen perencanaan dan rencana aksi
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="btn-secondary">
            <Upload className="h-4 w-4 mr-2" />
            Upload Dokumen
          </button>
          <button className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Rencana
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: "pohon-kinerja", name: "Pohon Kinerja", icon: FileText },
            { id: "cascading", name: "Cascading", icon: FileText },
            { id: "renstra", name: "Renstra", icon: Target }, //ketika usernya adalah pemda rentra berubah jadi rpjmd
            { id: "Renja ", name: "Rencana Kerja", icon: Calendar }, //ketika usernya pemda renja menjadi rkpd
            { id: "PK", name: "Perjanjian Kinerja", icon: Calendar },
            { id: "renaksi", name: "Rencana Aksi", icon: Calendar },
            { id: "documents", name: "Dokumen", icon: FileText },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === tab.id
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}

      {activeTab === "renaksi" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="card p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Rencana Aksi {planningData.renaksi.year}
              </h3>

              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {planningData.renaksi.kegiatan_count}
                  </p>
                  <p className="text-sm text-gray-500">Total Kegiatan</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-success-600">
                    {planningData.renaksi.completed}
                  </p>
                  <p className="text-sm text-gray-500">Selesai</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-warning-600">
                    {planningData.renaksi.in_progress}
                  </p>
                  <p className="text-sm text-gray-500">Berjalan</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-danger-600">
                    {planningData.renaksi.not_started}
                  </p>
                  <p className="text-sm text-gray-500">Belum Mulai</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">
                      Pembangunan Sekolah Baru
                    </p>
                    <p className="text-sm text-gray-500">
                      Target: 10 Unit | Timeline: Jan-Des 2024
                    </p>
                  </div>
                  <span className="text-xs px-2 py-1 bg-warning-100 text-warning-700 rounded-full">
                    Berjalan
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Pelatihan Guru</p>
                    <p className="text-sm text-gray-500">
                      Target: 500 Orang | Timeline: Mar-Nov 2024
                    </p>
                  </div>
                  <span className="text-xs px-2 py-1 bg-success-100 text-success-700 rounded-full">
                    Selesai
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="card p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Template Renaksi
              </h3>
              <div className="space-y-3">
                <button className="w-full btn-primary text-left">
                  <Download className="h-4 w-4 mr-2" />
                  Download Template
                </button>
                <button className="w-full btn-secondary text-left">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Renaksi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "cascading" && (
        <div className="space-y-6">
          <CascadingPerformance period={2023} />
        </div>
      )}

      {activeTab === "pohon-kinerja" && <PerformanceTree />}

      {activeTab === "documents" && (
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Manajemen Dokumen
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                name: "RPJMD 2021-2026",
                type: "PDF",
                size: "2.5 MB",
                date: "2024-01-15",
              },
              {
                name: "RKPD 2024",
                type: "PDF",
                size: "1.8 MB",
                date: "2024-02-01",
              },
              {
                name: "Perjanjian Kinerja 2024",
                type: "PDF",
                size: "1.2 MB",
                date: "2024-03-01",
              },
              {
                name: "IKU 2024",
                type: "Excel",
                size: "850 KB",
                date: "2024-03-15",
              },
              {
                name: "Renaksi 2024",
                type: "Excel",
                size: "1.1 MB",
                date: "2024-04-01",
              },
            ].map((doc, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <FileText className="h-8 w-8 text-primary-500" />
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                    {doc.type}
                  </span>
                </div>
                <h4 className="font-medium text-gray-900 mb-1">{doc.name}</h4>
                <p className="text-sm text-gray-500">
                  {doc.size} • {doc.date}
                </p>
                <div className="mt-3 flex space-x-2">
                  <button className="text-xs text-primary-600 hover:text-primary-500">
                    Download
                  </button>
                  <button className="text-xs text-gray-600 hover:text-gray-500">
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "renstra" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Renstra Overview */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Rencana Strategis {planningData.renstra.period}
                </h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                  {planningData.renstra.status}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary-600">
                    {planningData.renstra.tujuan_count}
                  </p>
                  <p className="text-sm text-gray-500">Tujuan</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary-600">
                    {planningData.renstra.sasaran_count}
                  </p>
                  <p className="text-sm text-gray-500">Sasaran</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary-600">
                    {planningData.renstra.program_count}
                  </p>
                  <p className="text-sm text-gray-500">Program</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary-600">
                    {planningData.renstra.kegiatan_count}
                  </p>
                  <p className="text-sm text-gray-500">Kegiatan</p>
                </div>
              </div>
            </div>

            {/* Hierarchy Tree */}
            <div className="card p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Hierarki Perencanaan
              </h3>
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <Target className="h-5 w-5 text-primary-500 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">
                      Tujuan 1: Meningkatkan Kualitas Pendidikan
                    </p>
                    <p className="text-sm text-gray-500">
                      3 Sasaran, 8 Program, 45 Kegiatan
                    </p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <Target className="h-5 w-5 text-primary-500 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">
                      Tujuan 2: Meningkatkan Pelayanan Kesehatan
                    </p>
                    <p className="text-sm text-gray-500">
                      4 Sasaran, 6 Program, 32 Kegiatan
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Aksi Cepat
              </h3>
              <div className="space-y-3">
                <button className="w-full btn-primary text-left">
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Tujuan Baru
                </button>
                <button className="w-full btn-secondary text-left">
                  <FileText className="h-4 w-4 mr-2" />
                  Edit Indikator
                </button>
                <button className="w-full btn-secondary text-left">
                  <Download className="h-4 w-4 mr-2" />
                  Export Renstra
                </button>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Status Dokumen
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">RPJMD</span>
                  <span className="text-xs px-2 py-1 bg-success-100 text-success-700 rounded-full">
                    Aktif
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">RKPD 2024</span>
                  <span className="text-xs px-2 py-1 bg-success-100 text-success-700 rounded-full">
                    Aktif
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">PK 2024</span>
                  <span className="text-xs px-2 py-1 bg-warning-100 text-warning-700 rounded-full">
                    Draft
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Planning = () => {
  return (
    <Routes>
      <Route path="/" element={<PlanningOverview />} />
      <Route path="/*" element={<PlanningOverview />} />
    </Routes>
  );
};

export default Planning;
