import Header from '../components/Header'
import Hero from '../components/Hero'

import FeaturedProducts from '../components/FeaturedProducts'
import PromoBanner from '../components/PromoBanner'
import Footer from '../components/Footer'
import CategoryTabs from '../components/CategoryTabs'
export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      {/* danh mục sản phẩm  */}
     <CategoryTabs />
      <FeaturedProducts />
      <PromoBanner/>
      <Footer />
    </>
  )
}
