import React, { useState } from 'react';

import TimeSeriesPlot from './components/TimeSeriesPlot';
import './App.css';

// import the data
import burbank_max from './data/burbank_max.json';
import lax_max from './data/lax_max.json';
import usc_max from './data/usc_max.json';
import redondo_max from './data/redondo_max.json';
import culver_max from './data/culver_max.json';
import culver_min from './data/culver_min.json';
import burbank_min from './data/burbank_min.json';
import lax_min from './data/lax_min.json';
import redondo_min from './data/redondo_min.json';
import usc_min from './data/usc_min.json';

// Define the type for your data objects
type DeviceData = {
  data: any; // Replace 'any' with the actual data type
  device_id: string;
  temp_type: string;
};

const App: React.FC = () => {
  // State to keep track of which dataset is currently selected
  const [selectedDatasetIndex, setSelectedDatasetIndex] = useState<number>(0);

  const datasets: DeviceData[] = [
    { data: culver_max, device_id: "Culver City", temp_type: "high"},
    { data: burbank_max, device_id: "Burbank", temp_type: "high"},
    { data: lax_max, device_id: "LAX Airport", temp_type: "high"},
    { data: redondo_max, device_id: "Redondo Beach", temp_type: "high"},
    { data: usc_max, device_id: "USC/Downtown LA", temp_type: "high"},
    { data: culver_min, device_id: "Culver City", temp_type: "low"},
    { data: burbank_min, device_id: "Burbank", temp_type: "low"},
    { data: lax_min, device_id: "LAX Airport", temp_type: "low"},
    { data: redondo_min, device_id: "Redondo Beach", temp_type: "low"},
    { data: usc_min, device_id: "USC/Downtown LA", temp_type: "low"}
  ];

  // Function to handle when a dataset button is clicked
  const handleDatasetChange = (index: number) => {
    setSelectedDatasetIndex(index);
  };

  return (
    <div>
      <div className="menu">
        <h1>HighsAndLows</h1>
        <h3>Los Angeles area temperature data</h3>
        <div className="grid">
          {datasets.map((dataset, index) => (
            // Map over the datasets array and create a button for each dataset
            <button
              key={index}
              // If the selectedDatasetIndex is equal to the index of the dataset we are currently mapping over, then add the class 'active' to the button
              className={`button ${selectedDatasetIndex === index ? 'active' : ''}`}
              onClick={() => handleDatasetChange(index)}
            >
              {index <= 4 ? 'High Temperature' : 'Low Temperature'} Data for {dataset.device_id}
            </button>
          ))}
        </div>
      </div>
      <div className="chart-container">
        {/* <h2>{datasets[selectedDatasetIndex].device_id} Data:</h2> */}
        <TimeSeriesPlot
          data={datasets[selectedDatasetIndex].data}
          device_id={datasets[selectedDatasetIndex].device_id}
          temp_type={datasets[selectedDatasetIndex].temp_type}
        />
      </div>
    </div>
  );
};

export default App;
