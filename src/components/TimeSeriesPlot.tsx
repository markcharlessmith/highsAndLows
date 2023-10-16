import Plot from 'react-plotly.js';

interface TimeSeriesPlotProps {
  data: {
    sId: string;
    time: number;
    tmp: number;
  }[],
  device_id: string;
  temp_type: string;
}

const TimeSeriesPlot: React.FC<TimeSeriesPlotProps> = ({ data, temp_type }) => {

  function formatUnixTimestamp(timestamp: number): string {
    const date = new Date(timestamp);
    date.setDate(date.getDate() + 1); // Add one day to the date to account for the UTC offset
    const options: Intl.DateTimeFormatOptions = { year: '2-digit', month: 'numeric', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

  // syntax that go the graph to show up with the weather data
  const xValues: string[] = data.map((item) => formatUnixTimestamp(item.time));
  const yValues: number[] = data.map((item) => item.tmp);

  const maxTemp: number = Math.max(...yValues);
  const minTemp: number = Math.min(...yValues);

   // Define the y-axis range based on temp_type
  const yaxisRange: number[] = temp_type === "low" ? [5, 95] : [28, 128];

  // Calculate the mean average high temperature
  const meanTemp: number = Math.round(yValues.reduce((a, b) => a + b, 0) / yValues.length);

  // Find the day (data point) closest to the mean temperature
  const closestToMean: number = yValues.reduce((prev, curr) =>
    Math.abs(curr - meanTemp) < Math.abs(prev - meanTemp) ? curr : prev
  );

  const annotations = [
    {
      // Find the x-coordinate of the max temperature point
      x: xValues[yValues.indexOf(maxTemp)], 
      y: maxTemp,
      // Label for the max temperature point
      // Use string interpolation to add the maxTemp and date to the label
      text: temp_type === "high" ? `Max High Temp<br>${maxTemp}°F on ${xValues[yValues.indexOf(maxTemp)].substring(0, xValues[yValues.indexOf(maxTemp)].length - 3)}` : `Max Low Temp<br>${maxTemp}°F on ${xValues[yValues.indexOf(maxTemp)].substring(0, xValues[yValues.indexOf(maxTemp)].length - 3)}`, 
      font: {
        size: 9.5,
      },
      showarrow: true,
      arrowhead: 2,
      arrowsize: 1,
      arrowwidth: 2,
      arrowcolor: 'red',
    },
    {
      // Find the x-coordinate of the min temperature point
      x: xValues[yValues.indexOf(minTemp)], 
      y: minTemp,
      // Label for the min temperature point
      text: temp_type === "high" ? `Min High Temp<br>${minTemp}°F on ${xValues[yValues.indexOf(minTemp)].substring(0, xValues[yValues.indexOf(minTemp)].length - 3)}` : `Min Low Temp<br>${minTemp}°F on ${xValues[yValues.indexOf(minTemp)].substring(0, xValues[yValues.indexOf(minTemp)].length - 3)}`, 
      font: {
        size: 9.5,
      },
      showarrow: true,
      arrowhead: 2,
      arrowsize: 1,
      arrowwidth: 2,
      arrowcolor: 'blue',
      // Adjust the arrow's position to point up from below
      ay: 30, 
    },
    {
      // X-coordinate of the day closest to the mean temperature
      x: xValues[yValues.indexOf(closestToMean)], 
      y: meanTemp,
      text: temp_type === "high" ? `Mean Avg High: ${meanTemp}°F` : `Mean Avg Low: ${meanTemp}°F`,
      font: {
        size: 9.5,
      },
      showarrow: true,
      arrowhead: 2,
      arrowsize: 1,
      arrowwidth: 2,
      arrowcolor: 'purple',
      ay: -40,
   },
  ];


  const plotData: Plotly.Data[] = [
    {
      x: xValues,
      y: yValues,
      type: 'scatter',
      mode: 'lines+markers',
      line: {
        width: 1,
        color: 'black',
      },
      marker: {
        size: 4,
        color: 'black',
      },
      name: temp_type === 'high' ? 'Recorded High Temperature' : 'Recorded Low Temperature',
    },
    // add a red line at y = (the maximum value in the dataset)
    {
      x: xValues,
      y: Array(xValues.length).fill(
        Math.max(...yValues) //ts-ignore
      ),
      type: 'scatter',
      mode: 'lines',
      line: {
        width: 1,
        color: 'red',
      },
      name: temp_type === 'high' ? 'Yearly Maximum High Temp' : 'Yearly Maximum Low Temp',
    },
    // add a blue line at y = (the minimum value in the dataset)
    {
      x: xValues,
      y: Array(xValues.length).fill(
        Math.min(...yValues)), //ts-ignore
      type: 'scatter',
      mode: 'lines',
      line: {
        width: 1,
        color: 'blue',
      },
      name: temp_type === 'high' ? 'Yearly Minimum High Temp' : 'Yearly Minimum Low Temp',
    },
     // Add a dashed purple line at the average
  {
    x: xValues,
    // Use the mean temperature for all y-values
    y: Array(xValues.length).fill(meanTemp), 
    type: 'scatter',
    mode: 'lines',
    line: {
      width: 1,
      color: 'purple',
      dash: 'dash', 
    },
    name: temp_type === 'high' ? 'Mean Annual High Temp' : 'Mean Annual Low Temp',
  },
  ];

  const layout: Partial<Plotly.Layout> = {
    width: 1250,
    height: 400,
    title: `${temp_type === 'high' ? 'High' : 'Low'} Temperatures in ${data[0].sId}`,
    xaxis: {
      title: 'Date',
      nticks: 12,
      tickangle: 0,
      tickvals: xValues.map((date, index) => (index % 30 === 0) ? date : null), // Set the first day of each month as tick positions
      ticktext: xValues.map((date, index) => (index % 30 === 0) ? date : ''), // Set the corresponding month as tick labels
    },
    yaxis: {
      title: 'Temperature (°F)',
      range: yaxisRange,
    },
    annotations: annotations,
    plot_bgcolor: '#F9F6CF',
    // set paper_bgcolor to 'transparent' to remove the default bg and so border-radius and bg color of the chart container will be visible
    paper_bgcolor: 'transparent',
    font: {
      family: 'Roboto mono, monospace',
      color: '#6A4B3E',
    },
     
  };

  const config = { staticPlot: false}

  return (
      <Plot data={plotData} layout={layout} config={config} style={{ borderRadius: '8px', backgroundColor: '#ECD98D' }} />
  );
};

export default TimeSeriesPlot;