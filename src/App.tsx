

import './App.css'
import { BarcodeScanner } from './components/ScanPDF417/ScanPDF417'


// Add a type declaration for ReactCodeScanner component


const App = () => {

  
  return (
    <>
      <div>
        <BarcodeScanner />
      </div>
    </>
  )
}

export default App;