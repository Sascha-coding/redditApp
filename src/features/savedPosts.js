const dbName = "savedPosts";
const dbVersion = 1;

let db; // Module-level variable to store the reference to the indexedDB database once opened
export async function getDatabase() {
  let Database = await initializeDatabase();
  return db;
}
  async function COS() {
    const ObjectStore = db.createObjectStore("posts", { keyPath: "idDB", autoIncrement: true });
    ObjectStore.createIndex("byId", "id", { unique: true });
    ObjectStore.createIndex("bySubreddit", "subreddit", { unique: false });
  }
let storeNames = ["posts"];
async function initializeDatabase() {
  return new Promise((resolve, reject) => {
    if (db) {
      // If the database is already open, resolve with the database instance
      resolve(db);
    } else {
      // If the database is not open, open it and resolve with the database instance
      const request = indexedDB.open(dbName, dbVersion);

      request.onupgradeneeded = async (event) => {
        db = event.target.result;
        await COS();
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };

      request.onsuccess = (event) => {
        db = event.target.result;
        resolve(db);
      };
    }
  });
}
export async function addPostToIDBCollection(post, mode) {
  try {
    const transaction = db.transaction("posts", mode);
    const objectStore = transaction.objectStore("posts");
    const request = objectStore.put(post);
    return request;
  }catch(error){
    console.log(error);
  }
}
export async function getAllDataFromIDBCollection(mode,key) {
  try {
    
    const transaction = db.transaction("posts",mode);
    const objectStore = transaction.objectStore("posts");
    const request = objectStore.getAll();

    return new Promise((resolve, reject) => {
      request.onsuccess = (event) => {
        const sortedData = event.target.result.sort((a, b) => {
          console.log(a);
          console.log(b);
          a.id - b.id
        });
        console.log(sortedData);
        resolve(sortedData);
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  } catch (error) {
    console.error("Error fetching audio data from IndexedDB:", error);
  }
}