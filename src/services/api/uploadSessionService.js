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

const uploadSessionService = {
  async getAll() {
    try {
      await delay(250)
      const apperClient = getApperClient()
      
      const params = {
        Fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'total_files', 'completed_files', 'total_size', 'uploaded_size', 'start_time'],
        orderBy: [{ FieldName: 'CreatedOn', SortType: 'DESC' }]
      }
      
      const response = await apperClient.fetchRecords('upload_session', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }
      
      return response.data || []
    } catch (error) {
      console.error('Error fetching upload sessions:', error)
      toast.error('Failed to load upload sessions')
      return []
    }
  },

  async getById(id) {
    try {
      await delay(200)
      const apperClient = getApperClient()
      
      const params = {
        fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'total_files', 'completed_files', 'total_size', 'uploaded_size', 'start_time']
      }
      
      const response = await apperClient.getRecordById('upload_session', parseInt(id), params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      return response.data
    } catch (error) {
      console.error(`Error fetching upload session with ID ${id}:`, error)
      throw error
    }
  },

  async create(session) {
    try {
      await delay(300)
      const apperClient = getApperClient()
      
      // Only include Updateable fields
      const recordData = {
        Name: session.name || session.Name || `Upload Session ${Date.now()}`,
        total_files: session.total_files || session.totalFiles || 0,
        completed_files: session.completed_files || session.completedFiles || 0,
        total_size: session.total_size || session.totalSize || 0,
        uploaded_size: session.uploaded_size || session.uploadedSize || 0,
        start_time: new Date().toISOString()
      }
      
      const params = {
        records: [recordData]
      }
      
      const response = await apperClient.createRecord('upload_session', params)
      
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
      
      throw new Error('Failed to create upload session record')
    } catch (error) {
      console.error('Error creating upload session:', error)
      throw error
    }
  },

  async update(id, updates) {
    try {
      await delay(200)
      const apperClient = getApperClient()
      
      // Only include Updateable fields
      const { Id, CreatedOn, CreatedBy, ModifiedOn, ModifiedBy, ...updateableFields } = updates
      
      const params = {
        records: [{
          Id: parseInt(id),
          ...updateableFields
        }]
      }
      
      const response = await apperClient.updateRecord('upload_session', params)
      
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
      
      throw new Error('Failed to update upload session record')
    } catch (error) {
      console.error('Error updating upload session:', error)
      throw error
    }
  },

  async delete(id) {
    try {
      await delay(250)
      const apperClient = getApperClient()
      
      const params = {
        RecordIds: [parseInt(id)]
      }
      
      const response = await apperClient.deleteRecord('upload_session', params)
      
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
      console.error('Error deleting upload session:', error)
      throw error
    }
  }
}

export default uploadSessionService