<template>
  <div ref="chartRef" class="w-full aspect-square relative text-xs"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import * as d3 from 'd3';

const props = defineProps<{
  data: { label: string; value: number; max?: number }[];
  color?: string;
  fillColor?: string;
}>();

const chartRef = ref<HTMLElement | null>(null);

const drawChart = () => {
  if (!chartRef.value || !props.data.length) return;

  // Clear previous
  d3.select(chartRef.value).selectAll('*').remove();

  const width = chartRef.value.clientWidth;
  const height = chartRef.value.clientHeight;
  const margin = 30;
  const radius = Math.min(width, height) / 2 - margin;

  const svg = d3.select(chartRef.value)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', `translate(${width / 2},${height / 2})`);

  // Scales
  const angleSlice = (Math.PI * 2) / props.data.length;
  const rScale = d3.scaleLinear()
    .range([0, radius])
    .domain([0, 100]); // Assuming normalized 0-100 input for simplicity, or we can compute max

  // Draw Grid (Web)
  const levels = 4;
  for (let level = 0; level < levels; level++) {
    const r = (radius / levels) * (level + 1);
    svg.selectAll(`.level-${level}`)
      .data(props.data)
      .enter()
      .append('line')
      .attr('x1', (d, i) => r * Math.cos(angleSlice * i - Math.PI / 2))
      .attr('y1', (d, i) => r * Math.sin(angleSlice * i - Math.PI / 2))
      .attr('x2', (d, i) => r * Math.cos(angleSlice * (i + 1) - Math.PI / 2))
      .attr('y2', (d, i) => r * Math.sin(angleSlice * (i + 1) - Math.PI / 2))
      .attr('stroke', '#e5e7eb') // gray-200
      .attr('stroke-dasharray', '4 4')
      .attr('stroke-width', 1);
  }

  // Draw Axes
  const axes = svg.selectAll('.axis')
    .data(props.data)
    .enter()
    .append('g')
    .attr('class', 'axis');

  axes.append('line')
    .attr('x1', 0)
    .attr('y1', 0)
    .attr('x2', (d, i) => rScale(100) * Math.cos(angleSlice * i - Math.PI / 2))
    .attr('y2', (d, i) => rScale(100) * Math.sin(angleSlice * i - Math.PI / 2))
    .attr('stroke', '#d1d5db') // gray-300
    .attr('stroke-width', 1);

  // Draw Labels
  axes.append('text')
    .attr('class', 'legend')
    .attr('text-anchor', 'middle')
    .attr('dy', '0.35em')
    .attr('x', (d, i) => (rScale(100) + 20) * Math.cos(angleSlice * i - Math.PI / 2))
    .attr('y', (d, i) => (rScale(100) + 20) * Math.sin(angleSlice * i - Math.PI / 2))
    .text(d => d.label)
    .style('font-size', '12px')
    .style('fill', 'var(--color-text-primary, #374151)');

  // Draw Polygon (The Data)
  const line = d3.line<{ label: string; value: number }>()
    .x((d, i) => rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2))
    .y((d, i) => rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2))
    .curve(d3.curveLinearClosed);

  svg.append('path')
    .datum(props.data)
    .attr('d', line)
    .style('stroke-width', 2)
    .style('stroke', props.color || '#3b82f6')
    .style('fill', props.fillColor || 'rgba(59, 130, 246, 0.2)')
    .style('filter', 'drop-shadow(0 0 4px rgba(59, 130, 246, 0.3))');
    
  // Draw Dots
  svg.selectAll('.dot')
    .data(props.data)
    .enter()
    .append('circle')
    .attr('cx', (d, i) => rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2))
    .attr('cy', (d, i) => rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2))
    .attr('r', 4)
    .style('fill', props.color || '#3b82f6')
    .style('stroke', '#fff')
    .style('stroke-width', 2);
};

onMounted(() => {
  drawChart();
  window.addEventListener('resize', drawChart);
});

watch(() => props.data, drawChart, { deep: true });
</script>

<style scoped>
/* Optional: Transitions */
path {
  transition: d 0.5s ease;
}
</style>
