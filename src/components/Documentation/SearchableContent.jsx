import { useState, useMemo } from 'react'
import { Search, ChevronRight } from 'lucide-react'

const SearchableContent = ({ sections, onSectionSelect }) => {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredContent = useMemo(() => {
    if (!searchTerm) return []

    const results = []
    sections.forEach(section => {
      section.items.forEach(item => {
        if (
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          section.title.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          results.push({
            ...item,
            sectionTitle: section.title,
            sectionId: section.id
          })
        }
      })
    })
    return results
  }, [sections, searchTerm])

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Cari dalam dokumentasi..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {searchTerm && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {filteredContent.length > 0 ? (
            <div className="p-2">
              {filteredContent.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    onSectionSelect(item.id)
                    setSearchTerm('')
                  }}
                  className="w-full text-left p-3 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{item.title}</p>
                      <p className="text-sm text-gray-500">{item.sectionTitle}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              Tidak ada hasil ditemukan untuk "{searchTerm}"
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchableContent