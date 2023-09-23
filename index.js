// D3 Scatterplot
//* First fetch the data
const sec = []
const req = new XMLHttpRequest();
req.open("GET", "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json");
req.send();
req.onload = function(){
    const json = JSON.parse(req.responseText);
    for(i = 0; i < json.length; i++){
        minutes = Math.floor(json[i].Seconds/60)
        second = json[i].Seconds % 60
        sec.push(`${minutes}:${second < 10? '0' + second: second}`)
    }
    w = 1100;
    h = 600;
    padding = 70;
    const title1 = d3.select("body")
                        .append("div")
                        .attr("id", "title")
                        .text("Doping in Professional Bicycle Racing")
    const title2 = d3.select("body")
                     .append("div")
                     .attr("id", "title2")
                     .text("35 Fastest times up Alpe d'Huez")

                        
    const svg = d3.select("body")
                  .append("svg")
                  .attr("width", w)
                  .attr("height", h)
                  .style("background-color", "white")
                  
    //? lets create the xscale and the xaxis

    const xScale = d3.scaleLinear()
                     .range([padding, w - padding])
                     .domain([d3.min(json, (d) => d.Year -1), d3.max(json, (d) => d.Year + 1)])
    const xAxis = d3.axisBottom(xScale)
                    .tickFormat(d3.format('d'))

    const scale = d3.select("svg")
                    .append("g")
                    .attr("transform", "translate(0, " + (h - padding) + ")")
                    .attr("id", "x-axis")
                    .call(xAxis)


    //? lets create the yscale and yaxis
    const yScale = d3.scaleTime()
                     .range([padding ,h-padding])
                     .domain([d3.min(json, (d) => {
                        return new Date(d.Seconds * 1000)
                     }), d3.max(json, (d) => {
                        return new Date(d.Seconds * 1000)
                     })])
                     

    const yAxis = d3.axisLeft(yScale)
                    .tickFormat(d3.timeFormat('%M:%S'))

    const scale2 = d3.select("svg")
                     .append("g")
                     .attr("transform", "translate(" + (padding) + ", 0)")
                     .attr("id", "y-axis")
                     .call(yAxis)

    let tooltip = d3.select("#tooltip")               
    svg.selectAll("circle")
       .data(json)
       .enter()
       .append("circle")
       .attr("class", "dot")
       .attr("data-xvalue", (d) => {
        return d['Year'];
       })
       .attr("data-yvalue", (d) => {
        return new Date(d['Seconds'] * 1000)
       })
       .attr("cx", (d) => {
        return xScale(d.Year)
       })
       .attr("cy", (d) => {
        return yScale(new Date(d.Seconds * 1000))
       })
       .attr("r", 5)
       .attr("fill", (d) => {
        if(d.Doping !== ""){
            return "blue"
        }else{
            return "orangered"
        }

       }) 
       .on("mouseover", function(e, d) {

        d3.select("#tooltip")
        .attr("data-year", d.Year)
        .attr("data-date", d.date)
        .style("opacity", 1)
        .style("left", (e.target.pageX) + "px")
        .style("top", (e.target.pageY) + "px")
        .style("background-color", "lightblue")
        
        if(d.Doping !== ""){
            tooltip.html("<p>" + d.Name +": " + d.Nationality+' Year :' + d.Year + " Time: " + d.Time + "</p><h2>$" + d.Doping + "</h2>");
        }else{
            tooltip.html("<p>" + d.Name +": " + d.Nationality +' Year :' + d.Year + "Time: " + d.Time + "</p><h2>$" + "No Doping Allegations </h2>");
        }
        })
      .on("mouseout", function(d, i) {
        d3.select("#tooltip")
        .style("opacity", 0)
        .style("background-color", "none");

      })

    
}