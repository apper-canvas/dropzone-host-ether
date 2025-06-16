import { motion } from 'framer-motion'
import FileUploadSection from '@/components/organisms/FileUploadSection'

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen"
    >
      <FileUploadSection />
    </motion.div>
  )
}

export default Home