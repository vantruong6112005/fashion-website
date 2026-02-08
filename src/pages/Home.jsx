import Header from '../components/Header'
import Hero from '../components/Hero'

import FeaturedProducts from '../components/FeaturedProducts'
import PromoBanner from '../components/PromoBanner'
import Footer from '../components/Footer'
import CategoryTabs from '../components/CategoryTabs'
import Newletter from '../components/Newsletter'
export default function Home() {
  return (
    <>
   
      <Hero />
      {/* danh mục sản phẩm  */}
     {/* <CategoryTabs /> */}
      <FeaturedProducts />
      <Newletter />
     
    </>
  )
}
