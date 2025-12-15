<template>
<div class="font-display bg-background-light dark:bg-background-dark text-text-dark dark:text-text-light min-h-screen flex flex-col overflow-x-hidden bg-gradient-animated selection:bg-primary selection:text-white pb-24">
  <header class="w-full z-50 px-6 py-4 lg:px-12 fixed top-0 left-0 transition-all duration-300">
    <div class="glass-panel mx-auto max-w-7xl rounded-full px-6 py-3 flex items-center justify-between bg-white/60 dark:bg-black/20 shadow-sm">
      <div class="flex items-center gap-3">
        <div class="size-8 rounded-full bg-primary flex items-center justify-center text-white shadow-glow">
          <span class="material-symbols-outlined text-xl">data_exploration</span>
        </div>
        <h2 class="text-text-dark dark:text-white text-lg font-bold tracking-tight">Calabiyau <span class="text-primary">Data Vis</span></h2>
      </div>
      <nav class="hidden md:flex items-center gap-8 mx-auto">
        <NuxtLink class="text-text-dark dark:text-white/80 text-sm font-medium hover:text-primary transition-colors" to="/">Home</NuxtLink>
        <NuxtLink class="text-text-dark dark:text-white/80 text-sm font-medium hover:text-primary transition-colors" to="/characters">Characters</NuxtLink>
        <NuxtLink class="text-text-dark dark:text-white/80 text-sm font-medium hover:text-primary transition-colors" to="/weapons">Weapons</NuxtLink>
        <a class="text-text-dark dark:text-white/80 text-sm font-medium hover:text-primary transition-colors" href="#">Analytics</a>
      </nav>
      <div class="hidden md:block w-8"></div> 
      <button class="md:hidden text-text-dark dark:text-white">
        <span class="material-symbols-outlined">menu</span>
      </button>
    </div>
  </header>
  <main class="flex-grow flex flex-col items-center w-full z-10 pt-24 pb-12 gap-24">
    <section class="relative px-4 lg:px-12 w-full max-w-[1440px] mx-auto min-h-[85vh] flex items-center">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full items-center">
        <div class="lg:col-span-3 flex flex-col gap-6 items-center lg:items-end order-2 lg:order-1">
          <div class="glass-panel bg-card-light dark:bg-card-dark p-5 rounded-[2rem] shadow-soft w-full max-w-[280px] floating-1 cursor-pointer group hover:scale-105 transition-transform duration-300">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-primary text-xl">radar</span>
                <span class="text-sm font-bold">Kokona Stats</span>
              </div>
              <span class="material-symbols-outlined text-gray-400 group-hover:text-primary text-sm transition-colors">arrow_outward</span>
            </div>
            <div class="relative w-full aspect-square bg-primary-soft/50 dark:bg-white/5 rounded-full flex items-center justify-center p-4">
              <svg class="w-full h-full overflow-visible drop-shadow-md" viewBox="0 0 100 100">
                <polygon fill="none" points="50,10 90,30 90,70 50,90 10,70 10,30" stroke="currentColor" stroke-opacity="0.1" stroke-width="1"></polygon>
                <polygon fill="none" points="50,25 75,37.5 75,62.5 50,75 25,62.5 25,37.5" stroke="currentColor" stroke-opacity="0.1" stroke-width="1"></polygon>
                <polygon class="group-hover:fill-primary/60 transition-colors duration-300" fill="rgba(238, 43, 91, 0.4)" points="50,10 85,35 70,75 40,80 20,50" stroke="#ee2b5b" stroke-width="2"></polygon>
                <circle class="fill-primary" cx="50" cy="10" r="2"></circle>
                <circle class="fill-primary" cx="85" cy="35" r="2"></circle>
                <circle class="fill-primary" cx="70" cy="75" r="2"></circle>
                <circle class="fill-primary" cx="40" cy="80" r="2"></circle>
                <circle class="fill-primary" cx="20" cy="50" r="2"></circle>
              </svg>
              <div class="absolute bottom-2 text-[10px] text-gray-500 font-medium">Agility vs Defense</div>
            </div>
          </div>
          <div class="glass-panel bg-card-light dark:bg-card-dark p-5 rounded-[2rem] shadow-soft w-full max-w-[280px] floating-3 cursor-pointer group hover:scale-105 transition-transform duration-300 hidden lg:block">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-primary text-xl">show_chart</span>
                <span class="text-sm font-bold">Dmg Drop-off</span>
              </div>
            </div>
            <div class="h-24 w-full flex items-end justify-between gap-1 px-2 pb-2 border-b border-primary/20">
              <div class="w-1/5 bg-primary/20 h-[80%] rounded-t-sm relative group-hover:bg-primary/30 transition-colors"></div>
              <div class="w-1/5 bg-primary/40 h-[75%] rounded-t-sm relative group-hover:bg-primary/50 transition-colors"></div>
              <div class="w-1/5 bg-primary/60 h-[60%] rounded-t-sm relative group-hover:bg-primary/70 transition-colors"></div>
              <div class="w-1/5 bg-primary/80 h-[40%] rounded-t-sm relative group-hover:bg-primary/90 transition-colors"></div>
              <div class="w-1/5 bg-primary h-[30%] rounded-t-sm relative"></div>
            </div>
            <div class="flex justify-between mt-2 text-[10px] text-gray-400">
              <span>10m</span>
              <span>50m</span>
            </div>
          </div>
        </div>
        <div class="lg:col-span-6 flex flex-col items-center text-center gap-8 order-1 lg:order-2 z-20">
          <div class="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
            <div class="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-full blur-3xl transform scale-90 animate-pulse"></div>
            <div class="w-full h-full bg-center bg-no-repeat bg-contain floating-2 drop-shadow-2xl flex items-center justify-center">
                 <NuxtImg src="/images/kokona_portrait.png" alt="Strinova Mascot" class="w-full h-full object-contain" format="webp" />
            </div>
          </div>
          <div class="space-y-2">
            <h1 class="text-4xl md:text-6xl font-black tracking-tighter text-text-dark dark:text-white drop-shadow-sm">
                            Calabiyau <br class="md:hidden"/>Data Vis
                        </h1>
            <p class="text-lg md:text-xl text-gray-600 dark:text-gray-300 font-medium">
                            Analyze. Strategize. <span class="text-primary font-bold">UwU.</span>
            </p>
          </div>
          <div class="w-full max-w-lg relative group">
            <div class="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div class="relative flex items-center w-full h-16 bg-white dark:bg-gray-800 rounded-full shadow-lg border-2 border-transparent focus-within:border-primary/30 transition-all overflow-hidden p-2 pl-6">
              <span class="material-symbols-outlined text-gray-400 text-2xl">search</span>
              <input class="w-full h-full bg-transparent border-none outline-none focus:ring-0 text-text-dark dark:text-white placeholder-gray-400 ml-3 text-lg" placeholder="Search for character, weapon, map..." type="text"/>
              <button class="h-12 px-8 bg-primary hover:bg-red-600 text-white font-bold rounded-full transition-colors flex items-center justify-center shadow-md">
                                Search
                            </button>
            </div>
          </div>
          <div class="flex flex-wrap justify-center gap-3">
            <NuxtLink class="px-5 py-2 rounded-full bg-white/60 dark:bg-white/5 border border-white/40 shadow-sm text-sm font-semibold hover:bg-white hover:text-primary transition-all" to="/characters">Characters</NuxtLink>
            <NuxtLink class="px-5 py-2 rounded-full bg-white/60 dark:bg-white/5 border border-white/40 shadow-sm text-sm font-semibold hover:bg-white hover:text-primary transition-all" to="/weapons">Weapons</NuxtLink>
            <a class="px-5 py-2 rounded-full bg-white/60 dark:bg-white/5 border border-white/40 shadow-sm text-sm font-semibold hover:bg-white hover:text-primary transition-all" href="#">Maps</a>
            <a class="px-5 py-2 rounded-full bg-white/60 dark:bg-white/5 border border-white/40 shadow-sm text-sm font-semibold hover:bg-white hover:text-primary transition-all text-primary" href="#">Meta Picks</a>
          </div>
        </div>
        <div class="lg:col-span-3 flex flex-col gap-6 items-center lg:items-start order-3 lg:order-3">
          <div class="glass-panel bg-card-light dark:bg-card-dark p-5 rounded-[2rem] shadow-soft w-full max-w-[280px] floating-2 cursor-pointer group hover:scale-105 transition-transform duration-300">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-primary text-xl">hub</span>
                <span class="text-sm font-bold">Team Synergy</span>
              </div>
              <span class="material-symbols-outlined text-gray-400 group-hover:text-primary text-sm transition-colors">arrow_outward</span>
            </div>
            <div class="relative w-full aspect-[4/3] bg-primary-soft/30 dark:bg-white/5 rounded-3xl overflow-hidden">
              <svg class="absolute inset-0 pointer-events-none" height="100%" width="100%">
                <line stroke="#ee2b5b" stroke-opacity="0.3" stroke-width="2" x1="30%" x2="70%" y1="30%" y2="50%"></line>
                <line stroke="#ee2b5b" stroke-opacity="0.3" stroke-width="2" x1="70%" x2="40%" y1="50%" y2="80%"></line>
                <line stroke="#ee2b5b" stroke-opacity="0.3" stroke-width="2" x1="30%" x2="40%" y1="30%" y2="80%"></line>
              </svg>
              <div class="absolute top-[30%] left-[30%] -translate-x-1/2 -translate-y-1/2 size-10 bg-white dark:bg-gray-700 rounded-full border-2 border-primary shadow-lg flex items-center justify-center">
                <img class="size-8 rounded-full" data-alt="Character Icon 1" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKBeFPLNsQ0-c7LXMciPb-lmFtYIKzoiJOL-3M4bF7Dcp2SzX0XyihqXSzT5hTf0r9gV61SbE1pbwpYOwd5C3lDF8c2_3--Oxc1cbyDoUpfBnG0BxsJOVM82HWRAMbHHjjEuXpimif0F10QLyv7_kIUI53eduFpn6kTtf9HYFY8_q4blplq3TOu7Ou6j4tg2a2sa2nrEdcR9-X0RPbgsw8pfNGfZmwQ-CFyE84EyNOi96KdRi8W4KjHh-mUH6F23SHsvjAn6lhhg8"/>
              </div>
              <div class="absolute top-[50%] left-[70%] -translate-x-1/2 -translate-y-1/2 size-12 bg-white dark:bg-gray-700 rounded-full border-2 border-blue-400 shadow-lg flex items-center justify-center z-10">
                <img class="size-10 rounded-full" data-alt="Character Icon 2" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9i6lFnpmuRvsoish942JpfzgCviFFsmXXh2EJVU4YQ6kehalSitHWNhOW7AKdcnTWuz5H87AsKZgqxKksYXjSnOoiOMWUBLZzHCm4Wfv9r5T4UPZyJo8CJBugShd7NWjYsPw2Qm2uo6qwd6L8eAjjAfsa-SlW5w0CqRy0DX-Ok8Nug2tl_lzHnmTJMakldkUHiO-sjl6gG4tukO9fKo8xahvtlzyLQK81aVG2DN0l3_1SXxaWVbdLghO2B3534fJNMafKb9qh43I"/>
              </div>
              <div class="absolute top-[80%] left-[40%] -translate-x-1/2 -translate-y-1/2 size-9 bg-white dark:bg-gray-700 rounded-full border-2 border-green-400 shadow-lg flex items-center justify-center">
                <img class="size-7 rounded-full" data-alt="Character Icon 3" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCY6YxQgDLBQpkpYvoHbhREenJMpUGJNmfJ4qsLIaDZira1-4Y36TVG3RuYGs0DtOG2SJKUGevZr1zCo4_lgZegeIznbrUnbLyHLK9itQNhVqVD8Ea1vjj-Z7n-WseM-F_zauZIaEtGseL51olVHdp0Wk1DwW7d4A2Cqf8HFD_YRiFSBEN90aWXCVvD3rCLJk2piahf0dNgjPm-qIen7IbpN5Ej4ypwPSRfTEGd7x6UEseEULpYvh1OkOuJxIBo0bdFmuMR1x0Wqdw"/>
              </div>
              <div class="absolute bottom-2 right-3 text-[10px] text-gray-500 font-medium bg-white/80 dark:bg-black/50 px-2 py-1 rounded-full">Support Link</div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="w-full max-w-[1280px] px-6 lg:px-12">
      <div class="flex flex-col items-center gap-12">
        <div class="text-center space-y-3">
          <span class="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wider uppercase">Features</span>
          <h2 class="text-3xl lg:text-4xl font-bold text-text-dark dark:text-white">Discover the Dataverse</h2>
          <p class="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">Everything you need to master your kawaii combat skills, beautifully visualized.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <div class="glass-panel p-8 rounded-[2.5rem] bg-white/40 dark:bg-white/5 hover:bg-white/60 transition-all duration-300 group border-t-4 border-t-primary/0 hover:border-t-primary">
            <div class="size-14 rounded-2xl bg-[#ffeaef] dark:bg-primary/20 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span class="material-symbols-outlined text-3xl">smart_toy</span>
            </div>
            <h3 class="text-xl font-bold mb-3 dark:text-white">Cute &amp; Deadly</h3>
            <p class="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                            Deep dive into character stats including hitbox sizes, ability cooldowns, and hidden multipliers.
                        </p>
          </div>
          <div class="glass-panel p-8 rounded-[2.5rem] bg-white/40 dark:bg-white/5 hover:bg-white/60 transition-all duration-300 group border-t-4 border-t-primary/0 hover:border-t-primary">
            <div class="size-14 rounded-2xl bg-[#eefcfd] dark:bg-blue-500/20 text-blue-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span class="material-symbols-outlined text-3xl">swords</span>
            </div>
            <h3 class="text-xl font-bold mb-3 dark:text-white">Arsenal Logic</h3>
            <p class="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                            Compare recoil patterns, damage fall-off curves, and time-to-kill metrics for every weapon.
                        </p>
          </div>
          <div class="glass-panel p-8 rounded-[2.5rem] bg-white/40 dark:bg-white/5 hover:bg-white/60 transition-all duration-300 group border-t-4 border-t-primary/0 hover:border-t-primary">
            <div class="size-14 rounded-2xl bg-[#fff5fa] dark:bg-purple-500/20 text-purple-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span class="material-symbols-outlined text-3xl">map</span>
            </div>
            <h3 class="text-xl font-bold mb-3 dark:text-white">Map Mastery</h3>
            <p class="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                            Interactive maps showing health pack locations, stringer routes, and optimal defensive positions.
                        </p>
          </div>
        </div>
      </div>
    </section>
    <section class="w-full max-w-[1280px] px-6 lg:px-12">
      <div class="glass-panel w-full bg-white/30 dark:bg-black/20 rounded-[3rem] p-8 lg:p-12 shadow-soft relative overflow-hidden">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 relative z-10">
          <div>
            <h3 class="text-2xl font-bold dark:text-white flex items-center gap-3">
              <span class="material-symbols-outlined text-primary">hub</span>
                            Synergy Network Map
                        </h3>
            <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">Visualize team compositions and character relationships.</p>
          </div>
          <div class="flex gap-2">
            <button class="px-4 py-2 rounded-full bg-white dark:bg-white/10 text-xs font-bold shadow-sm hover:text-primary transition-colors">Offense</button>
            <button class="px-4 py-2 rounded-full bg-white dark:bg-white/10 text-xs font-bold shadow-sm hover:text-primary transition-colors">Support</button>
            <button class="px-4 py-2 rounded-full bg-primary text-white text-xs font-bold shadow-sm shadow-primary/30">All</button>
          </div>
        </div>
        <div class="w-full h-[500px] bg-white/40 dark:bg-black/20 rounded-[2rem] relative overflow-hidden border border-white/40 dark:border-white/5">
          <div class="absolute inset-0" style="background-image: radial-gradient(circle, #ee2b5b 1px, transparent 1px); background-size: 30px 30px; opacity: 0.1;"></div>
          <svg class="absolute inset-0 w-full h-full pointer-events-none">
            <line stroke="#ee2b5b" stroke-dasharray="5,5" stroke-opacity="0.2" stroke-width="2" x1="50%" x2="20%" y1="50%" y2="30%"></line>
            <line stroke="#ee2b5b" stroke-opacity="0.2" stroke-width="2" x1="50%" x2="80%" y1="50%" y2="30%"></line>
            <line stroke="#ee2b5b" stroke-opacity="0.2" stroke-width="2" x1="50%" x2="20%" y1="50%" y2="70%"></line>
            <line stroke="#ee2b5b" stroke-opacity="0.2" stroke-width="2" x1="50%" x2="80%" y1="50%" y2="70%"></line>
            <line stroke="#ee2b5b" stroke-opacity="0.4" stroke-width="4" x1="50%" x2="50%" y1="50%" y2="20%"></line> 
            <line class="text-gray-400" stroke="currentColor" stroke-opacity="0.3" stroke-width="1" x1="20%" x2="50%" y1="30%" y2="20%"></line>
            <line class="text-gray-400" stroke="currentColor" stroke-opacity="0.3" stroke-width="1" x1="80%" x2="80%" y1="30%" y2="70%"></line>
          </svg>
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 group cursor-pointer">
            <div class="relative">
              <div class="absolute inset-0 bg-primary rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div class="size-20 bg-white dark:bg-gray-800 rounded-full p-1 shadow-xl border-4 border-primary transition-transform group-hover:scale-110">
                <img class="size-full rounded-full object-cover bg-primary/10" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdnQArZ1s2I51Vu_UH3-55F_XOcuTCN3KRFkiI8r8cFdc--3FpibCGVaD4ZgkyYvEhDULvBFveMxW7i4ZSfdF577yg8drYh2FZpauovirmF3Ad_gzGkBZ1rpw8qFsrAauNbCfRhKnqg3PArO9R20_sR-b6prG2g2Qz1zJLCB-0pN9gBruDyclscGwM2Hk0mq94haD86HQDMNImdnr-HQDbNvh0NOzfXXsrnT6RtbgxcLq8qGMejgxxylBzh7zpUVPA2_RXlBjzB1g"/>
              </div>
              <div class="absolute -bottom-8 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/80 text-white text-xs rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Current Pick</div>
            </div>
          </div>
          <div class="absolute top-[20%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer group">
            <div class="size-14 bg-white dark:bg-gray-800 rounded-full p-1 shadow-lg border-2 border-green-400 transition-transform group-hover:scale-110">
              <img class="size-full rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCY6YxQgDLBQpkpYvoHbhREenJMpUGJNmfJ4qsLIaDZira1-4Y36TVG3RuYGs0DtOG2SJKUGevZr1zCo4_lgZegeIznbrUnbLyHLK9itQNhVqVD8Ea1vjj-Z7n-WseM-F_zauZIaEtGseL51olVHdp0Wk1DwW7d4A2Cqf8HFD_YRiFSBEN90aWXCVvD3rCLJk2piahf0dNgjPm-qIen7IbpN5Ej4ypwPSRfTEGd7x6UEseEULpYvh1OkOuJxIBo0bdFmuMR1x0Wqdw"/>
            </div>
            <span class="absolute -top-6 left-1/2 -translate-x-1/2 bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">Best Pair</span>
          </div>
          <div class="absolute top-[30%] left-[20%] -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer hover:scale-110 transition-transform">
            <div class="size-12 bg-white dark:bg-gray-800 rounded-full p-1 shadow-lg border-2 border-blue-400">
              <img class="size-full rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9i6lFnpmuRvsoish942JpfzgCviFFsmXXh2EJVU4YQ6kehalSitHWNhOW7AKdcnTWuz5H87AsKZgqxKksYXjSnOoiOMWUBLZzHCm4Wfv9r5T4UPZyJo8CJBugShd7NWjYsPw2Qm2uo6qwd6L8eAjjAfsa-SlW5w0CqRy0DX-Ok8Nug2tl_lzHnmTJMakldkUHiO-sjl6gG4tukO9fKo8xahvtlzyLQK81aVG2DN0l3_1SXxaWVbdLghO2B3534fJNMafKb9qh43I"/>
            </div>
          </div>
          <div class="absolute top-[30%] left-[80%] -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer hover:scale-110 transition-transform">
            <div class="size-12 bg-white dark:bg-gray-800 rounded-full p-1 shadow-lg border-2 border-orange-400">
              <img class="size-full rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKBeFPLNsQ0-c7LXMciPb-lmFtYIKzoiJOL-3M4bF7Dcp2SzX0XyihqXSzT5hTf0r9gV61SbE1pbwpYOwd5C3lDF8c2_3--Oxc1cbyDoUpfBnG0BxsJOVM82HWRAMbHHjjEuXpimif0F10QLyv7_kIUI53eduFpn6kTtf9HYFY8_q4blplq3TOu7Ou6j4tg2a2sa2nrEdcR9-X0RPbgsw8pfNGfZmwQ-CFyE84EyNOi96KdRi8W4KjHh-mUH6F23SHsvjAn6lhhg8"/>
            </div>
          </div>
          <div class="absolute top-[70%] left-[20%] -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer hover:scale-110 transition-transform opacity-60 hover:opacity-100">
            <div class="size-10 bg-white dark:bg-gray-800 rounded-full p-1 shadow-lg border-2 border-gray-300">
              <div class="size-full rounded-full bg-gray-200 dark:bg-gray-700"></div>
            </div>
          </div>
          <div class="absolute top-[70%] left-[80%] -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer hover:scale-110 transition-transform opacity-60 hover:opacity-100">
            <div class="size-10 bg-white dark:bg-gray-800 rounded-full p-1 shadow-lg border-2 border-gray-300">
              <div class="size-full rounded-full bg-gray-200 dark:bg-gray-700"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="w-full max-w-[1280px] px-6 lg:px-12">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="flex flex-col justify-center space-y-6">
          <div class="flex items-center gap-3">
            <div class="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl text-red-500">
              <span class="material-symbols-outlined">analytics</span>
            </div>
            <h3 class="text-3xl font-bold dark:text-white">Damage Analysis</h3>
          </div>
          <p class="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                        Compare Time-to-Kill (TTK) across different ranges. Our visualization tool helps you decide whether to engage or rotate based on your loadout.
                    </p>
          <div class="glass-panel p-6 rounded-3xl bg-white/50 dark:bg-white/5 border-l-4 border-l-primary">
            <h4 class="font-bold text-sm text-gray-400 uppercase tracking-wider mb-2">Meta Insight</h4>
            <p class="text-text-dark dark:text-white font-medium">"The <span class="text-primary">Stringer</span> currently outperforms in close-quarters (0-10m) but suffers a 40% damage drop-off beyond 20m."</p>
          </div>
          <button class="w-fit px-8 py-3 bg-text-dark dark:bg-white text-white dark:text-black font-bold rounded-full hover:shadow-lg hover:scale-105 transition-all">
                        Full Comparison Tool
                    </button>
        </div>
        <div class="glass-panel bg-white/60 dark:bg-black/20 p-6 md:p-8 rounded-[2.5rem] shadow-soft flex flex-col gap-6">
          <div class="flex justify-between items-center">
            <h4 class="font-bold dark:text-white">TTK Comparison (ms)</h4>
            <div class="flex gap-4 text-xs font-bold">
              <div class="flex items-center gap-2">
                <span class="size-3 rounded-full bg-primary"></span> Stringer
                            </div>
              <div class="flex items-center gap-2">
                <span class="size-3 rounded-full bg-gray-400"></span> Standard
                            </div>
            </div>
          </div>
          <div class="flex-grow flex flex-col justify-end gap-4 min-h-[300px]">
            <div class="space-y-1">
              <div class="flex justify-between text-xs text-gray-500 font-medium px-1">
                <span>Close Range (0-10m)</span>
                <span>-12% Faster</span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700/50 rounded-full h-10 relative overflow-hidden flex items-center px-1">
                <div class="absolute top-1 bottom-1 left-1 bg-gray-400 rounded-full w-[65%]"></div>
                <div class="absolute top-1 bottom-1 left-1 bg-primary rounded-full w-[52%] shadow-[0_0_15px_rgba(238,43,91,0.5)] flex items-center justify-end px-3 text-white text-xs font-bold">240ms</div>
              </div>
            </div>
            <div class="space-y-1">
              <div class="flex justify-between text-xs text-gray-500 font-medium px-1">
                <span>Mid Range (10-30m)</span>
                <span>Equal</span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700/50 rounded-full h-10 relative overflow-hidden flex items-center px-1">
                <div class="absolute top-1 bottom-1 left-1 bg-gray-400 rounded-full w-[70%]"></div>
                <div class="absolute top-1 bottom-1 left-1 bg-primary rounded-full w-[70%] opacity-80 flex items-center justify-end px-3 text-white text-xs font-bold">380ms</div>
              </div>
            </div>
            <div class="space-y-1">
              <div class="flex justify-between text-xs text-gray-500 font-medium px-1">
                <span>Long Range (30m+)</span>
                <span>+25% Slower</span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700/50 rounded-full h-10 relative overflow-hidden flex items-center px-1">
                <div class="absolute top-1 bottom-1 left-1 bg-gray-400 rounded-full w-[60%]"></div>
                <div class="absolute top-1 bottom-1 left-1 bg-primary rounded-full w-[85%] opacity-60 flex items-center justify-end px-3 text-white text-xs font-bold">550ms</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
  <footer class="w-full flex flex-col items-center py-12 text-center relative z-10 border-t border-white/20">
    <div class="mb-4 text-2xl font-bold tracking-tight text-text-dark dark:text-white">Calabiyau <span class="text-primary">Data Vis</span></div>
    <div class="flex gap-6 mb-8 text-sm font-medium text-gray-500 dark:text-gray-400">
      <a class="hover:text-primary transition-colors" href="#">Privacy</a>
      <a class="hover:text-primary transition-colors" href="#">Terms</a>
      <a class="hover:text-primary transition-colors" href="#">Contact</a>
    </div>
    <p class="text-gray-400 text-xs font-medium max-w-md px-6">© 2025 Calabiyau Data Vis. Data provided for entertainment purposes. Not affiliated with the official game developers.</p>
  </footer>
</div>
</template>

<style scoped>
.glass-panel {
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.5);
}
.dark .glass-panel {
    border: 1px solid rgba(255, 255, 255, 0.1);
}
.floating-1 { animation: float 6s ease-in-out infinite; }
.floating-2 { animation: float 7s ease-in-out infinite 1s; }
.floating-3 { animation: float 8s ease-in-out infinite 2s; }
@keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
}
.bg-gradient-animated {
    background: linear-gradient(-45deg, #fff0f3, #fcecee, #eefcfd, #fff5fa);
    background-size: 400% 400%;
    animation: gradientBG 15s ease infinite;
    background-attachment: fixed;
}
.dark .bg-gradient-animated {
    background: linear-gradient(-45deg, #2a141a, #1f0f13, #150a0d, #251016);
    background-size: 400% 400%;
}
@keyframes gradientBG {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}
::-webkit-scrollbar {
    width: 8px;
}
::-webkit-scrollbar-track {
    background: transparent; 
}
::-webkit-scrollbar-thumb {
    background: rgba(238, 43, 91, 0.2); 
    border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
    background: rgba(238, 43, 91, 0.5); 
}
</style>
