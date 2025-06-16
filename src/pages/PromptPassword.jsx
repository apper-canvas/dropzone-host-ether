import { useEffect } from 'react'

const PromptPassword = () => {
    useEffect(() => {
        const { ApperUI } = window.ApperSDK
        ApperUI.showPromptPassword('#authentication-prompt-password')
    }, [])

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-surface-900 via-surface-800 to-surface-900">
            <div className="flex-1 py-12 px-5 flex justify-center items-center">
                <div id="authentication-prompt-password" className="glass-dark mx-auto w-[400px] max-w-full p-10 rounded-2xl">
                    <div className="text-center text-white">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-4">Loading...</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PromptPassword