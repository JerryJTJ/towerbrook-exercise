import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('./people.repository.js', () => ({
  peopleRepository: {
    getAllPeople: vi.fn(),
    getAllPeopleByCompanyId: vi.fn(),
    getPersonById: vi.fn(),
    updatePeopleNotes: vi.fn(),
    updatePeopleSaved: vi.fn(),
    deletePeople: vi.fn(),
  },
}))

import { peopleController } from './people.controller.js'
import { peopleRepository } from './people.repository.js'

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

describe('peopleController', () => {
  it('returns all people from repository', async () => {
    const req = createRequest()
    const res = createResponse()
    ;(peopleRepository.getAllPeople as any).mockResolvedValue([{ id: 1 }])

    await peopleController.fetchAllPeople(req as any, res as any)

    expect(peopleRepository.getAllPeople).toHaveBeenCalled()
    expect(res.json).toHaveBeenCalledWith([{ id: 1 }])
  })

  it('returns 400 when updatePeopleNotes receives non-string notes', async () => {
    const req = createRequest({ id: '2' }, { notes: 123 })
    const res = createResponse()

    await peopleController.updatePeopleNotes(req as any, res as any)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ message: 'Notes must be a string' })
    expect(peopleRepository.updatePeopleNotes).not.toHaveBeenCalled()
  })

  it('returns 400 when deletePeople receives invalid id', async () => {
    const req = createRequest({ id: 'NaN' })
    const res = createResponse()

    await peopleController.deletePeople(req as any, res as any)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid peopleId' })
    expect(peopleRepository.deletePeople).not.toHaveBeenCalled()
  })
})
