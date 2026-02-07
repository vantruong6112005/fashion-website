import { useEffect, useState } from 'react'
import hero1 from '../assets/images/hero/hero1.png'
import hero2 from '../assets/images/hero/hero2.png'
import hero3 from '../assets/images/hero/hero1.png'
import '../CSS/Hero.css'

const slides = [
  {
    title: 'ÁO POLO\nNĂNG ĐỘNG',
    image: hero2
  },
  {
    title: 'VESTON\nLỊCH LÃM',
    image: hero1
  },
  {
    title: 'PHONG CÁCH\nDOANH NHÂN',
    image: hero3
  }
]

export default function Hero() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex(i => (i + 1) % slides.length)
    }, 5000) // 5s cho sang

    return () => clearInterval(timer)
  }, [])

  const slide = slides[index]

  return (
    <section className="hero-owen">
      <div className="container">
        <div key={index} className="hero-content">

          <div className="hero-text">
            <h1>
              {slide.title.split('\n').map((line, i) => (
                <span key={i}>
                  {line}
                  <br />
                </span>
              ))}
            </h1>
            <button className="btn-hero">Xem thêm</button>
          </div>

          <div className="hero-image">
            <img src={slide.image} alt="Hero" />
          </div>

        </div>
      </div>
    </section>
  )
}
