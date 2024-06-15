import { initializeApp } from "firebase/app";
import {
  child,
  get,
  getDatabase,
  push,
  ref,
  remove,
  set,
  update,
} from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCqgpGtqAZRvqmt7gkbYE3rtb2o129KLDI",
  authDomain: "utak-react-developer-tes-ad4d6.firebaseapp.com",
  databaseURL:
    "https://utak-react-developer-tes-ad4d6-default-rtdb.firebaseio.com",
  projectId: "utak-react-developer-tes-ad4d6",
  storageBucket: "utak-react-developer-tes-ad4d6.appspot.com",
  messagingSenderId: "750720143397",
  appId: "1:750720143397:web:522d82c892e7dad937efcc",
  measurementId: "G-8Z4STXZJFJ",
};

export const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);

export async function getData(path) {
  const snapshot = await get(child(ref(database), path));
  if (!snapshot.exists()) throw new Error("No data available");
  // For testing
  // await new Promise((res) => setTimeout(res, 2000));
  return snapshot.val();
}

export async function postData(path, data) {
  await set(push(ref(database, path)), data);
}

export async function deleteData(path) {
  await remove(ref(database, path));
}

export async function updateData(path, data) {
  await update(ref(database, path), data);
}

export async function getMenuItem(id) {
  return await getData(`menuItems/${id}`);
}

export async function getMenuItems() {
  return await getData("menuItems");
}

export async function addMenuItem(data) {
  await postData("menuItems", data);
}

export async function deleteMenuItem(id) {
  await deleteData(`menuItems/${id}`);
}

export async function updateMenuItem(id, data) {
  await updateData(`menuItems/${id}`, data);
}

export async function getMetrics() {
  return await getData("metrics");
}
