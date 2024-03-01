import { writable } from 'svelte/store'

export const metadata = writable({
    tags: [],
    forms: { default: {}},
    rules: [],
    mappings: []
})