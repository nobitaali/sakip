import { Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import { 
  Book, 
  Search, 
  ChevronRight, 
  ChevronDown, 
  ExternalLink,
  Download,
  Play,
  FileText,
  Video,
  Code,
  HelpCircle,
  Star,
  Users,
  Zap
} from 'lucide-react'
import { gettingStartedContent } from './content/gettingStarted'
import CodeBlock from '../../components/Documentation/CodeBlock'
import VideoPlayer from '../../components/Documentation/VideoPlayer'

const DocumentationOverview = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeSection, setActiveSection] = useState('getting-started')
  const [expandedSections, setExpandedSections] = useState(new Set(['getting-started']))

  const documentationSections = [
    {
      id: 'getting-started',
      title: 'Memulai',
      icon: Zap,
      description: 'Panduan cepat untuk memulai menggunakan SAKIP',
      items: [
        { id: 'introduction', title: 'Pengenalan SAKIP', type: 'guide' },
        { id: 'login', title: 'Cara Login', type: 'guide' },
        { id: 'dashboard', title: 'Memahami Dashboard', type: 'guide' },
        { id: 'navigation', title: 'Navigasi Aplikasi', type: 'guide' }
      ]
    },
    {
      id: 'modules',
      title: 'Modul Aplikasi',
      icon: Book,
      description: 'Panduan lengkap setiap modul dalam SAKIP',
      items: [
        { id: 'planning', title: 'Modul Perencanaan', type: 'guide' },
        { id: 'performance', title: 'Pengukuran Kinerja', type: 'guide' },
        { id: 'budget', title: 'Modul Anggaran', type: 'guide' },
        { id: 'reporting', title: 'Modul Pelaporan', type: 'guide' },
        { id: 'evaluation', title: 'Modul Evaluasi', type: 'guide' },
        { id: 'integration', title: 'Integrasi & API', type: 'guide' }
      ]
    },
    {
      id: 'user-roles',
      title: 'Peran Pengguna',
      icon: Users,
      description: 'Panduan berdasarkan peran pengguna',
      items: [
        { id: 'super-admin', title: 'Super Administrator', type: 'guide' },
        { id: 'admin-opd', title: 'Admin OPD', type: 'guide' },
        { id: 'evaluator', title: 'Evaluator', type: 'guide' },
        { id: 'viewer', title: 'Viewer Publik', type: 'guide' }
      ]
    },
    {
      id: 'tutorials',
      title: 'Tutorial',
      icon: Video,
      description: 'Tutorial step-by-step untuk tugas-tugas umum',
      items: [
        { id: 'create-renstra', title: 'Membuat Renstra', type: 'tutorial' },
        { id: 'input-performance', title: 'Input Data Kinerja', type: 'tutorial' },
        { id: 'generate-lkjip', title: 'Generate LKJIP', type: 'tutorial' },
        { id: 'conduct-evaluation', title: 'Melakukan Evaluasi', type: 'tutorial' }
      ]
    },
    {
      id: 'faq',
      title: 'FAQ',
      icon: HelpCircle,
      description: 'Pertanyaan yang sering diajukan',
      items: [
        { id: 'general-faq', title: 'Pertanyaan Umum', type: 'faq' },
        { id: 'technical-faq', title: 'Masalah Teknis', type: 'faq' },
        { id: 'data-faq', title: 'Pengelolaan Data', type: 'faq' }
      ]
    },
    {
      id: 'api',
      title: 'API Documentation',
      icon: Code,
      description: 'Dokumentasi API untuk developer',
      items: [
        { id: 'api-overview', title: 'API Overview', type: 'api' },
        { id: 'authentication', title: 'Authentication', type: 'api' },
        { id: 'endpoints', title: 'API Endpoints', type: 'api' },
        { id: 'examples', title: 'Code Examples', type: 'api' }
      ]
    }
  ]

  const quickLinks = [
    {
      title: 'Panduan Cepat',
      description: 'Mulai menggunakan SAKIP dalam 5 menit',
      icon: Zap,
      color: 'bg-primary-500',
      link: '#getting-started'
    },
    {
      title: 'Video Tutorial',
      description: 'Tonton video panduan penggunaan',
      icon: Video,
      color: 'bg-success-500',
      link: '#tutorials'
    },
    {
      title: 'API Docs',
      description: 'Dokumentasi lengkap API SAKIP',
      icon: Code,
      color: 'bg-warning-500',
      link: '#api'
    },
    {
      title: 'FAQ',
      description: 'Jawaban untuk pertanyaan umum',
      icon: HelpCircle,
      color: 'bg-danger-500',
      link: '#faq'
    }
  ]

  const toggleSection = (sectionId) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId)
    } else {
      newExpanded.add(sectionId)
    }
    setExpandedSections(newExpanded)
  }

  const getTypeIcon = (type) => {
    const icons = {
      guide: FileText,
      tutorial: Video,
      faq: HelpCircle,
      api: Code
    }
    return icons[type] || FileText
  }

  const filteredSections = documentationSections.map(section => ({
    ...section,
    items: section.items.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(section => section.items.length > 0 || searchTerm === '')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary-100 rounded-full">
                <Book className="h-8 w-8 text-primary-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Dokumentasi SAKIP
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Panduan lengkap penggunaan Sistem Akuntabilitas Kinerja Instansi Pemerintah
            </p>
            
            {/* Search */}
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari dokumentasi..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Navigasi</h3>
                <nav className="space-y-2">
                  {filteredSections.map((section) => (
                    <div key={section.id}>
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="flex items-center justify-between w-full text-left p-2 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center">
                          <section.icon className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-sm font-medium text-gray-700">
                            {section.title}
                          </span>
                        </div>
                        {expandedSections.has(section.id) ? (
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                      
                      {expandedSections.has(section.id) && (
                        <div className="ml-6 mt-2 space-y-1">
                          {section.items.map((item) => {
                            const IconComponent = getTypeIcon(item.type)
                            return (
                              <button
                                key={item.id}
                                onClick={() => setActiveSection(item.id)}
                                className={`flex items-center w-full text-left p-2 rounded-md text-sm transition-colors ${
                                  activeSection === item.id
                                    ? 'bg-primary-50 text-primary-700'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                              >
                                <IconComponent className="h-3 w-3 mr-2" />
                                {item.title}
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </nav>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeSection === 'getting-started' && (
              <div className="space-y-8">
                {/* Quick Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {quickLinks.map((link, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-center mb-4">
                        <div className={`p-2 rounded-lg ${link.color} text-white mr-3`}>
                          <link.icon className="h-5 w-5" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">{link.title}</h3>
                      </div>
                      <p className="text-gray-600">{link.description}</p>
                      <div className="mt-4">
                        <span className="text-primary-600 text-sm font-medium flex items-center">
                          Mulai sekarang <ChevronRight className="h-4 w-4 ml-1" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Getting Started Content */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Selamat Datang di SAKIP</h2>
                  
                  <div className="prose max-w-none">
                    <p className="text-lg text-gray-600 mb-6">
                      SAKIP (Sistem Akuntabilitas Kinerja Instansi Pemerintah) adalah aplikasi web modern yang dirancang untuk membantu instansi pemerintah dalam mengelola, memantau, dan mengevaluasi kinerja secara terpadu dan terintegrasi.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Fitur Utama</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div className="flex items-start">
                        <div className="p-2 bg-primary-100 rounded-lg mr-3 mt-1">
                          <Zap className="h-4 w-4 text-primary-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Dashboard Real-time</h4>
                          <p className="text-gray-600 text-sm">Monitor kinerja dan anggaran secara langsung</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="p-2 bg-success-100 rounded-lg mr-3 mt-1">
                          <FileText className="h-4 w-4 text-success-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Auto-Generate LKJIP</h4>
                          <p className="text-gray-600 text-sm">Laporan otomatis sesuai standar PermenPANRB</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="p-2 bg-warning-100 rounded-lg mr-3 mt-1">
                          <Code className="h-4 w-4 text-warning-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Integrasi SIPD</h4>
                          <p className="text-gray-600 text-sm">Sinkronisasi data anggaran otomatis</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="p-2 bg-danger-100 rounded-lg mr-3 mt-1">
                          <Users className="h-4 w-4 text-danger-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Multi-Role Access</h4>
                          <p className="text-gray-600 text-sm">Akses sesuai peran pengguna</p>
                        </div>
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Langkah Pertama</h3>
                    <div className="bg-gray-50 rounded-lg p-6">
                      <ol className="list-decimal list-inside space-y-3 text-gray-700">
                        <li>Login menggunakan akun yang telah diberikan administrator</li>
                        <li>Familiarisasi dengan dashboard utama</li>
                        <li>Jelajahi modul sesuai dengan peran Anda</li>
                        <li>Mulai input data atau lakukan evaluasi</li>
                        <li>Generate laporan sesuai kebutuhan</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Dynamic content based on activeSection */}
            {['introduction', 'login', 'dashboard', 'navigation'].includes(activeSection) && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {gettingStartedContent[activeSection]?.title}
                </h2>
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ 
                    __html: gettingStartedContent[activeSection]?.content || '' 
                  }}
                />
              </div>
            )}

            {/* Add more content sections as needed */}
            {activeSection === 'planning' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Modul Perencanaan</h2>
                
                <div className="prose max-w-none">
                  <p className="text-lg text-gray-600 mb-6">
                    Modul Perencanaan digunakan untuk mengelola dokumen perencanaan dan rencana aksi organisasi.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Fitur Utama</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="border border-gray-200 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Rencana Strategis (Renstra)</h4>
                      <ul className="text-gray-600 text-sm space-y-2">
                        <li>• Hierarki perencanaan lengkap</li>
                        <li>• Input visi, misi, tujuan</li>
                        <li>• Manajemen indikator kinerja</li>
                        <li>• Export dan import data</li>
                      </ul>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Rencana Aksi (Renaksi)</h4>
                      <ul className="text-gray-600 text-sm space-y-2">
                        <li>• Timeline kegiatan bulanan</li>
                        <li>• Target dan milestone</li>
                        <li>• Tracking progress real-time</li>
                        <li>• Template standar</li>
                      </ul>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Cara Membuat Renstra</h3>
                  
                  <div className="space-y-4">
                    {[
                      'Klik "Tambah Rencana" di pojok kanan atas',
                      'Isi informasi dasar (periode, visi, misi)',
                      'Tambah tujuan strategis',
                      'Definisikan sasaran untuk setiap tujuan',
                      'Buat program dan kegiatan',
                      'Set indikator dan target kinerja'
                    ].map((step, index) => (
                      <div key={index} className="flex items-start">
                        <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                          <span className="text-primary-600 font-semibold text-sm">{index + 1}</span>
                        </div>
                        <p className="text-gray-600 mt-1">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* FAQ Section */}
            {activeSection === 'general-faq' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Pertanyaan Umum (FAQ)</h2>
                
                <div className="space-y-6">
                  {[
                    {
                      question: 'Apa itu SAKIP?',
                      answer: 'SAKIP (Sistem Akuntabilitas Kinerja Instansi Pemerintah) adalah sistem untuk mengelola, memantau, dan mengevaluasi kinerja instansi pemerintah secara terpadu dan terintegrasi.'
                    },
                    {
                      question: 'Bagaimana cara mendapatkan akun?',
                      answer: 'Akun SAKIP diberikan oleh administrator sistem di instansi Anda. Hubungi bagian IT atau administrator SAKIP untuk mendapatkan username dan password.'
                    },
                    {
                      question: 'Apakah data saya aman?',
                      answer: 'Ya, SAKIP menggunakan enkripsi data dan sistem keamanan berlapis untuk melindungi informasi Anda. Akses data dibatasi sesuai dengan peran pengguna.'
                    },
                    {
                      question: 'Bisakah mengakses SAKIP dari mobile?',
                      answer: 'Ya, SAKIP memiliki desain responsif yang dapat diakses dari berbagai perangkat termasuk smartphone dan tablet.'
                    },
                    {
                      question: 'Bagaimana cara backup data?',
                      answer: 'Sistem melakukan backup otomatis setiap hari. Untuk backup manual, hubungi administrator sistem.'
                    }
                  ].map((faq, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-6">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <HelpCircle className="h-5 w-5 text-primary-500 mr-2" />
                        {faq.question}
                      </h3>
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Bantuan</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>Email: support@sakip-app.com</p>
                <p>Phone: 021-1234-5678</p>
                <p>WhatsApp: 0812-3456-7890</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
              <div className="space-y-2 text-sm">
                <a href="#" className="text-primary-600 hover:text-primary-500 block">
                  Video Tutorial
                </a>
                <a href="#" className="text-primary-600 hover:text-primary-500 block">
                  Download Manual PDF
                </a>
                <a href="#" className="text-primary-600 hover:text-primary-500 block">
                  Template Dokumen
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Updates</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>Version 1.2.0</p>
                <p>Last updated: December 2024</p>
                <p>Next update: January 2025</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const Documentation = () => {
  return (
    <Routes>
      <Route path="/" element={<DocumentationOverview />} />
      <Route path="/*" element={<DocumentationOverview />} />
    </Routes>
  )
}

export default Documentation