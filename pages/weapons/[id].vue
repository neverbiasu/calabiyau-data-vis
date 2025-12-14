<template>
<div class="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-text-dark antialiased selection:bg-primary selection:text-white">
  <header class="sticky top-0 z-50 flex w-full items-center justify-between border-b border-[#f4e6ed] bg-[#fcf8fa]/90 backdrop-blur-md px-6 py-4 lg:px-10">
    <div class="flex items-center gap-8">
      <div class="flex items-center gap-3">
        <div class="size-8 rounded-full bg-primary flex items-center justify-center text-white shadow-glow">
          <span class="material-symbols-outlined text-xl">data_exploration</span>
        </div>
        <h2 class="text-xl font-bold leading-tight tracking-tight">Calabiyau <span class="text-primary">Data</span></h2>
      </div>
      <nav class="hidden items-center gap-6 md:flex">
        <NuxtLink class="text-sm font-medium text-text-dark hover:text-primary transition-colors" to="/characters">Characters</NuxtLink>
        <NuxtLink class="text-sm font-bold text-primary" to="/weapons">Weapons</NuxtLink>
        <a class="text-sm font-medium text-text-dark hover:text-primary transition-colors" href="#">Maps</a>
        <a class="text-sm font-medium text-text-dark hover:text-primary transition-colors" href="#">Leaderboard</a>
      </nav>
    </div>
    <div class="flex items-center gap-6">
      <label class="hidden md:flex flex-col min-w-40 h-10 max-w-64 relative group">
        <div class="flex w-full flex-1 items-stretch rounded-full h-full border border-transparent group-hover:border-primary/30 transition-all bg-white shadow-sm">
          <div class="text-text-muted flex items-center justify-center pl-3 rounded-l-full">
            <span class="material-symbols-outlined text-[20px]">search</span>
          </div>
          <input class="flex w-full min-w-0 flex-1 bg-transparent px-3 text-sm text-text-dark focus:outline-none placeholder:text-text-muted/60" placeholder="Search database..."/>
        </div>
      </label>
      <div class="h-10 w-10 overflow-hidden rounded-full border-2 border-white shadow-md bg-cover bg-center" data-alt="User profile avatar showing anime style character" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuC698uffG6JCmalNlhto2qau4D1ELa3HsypJLg_g3S9mT5ycSSk9qcUUeTGzUfIX05BV6Knmz4bIn7DddOQquXWxuMiVuDB0f-PcfSrvUQsRyyIWOK8EUHNmxXJAdQxkjy1YyC9JnBoOWBIj98vwkzsYFxrwD37hoNFc2KLVRPkt4D8Cvq_GHjL8t_f9H5aI0vE7heaECdYstIPnOqUBhtxa9UDhQrsJ8MijoWdNwRcM-v2y7uqbngPB1lIlCigYHeo39r9-Uy9s_k");'></div>
    </div>
  </header>
  <main class="layout-container flex grow flex-col py-8 px-4 md:px-10 lg:px-40">
    <div class="mx-auto flex w-full max-w-[1200px] flex-col gap-8">
      <div class="flex flex-wrap items-center gap-2 px-2">
        <NuxtLink class="text-text-muted hover:text-primary text-sm font-medium transition-colors" to="/">Home</NuxtLink>
        <span class="material-symbols-outlined text-text-muted text-[16px]">chevron_right</span>
        <NuxtLink class="text-text-muted hover:text-primary text-sm font-medium transition-colors" to="/weapons">Weapons</NuxtLink>
        <span class="material-symbols-outlined text-text-muted text-[16px]">chevron_right</span>
        <span class="text-text-dark text-sm font-bold bg-white px-3 py-1 rounded-full shadow-sm">Law of the Jungle</span>
      </div>
      <section class="relative overflow-hidden rounded-2xl bg-white p-6 shadow-kawaii md:p-8">
        <div class="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl"></div>
        <div class="absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-secondary/10 blur-2xl"></div>
        <div class="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div class="group relative flex shrink-0 items-center justify-center">
            <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 blur-md transition-all group-hover:blur-lg"></div>
            <div class="relative flex h-40 w-40 items-center justify-center rounded-2xl bg-gradient-to-br from-[#fff0f6] to-white border border-white shadow-inner-soft">
              <img alt="High definition icon of Law of the Jungle weapon" class="h-32 w-32 object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsuMwxZIWy94zu1xS90zsEbAFXrtZD40NgKI-56DpmdlH-bodBmAGqKe_zCJQz9gXLdIEEg-QzBN-pTZsXr2UtMUiwwlwVTtwa8p3ihOSTqQqAg8K0wDkyXAbpL6xrQQYkgq4p-gUXmNaVbb_4duEn_vgSU8CbK7DngHJwhc60D376m9XEP4m6iyhCnxRBRv0OhQaOtKwQrkSq3g_6YtrczSAmJE5SyJqBXhfSVRmMGy7ggUVbrzck1XSNM6l2yThjFPbBCERthkU"/>
            </div>
          </div>
          <div class="flex flex-1 flex-col items-center text-center md:items-start md:text-left gap-3">
            <h1 class="font-display text-3xl font-black tracking-tight text-text-dark md:text-5xl">Law of the Jungle</h1>
            <div class="flex flex-wrap justify-center gap-3 md:justify-start">
              <button class="group flex items-center gap-2 rounded-full bg-[#f4e6ed] py-1.5 pl-1.5 pr-4 transition-all hover:bg-primary hover:text-white hover:shadow-md">
                <div class="h-8 w-8 overflow-hidden rounded-full border-2 border-white bg-white">
                  <img alt="Avatar of Faimette character" class="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLD3n1hevVBeMjkeGDSQJCagQ9CeD5xs-Eq0pAzIvxdLOQH-1sOesD8Bm3vyh_Cl5OiQHCf2jJjKavHnkBVUiVzVXf15oRwkVv4ipCsWKPEZXNUyJ7_0gzxQZ1pafIrbK9AowEQQIhyQL49gYP5fAd7ny1mz21ucRF4HZvsyZIbEv-PFAfZ9GDcbAkGxouD1i3l1AUXNqgsYEt9KpvCP2J3Blp414sS6klqW-n3qP0bYEPLGVdr7aUEfGW6oFl7EgdDKnoJlyEvsY"/>
                </div>
                <span class="text-sm font-bold text-text-dark group-hover:text-white">Faimette</span>
                <span class="material-symbols-outlined text-[16px] group-hover:text-white opacity-50">link</span>
              </button>
              <div class="flex items-center gap-2 rounded-full bg-secondary/20 py-1.5 px-4 text-sky-700">
                <span class="material-symbols-outlined text-[18px]">emergency_home</span>
                <span class="text-sm font-bold">Automatic Rifle</span>
              </div>
            </div>
            <p class="mt-2 max-w-lg text-sm text-text-muted">
                                A balanced automatic rifle favored by Faimette. Offers reliable damage output at mid-range engagements with moderate recoil control.
                            </p>
          </div>
          <div class="flex shrink-0 flex-col items-center">
            <div class="relative flex h-28 w-28 rotate-6 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-[#ff7eb6] shadow-lg shadow-primary/40 ring-4 ring-white transition-transform hover:rotate-0 hover:scale-105">
              <span class="font-display text-6xl font-black text-white drop-shadow-md">S</span>
              <div class="absolute -bottom-3 rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary shadow-sm">Tier</div>
              <span class="material-symbols-outlined absolute -right-2 -top-2 animate-pulse text-yellow-300 drop-shadow-sm" style="font-size: 32px;">spark</span>
            </div>
          </div>
        </div>
      </section>
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div class="col-span-1 flex flex-col rounded-2xl bg-white p-6 shadow-kawaii">
          <div class="mb-4 flex items-center justify-between">
            <h3 class="flex items-center gap-2 text-lg font-bold text-text-dark">
              <span class="material-symbols-outlined text-primary">radar</span>
                                Analysis
                            </h3>
            <span class="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">v3.2 Patch</span>
          </div>
          <div class="relative flex flex-1 items-center justify-center py-4">
            <svg class="h-full w-full max-h-[280px]" viewBox="0 0 200 200">
              <circle cx="100" cy="100" fill="none" r="80" stroke="#f0f0f0" stroke-width="1"></circle>
              <circle cx="100" cy="100" fill="none" r="60" stroke="#f0f0f0" stroke-width="1"></circle>
              <circle cx="100" cy="100" fill="none" r="40" stroke="#f0f0f0" stroke-width="1"></circle>
              <circle cx="100" cy="100" fill="none" r="20" stroke="#f0f0f0" stroke-width="1"></circle>
              <line stroke="#f0f0f0" stroke-width="1" x1="100" x2="100" y1="100" y2="20"></line>
              <line stroke="#f0f0f0" stroke-width="1" x1="100" x2="176" y1="100" y2="76"></line>
              <line stroke="#f0f0f0" stroke-width="1" x1="100" x2="147" y1="100" y2="181"></line>
              <line stroke="#f0f0f0" stroke-width="1" x1="100" x2="53" y1="100" y2="181"></line>
              <line stroke="#f0f0f0" stroke-width="1" x1="100" x2="24" y1="100" y2="76"></line>
              <polygon fill="rgba(255, 158, 205, 0.4)" points="100,30 165,76 130,170 65,160 35,76" stroke="#ff9ecd" stroke-linejoin="round" stroke-width="3"></polygon>
              <circle cx="100" cy="30" fill="#ff9ecd" r="3"></circle>
              <circle cx="165" cy="76" fill="#ff9ecd" r="3"></circle>
              <circle cx="130" cy="170" fill="#ff9ecd" r="3"></circle>
              <circle cx="65" cy="160" fill="#ff9ecd" r="3"></circle>
              <circle cx="35" cy="76" fill="#ff9ecd" r="3"></circle>
              <text fill="#a14571" font-size="10" font-weight="bold" text-anchor="middle" x="100" y="15">Mobility</text>
              <text fill="#a14571" font-size="10" font-weight="bold" text-anchor="start" x="185" y="75">Range</text>
              <text fill="#a14571" font-size="10" font-weight="bold" text-anchor="middle" x="150" y="195">Mag</text>
              <text fill="#a14571" font-size="10" font-weight="bold" text-anchor="middle" x="50" y="195">Dmg</text>
              <text fill="#a14571" font-size="10" font-weight="bold" text-anchor="end" x="15" y="75">RPM</text>
            </svg>
          </div>
          <div class="mt-4 text-center">
            <p class="text-2xl font-black tracking-tight text-text-dark">Balanced</p>
            <p class="text-sm text-text-muted">Overall performance score</p>
          </div>
        </div>
        <div class="col-span-1 lg:col-span-2 flex flex-col rounded-2xl bg-white p-6 shadow-kawaii">
          <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
            <h3 class="flex items-center gap-2 text-lg font-bold text-text-dark">
              <span class="material-symbols-outlined text-secondary">ssid_chart</span>
                                Damage Falloff
                            </h3>
            <div class="flex items-center gap-4 text-sm font-medium">
              <div class="flex items-center gap-2">
                <span class="block h-1 w-6 rounded-full bg-primary"></span>
                <span class="text-text-dark">Body</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="block h-1 w-6 rounded-full bg-secondary border border-secondary border-dashed" style="background-image: linear-gradient(to right, #A0E9FF 50%, transparent 50%); background-size: 8px 100%;"></span>
                <span class="text-text-dark">Headshot (1.5x)</span>
              </div>
            </div>
          </div>
          <div class="relative flex-1 min-h-[250px] w-full bg-[#fbfbfb] rounded-xl border border-gray-100 p-4">
            <div class="absolute inset-0 chart-grid rounded-xl"></div>
            <svg class="h-full w-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 600 250">
              <line stroke="#e5e5e5" stroke-width="1" x1="0" x2="600" y1="200" y2="200"></line>
              <line stroke="#e5e5e5" stroke-width="1" x1="0" x2="600" y1="150" y2="150"></line>
              <line stroke="#e5e5e5" stroke-width="1" x1="0" x2="600" y1="100" y2="100"></line>
              <line stroke="#e5e5e5" stroke-width="1" x1="0" x2="600" y1="50" y2="50"></line>
              <text fill="#9ca3af" font-size="10" x="5" y="215">0m</text>
              <text fill="#9ca3af" font-size="10" x="150" y="215">25m</text>
              <text fill="#9ca3af" font-size="10" x="300" y="215">50m</text>
              <text fill="#9ca3af" font-size="10" x="450" y="215">75m</text>
              <text fill="#9ca3af" font-size="10" text-anchor="end" x="590" y="215">100m</text>
              <text fill="#9ca3af" font-size="10" text-anchor="end" x="-10" y="200">0</text>
              <text fill="#9ca3af" font-size="10" text-anchor="end" x="-10" y="100">25</text>
              <text fill="#9ca3af" font-size="10" text-anchor="end" x="-10" y="10">50</text>
              <path d="M0,50 L120,50 L200,80 L600,80" fill="none" stroke="#A0E9FF" stroke-dasharray="8 4" stroke-linecap="round" stroke-width="3"></path>
              <circle cx="0" cy="50" fill="#A0E9FF" r="4" stroke="white" stroke-width="2"></circle>
              <circle cx="120" cy="50" fill="#A0E9FF" r="4" stroke="white" stroke-width="2"></circle>
              <path d="M0,100 L120,100 L200,130 L600,130" fill="none" stroke="#ff9ecd" stroke-linecap="round" stroke-width="3"></path>
              <circle cx="0" cy="100" fill="#ff9ecd" r="4" stroke="white" stroke-width="2"></circle>
              <circle cx="120" cy="100" fill="#ff9ecd" r="4" stroke="white" stroke-width="2"></circle>
              <g class="group cursor-crosshair">
                <line opacity="0.2" stroke="#1d0c14" stroke-dasharray="2 2" stroke-width="1" x1="108" x2="108" y1="0" y2="200"></line>
                <rect class="shadow-lg drop-shadow-sm" fill="white" height="50" rx="8" stroke="#f4e6ed" width="100" x="115" y="60"></rect>
                <text fill="#1d0c14" font-size="10" font-weight="bold" x="125" y="78">18 Meters</text>
                <text fill="#ff9ecd" font-size="10" x="125" y="92">32 Body Dmg</text>
                <text fill="#a14571" font-size="9" x="125" y="104">TTK: 0.4s</text>
                <circle cx="108" cy="100" fill="white" r="5" stroke="#1d0c14" stroke-width="2"></circle>
              </g>
            </svg>
          </div>
        </div>
        <div class="col-span-1 lg:col-span-3">
          <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div class="flex flex-col items-center justify-center gap-2 rounded-2xl bg-white p-6 shadow-kawaii transition-transform hover:-translate-y-1">
              <div class="flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-400">
                <span class="material-symbols-outlined">flash_on</span>
              </div>
              <div class="text-center">
                <span class="block text-3xl font-black text-text-dark">450</span>
                <span class="text-xs font-bold uppercase tracking-wider text-text-muted">DPS</span>
              </div>
            </div>
            <div class="flex flex-col items-center justify-center gap-2 rounded-2xl bg-white p-6 shadow-kawaii transition-transform hover:-translate-y-1">
              <div class="relative flex h-16 w-16 items-center justify-center">
                <svg class="absolute h-full w-full rotate-[-90deg]" viewBox="0 0 36 36">
                  <path class="text-gray-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="3"></path>
                  <path class="text-primary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-dasharray="80, 100" stroke-linecap="round" stroke-width="3"></path>
                </svg>
                <span class="material-symbols-outlined text-primary">cyclone</span>
              </div>
              <div class="text-center">
                <span class="block text-2xl font-black text-text-dark">800</span>
                <span class="text-xs font-bold uppercase tracking-wider text-text-muted">RPM</span>
              </div>
            </div>
            <div class="flex flex-col items-center justify-center gap-2 rounded-2xl bg-white p-6 shadow-kawaii transition-transform hover:-translate-y-1">
              <div class="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-400">
                <span class="material-symbols-outlined">layers</span>
              </div>
              <div class="text-center">
                <span class="block text-3xl font-black text-text-dark">30</span>
                <span class="text-xs font-bold uppercase tracking-wider text-text-muted">Rounds</span>
              </div>
            </div>
            <div class="flex flex-col items-center justify-center gap-2 rounded-2xl bg-white p-6 shadow-kawaii transition-transform hover:-translate-y-1">
              <div class="flex h-12 w-12 items-center justify-center rounded-full bg-purple-50 text-purple-400">
                <span class="material-symbols-outlined">update</span>
              </div>
              <div class="text-center w-full px-4">
                <span class="block text-2xl font-black text-text-dark">1.2s</span>
                <div class="mt-1 h-1.5 w-full rounded-full bg-gray-100">
                  <div class="h-1.5 w-3/4 rounded-full bg-purple-400"></div>
                </div>
                <span class="mt-1 block text-xs font-bold uppercase tracking-wider text-text-muted">Reload</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section class="overflow-hidden rounded-2xl bg-white shadow-kawaii">
        <div class="border-b border-gray-100 bg-[#fff5f9] p-4 px-6 flex justify-between items-center">
          <h3 class="text-lg font-bold text-text-dark flex items-center gap-2">
            <span class="material-symbols-outlined text-text-muted">table_chart</span>
                            Raw Statistics
                        </h3>
          <span class="material-symbols-outlined text-text-muted cursor-pointer hover:text-primary">expand_more</span>
        </div>
        <div class="w-full overflow-x-auto">
          <table class="w-full min-w-[600px] text-left text-sm">
            <thead class="bg-[#fcf8fa] text-xs font-bold uppercase tracking-wider text-text-muted">
              <tr>
                <th class="px-6 py-4">Attribute</th>
                <th class="px-6 py-4">Value</th>
                <th class="px-6 py-4">Category Average</th>
                <th class="px-6 py-4">Variance</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr class="hover:bg-[#fff5f9] transition-colors">
                <td class="px-6 py-4 font-medium text-text-dark">Headshot Multiplier</td>
                <td class="px-6 py-4 text-primary font-bold">1.5x</td>
                <td class="px-6 py-4 text-gray-500">1.4x</td>
                <td class="px-6 py-4 text-green-500 font-bold">+7.1%</td>
              </tr>
              <tr class="bg-[#fcf8fa]/50 hover:bg-[#fff5f9] transition-colors">
                <td class="px-6 py-4 font-medium text-text-dark">ADS Movement Speed</td>
                <td class="px-6 py-4 text-primary font-bold">2.4 m/s</td>
                <td class="px-6 py-4 text-gray-500">2.2 m/s</td>
                <td class="px-6 py-4 text-green-500 font-bold">+9.0%</td>
              </tr>
              <tr class="hover:bg-[#fff5f9] transition-colors">
                <td class="px-6 py-4 font-medium text-text-dark">Sprint Speed</td>
                <td class="px-6 py-4 text-primary font-bold">6.0 m/s</td>
                <td class="px-6 py-4 text-gray-500">6.0 m/s</td>
                <td class="px-6 py-4 text-gray-400 font-bold">0%</td>
              </tr>
              <tr class="bg-[#fcf8fa]/50 hover:bg-[#fff5f9] transition-colors">
                <td class="px-6 py-4 font-medium text-text-dark">Equip Time</td>
                <td class="px-6 py-4 text-primary font-bold">0.8s</td>
                <td class="px-6 py-4 text-gray-500">0.9s</td>
                <td class="px-6 py-4 text-green-500 font-bold">-11.1%</td>
              </tr>
              <tr class="hover:bg-[#fff5f9] transition-colors">
                <td class="px-6 py-4 font-medium text-text-dark">Hipfire Accuracy</td>
                <td class="px-6 py-4 text-primary font-bold">Low</td>
                <td class="px-6 py-4 text-gray-500">Medium</td>
                <td class="px-6 py-4 text-rose-400 font-bold">Lower</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="bg-[#fcf8fa] px-6 py-3 text-center">
          <button class="text-xs font-bold uppercase tracking-wide text-text-muted hover:text-primary transition-colors">
                            View All 24 Rows
                        </button>
        </div>
      </section>
    </div>
  </main>
</div>
</template>

<style scoped>
.material-symbols-outlined {
    font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
/* Custom scrollbar for raw data table */
::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}
::-webkit-scrollbar-track {
    background: #f4e6ed; 
}
::-webkit-scrollbar-thumb {
    background: #ff9ecd; 
    border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
    background: #ff7eb6; 
}

.chart-grid {
    background-image: radial-gradient(#ff9ecd 1px, transparent 1px);
    background-size: 20px 20px;
    opacity: 0.1;
}
</style>
