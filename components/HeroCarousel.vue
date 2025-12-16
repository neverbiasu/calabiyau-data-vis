<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

interface Slide {
    image: string;
    title: string;
    subtitle: string;
}

const slides = ref<Slide[]>([]);
const currentIndex = ref(0);
let timer: ReturnType<typeof setInterval>;

// Catchy titles for the carousel
const titles = [
    { title: 'Dive Into The Dimensions', subtitle: 'Explore the multiverse of Calabiyau' },
    { title: 'Master Your Strategy', subtitle: 'Analyze comprehensive data for every stringer' },
    { title: 'Visualized Perfection', subtitle: 'Advanced metrics and synergy maps' },
    { title: 'Join The Archive', subtitle: 'The ultimate database for Strinova' },
    { title: 'Stringify The World', subtitle: 'Tactical anime shooter data reimagined' }
];

const loadSlides = async () => {
    try {
        const response = await fetch('/data/gallery-images.json');
        const data = await response.json();
        
        // User selected specific images: 5, 15, 16, 18, 19
        // Corresponding 0-based indices: 4, 14, 15, 17, 18
        const selectedIndices = [4, 14, 15, 17, 18];
        
        slides.value = selectedIndices
            .map((index, i) => {
                const item = data[index];
                if (!item) return null;
                return {
                    image: item.url,
                    title: titles[i % titles.length].title,
                    subtitle: titles[i % titles.length].subtitle
                };
            })
            .filter((slide): slide is Slide => slide !== null);
        
        // Fallback if fetch fails or returns empty
        if (slides.value.length === 0) throw new Error("No images found");
        
    } catch (e) {
        console.error("Failed to load hero images", e);
        // Fallback hardcoded slides
        slides.value = [
            {
                image: 'https://klbq-website-cdn.idreamsky.com/klbq-admin/prod/images/202503/b3f9964a-6a62-4a5f-a40a-69fff5b8f6f3.jpg',
                title: 'Dive Into The Dimensions',
                subtitle: 'Explore the multiverse of Calabiyau'
            },
            {
                image: 'https://klbq-website-cdn.idreamsky.com/klbq-admin/prod/images/202503/b50eb215-d1fd-42ba-a326-ff11ff9f9c40.jpg',
                title: 'Master Your Strategy',
                subtitle: 'Analyze comprehensive data for every stringer'
            }
        ];
    }
};

const nextSlide = () => {
    if (slides.value.length === 0) return;
    currentIndex.value = (currentIndex.value + 1) % slides.value.length;
};

const prevSlide = () => {
    if (slides.value.length === 0) return;
    currentIndex.value = (currentIndex.value - 1 + slides.value.length) % slides.value.length;
};

const goToSlide = (index: number) => {
    currentIndex.value = index;
};

onMounted(() => {
    loadSlides();
    timer = setInterval(nextSlide, 5000); // Auto-advance every 5s
});

onUnmounted(() => {
    if (timer) clearInterval(timer);
});
</script>

<template>
  <div class="relative w-full h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden rounded-[0rem] shadow-2xl group">
    <!-- Slides -->
    <div 
        v-for="(slide, index) in slides" 
        :key="index"
        class="absolute inset-0 transition-opacity duration-1000 ease-in-out"
        :class="index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'"
    >
        <!-- Image with Overlay -->
        <div class="absolute inset-0 bg-black/30 z-10"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-background-light dark:from-background-dark via-transparent to-transparent z-10"></div>
        <NuxtImg 
            :src="slide.image" 
            :alt="slide.title"
            class="w-full h-full object-cover object-center transition-transform duration-[10s] ease-linear"
            :class="index === currentIndex ? 'scale-110' : 'scale-100'"
            format="webp"
        />
        
        <!-- Content -->
        <div class="absolute bottom-24 left-0 right-0 z-20 text-center px-6">
            <h2 class="text-4xl md:text-6xl font-black text-white tracking-tight drop-shadow-md mb-4 translate-y-4 opacity-0 transition-all duration-700 delay-300" :class="index === currentIndex ? '!translate-y-0 !opacity-100' : ''">
                {{ slide.title }}
            </h2>
            <p class="text-lg md:text-2xl text-white/90 font-medium max-w-2xl mx-auto translate-y-4 opacity-0 transition-all duration-700 delay-500" :class="index === currentIndex ? '!translate-y-0 !opacity-100' : ''">
                {{ slide.subtitle }}
            </p>
        </div>
    </div>

    <!-- Controls -->
    <button @click="prevSlide" class="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0">
        <span class="material-symbols-outlined text-3xl">chevron_left</span>
    </button>
    <button @click="nextSlide" class="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0">
        <span class="material-symbols-outlined text-3xl">chevron_right</span>
    </button>

    <!-- Indicators -->
    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        <button 
            v-for="(_, index) in slides" 
            :key="index"
            @click="goToSlide(index)"
            class="h-1.5 rounded-full transition-all duration-300"
            :class="index === currentIndex ? 'w-8 bg-primary' : 'w-2 bg-white/50 hover:bg-white'"
        ></button>
    </div>
  </div>
</template>

<style scoped>
/* Ensure smooth fading */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
