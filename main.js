const svg = d3.select("#world-map");
const tooltip = d3.select(".tooltip");

const width = window.innerWidth;
const height = window.innerHeight - 80; // account for nav height

const projection = d3.geoNaturalEarth1()
  .scale(width / 6)
  .translate([width / 2, height / 2]);

const path = d3.geoPath().projection(projection);
const g = svg.append("g");

const colorScale = d3.scaleSequential(d3.interpolateViridis).domain([0, 100]);

const sampleData = [
  { country: "USA", value: 75 },
  { country: "Canada", value: 50 },
  { country: "England", value: 60 },
  { country: "Australia", value: 30 },
  { country: "New Zealand", value: 40 },
];

const dataMap = new Map(sampleData.map(d => [d.country, d.value]));

const zoom = d3.zoom()
  .scaleExtent([1, 8])
  .on("zoom", event => g.attr("transform", event.transform));

svg.call(zoom);

// Load map
d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
  .then(worldData => {
    g.selectAll("path")
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

    populateDropdown(worldData.features.map(f => f.properties.name));
  });

function populateDropdown(countries) {
  const select = document.getElementById("country-select");
  countries.sort().forEach(country => {
    const option = document.createElement("option");
    option.value = country;
    option.textContent = country;
    select.appendChild(option);
  });

  select.addEventListener("change", e => {
    const selected = e.target.value;
    d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
      .then(worldData => {
        const match = worldData.features.find(f => f.properties.name === selected);
        if (match) {
          const [[x0, y0], [x1, y1]] = path.bounds(match);
          const dx = x1 - x0;
          const dy = y1 - y0;
          const x = (x0 + x1) / 2;
          const y = (y0 + y1) / 2;
          const scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / height)));
          const translate = [width / 2 - scale * x, height / 2 - scale * y];

          svg.transition()
            .duration(750)
            .call(zoom.transform, d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale));
        }
      });
  });
}
