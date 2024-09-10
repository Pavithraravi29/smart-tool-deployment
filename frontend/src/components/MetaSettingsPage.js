import React, { useState } from 'react';
import Spikemeasurements from './Test';

const MetaSettingsPage = () => {
  const [fileName, setFileName] = useState('');
  const [navigateTospike, setNavigateTospike] = useState(false);
  const [directoryPath, setDirectoryPath] = useState('C:\\Users\\SDC-03\\Downloads');
  const [selectedFileType, setSelectedFileType] = useState('txt'); // Default file type

  const handleFileTypeChange = (event) => {
    setSelectedFileType(event.target.value);
  };

  const generateFileName = () => {
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}${currentDate.getMonth() + 1}${currentDate.getDate()}`;
    return `Recording_${formattedDate}_${currentDate.getHours()}${currentDate.getMinutes()}${currentDate.getSeconds()}`;
  };

  const handleGenerateNameClick = () => {
    const generatedName = generateFileName();
    setFileName(generatedName);
  };

  const handleFileNameChange = (event) => {
    setFileName(event.target.value);
  };
  

  const predefinedRows = [
    { name: 'Operator', unit: '', value: '' },
    { name: 'Process', unit: '', value: '' },
    { name: 'Tool', unit: '', value: '' },
    { name: 'Material', unit: '', value: '' },
    { name: 'Tool Gage', unit: 'mm', value: '' },
    { name: 'd', unit: 'mm', value: '' },
    { name: 'z', unit: '', value: '' },
    { name: 'ap', unit: 'mm', value: '' },
    { name: 'ae', unit: 'mm', value: '' },
    { name: 'vc', unit: 'm/min', value: '' },
    { name: 'n', unit: 'U/min', value: '' },
    { name: 'fu', unit: 'mm', value: '' },
    { name: 'fz', unit: 'mm/z', value: '' },
    { name: 'X', unit: '', value: '' },
    { name: 'Cooling', unit: '', value: '' },
    { name: 'Unit type', unit: '', value: '' },
  ];
  

  const [tableData, setTableData] = useState([...predefinedRows]);

const handleTableInputChange = (index, field, value) => {
  // Ensure that only 'value' field is editable
  if (field === 'value') {
    const updatedData = [...tableData];
    updatedData[index][field] = value;
    setTableData(updatedData);
  }
};
const handleBrowseClick = async () => {
  try {
    const directoryHandle = await window.showDirectoryPicker();
    const directoryPath = directoryHandle.name; // This gets the name of the selected directory
    setDirectoryPath(directoryPath);
  } catch (error) {
    console.error('Error selecting directory:', error);
  }
};


  const handlespikeClick = () => {
    setNavigateTospike(true);
  };

  if (navigateTospike) {
    return <Spikemeasurements  fileName={fileName} selectedFileType={selectedFileType} directoryPath={directoryPath} tableData={tableData}/>;
  }

  return (
    <section className="bg-white p-4 rounded-lg shadow-md">
    <h2 className="text-2xl font-bold mb-5" style={{fontSize:'26px',textAlign:'center'}}>Meta Settings</h2>
    <h2 className="text-1xl  mb-4"style={{fontSize:'16px',textAlign:'center'}}>Enter your current process parameter and define where and in what format your recordings should be saved</h2>
    <div className="grid grid-cols-2 gap-4">
      {/* Left Section */}
      <div>
        
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Name</th>
              <th className="border border-gray-300 p-2">Unit</th>
              <th className="border border-gray-300 p-2">Value</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={index}>
                <td className="border border-gray-300 p-2">{row.name}</td>
                <td className="border border-gray-300 p-2">{row.unit}</td>
                <td className="border border-gray-300 p-2">
                  <input
                    type="text"
                    value={row.value}
                    onChange={(e) => handleTableInputChange(index, 'value', e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mb-4">
        <label htmlFor="directoryInput" className="block text-gray-700 font-bold mb-2">
          Directory Path:
        </label>
        <input
          type="text"
          id="directoryInput"
          value={directoryPath}
          onChange={(e) => setDirectoryPath(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Selected directory path..."
        />
         <button
          type="button"
          onClick={handleBrowseClick}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4"
        >
          Browse
        </button>
        <label className="block text-gray-700 font-bold mb-2">File Type:</label>
        <div className="flex space-x-4">
          <label>
            <input
              type="radio"
              value="txt"
              checked={selectedFileType === 'txt'}
              onChange={handleFileTypeChange}
              className="mr-2"
            />
            .txt
          </label>
          <label>
            <input
              type="radio"
              value="pms"
              checked={selectedFileType === 'pms'}
              onChange={handleFileTypeChange}
              className="mr-2"
            />
            .pms
          </label>
          <label>
            <input
              type="radio"
              value="csv"
              checked={selectedFileType === 'csv'}
              onChange={handleFileTypeChange}
              className="mr-2"
            />
            .csv
          </label>
          </div>
        <div className="mb-4">
        <label htmlFor="filepreview" className="block text-gray-700 font-bold mb-2">
          File Name:
        </label>
        <input
          type="text"
          id="filepreview"
          value={fileName}
          onChange={handleFileNameChange}
          className="w-full border rounded p-2"
        />
        <button
          type="button"
          onClick={handleGenerateNameClick}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4"
        >
          Auto Generate
        </button>
      </div>
      </div>
        <label onClick={handlespikeClick} style={{position: 'fixed', bottom: '20px', right: '20px', fontSize: '18px', backgroundColor:'#1292d6', border: '1px solid #000', padding: '5px 10px'}}>
            Next Spike_measurements
        </label>
      </div>
    </section>
  );
};

export default MetaSettingsPage;