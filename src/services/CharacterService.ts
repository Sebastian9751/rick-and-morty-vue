import { ref } from "vue";
import { Character, ApiResponse } from "../Models/index";

const BASE_URL = "https://rickandmortyapi.com/api/character";

export const characters = ref<Character[]>([]);
export const loading = ref(true);

export async function fetchCharacters(id: number) {
  try {
    const response = await fetch(`${BASE_URL}/?page=${id}`);
    const data: ApiResponse = await response.json();
    characters.value = characters.value
      ? [...characters.value, ...data.results]
      : data.results;
  } catch (error) {
    console.error("Error fetching characters:", error);
  } finally {
    loading.value = false;
  }
}

export async function findCharacter(name: string) {
  try {
    const response = await fetch(`${BASE_URL}/?name=${name.toLowerCase()}`);
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
