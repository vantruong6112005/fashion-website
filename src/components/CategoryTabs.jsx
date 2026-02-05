import { useState } from 'react'
import '../CSS/categoryTabs.css'

const TABS = [
  'Hàng mới về',
  'Bộ sưu tập',
  'BST Retro vacation',
  'Giá tốt',
  'Áo',
  'Quần',
  'Phụ kiện',
  'Sản phẩm bán chạy'
]
export default function CategoryTabs() {
  const [active, setActive] = useState('Bộ sưu tập')

  return (
    <div className="container">
      <div className="category-tabs-wrapper">
        {TABS.map(tab => (
          <button
            key={tab}
            className={`tab-btn ${active === tab ? 'active' : ''}`}
            onClick={() => setActive(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  )
}
