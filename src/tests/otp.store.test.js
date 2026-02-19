
const store = require("../stores/otp.store");

// fake data
const phone = "+919876543210";
const hash = "hashed-otp-value";

// 1️⃣ save
store.save(phone, hash);
console.log("After save:", store.get(phone));

// 2️⃣ get
const data = store.get(phone);
console.log("Hash matches:", data.hash === hash);
console.log("Expires in future:", data.expires > Date.now());

// 3️⃣ remove
store.remove(phone);
console.log("After remove:", store.get(phone)); // should be undefined
