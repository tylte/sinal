import { v4 as uuidv4 } from "uuid";
import dictionary from "../../data/dictionary.json";

export function get_id() {
  return uuidv4();
}

export function get_word() {
  return dictionary[Math.floor(Math.random() * dictionary.length)];
}
