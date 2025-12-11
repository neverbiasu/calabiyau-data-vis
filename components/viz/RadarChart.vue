<template>
  <div class="w-full h-full relative" ref="container">
     <div v-if="!weapon" class="flex items-center justify-center h-full text-text-muted">
      Select a weapon to view specs
    </div>
    <svg v-else ref="svgRef" class="w-full h-full"></svg>
  </div>
</template>

<script setup lang="ts">
import * as d3 from 'd3';
import { onMounted, ref, watch, onUnmounted, type PropType, computed } from 'vue';
import type { Weapon } from '~/types/data';

const props = defineProps({
  weapon: {
    type: Object as PropType<Weapon | null>,
    default: null
  },
  compareWeapon: {
     type: Object as PropType<Weapon | null>,
     default: null
  }
});

const container = ref<HTMLElement | null>(null);
const svgRef = ref<SVGSVGElement | null>(null);

const margin = { top: 40, right: 40, bottom: 40, left: 40 };
let width = 0;
let height = 0;
let svg: any = null;

const FEATURES = ['Damage', 'Fire Rate', 'Capacity', 'Mobility', 'Range'];

// Normalization Helper
// We need Max values for scaling.
// Hardcoding maxes for now based on typical game stats for stability.
const MAX_VALUES = {
    'Damage': 100,
    'Fire Rate': 1200,
    'Capacity': 100,
    'Mobility': 5, // Inverse reload time (0-5s, where 0 is best? No, faster reload is better.)
                   // Let's use Reload Time (lower is better). Normalized: 1 - (reload / 5)
    'Range': 100
};

function getPoints(w: Weapon) {
    if (!w) return [];
    
    // Normalize 0-1
    const dmg = Math.min(w.stats.damage_body / MAX_VALUES.Damage, 1);
    const rof = Math.min(w.stats.fire_rate / MAX_VALUES['Fire Rate'], 1);
    const cap = Math.min(w.stats.mag_capacity / MAX_VALUES.Capacity, 1);
    // Mobility: derive from reload. reload 2.5s. 5s max.
    // 5s -> 0 mobility. 0s -> 1 mobility.
    const mobility = Math.max(0, 1 - (w.stats.reload_time / 5));
    const range = Math.min(w.stats.range / MAX_VALUES.Range, 1);
    
    return [
        { axis: 'Damage', value: dmg },
        { axis: 'Fire Rate', value: rof },
        { axis: 'Capacity', value: cap },
        { axis: 'Mobility', value: mobility },
        { axis: 'Range', value: range }
    ];
}

function initChart() {
    if (!container.value || !svgRef.value) return;

    width = container.value.clientWidth - margin.left - margin.right;
    height = container.value.clientHeight - margin.top - margin.bottom;
    const radius = Math.min(width, height) / 2;

    d3.select(svgRef.value).selectAll('*').remove();

    svg = d3.select(svgRef.value)
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${(width / 2) + margin.left},${(height / 2) + margin.top})`);
        
    // Draw Grid (Hexagon or Circle)
    const angleSlice = Math.PI * 2 / FEATURES.length;
    
    // Radial Scale
    const rScale = d3.scaleLinear()
        .range([0, radius])
        .domain([0, 1]);
        
    // Levels (0.2, 0.4, 0.6, 0.8, 1.0)
    for (let level = 1; level <= 5; level++) {
        const levelFactor = radius * (level / 5);
        svg.selectAll('.levels')
           .data(FEATURES)
           .enter()
           .append('line')
           .attr('x1', (d: any, i: number) => levelFactor * (1 - Math.sin(i * angleSlice))) // Check math, usually cos/sin
           .attr('y1', (d: any, i: number) => levelFactor * (1 - Math.cos(i * angleSlice)));
           // Actually, simpler to draw polygon
           
           const levelPath = d3.lineRadial()
             .angle((d, i) => i * angleSlice)
             .radius(levelFactor)
             .curve(d3.curveLinearClosed);
             
           const featureIndices = FEATURES.map((_, i) => i);
           
           svg.append('path')
              .datum(featureIndices)
              .attr('d', levelPath)
              .style("fill", "none")
              .style("stroke", "#2A2F3E")
              .style("stroke-dasharray", "4,4")
              .style("stroke-width", "0.5px");
    }
    
    // Axes
    const axis = svg.selectAll(".axis")
        .data(FEATURES)
        .enter()
        .append("g")
        .attr("class", "axis");
        
    axis.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", (d: any, i: number) => rScale(1.1) * Math.cos(i * angleSlice - Math.PI/2))
        .attr("y2", (d: any, i: number) => rScale(1.1) * Math.sin(i * angleSlice - Math.PI/2))
        .attr("class", "line")
        .style("stroke", "#2A2F3E")
        .style("stroke-width", "1px");

    // Labels
    axis.append("text")
        .attr("class", "legend")
        .style("font-size", "10px")
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .attr("x", (d: any, i: number) => rScale(1.25) * Math.cos(i * angleSlice - Math.PI/2))
        .attr("y", (d: any, i: number) => rScale(1.25) * Math.sin(i * angleSlice - Math.PI/2))
        .text((d: string) => d)
        .style("fill", "#6B7280"); // Text muted

    updateChart();
}

function updateChart() {
    if (!svg || !props.weapon) return;
    
    const angleSlice = Math.PI * 2 / FEATURES.length;
    const radius = Math.min(width, height) / 2;
    const rScale = d3.scaleLinear().range([0, radius]).domain([0, 1]);
    
    // Radar Line Generator
    const radarLine = d3.lineRadial<any>()
        .angle((d, i) => i * angleSlice)
        .radius(d => rScale(d.value))
        .curve(d3.curveLinearClosed);
        
    // Draw Selected Weapon
    const data = getPoints(props.weapon);
    
    // Clear old paths
    svg.selectAll(".radar-area").remove();
    
    // Main Layer
    svg.append("path")
        .datum(data)
        .attr("class", "radar-area")
        .attr("d", radarLine)
        .style("fill", "#00F0FF")
        .style("fill-opacity", 0.5)
        .style("stroke", "#00F0FF")
        .style("stroke-width", 2);
        
    // Compare Layer
    if (props.compareWeapon) {
        const compareData = getPoints(props.compareWeapon);
        svg.append("path")
            .datum(compareData)
            .attr("class", "radar-area")
            .attr("d", radarLine)
            .style("fill", "#FF0055")
            .style("fill-opacity", 0.3)
            .style("stroke", "#FF0055")
            .style("stroke-width", 2)
            .style("stroke-dasharray", "4,4");
    }
}

watch(() => [props.weapon, props.compareWeapon], updateChart, { deep: true });

onMounted(() => {
    initChart();
});
</script>
