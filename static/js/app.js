function init() {
//getting a reference from the drop down list
    var selector = d3.select("#selDataset");

    d3.json("samples.json").then((data) => {
        var sampleNames = data.names;
    
        sampleNames.forEach((sample) => {
          selector
            .append("option")
            .text(sample)
            .property("value", sample);
        });
    
        // Use the first sample from the list to build the initial plots
        var startSample = sampleNames[0];
        createCharts(startSample);
        collectMeta(startSample);
      });
    }








    
// Initialize the dashboard by running the init function
init();







//This function is needed to allow for new/different subjects to pass through
    //Tried changing the function name as test. 
      //do not change this option's name
function optionChanged(freshSample) {
    // Fetch new data each time a new sample is selected
    collectMeta(freshSample);
    createCharts(freshSample);
    
  }







  // Demographics Panel 

  //This panel is for the demographic key terms found on the left hand side that list the info of the selected subject


function collectMeta(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      // Filter the data for the object with the desired sample number
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      // Use d3 to select the panel with id of `#sample-metadata`
      var PANEL = d3.select("#sample-metadata");
  
      // Use `.html("") to clear any existing metadata
      PANEL.html("");
  
      // Use `Object.entries` to add each key and value pair to the panel
      // Hint: Inside the loop, you will need to use d3 to append new
      // tags for each key-value in the metadata.
      Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
  
    });
  }
  




  //https://plotly.com/javascript/horizontal-bar-charts/
  //Basic Horizontal Bar Chart was perfectly fine to display the data
  
  // 1. Create the createCharts function.
  function createCharts(sample) {
  
    // 2. Use d3.json to load and retrieve the samples.json file 
    d3.json("samples.json").then((data) => {
  
      // 3. Create a variable that holds the samples array. 
      var samples = data.samples;
  
      // 4. Create a variable that filters the samples for the object with the desired sample number.
      var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
  
      //  5. Create a variable that holds the first sample in the array.
      var result = resultArray[0];
  
      // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
      var  ids = result.otu_ids;
      var labels = result.otu_labels.slice(0, 10).reverse();
      var values = result.sample_values.slice(0,10).reverse();
  
      var bubbleLabels = result.otu_labels;
      var bubbleValues = result.sample_values;
  
      // 7. Create the yticks for the bar chart.
      // Hint: Get the the top 10 otu_ids and map them in descending order  
      //  so the otu_ids with the most bacteria are last. 
      var yticks = ids.map(sampleObj => "OTU " + sampleObj).slice(0,10).reverse();
      console.log(yticks)
  
      // 8. Create the trace for the bar chart. 
      var barTrace = {
        x: values,
        y: yticks,
        type: "bar",
        orientation: "h",
        text: labels 
      };
  
      var barChartData = [barTrace]
  
      // 9. Create the layout for the bar chart. 
      var barLayout = {
       title: "Top 10 Bacteria Cultures Found"
      };
  
      // 10. Use Plotly to plot the data with the layout. 
      Plotly.newPlot("bar", barChartData, barLayout);
  





      //https://plotly.com/javascript/bubble-charts/
      //using the second to last chart since It is the most comprehensive without adding in the different shapes to the mix
      // 1. Create the trace for the bubble chart.
      var bubbleChartData = [{
        x: ids,
        y: bubbleValues,
        text: bubbleLabels,
        mode: "markers",
         marker: {
           size: bubbleValues,
           color: bubbleValues,
           colorscale: "YlGnBu" 
         }
     
      }];
  
      // 2. Create the layout for the bubble chart.
      var bubbleLayout = {
        title: "Bacteria Cultures per Sample",
          xaxis: {title: "OTU ID"},
          automargin: true,
          hovermode: "closest"
      };
  
      //Since all the data is already present in the ids and bubble values, I do not need to do the different trace setups like in the example
      // 3. Use Plotly to plot the data with the layout.
      Plotly.newPlot("bubble", bubbleChartData, bubbleLayout); 
  




      //washing frequency bonus - gauge chart
      //https://plotly.com/javascript/gauge-charts/

      //Links for the different step colors
      //https://plotly.com/javascript/indicator/
      //https://plotly.com/javascript/reference/indicator/#indicator-gauge-steps-items-step-color

      //1 Create a variable that filters the metadata array for the object with the desired sample number.
      // Create a variable that holds the first sample in the array.
      var metadata = data.metadata;
      var gaugeArray = metadata.filter(metaObj => metaObj.id == sample); 
  
      // 2. Create a variable that holds the first sample in the metadata array.
      // Create variables that hold the otu_ids, otu_labels, and sample_values.
      var gaugeResult = gaugeArray[0];
  
      // 3. Create a variable that holds the washing frequency.
      var wfreqs = gaugeResult.wfreq;
      console.log(wfreqs)
      
      // 4. Create the trace for the gauge chart.
      var gaugeData = [{
        value: wfreqs,
        type: "indicator",
        mode: "gauge+number",
        title: {text: "Belly Button Washing Frequency"},
        gauge: {
          axis: {range: [null,10], dtick: "2"},
  
          bar: {color: "black"},
          steps:[
            {range: [0, 2], color: "red"},
            {range: [2, 4], color: "orange"},
            {range: [4, 6], color: "yellow"},
            {range: [6, 8], color: "lightgreen"},
            {range: [8, 10], color: "green"}
          ],
          dtick: 2
        }
      }];
      
      // 5. Create the layout for the gauge chart.
      var gaugeLayout = { 
        automargin: true
      };
  
      // 6. Use Plotly to plot the gauge data and layout.
      Plotly.newPlot("gauge", gaugeData, gaugeLayout);
    });
  }