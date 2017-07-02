
//cdnjs.cloudflare.com/ajax/libs/d3/3.5.16/d3.min.js

// FCC: Visual Data with a Heat Map
// User Story: I can view a heat map with data represented both on the Y and X axis.
// User Story: Each cell is colored based its relationship to other data.
// User Story: I can mouse over a cell in the heat map to get more exact information.

var Chart = (function(window, d3) {
  var url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json';
  
  var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var colors = ['#5e4fa2', '#3288bd', '#66c2a5', '#abdda4', '#e6f598', '#ffffbf', '#fee08b', '#fdae61', '#f46d43', '#d53e4f', '#9e0142'];
  var fillColor = '';
  var yearFormat = d3.time.format('%Y');
  var monthFormat = d3.time.format('%m');
  
  var x, y, xAxis, yAxis, svg, chartWrapper, div, bars, data, baseTemperature, varianceBounds, range, increment, legend, legendText, margin, width, height;
  
  d3.json(url, init);
  
  function init(json) {
    
    data = json.monthlyVariance;
    
    baseTemperature = json.baseTemperature;
    
    var xBounds = d3.extent(json.monthlyVariance.map(function(x) { return yearFormat.parse(String(x.year)); }));
    var yBounds = d3.extent(json.monthlyVariance.map(function(y) { return monthFormat.parse(String(y.month)); }));
    
    varianceBounds = d3.extent(json.monthlyVariance.map(function(v) { return v.variance; }));
    range = varianceBounds[1] - varianceBounds[0];
    increment = range/11;
    
    x = d3.time.scale()
      .domain(xBounds);
    
    y = d3.time.scale()
      .domain([yBounds[1], yBounds[0]]);
      
    xAxis = d3.svg.axis()
      .orient('bottom');
    
    yAxis = d3.svg.axis()
      .tickFormat(d3.time.format('%B'))
      .orient('left');
       
    svg = d3.select('.chart').append('svg');
    
    chartWrapper = svg.append('g');
    
    div = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);
    
    chartWrapper.append('g')
      .attr('class', 'axis axis--x');
    
    chartWrapper.append('text')
      .attr('class', 'label label--title')
      .style('text-anchor', 'middle')
      .text('Monthly Global Land-Surface Temperature');
    
    chartWrapper.append('text')
      .attr('class', 'label label--years')
      .style('text-anchor', 'middle')
      .text('1753 - 2015');
    
    chartWrapper.append('text')
      .attr('class', 'label label--subtitle')
      .style('text-anchor', 'middle')
      .text('Temperatures in Celsius relative to the January 1951 - December 1980 average (8.66°C ± 0.07)');
    
    chartWrapper.append('text')
      .attr('class', 'label label--x')
      .attr('dy', '.71em')
      .style('text-anchor', 'middle')
      .text('Year');
    
    chartWrapper.append('g')
      .attr('class', 'axis axis--y');
    
    legend = chartWrapper.selectAll('rect')
      .data(colors).enter()
      .append('rect')
      .style('fill', function(d) {
        return d;
      });
    
    legendText = chartWrapper.selectAll('legend')
      .data(colors).enter()
      .append('text')
      .attr('class', 'legend--scale')
      .style('text-anchor', 'end')
      .text(function(d, i) { return (varianceBounds[0] + increment * i).toFixed(1); });
      
    
    bars = chartWrapper.selectAll('bar')
      .data(json.monthlyVariance)
      .enter().append('rect')
    
      .on('mouseover', function(d) {
        d3.select(this).attr('class', 'bar active');
        div.transition()
          .duration(200)
          .style('opacity', 0.9);
        // year - month
        // tempearture
        // variance
      
        fillColor = getFillColor(d, true);
      
        div.html('<div class="textbox"><span class="textbox--year">' + d.year + '</span>' + ' - ' +
                '<span class="textbox--month">' + monthNames[d.month - 1] + '</span><br>' + 
                '<span class="textbox--temperature ' + fillColor + '">' + (baseTemperature + d.variance).toFixed(3) + '°C</span><br>' +
                '<span class="textbox--variance">' + d.variance.toFixed(3) + '°C</span></div>')
          .style('left', (d3.event.pageX) + 'px')
          .style('top', (d3.event.pageY - 64) + 'px');
      })
    
      .on('mouseout', function(d) {
        d3.select(this).attr('class','bar');
        div.transition()
          .duration(500)
          .style('opacity', 0);
      });
    
    bars.attr('fill', getFillColor);

    
    function getFillColor(d, isText) {
      
      if (arguments[1] === true)
        isText = true;
      else isText = false;
      
      switch (true) {
        case (d.variance < varianceBounds[0] + increment): { isText ? fillColor = 'color-1' : fillColor = colors[0] }; break;
          case (d.variance < varianceBounds[0] + increment*2): { isText ? fillColor = 'color-2' : fillColor = colors[1] }; break;
          case (d.variance < varianceBounds[0] + increment*3): { isText ? fillColor = 'color-3' : fillColor = colors[2] }; break;
          case (d.variance < varianceBounds[0] + increment*4): { isText ? fillColor = 'color-4' : fillColor = colors[3] }; break;
          case (d.variance < varianceBounds[0] + increment*5): { isText ? fillColor = 'color-5' : fillColor = colors[4] }; break;
          case (d.variance < varianceBounds[0] + increment*6): { isText ? fillColor = 'color-6' : fillColor = colors[5] }; break;
          case (d.variance < varianceBounds[0] + increment*7): { isText ? fillColor = 'color-7' : fillColor = colors[6] }; break;
          case (d.variance < varianceBounds[0] + increment*8): { isText ? fillColor = 'color-8' : fillColor = colors[7] }; break;
          case (d.variance < varianceBounds[0] + increment*9): { isText ? fillColor = 'color-9' : fillColor = colors[8] }; break;
          case (d.variance < varianceBounds[0] + increment*10): { isText ? fillColor = 'color-10' : fillColor = colors[9] }; break;
          case (d.variance < varianceBounds[0] + increment*11): { isText ? fillColor = 'color-11' : fillColor = colors[10] }; break;
          default: console.log('uh oh');
        }
        
        return fillColor;
    }
    
    render();
    
  }
  
  function render() {
    updateDimensions();
    
    x.range([0, width]);
    y.range([height, 0]);
    
    svg.attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom);
    
    chartWrapper.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    
    xAxis.scale(x);
    
    if (window.innerWidth > 1200) {
      xAxis.ticks(25);
    }
    else xAxis.ticks(12);
    
    yAxis.scale(y);
    
    svg.select('.axis.axis--x')
      .attr('transform', 'translate(0,' + (height + 3) + ')')
      .call(xAxis);
    
    svg.select('.axis.axis--y')
      .attr('transform', 'translate(0,' + height * -0.045 + ')')
      .call(yAxis);
    
    
    svg.select('.label.label--title')
      .attr('x', width/2)
      .attr('y', -margin.top/2 - 25);
    
    svg.select('.label.label--years')
      .attr('x', width/2)
      .attr('y', -margin.top/2 - 2);
    
    svg.select('.label.label--subtitle')
      .attr('x', width/2)
      .attr('y', -margin.top/2 + 15);
    
    svg.select('.label.label--x')
      .attr('x', width/2)
      .attr('y', height + 35);
    
    bars.attr('width', width/data.length + 5)
      .attr('height', height/12 + 4)
      .attr('x', function(d) { return x(new Date(yearFormat.parse(String(d.year)))); })
      .attr('y', function(d) { return y(new Date(monthFormat.parse(String(d.month - 1)))); });
      
    legend.attr('width', (width * 1/3)/11)
      .attr('height', 20)
      .attr('x', function(d, i) { return width * 2/3 + (i * (width * 1/3)/11); })
      .attr('y', height + 40);
    
    legendText.attr('x', function(d, i) { return width * 2/3 + (i * (width * 1/3)/11) + 25; })
      .attr('y', height + 75);
    
  }
  
  function updateDimensions() {
    margin = {top: 120, right: 40, bottom: 90, left: 80};
    
    margin.top = window.innerHeight * 0.04 + 100;
    
    width = window.innerWidth * 0.8 - margin.left - margin.right;
    height = window.innerHeight * 0.8 - margin.top - margin.bottom;
  }
  
  return {
    render: render
  }
  
})(window, d3);

window.addEventListener('resize', Chart.render);


