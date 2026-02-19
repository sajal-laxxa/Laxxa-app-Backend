
const store = new Map();

exports.save = (phone, hash) => {
  store.set(phone, {
    hash,
    expires: Date.now() + 2 * 60 * 1000
  });
};

exports.get = (phone) => store.get(phone);

exports.remove = (phone) => store.delete(phone);

//:TODO store in redis
