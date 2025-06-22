import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders the NavBar', () => {
    render(<App />)
    expect(screen.getByText(/functions/i)).toBeInTheDocument()
  })

  it('renders the HomePage by default', () => {
    render(<App />)
    expect(screen.getByText(/PDFinho/i)).toBeInTheDocument()
  })

  it('renders the AboutPage when route is /about', () => {
    window.history.pushState({}, '', '/about')
    render(<App />)
    expect(screen.getByText(/about/i)).toBeInTheDocument()
  })
})
