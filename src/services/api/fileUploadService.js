import fileUploads from '../mockData/fileUploads.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let data = [...fileUploads]

const fileUploadService = {
  async getAll() {
    await delay(300)
    return [...data]
  },

  async getById(id) {
    await delay(200)
    const item = data.find(upload => upload.Id === parseInt(id))
    if (!item) throw new Error('File upload not found')
    return { ...item }
  },

  async create(fileUpload) {
    await delay(400)
    
    // Simulate file type validation
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain', 'application/zip']
    if (!allowedTypes.includes(fileUpload.type)) {
      throw new Error(`File type ${fileUpload.type} is not supported`)
    }
    
    // Simulate file size validation (50MB limit)
    if (fileUpload.size > 50 * 1024 * 1024) {
      throw new Error('File size exceeds 50MB limit')
    }
    
    const maxId = data.length > 0 ? Math.max(...data.map(item => item.Id)) : 0
    const newUpload = {
      ...fileUpload,
      Id: maxId + 1,
      progress: 0,
      status: 'pending',
      shareUrl: null,
      thumbnailUrl: fileUpload.type.startsWith('image/') ? `https://picsum.photos/200/200?random=${maxId + 1}` : null,
      uploadedAt: null
    }
    
    data.push(newUpload)
    return { ...newUpload }
  },

  async update(id, updates) {
    await delay(200)
    const index = data.findIndex(upload => upload.Id === parseInt(id))
    if (index === -1) throw new Error('File upload not found')
    
    // Don't allow Id modification
    const { Id, ...allowedUpdates } = updates
    data[index] = { ...data[index], ...allowedUpdates }
    
    // If status is completed, generate share URL
    if (updates.status === 'completed' && !data[index].shareUrl) {
      data[index].shareUrl = `https://dropzone.app/file/${data[index].Id}`
      data[index].uploadedAt = new Date().toISOString()
    }
    
    return { ...data[index] }
  },

  async delete(id) {
    await delay(300)
    const index = data.findIndex(upload => upload.Id === parseInt(id))
    if (index === -1) throw new Error('File upload not found')
    
    const deletedItem = data[index]
    data.splice(index, 1)
    return { ...deletedItem }
  },

  // Simulate upload progress
  async simulateUpload(id, onProgress) {
    const upload = data.find(item => item.Id === parseInt(id))
    if (!upload) throw new Error('File upload not found')
    
    // Update status to uploading
    await this.update(id, { status: 'uploading' })
    
    // Simulate progress updates
    for (let progress = 0; progress <= 100; progress += Math.random() * 15 + 5) {
      if (progress > 100) progress = 100
      
      await delay(200 + Math.random() * 300) // Variable delay for realism
      await this.update(id, { progress })
      
      if (onProgress) onProgress(progress)
      
      if (progress >= 100) {
        await this.update(id, { status: 'completed', progress: 100 })
        break
      }
    }
    
    return this.getById(id)
  }
}

export default fileUploadService