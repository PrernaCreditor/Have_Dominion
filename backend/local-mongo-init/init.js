db = db.getSiblingDB('auth-service');

db.createCollection('users');

db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1 });
db.users.createIndex({ createdAt: -1 });

print('MongoDB initialization completed');