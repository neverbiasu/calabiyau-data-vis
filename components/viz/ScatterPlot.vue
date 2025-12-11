<template>
  <div class="w-full h-full relative" ref="container">
    <div v-if="!weapons.length" class="flex items-center justify-center h-full text-text-muted">
      Loading Data...
    </div>
    <svg v-else ref="svgRef" class="w-full h-full"></svg>
    
    <!-- Tooltip -->
    <div 
      v-if="tooltip.visible"
      class="absolute pointer-events-none bg-bg-panel border border-border-color p-3 rounded shadow-lg z-50 text-sm backdrop-blur-sm bg-opacity-90"
      :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
    >
      <div class="font-bold text-primary">{{ tooltip.data.name }}</div>
      <div class="text-xs text-text-muted">{{ tooltip.data.type }}</div>
      <div class="mt-1 grid grid-cols-2 gap-x-3 gap-y-1">
        <span>DPS: <span class="text-accent">{{ Math.round(tooltip.data.computed.dps_body) }}</span></span>
        <span>RPM: {{ tooltip.data.stats.fire_rate }}</span>
        <span>Dmg: {{ tooltip.data.stats.damage_body }}</span>
        <span>Mag: {{ tooltip.data.stats.mag_capacity }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as d3 from 'd3';
import { onMounted, ref, watch, onUnmounted, type PropType } from 'vue';
import type { Weapon } from '~/types/data';

const props = defineProps({
  weapons: {
    type: Array as PropType<Weapon[]>,
    required: true
  },
  selectedId: {
    type: String as PropType<string | null>,
    default: null
  }
});

const emit = defineEmits(['select']);

const container = ref<HTMLElement | null>(null);
const svgRef = ref<SVGSVGElement | null>(null);

const tooltip = ref({
  visible: false,
  x: 0,
  y: 0,
  data: {} as any
});

// Config
const margin = { top: 20, right: 20, bottom: 40, left: 50 };
let width = 0;
let height = 0;
let svg: any = null;
let zoom: any = null;

// Scales
let x: any = null;
let y: any = null;
let color: any = null;
let size: any = null;

function initChart() {
  if (!container.value || !svgRef.value || !props.weapons.length) return;
  
  width = container.value.clientWidth - margin.left - margin.right;
  height = container.value.clientHeight - margin.top - margin.bottom;

  // Clear previous
  d3.select(svgRef.value).selectAll('*').remove();
  
  svg = d3.select(svgRef.value)
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .call(d3.zoom().on('zoom', (event) => {
        g.attr('transform', event.transform);
    }))
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);
    
  // Clip Path
  svg.append("defs").append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", width)
    .attr("height", height);

  const g = svg.append('g').attr("clip-path", "url(#clip)");
  
  // Axes Layer
  const xAxisGroups = svg.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(d3.scaleLinear().range([0, width])).ticks(5)); // Temp scale
    
  const yAxisGroups = svg.append('g')
    .call(d3.axisLeft(d3.scaleLinear().range([height, 0])));
    
  // Store references to update them
  (svg as any).xAxis = xAxisGroups;
  (svg as any).yAxis = yAxisGroups;
  (svg as any).mainG = g;
  
  updateChart();
}

function updateChart() {
  if (!svg || !props.weapons.length) return;
  
  const weapons = props.weapons;
  
  // Update Scales
  const xMin = d3.min(weapons, d => d.stats.fire_rate) || 0;
  const xMax = d3.max(weapons, d => d.stats.fire_rate) || 1000;
  const yMin = d3.min(weapons, d => d.stats.damage_body) || 0;
  const yMax = d3.max(weapons, d => d.stats.damage_body) || 100;
  
  x = d3.scaleLinear()
    .domain([xMin * 0.9, xMax * 1.1])
    .range([0, width]);
    
  y = d3.scaleLinear()
    .domain([yMin * 0.9, yMax * 1.1])
    .range([height, 0]);
    
  size = d3.scaleSqrt()
    .domain([10, 100])
    .range([4, 12]); // Mag capacity → Radius
    
  color = d3.scaleOrdinal(d3.schemeCategory10)
    .domain(weapons.map(d => d.type));

  // Update Axes
  (svg as any).xAxis.transition().call(d3.axisBottom(x).tickSize(-height).tickPadding(10));
  (svg as any).yAxis.transition().call(d3.axisLeft(y).tickSize(-width).tickPadding(10));
  
  // Style Axes
  svg.selectAll('.domain').attr('stroke', '#2A2F3E');
  svg.selectAll('.tick line').attr('stroke', '#2A2F3E').attr('stroke-dasharray', '2,2');
  svg.selectAll('.tick text').attr('fill', '#6B7280');

  // Labels
  svg.selectAll('.axis-label').remove();
  
  // X Label
  svg.append('text')
    .attr('class', 'axis-label')
    .attr('text-anchor', 'end')
    .attr('x', width)
    .attr('y', height + 35)
    .text('Fire Rate (RPM)')
    .attr('fill', '#6B7280')
    .attr('font-size', '12px');

  // Y Label
  svg.append('text')
    .attr('class', 'axis-label')
    .attr('text-anchor', 'end')
    .attr('transform', 'rotate(-90)')
    .attr('y', -35)
    .attr('x', 0)
    .text('Body Damage')
    .attr('fill', '#6B7280')
    .attr('font-size', '12px');

  // Draw Points
  const g = (svg as any).mainG;
  
  const circles = g.selectAll('circle')
    .data(weapons, (d: Weapon) => d.id);
    
  circles.enter()
    .append('circle')
    .attr('cx', (d: Weapon) => x(d.stats.fire_rate))
    .attr('cy', (d: Weapon) => y(d.stats.damage_body))
    .attr('r', 0)
    .attr('fill', (d: Weapon) => color(d.type))
    .attr('stroke', '#12141C')
    .attr('stroke-width', 1.5)
    .attr('cursor', 'pointer')
    .on('mouseover', (event: any, d: Weapon) => {
        tooltip.value = {
            visible: true,
            x: event.pageX + 10,
            y: event.pageY + 10,
            data: d
        };
        d3.select(event.currentTarget).attr('stroke', '#fff').attr('stroke-width', 2);
    })
    .on('mouseout', (event: any) => {
        tooltip.value.visible = false;
        const target = d3.select(event.currentTarget);
        // keep highlight if selected
        if (target.datum().id !== props.selectedId) {
            target.attr('stroke', '#12141C').attr('stroke-width', 1.5);
        } else {
             target.attr('stroke', '#00F0FF').attr('stroke-width', 2);
        }
    })
    .on('click', (event: any, d: Weapon) => {
        emit('select', d.id);
    })
    .merge(circles)
    .transition().duration(500)
    .attr('cx', (d: Weapon) => x(d.stats.fire_rate))
    .attr('cy', (d: Weapon) => y(d.stats.damage_body))
    .attr('r', (d: Weapon) => size(d.stats.mag_capacity))
    .attr('fill', (d: Weapon) => color(d.type))
    .attr('opacity', (d: Weapon) => props.selectedId && props.selectedId !== d.id ? 0.3 : 0.9)
    .attr('stroke', (d: Weapon) => d.id === props.selectedId ? '#00F0FF' : '#12141C')
    .attr('stroke-width', (d: Weapon) => d.id === props.selectedId ? 2 : 1.5);

  circles.exit().remove();
}

watch(() => props.weapons, updateChart, { deep: true });
watch(() => props.selectedId, updateChart);

let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
    initChart();
    resizeObserver = new ResizeObserver(() => {
        initChart(); // Simple re-init on resize
    });
    if (container.value) resizeObserver.observe(container.value);
});

onUnmounted(() => {
    if (resizeObserver && container.value) resizeObserver.unobserve(container.value);
});
</script>

<style scoped>
/* Add any specific styles here if needed */
</style>
