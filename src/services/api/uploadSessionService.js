import uploadSessions from '../mockData/uploadSessions.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let data = [...uploadSessions]

const uploadSessionService = {
  async getAll() {
    await delay(250)
    return [...data]
  },

  async getById(id) {
    await delay(200)
    const item = data.find(session => session.Id === parseInt(id))
    if (!item) throw new Error('Upload session not found')
    return { ...item }
  },

  async create(session) {
    await delay(300)
    const maxId = data.length > 0 ? Math.max(...data.map(item => item.Id)) : 0
    const newSession = {
      ...session,
      Id: maxId + 1,
      startTime: new Date().toISOString()
    }
    
    data.push(newSession)
    return { ...newSession }
  },

  async update(id, updates) {
    await delay(200)
    const index = data.findIndex(session => session.Id === parseInt(id))
    if (index === -1) throw new Error('Upload session not found')
    
    // Don't allow Id modification
    const { Id, ...allowedUpdates } = updates
    data[index] = { ...data[index], ...allowedUpdates }
    return { ...data[index] }
  },

  async delete(id) {
    await delay(250)
    const index = data.findIndex(session => session.Id === parseInt(id))
    if (index === -1) throw new Error('Upload session not found')
    
    const deletedItem = data[index]
    data.splice(index, 1)
    return { ...deletedItem }
  }
}

export default uploadSessionService