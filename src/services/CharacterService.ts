import { ref } from "vue";
import { Character, ApiResponse } from "../Models/index";

const BASE_URL = "https://rickandmortyapi.com/api/character";

export const characters = ref<Character[]>([]);
export const placeholders = ref<string[]>([]);
export const loading = ref(true);

export async function fetchCharacters(id: number) {
  try {
    const response = await fetch(`${BASE_URL}/?page=${id}`);
    const data: ApiResponse = await response.json();
    characters.value = characters.value
      ? [...characters.value, ...data.results]
      : data.results;

    placeholders.value = data.results.map((character) => character.name);
  } catch (error) {
    console.error("Error fetching characters:", error);
  } finally {
    loading.value = false;
  }
}

export async function findCharacter(e: any) {
  try {
    const name = e.target.value;
    const response = await fetch(`${BASE_URL}/?name=${name}`);
    const data: ApiResponse = await response.json();
    characters.value = data.results;
  } catch (error) {
    console.error("Error fetching characters:", error);
  } finally {
    loading.value = false;
  }
}

export async function characterPagination(page: number, name: string) {
  return await fetch(`${BASE_URL}/?page=${page}&name=${name}`);
}

export const placeholderText = ref("");
let placeholderIndex = 0;
let charIndex = 0;

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

export const startTypingPlaceholder = () => {
  return setInterval(typePlaceholder, 100);
};

export const stopTypingPlaceholder = (intervalId: any) => {
  clearInterval(intervalId);
};
