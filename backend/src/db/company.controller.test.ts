import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('./company.repository.js', () => ({
  companyRepository: {
    getAllCompanies: vi.fn(),
    getCompanyById: vi.fn(),
    updateCompanyInfo: vi.fn(),
    updateCompanyNotes: vi.fn(),
    toggleCompanySaved: vi.fn(),
    deleteCompany: vi.fn(),
  },
}))

import { companyController } from './company.controller.js'
import { companyRepository } from './company.repository.js'

type MockResponse = {
  status: ReturnType<typeof vi.fn>
  json: ReturnType<typeof vi.fn>
}

const createResponse = () => {
  const res: any = {
    status: vi.fn(() => res),
    json: vi.fn(() => res),
  }
  return res as MockResponse
}

const createRequest = (params: any = {}, body: any = {}) => ({ params, body })

beforeEach(() => {
  vi.clearAllMocks()
})

describe('companyController', () => {
  it('returns 400 for invalid company id on fetchCompanyById', async () => {
    const req = createRequest({ id: 'not-a-number' })
    const res = createResponse()

    await companyController.fetchCompanyById(req as any, res as any)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid company id' })
    expect(companyRepository.getCompanyById).not.toHaveBeenCalled()
  })

  it('returns 200 with updated company notes when body is valid', async () => {
    const req = createRequest({ id: '5' }, { notes: 'New notes' })
    const res = createResponse()
    ;(companyRepository.updateCompanyNotes as any).mockResolvedValue({ id: 5, notes: 'New notes' })

    await companyController.updateCompanyNotes(req as any, res as any)

    expect(companyRepository.updateCompanyNotes).toHaveBeenCalledWith(5, 'New notes')
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      message: 'Company notes updated successfully',
      data: { id: 5, notes: 'New notes' },
    })
  })

  it('returns 400 when saved payload is not boolean', async () => {
    const req = createRequest({ id: '3' }, { saved: 'yes' })
    const res = createResponse()

    await companyController.updateCompanySaved(req as any, res as any)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      message: 'saved must be a boolean',
    })
    expect(companyRepository.toggleCompanySaved).not.toHaveBeenCalled()
  })

  it('returns 200 when deleteCompany succeeds', async () => {
    const req = createRequest({ id: '7' })
    const res = createResponse()
    ;(companyRepository.deleteCompany as any).mockResolvedValue(undefined)

    await companyController.deleteCompany(req as any, res as any)

    expect(companyRepository.deleteCompany).toHaveBeenCalledWith(7)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ message: 'Company deleted successfully' })
  })
})
