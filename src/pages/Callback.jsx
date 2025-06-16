import React, { useEffect } from 'react'

const Callback = () => {
  useEffect(() => {
    const { ApperUI } = window.ApperSDK
    ApperUI.showSSOVerify("#authentication-callback")
  }, [])
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-surface-900 via-surface-800 to-surface-900">
      <div id="authentication-callback">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Authenticating...</p>
        </div>
      </div>
    </div>
  )
}

export default Callback