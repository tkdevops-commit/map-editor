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

document.addEventListener("DOMContentLoaded", () => {
  const countries = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola",
    "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
    "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus",
    "Belgium", "Belize", "Benin", "Bhutan", "Bolivia",
    "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria",
    "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada",
    "Cape Verde", "Central African Republic", "Chad", "Chile", "China",
    "Colombia", "Comoros", "Congo (Brazzaville)", "Congo (Kinshasa)", "Costa Rica",
    "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark",
    "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt",
    "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini",
    "Ethiopia", "Fiji", "Finland", "France", "Gabon",
    "Gambia", "Georgia", "Germany", "Ghana", "Greece",
    "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
    "Haiti", "Honduras", "Hungary", "Iceland", "India",
    "Indonesia", "Iran", "Iraq", "Ireland", "Israel",
    "Italy", "Ivory Coast", "Jamaica", "Japan", "Jordan",
    "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan",
    "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia",
    "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar",
    "Malawi", "Malaysia", "Maldives", "Mali", "Malta",
    "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia",
    "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco",
    "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal",
    "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria",
    "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan",
    "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru",
    "Philippines", "Poland", "Portugal", "Qatar", "Romania",
    "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines",
    "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal",
    "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia",
    "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea",
    "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname",
    "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan",
    "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga",
    "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
    "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States",
    "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela",
    "Vietnam", "Yemen", "Zambia", "Zimbabwe"
  ];

  const select = document.getElementById("country-select");

  countries.forEach(country => {
    const option = document.createElement("option");
    option.value = country;
    option.textContent = country;
    select.appendChild(option);
  });
});
