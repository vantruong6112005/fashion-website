
import Header from '../components/Header'
export default function Layout1({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  )
}