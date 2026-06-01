import { describe, expect, it, vi } from 'vitest'

vi.mock('./axiosClient', () => ({
  axiosClient: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}))

import {
  deleteCompany,
  getAllCompanies,
  getCompanyById,
  updateCompanyNotes,
  updateCompanySaved,
} from './company.api'
import { axiosClient } from './axiosClient'

describe('company.api', () => {
  it('returns company list on success', async () => {
    ;(axiosClient.get as any).mockResolvedValue({ data: [{ id: 1 }] })

    const result = await getAllCompanies()

    expect(result).toEqual([{ id: 1 }])
    expect(axiosClient.get).toHaveBeenCalledWith('/db/company')
  })

  it('returns empty object when getCompanyById fails', async () => {
    ;(axiosClient.get as any).mockRejectedValue(new Error('network'))

    const result = await getCompanyById(2)

    expect(result).toEqual({})
    expect(axiosClient.get).toHaveBeenCalledWith('/db/company/2')
  })

  it('throws when updateCompanyNotes fails', async () => {
    ;(axiosClient.post as any).mockRejectedValue(new Error('bad request'))

    await expect(updateCompanyNotes(3, 'notes')).rejects.toThrow('bad request')
    expect(axiosClient.post).toHaveBeenCalledWith('/db/company/3/notes', { notes: 'notes' })
  })

  it('posts saved state and returns response data', async () => {
    ;(axiosClient.post as any).mockResolvedValue({ data: { success: true } })

    const result = await updateCompanySaved(4, true)

    expect(result).toEqual({ success: true })
    expect(axiosClient.post).toHaveBeenCalledWith('/db/company/4/saved', { saved: true })
  })

  it('calls delete and returns response', async () => {
    ;(axiosClient.delete as any).mockResolvedValue({ data: { ok: true } })

    const result = await deleteCompany(5)

    expect(result).toEqual({ ok: true })
    expect(axiosClient.delete).toHaveBeenCalledWith('/db/company/5')
  })
})
