// astro.config.mjs
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

export default defineConfig({
    vite: {
        plugins: [tailwindcss()],
    },
    base: 'https://jeffryvalle.github.io/Photographer/',
});