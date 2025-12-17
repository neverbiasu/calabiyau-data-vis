<template>
  <div ref="chartContainer" class="w-full h-full min-h-[300px] relative text-xs">
    <div v-if="!hasData" class="absolute inset-0 flex items-center justify-center text-gray-400">
      No Damage Falloff Data
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import * as d3 from 'd3';

const props = defineProps<{
  data?: Record<string, { head: number; body: number; legs: number }>;
  unit?: string;
}>();

const chartContainer = ref<HTMLElement | null>(null);

const hasData = computed(() => props.data && Object.keys(props.data).length > 0);

const drawChart = () => {
  if (!chartContainer.value || !hasData.value) return;
  const container = chartContainer.value;
  d3.select(container).selectAll('*').remove();

  // Parse data
  // data keys are like "10米", "20米". Convert to number.
  const rawData = Object.entries(props.data!).map(([k, v]) => {
      const dist = parseInt(k.replace('米', '').replace('m', '')) || 0;
      return { dist, ...v };
  }).sort((a, b) => a.dist - b.dist);

  if (!rawData.length) return;

  const margin = { top: 20, right: 30, bottom: 30, left: 40 };
  const width = container.clientWidth - margin.left - margin.right;
  const height = container.clientHeight - margin.top - margin.bottom;

  const svg = d3.select(container)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // X Axis
  const x = d3.scaleLinear()
    .domain(d3.extent(rawData, d => d.dist) as [number, number])
    .range([0, width]);

  svg.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x).ticks(5).tickFormat(d => `${d}m`))
    .attr('color', '#9ca3af'); // gray-400

  // Y Axis
  const maxDamage = d3.max(rawData, d => Math.max(d.head, d.body, d.legs)) || 100;
  const y = d3.scaleLinear()
    .domain([0, maxDamage * 1.1])
    .range([height, 0]);

  svg.append('g')
    .call(d3.axisLeft(y).ticks(5))
    .attr('color', '#9ca3af')
    .call(g => g.select('.domain').remove())
    .call(g => g.selectAll('.tick line').clone()
        .attr('x2', width)
        .attr('stroke-opacity', 0.1));

  // Lines
  const lineGenerator = (key: 'head' | 'body' | 'legs') => d3.line<typeof rawData[0]>()
    .x(d => x(d.dist))
    .y(d => y(d[key]))
    .curve(d3.curveMonotoneX);

  const colors = {
      head: '#ef4444', // red-500
      body: '#3b82f6', // blue-500
      legs: '#10b981'  // emerald-500
  };

  // Draw Lines
  ['head', 'body', 'legs'].forEach(part => {
      const p = part as keyof typeof colors;
      
      // Path
      svg.append('path')
        .datum(rawData)
        .attr('fill', 'none')
        .attr('stroke', colors[p])
        .attr('stroke-width', 2)
        .attr('d', lineGenerator(p));

      // Dots
      svg.selectAll(`.dot-${p}`)
        .data(rawData)
        .enter()
        .append('circle')
        .attr('cx', d => x(d.dist))
        .attr('cy', d => y(d[p]))
        .attr('r', 4)
        .attr('fill', '#fff')
        .attr('stroke', colors[p])
        .attr('stroke-width', 2);
  });

  // Legend
  const legend = svg.append('g')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 10)
      .attr('text-anchor', 'end')
      .selectAll('g')
      .data(['Head', 'Body', 'Legs'])
      .enter().append('g')
      .attr('transform', (d, i) => `translate(${width},${i * 20})`);

  legend.append('rect')
      .attr('x', -19)
      .attr('width', 19)
      .attr('height', 19)
      .attr('fill', (d) => {
          if (d === 'Head') return colors.head;
          if (d === 'Body') return colors.body;
          return colors.legs;
      });

  legend.append('text')
      .attr('x', -24)
      .attr('y', 9.5)
      .attr('dy', '0.32em')
      .text(d => d);
};

onMounted(() => {
  drawChart();
  window.addEventListener('resize', drawChart);
});

watch(() => props.data, drawChart, { deep: true });
</script>
