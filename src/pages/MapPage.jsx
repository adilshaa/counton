import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const MapPage = () => {
  const svgRef = useRef();
  const [worldData, setWorldData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transform, setTransform] = useState(d3.zoomIdentity);

  useEffect(() => {
    const loadWorldData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load TopoJSON library with proper waiting
        const loadTopojson = () => {
          return new Promise((resolve, reject) => {
            // Check if topojson is already loaded
            if (window.topojson) {
              resolve(window.topojson);
              return;
            }

            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/topojson/3.0.2/topojson.min.js';
            script.onload = () => {
              // Wait a bit to ensure the library is fully initialized
              setTimeout(() => {
                if (window.topojson) {
                  resolve(window.topojson);
                } else {
                  reject(new Error('TopojSON library failed to load properly'));
                }
              }, 100);
            };
            script.onerror = () => reject(new Error('Failed to load TopojSON library'));
            document.head.appendChild(script);
          });
        };

        // Load TopoJSON first
        const topojson = await loadTopojson();

        // Load world atlas data - using a more reliable source
        const response = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@3/countries-110m.json');

        if (!response.ok) {
          throw new Error(`Failed to fetch world data: ${response.status} ${response.statusText}`);
        }

        const world = await response.json();

        // Validate the data structure
        if (!world.objects || !world.objects.countries) {
          throw new Error('Invalid world data structure');
        }

        // Convert TopoJSON to GeoJSON for countries
        const countries = topojson.feature(world, world.objects.countries);

        // Get country borders
        const borders = topojson.mesh(world, world.objects.countries, (a, b) => a !== b);

        setWorldData({
          countries: countries.features,
          borders: borders
        });

        setLoading(false);
      } catch (err) {
        console.error('Error loading world data:', err);
        setError(`Failed to load world map: ${err.message}`);
        setLoading(false);
      }
    };

    loadWorldData();
  }, []);

  useEffect(() => {
    if (loading || error || !worldData) return;

    const svg = d3.select(svgRef.current);
    const width = 1200;
    const height = 600;

    // Clear previous content
    svg.selectAll('*').remove();

    // Set up projection - using Natural Earth for better country representation
    const projection = d3.geoNaturalEarth1()
      .scale(190)
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    // Create main group for map content
    const g = svg.append('g');

    // Add ocean background
    g.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', '#4a90e2');

    // Draw individual countries
    const countries = g.selectAll('.country')
      .data(worldData.countries)
      .enter()
      .append('path')
      .attr('class', 'country')
      .attr('d', path)
      .attr('fill', '#f8f9fa')
      .attr('stroke', '#343a40')
      .attr('stroke-width', 0.5)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        d3.select(this)
          .attr('fill', '#ffd60a')
          .attr('stroke', '#001d3d')
          .attr('stroke-width', 1.5);

        // Show tooltip
        const countryName = d.properties.NAME || d.properties.NAME_EN || d.properties.ADMIN || 'Unknown Country';

        // Remove existing tooltips
        d3.selectAll('.map-tooltip').remove();

        d3.select('body')
          .append('div')
          .attr('class', 'map-tooltip')
          .style('position', 'absolute')
          .style('background', 'rgba(0, 0, 0, 0.8)')
          .style('color', 'white')
          .style('padding', '8px 12px')
          .style('border-radius', '4px')
          .style('font-size', '14px')
          .style('pointer-events', 'none')
          .style('z-index', '1000')
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px')
          .text(countryName);
      })
      .on('mousemove', function(event) {
        d3.select('.map-tooltip')
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px');
      })
      .on('mouseout', function(event, d) {
        d3.select(this)
          .attr('fill', '#f8f9fa')
          .attr('stroke', '#343a40')
          .attr('stroke-width', 0.5);

        d3.selectAll('.map-tooltip').remove();
      })
      .on('click', function(event, d) {
        // Zoom to country bounds
        const bounds = path.bounds(d);
        const dx = bounds[1][0] - bounds[0][0];
        const dy = bounds[1][1] - bounds[0][1];
        const x = (bounds[0][0] + bounds[1][0]) / 2;
        const y = (bounds[0][1] + bounds[1][1]) / 2;
        const scale = Math.min(8, 0.9 / Math.max(dx / width, dy / height));
        const translate = [width / 2 - scale * x, height / 2 - scale * y];

        svg.transition()
          .duration(750)
          .call(zoom.transform, d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale));
      });

    // Draw country borders for clearer separation
    if (worldData.borders) {
      g.append('path')
        .datum(worldData.borders)
        .attr('d', path)
        .attr('fill', 'none')
        .attr('stroke', '#495057')
        .attr('stroke-width', 0.8)
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round');
    }

    // Set up zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.5, 20])
      .on('zoom', (event) => {
        const { transform } = event;
        g.attr('transform', transform);
        setTransform(transform);

        // Adjust stroke widths based on zoom level
        const strokeScale = 1 / transform.k;
        g.selectAll('.country')
          .attr('stroke-width', Math.max(0.1, 0.5 * strokeScale));
        g.selectAll('path:last-child') // borders
          .attr('stroke-width', Math.max(0.2, 0.8 * strokeScale));
      });

    svg.call(zoom);

    // Store reset function
    svg.node().resetZoom = () => {
      svg.transition()
        .duration(750)
        .call(zoom.transform, d3.zoomIdentity);
    };

    // Cleanup function
    return () => {
      d3.selectAll('.map-tooltip').remove();
    };

  }, [worldData, loading, error]);

  const handleReset = () => {
    if (svgRef.current && svgRef.current.resetZoom) {
      svgRef.current.resetZoom();
    }
  };

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setWorldData(null);
    // Trigger useEffect to reload
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-xl text-gray-700 font-medium">Loading World Map...</p>
          <p className="text-sm text-gray-500 mt-2">Fetching country data and dependencies</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-red-100">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-700 mb-2">Error Loading Map</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto p-4">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold mb-2">World Map Explorer</h1>
                <p className="text-blue-100">Interactive map with all {worldData?.countries?.length || 0} countries</p>
              </div>
              <button
                onClick={handleReset}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-3 rounded-lg transition-all duration-200 font-medium border border-white/30"
              >
                🌍 Reset View
              </button>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border-b p-4">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="text-sm text-gray-700">
                <span className="font-semibold">🎯 Click</span> country to zoom •
                <span className="font-semibold ml-2">🖱️ Scroll</span> to zoom •
                <span className="font-semibold ml-2">🖐️ Drag</span> to pan
              </div>
              <div className="text-sm font-medium text-gray-600">
                Zoom: {transform.k.toFixed(2)}x
              </div>
            </div>
          </div>

          {/* Map Container */}
          <div className="relative">
            <svg
              ref={svgRef}
              width="1200"
              height="600"
              viewBox="0 0 1200 600"
              className="w-full h-auto bg-gradient-to-b from-sky-200 to-sky-100"
              style={{ maxHeight: '80vh', minHeight: '400px' }}
            >
            </svg>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 p-4 text-center">
            <p className="text-sm text-gray-600">
              Data source: Natural Earth via World Atlas • Countries loaded: {worldData?.countries?.length || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
