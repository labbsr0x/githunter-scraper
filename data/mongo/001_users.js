// eslint-disable-next-line no-undef
db.createUser({
  user: 'githunter',
  pwd: 'G1THuNt3R',
  roles: [{ role: 'readWrite', db: 'githunter-scraper' }],
});
