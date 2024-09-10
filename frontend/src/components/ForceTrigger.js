import React, { useState } from 'react';
import PlotPagecopy from './PlotPage copy';
import RecordPage from './RecordPage'; 

const ForceTrigger = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [navigateToPlotPage, setNavigateToPlotPage] = useState(false);
  const [navigateToRecordPage, setNavigateToRecordPage] = useState(false);

  const handleFileSelect = (e) => {
    const files = e.target.files;
  
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      setNavigateToPlotPage(true);
    } else {
      console.error("No files selected.");
    }
  };
  

  const handleRecordClick = () => {
    setNavigateToRecordPage(true);
  };

  // Conditionally render the PlotPage component when navigateToPlotPage is true
  if (navigateToPlotPage && selectedFile) {
    return <PlotPagecopy selectedFile={selectedFile} />;
  }

  // Conditionally render the RecordPage component when navigateToRecordPage is true
  if (navigateToRecordPage) {
    return <RecordPage />;
  }

  return (
    <div className="App">
      <h1 className='font-serif'  style={{ fontSize: '38px' ,textAlign: 'center'}}>Reference measurement</h1>
      <p className='font-serif'  style={{ fontSize: '18px' ,textAlign: 'center'}}>You need a reference measurement to define your trigger. Select how you want to proceed.</p>
      <div style={{ position: 'fixed', bottom: 0, width: '100%', background: '#fff', padding: '10px', marginLeft: '600px' }}>
        <input type="file" onChange={handleFileSelect} style={{ display: 'none' }} id="fileInput" />
        <label htmlFor="fileInput" onClick={handleFileSelect} style={{ border: '1px solid #000', padding: '5px 10px', marginRight: '10px', backgroundColor:'#1292d6'}}>
          Add measurements from a file
        </label>
        <label onClick={handleRecordClick} style={{ border: '1px solid #000', padding: '5px 10px', marginRight: '10px', backgroundColor:'#1292d6' }}>
          Record a measurement now
        </label>
        {/* Add a new label with an appropriate handler for continuing a previous run */}
        <label htmlFor="fileInput" onClick={handleFileSelect} style={{ border: '1px solid #000', padding: '5px 10px', backgroundColor:'#1292d6' }}>
          Continue a previous run
        </label>
      </div>
    </div>
  );
};

export default ForceTrigger;
