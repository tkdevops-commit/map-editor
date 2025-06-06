const svg = d3.select("#world-map");
const tooltip = d3.select(".tooltip");

const width = window.innerWidth;
const height = window.innerHeight;

// Define projection and path
const projection = d3.geoNaturalEarth1()
  .scale(width / 6)
  .translate([width / 2, height / 2]);

const path = d3.geoPath().projection(projection);

// Set up color scale
const colorScale = d3.scaleSequential(d3.interpolateViridis).domain([0, 100]);

// Sample Data (replace with your data) 
// Add distributed lists
// Static lists?
const sampleData = [
 { country: "USA", value: 75 },
  { country: "Canada", value: 50 },
  { country: "England", value: 60 },
  { country: "Australia", value: 30 },
  { country: "New Zealand", value: 40 },
];

const dataMap = new Map(sampleData.map(d => [d.country, d.value]));

// Zoom behavior
const zoom = d3.zoom()
  .scaleExtent([1, 8])  // Limit zoom levels
  .on("zoom", function(event) {
    svg.attr("transform", event.transform);
  });

svg.call(zoom);

// Load world map data
d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
  .then(worldData => {
    svg.selectAll("path")
      .data(worldData.features)
      .join("path")
      .attr("d", path)
      .attr("fill", d => {
        const val = dataMap.get(d.properties.name);
        return val !== undefined ? colorScale(val) : "#444";
      })
      .attr("stroke", "#222")
      .on("mousemove", (event, d) => {
        const val = dataMap.get(d.properties.name);
        tooltip.classed("show", true)
          .html(`<strong>${d.properties.name}</strong><br>Value: ${val ?? 'N/A'}`)
          .style("left", `${event.pageX + 12}px`)
          .style("top", `${event.pageY - 28}px`);
      })
      .on("mouseout", () => {
        tooltip.classed("show", false);
      });
  })
  .catch(err => {
    console.error("Map load error:", err);
  });

const = 
