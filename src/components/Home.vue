<script setup lang="ts">
import logo from "../assets/logo.png";
import gitLogo from "../assets/git.png";
import { ref, onMounted, onUnmounted } from "vue";
import { Character, ApiResponse } from "../Models/index";

const characters = ref<Character[]>([]);
const loading = ref(true);
const placeholderText = ref("");
const placeholders = ref<string[]>([]);
let placeholderIndex = 0;
let intervalId: any;
let charIndex = 0;

const fetchCharacters = async () => {
  try {
    const response = await fetch("https://rickandmortyapi.com/api/character");
    const data: ApiResponse = await response.json();
    characters.value = data.results;
    placeholders.value = characters.value.map((character) => character.name);
  } catch (error) {
    console.error("Error fetching characters:", error);
  } finally {
    loading.value = false;
  }
};

const findCharacter = async (e: any) => {
  try {
    const name = e.target.value.toLowerCase();
    if (name.length === 0) {
      fetchCharacters();
      return;
    }

    if (name.length <= 3) {
      return;
    }

    const response = await fetch(
      `https://rickandmortyapi.com/api/character/?name=${name}`
    );
    const data: ApiResponse = await response.json();
    characters.value = data.results;
    placeholders.value = characters.value.map((character) => character.name);
  } catch (error) {
    console.error("Error fetching characters:", error);
  } finally {
    loading.value = false;
  }
};

const typePlaceholder = () => {
  if (placeholders.value.length === 0) return;
  const currentPlaceholder = placeholders.value[placeholderIndex];
  if (charIndex < currentPlaceholder.length) {
    placeholderText.value += currentPlaceholder.charAt(charIndex);
    charIndex++;
  } else {
    charIndex = 0;
    placeholderIndex = (placeholderIndex + 1) % placeholders.value.length;
    placeholderText.value = "";
  }
};

onMounted(() => {
  fetchCharacters();
  intervalId = setInterval(typePlaceholder, 100);
});

onUnmounted(() => {
  clearInterval(intervalId);
});
</script>

<template>
  <main
    class="flex gap-8 items-center flex-col bg-black h-screen text-white text-[0.8rem] relative"
  >
    <a
      href="https://github.com/Sebastian9751/rick-and-morty-vue"
      target="_blank"
      class="flex justify-around items-center absolute z-30 italic font-bold text-sm bottom-5 left-4 animate-pulse"
    >
      Sebastian9751 <img class="ml-2 w-4" :src="gitLogo" />
    </a>

    <header class="flex justify-center w-[100%] h-[20vh]">
      <img :src="logo" />
    </header>

    <section class="flex justify-center">
      <input
        class="text-center bg-[#18191A] rounded-lg focus:outline-none p-2"
        type="text"
        :placeholder="placeholderText"
        @input="findCharacter"
      />
    </section>
    <span v-if="characters.length < 1">Not found</span>
    <span v-if="loading">Loading...</span>
    
<section
  v-else
  class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 min-h-[25vh] overflow-y-scroll bg-black w-full sm:w-[82%]"
>
  <div
    v-for="character in characters"
    :key="character.id"
    class="flex gap-2 justify-center items-center border rounded-lg border-blue-500 brightness-50 transition duration-300 ease-in-out hover:brightness-100 hover:border-green-500 h-[100%]"
  >
    <img :src="character.image" class="w-[50%] sm:w-[40%] md:w-[50%] rounded-full p-1" />
    <section
      class="flex flex-col justify-center gap-3 text-left w-[50%] sm:w-[60%] md:w-[50%] h-[100%] p-2 child:flex child:flex-col"
    >
      <p class="text-[1rem] font-bold">{{ character.name }}</p>

      <p>
        <span class="text-sm"> Origin </span>
        <span class="font-bold"> {{ character.origin.name }} </span>
      </p>
      <p>
        <span class="text-sm"> Last location </span>
        <span class="font-bold"> {{ character.location.name }} </span>
      </p>

      <p>
        <span class="hover:animate-pulse text-sm">
          Appears on {{ character.episode.length }} episodes</span
        >
      </p>
    </section>
  </div>
</section>

  </main>
</template>
