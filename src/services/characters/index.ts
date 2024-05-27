import { reactive, ref } from "vue";
import { Character, ApiResponse } from "../../Models/index";

const BASE_URL = "https://rickandmortyapi.com/api/character";

export const characters = ref<Character[]>([]);
export const placeholders = ref<string[]>([]);
export const loading = ref(true);
let placeholderIndex = 0;
let charIndex = 0;

export const state = reactive({
  isFinding: false,
  name: "",
  page: 1,
  loadpage: false,
  placeholderText: "",
});

export const fetchCharacters = async (id: number) => {
  try {
    const response = await fetch(`${BASE_URL}/?page=${id}`);
    const data: ApiResponse = await response.json();

    if (!data.results) {
      
      return;
    }
    characters.value = characters.value
      ? [...characters.value, ...data.results]
      : data.results;

    placeholders.value = data.results.map((character) => character.name);
  } catch (error) {
    console.error("Error fetching characters:", error);
  } finally {
    loading.value = false;
  }
};

export const findCharacter = async (e: any) => {
  try {
    state.page = 1;
    const name = e.target.value;
    state.name = e.target.value;

    if (name && name.length < 3) {
      return;
    }

    state.isFinding = true;
    const response = await fetch(`${BASE_URL}/?name=${name}`);
    const data: ApiResponse = await response.json();
    characters.value = data.results;
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
    state.placeholderText += currentPlaceholder.charAt(charIndex);
    charIndex++;
  } else {
    charIndex = 0;
    placeholderIndex = (placeholderIndex + 1) % placeholders.value.length;
    state.placeholderText = "";
  }
};

export const startTypingPlaceholder = () => {
  return setInterval(typePlaceholder, 100);
};

export const stopTypingPlaceholder = (intervalId: any) => {
  clearInterval(intervalId);
};

const characterPagination = async (
  page: number,
  name: string
): Promise<ApiResponse> => {
  const response = await fetch(`${BASE_URL}/?page=${page}&name=${name}`);
  return await response.json();
};

export const onScroll = async (e: any) => {
  const container = e.target;

  state.loadpage = true;

  if (container.scrollTop + container.clientHeight < container.scrollHeight) {
    state.loadpage = false;
    return;
  }

  state.page++;

  if (!state.isFinding) {
    fetchCharacters(state.page);
    state.loadpage = false;
    return;
  }

  const data: ApiResponse = await characterPagination(state.page, state.name);

  if (!data.info  ) {
    state.loadpage = false;
    return;
  }

  characters.value = [...characters.value, ...data.results];

  state.loadpage = false;

  return;
};
