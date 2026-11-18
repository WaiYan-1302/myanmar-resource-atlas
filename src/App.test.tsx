import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('Myanmar Field Atlas interactions', () => {
  it('renders all ten map-layer toggles and changes their pressed state', async () => {
    const user = userEvent.setup()
    render(<App />)
    const layerPanel = screen.getByRole('complementary', { name: /map layers/i })
    const toggles = within(layerPanel).getAllByRole('button', { pressed: true })
    expect(toggles).toHaveLength(10)
    expect(within(layerPanel).getByRole('button', { name: /ruby & sapphire/i })).toBeInTheDocument()
    expect(within(layerPanel).getByRole('button', { name: /^gold/i })).toBeInTheDocument()

    const gasToggle = within(layerPanel).getByRole('button', { name: /natural gas/i })
    await user.click(gasToggle)
    expect(gasToggle).toHaveAttribute('aria-pressed', 'false')
    expect(screen.queryByRole('button', { name: /open field note: shwe offshore/i })).not.toBeInTheDocument()
  })

  it('changes explanatory content with each perspective', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Jobs' }))
    expect(screen.getByText(/use one employment measure/i)).toBeInTheDocument()
    expect(screen.getAllByText(/more than one-third of total employment/i).length).toBeGreaterThan(0)

    await user.click(screen.getByRole('button', { name: 'Daily life' }))
    expect(screen.getByText(/trace connections/i)).toBeInTheDocument()
    expect(screen.getByText(/no cross-resource ranking/i)).toBeInTheDocument()
  })

  it('opens resource and region field cards with direct source links', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /open field note: hpakant/i }))
    const jadeCard = screen.getByRole('complementary', { name: /field note for hpakant/i })
    expect(within(jadeCard).getByText(/share: FY 2017–18/i)).toBeInTheDocument()
    expect(within(jadeCard).getAllByRole('link').some((link) => link.getAttribute('href')?.includes('eiti.org'))).toBe(true)

    await user.click(screen.getByRole('button', { name: /open field note for kachin/i }))
    const regionCard = screen.getByRole('complementary', { name: /field note for kachin/i })
    expect(within(regionCard).getByText(/do not show extraction boundaries or control/i)).toBeInTheDocument()
    expect(within(regionCard).getAllByRole('link').some((link) => link.getAttribute('href')?.includes('usgs.gov'))).toBe(true)
  })

  it('opens a river card and exposes claim-level evidence', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /open field note: ayeyarwady/i }))
    const riverCard = screen.getByRole('complementary', { name: /field note for ayeyarwady/i })
    expect(within(riverCard).getAllByText(/main tributary/i).length).toBeGreaterThan(0)
    expect(within(riverCard).getAllByRole('link').some((link) => link.getAttribute('href')?.includes('worldbank.org'))).toBe(true)
  })

  it('exposes source links as real outbound URLs', () => {
    render(<App />)
    const sourceShelf = screen.getByRole('heading', { name: /read the evidence/i }).closest('section')
    expect(sourceShelf).not.toBeNull()
    const links = within(sourceShelf!).getAllByRole('link')
    expect(links).toHaveLength(12)
    for (const link of links) {
      expect(link.getAttribute('href')).toMatch(/^https:\/\//)
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', expect.stringContaining('noreferrer'))
    }
  })
})
