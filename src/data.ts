export type Q = { prompt: string; options: string[]; answer: string; tip: string };

const makeQuestions = (rows: [string, string[], string][]): Q[] =>
  rows.map(([prompt, options, answer]) => ({
    prompt,
    options,
    answer,
    tip: `The right answer is ${answer}.`,
  }));

export const past: Q[] = makeQuestions([
  ["Yesterday I ___ to school.", ["go", "went", "gone", "going"], "went"],
  ["She ___ not see the zombie.", ["do", "does", "did", "was"], "did"],
  ["___ they escape last night?", ["Do", "Did", "Were", "Are"], "Did"],
  ["We ___ the door an hour ago.", ["close", "closed", "closes", "closing"], "closed"],
  ["He ___ a strange noise.", ["hear", "heard", "heared", "hears"], "heard"],
  ["The zombies ___ after midnight.", ["arrive", "arrived", "arrives", "are arriving"], "arrived"],
  ["I ___ my flashlight.", ["lost", "lose", "losed", "losing"], "lost"],
  ["They did not ___ us.", ["found", "find", "finding", "finds"], "find"],
  ["___ Anna lock the gate?", ["Does", "Was", "Did", "Has"], "Did"],
  ["Tom ___ very brave.", ["was", "were", "is", "be"], "was"],
  ["We ___ inside the shelter.", ["were", "was", "are", "be"], "were"],
  ["She ___ the map yesterday.", ["read", "reads", "reading", "readed"], "read"],
  ["The guard ___ the alarm.", ["rang", "ringed", "rings", "rung"], "rang"],
  ["I did not ___ afraid.", ["felt", "feel", "feels", "feeling"], "feel"],
  ["They ___ across the street.", ["ran", "run", "runned", "runs"], "ran"],
  ["___ you see that?", ["Did", "Do", "Are", "Have"], "Did"],
  ["We ___ a safe place.", ["found", "finded", "find", "finding"], "found"],
  ["He ___ the window.", ["broke", "breaked", "broken", "break"], "broke"],
  ["The bus ___ at nine.", ["left", "leave", "leaved", "leaves"], "left"],
  ["I ___ my friends outside.", ["met", "meet", "meeted", "meets"], "met"],
]);

export const pronouns: Q[] = makeQuestions([
  ["Sarah is my friend. ___ is brave.", ["She", "Her", "Hers"], "She"],
  ["I can see Tom. I can see ___.", ["he", "him", "his"], "him"],
  ["We live here. This is ___ shelter.", ["we", "us", "our"], "our"],
  ["Alex has a bag. It is ___.", ["he", "him", "his"], "his"],
  ["Kate called ___.", ["I", "me", "my"], "me"],
  ["___ are waiting outside.", ["They", "Them", "Their"], "They"],
  ["The dog follows ___.", ["we", "us", "our"], "us"],
  ["This is Anna and ___ bike.", ["she", "her", "hers"], "her"],
  ["Can you help ___?", ["I", "me", "my"], "me"],
  ["Ben says ___ is ready.", ["he", "him", "his"], "he"],
  ["Those supplies are ___.", ["they", "them", "theirs"], "theirs"],
  ["___ flashlight is bright.", ["You", "Your", "Yours"], "Your"],
  ["The radio belongs to ___.", ["she", "her", "hers"], "her"],
  ["___ found the key.", ["We", "Us", "Our"], "We"],
  ["Give ___ the map.", ["they", "them", "their"], "them"],
  ["This coat is ___.", ["I", "me", "mine"], "mine"],
  ["___ am not scared.", ["I", "Me", "My"], "I"],
  ["The teacher told ___ to hide.", ["he", "him", "his"], "him"],
  ["Is this ___ radio?", ["you", "your", "yours"], "your"],
  ["___ house is safe.", ["They", "Them", "Their"], "Their"],
]);

export type Cloth = { word: string; ru: string; icon: string };
export const clothes: Cloth[] = [
  ["T-shirt", "T-shirt", "tee"], ["shirt", "shirt", "shirt"],
  ["hoodie", "hoodie", "hoodie"], ["jacket", "jacket", "jacket"],
  ["coat", "coat", "coat"], ["dress", "dress", "dress"],
  ["skirt", "skirt", "skirt"], ["trousers", "trousers", "trousers"],
  ["jeans", "jeans", "jeans"], ["shorts", "shorts", "shorts"],
  ["socks", "socks", "socks"], ["shoes", "shoes", "shoes"],
  ["trainers", "trainers", "trainers"], ["boots", "boots", "boots"],
  ["cap", "cap", "cap"], ["hat", "hat", "hat"],
  ["scarf", "scarf", "scarf"], ["gloves", "gloves", "gloves"],
  ["belt", "belt", "belt"], ["sweater", "sweater", "sweater"],
].map(([word, ru, icon]) => ({ word, ru, icon }));
