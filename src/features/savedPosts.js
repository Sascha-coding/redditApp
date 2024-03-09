const DatabaseName = "savedPosts";
const DatabaseVersion = 1;

export let Database; // Module-level variable to store the reference to the indexedDB database once opened
export async function getDatabase() {
  console.log("getDatabase");
  Database = await initializeDatabase();
  return Database;
}
!Database ? getDatabase() : null ;
async function COS() {
  const ObjectStore = Database.createObjectStore("posts", { keyPath: "id", unique:true});
  ObjectStore.createIndex("byId", "id", { unique: false });
  ObjectStore.createIndex("bySubreddit", "subreddit", { unique: false });
}
let storeNames = ["posts"];
async function initializeDatabase() {
  return new Promise((resolve, reject) => {
    if (Database) {
      // If the database is already open, resolve with the database instance
      resolve(Database);
    } else {
      // If the database is not open, open it and resolve with the database instance
      const request = indexedDB.open(DatabaseName, DatabaseVersion);

      request.onupgradeneeded = async (event) => {
        Database = event.target.result;
        await COS();
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };

      request.onsuccess = (event) => {
        Database = event.target.result;
        resolve(Database);
      };
    }
  });
}
export async function addPostToIDBCollection(post, mode) {
  post = { ...post, saved: true };
  try {
    const transaction = await Database.transaction("posts", mode);
    const objectStore = await transaction.objectStore("posts");
    const request = await objectStore.put(post);
  }catch(error){
    console.log(error);
  }
}
export async function getAllDataFromIDBCollection(mode,key) {
  try {
    
    const transaction = Database.transaction("posts",mode);
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

export async function removePostFromIDBCollection(id) {
  try {
    const transaction = await Database.transaction("posts", "readwrite"); // Use readwrite mode for deletion
    const objectStore = await transaction.objectStore("posts");
    const request = await objectStore.delete(id); // Use ID for deletion
    await transaction.complete;
    request.onsuccess = (event) => {
      console.log("Post successfully removed from IDB:", id);
    };

    request.onerror = (error) => {
      console.error("Error removing post from IDB:", error);
    };
  } catch (error) {
    console.error("Error during IDB deletion:", error);
  }
}