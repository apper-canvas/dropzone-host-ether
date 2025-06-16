import { toast } from 'react-toastify'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  })
}

const fileUploadService = {
  async getAll() {
    try {
      await delay(300)
      const apperClient = getApperClient()
      
      const params = {
        Fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'size', 'type', 'progress', 'status', 'share_url', 'thumbnail_url', 'uploaded_at'],
        orderBy: [{ FieldName: 'CreatedOn', SortType: 'DESC' }]
      }
      
      const response = await apperClient.fetchRecords('file_upload', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }
      
      return response.data || []
    } catch (error) {
      console.error('Error fetching file uploads:', error)
      toast.error('Failed to load files')
      return []
    }
  },

  async getById(id) {
    try {
      await delay(200)
      const apperClient = getApperClient()
      
      const params = {
        fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'size', 'type', 'progress', 'status', 'share_url', 'thumbnail_url', 'uploaded_at']
      }
      
      const response = await apperClient.getRecordById('file_upload', parseInt(id), params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      return response.data
    } catch (error) {
      console.error(`Error fetching file upload with ID ${id}:`, error)
      throw error
    }
  },

  async create(fileUpload) {
    try {
      await delay(400)
      
      // File type validation
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain', 'application/zip']
      if (!allowedTypes.includes(fileUpload.type)) {
        throw new Error(`File type ${fileUpload.type} is not supported`)
      }
      
      // File size validation (50MB limit)
      if (fileUpload.size > 50 * 1024 * 1024) {
        throw new Error('File size exceeds 50MB limit')
      }
      
      const apperClient = getApperClient()
      
      // Only include Updateable fields
      const recordData = {
        Name: fileUpload.name || fileUpload.Name,
        size: fileUpload.size,
        type: fileUpload.type,
        progress: 0,
        status: 'pending',
        share_url: null,
        thumbnail_url: fileUpload.type.startsWith('image/') ? `https://picsum.photos/200/200?random=${Date.now()}` : null,
        uploaded_at: null
      }
      
      const params = {
        records: [recordData]
      }
      
      const response = await apperClient.createRecord('file_upload', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successfulRecords.length > 0) {
          return successfulRecords[0].data
        }
      }
      
      throw new Error('Failed to create file upload record')
    } catch (error) {
      console.error('Error creating file upload:', error)
      throw error
    }
  },

  async update(id, updates) {
    try {
      await delay(200)
      const apperClient = getApperClient()
      
      // Only include Updateable fields
      const { Id, CreatedOn, CreatedBy, ModifiedOn, ModifiedBy, ...updateableFields } = updates
      
      // If status is completed, generate share URL
      if (updates.status === 'completed' && !updates.share_url) {
        updateableFields.share_url = `https://dropzone.app/file/${id}`
        updateableFields.uploaded_at = new Date().toISOString()
      }
      
      const params = {
        records: [{
          Id: parseInt(id),
          ...updateableFields
        }]
      }
      
      const response = await apperClient.updateRecord('file_upload', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success)
        const failedUpdates = response.results.filter(result => !result.success)
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`)
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successfulUpdates.length > 0) {
          return successfulUpdates[0].data
        }
      }
      
      throw new Error('Failed to update file upload record')
    } catch (error) {
      console.error('Error updating file upload:', error)
      throw error
    }
  },

  async delete(id) {
    try {
      await delay(300)
      const apperClient = getApperClient()
      
      const params = {
        RecordIds: [parseInt(id)]
      }
      
      const response = await apperClient.deleteRecord('file_upload', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success)
        const failedDeletions = response.results.filter(result => !result.success)
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`)
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        return successfulDeletions.length > 0
      }
      
      return false
    } catch (error) {
      console.error('Error deleting file upload:', error)
      throw error
    }
  },

  // Simulate upload progress
  async simulateUpload(id, onProgress) {
    try {
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
    } catch (error) {
      console.error('Error simulating upload:', error)
      throw error
    }
  }
}

export default fileUploadService