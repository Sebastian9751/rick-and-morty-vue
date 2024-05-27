<script setup lang="ts">
import logo from "../assets/logo.png";
import gitLogo from "../assets/git.png";
import { ref, onMounted, onUnmounted } from "vue";
import {
  characters,
  loading,
  fetchCharacters,
  findCharacter,
  onScroll,
  startTypingPlaceholder,
  stopTypingPlaceholder,
  state,
} from "../services/characters";

let intervalId: any;
const scrollContainer = ref<HTMLElement | null>(null);

onMounted(() => {
  fetchCharacters(state.page);
  intervalId = startTypingPlaceholder();

  if (scrollContainer.value) {
    scrollContainer.value.addEventListener("scroll", onScroll);
  }
});

onUnmounted(() => {
  stopTypingPlaceholder(intervalId);

  if (scrollContainer.value) {
    scrollContainer.value.removeEventListener("scroll", onScroll);
  }
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
        :placeholder="state.placeholderText"
        @input="findCharacter"
      />
    </section>
    <span v-if="!characters">
      <span class="italic font-bold animate-pulse text-lg">Not found</span>
    </span>
    <span v-if="loading">Loading...</span>

    <section
      v-else
      ref="scrollContainer"
      @scroll="onScroll"
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 min-h-[25vh] overflow-y-scroll bg-black w-full sm:w-[82%] pb-10"
    >
      <div
        v-for="character in characters"
        :key="character.id"
        class="flex gap-2 justify-center items-center border rounded-lg border-blue-500 brightness-50 transition duration-300 ease-in-out hover:brightness-100 hover:border-green-500 h-[100%]"
      >
        <img
          :src="character.image"
          class="w-[50%] sm:w-[40%] md:w-[50%] rounded-full p-1"
        />
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

    <div v-if="state.loadpage" class="w-11 absolute z-40 bottom-14 right-48">
      <svg
        class="text-blue-400 brightness-50 animate-spin w-[100%] delay-500"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
          stroke="currentColor"
          stroke-width="5"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
        <path
          d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
          stroke="currentColor"
          stroke-width="5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="text-gray-900"
        ></path>
      </svg>
    </div>
  </main>
</template>
