const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_DIR = path.join(__dirname, '..', 'data');

function filePath(fileName) {
  return path.join(DATA_DIR, fileName);
}

function readJSON(fileName) {
  const raw = fs.readFileSync(filePath(fileName), 'utf-8').trim();
  return raw ? JSON.parse(raw) : [];
}

function writeJSON(fileName, data) {
  fs.writeFileSync(filePath(fileName), JSON.stringify(data, null, 2) + '\n');
}

function getAll(fileName) {
  return readJSON(fileName);
}

function getById(fileName, id) {
  return readJSON(fileName).find((item) => item.id === id) || null;
}

function create(fileName, fields) {
  const items = readJSON(fileName);
  const now = new Date().toISOString();
  const record = { id: uuidv4(), ...fields, createdAt: now, updatedAt: now };
  items.push(record);
  writeJSON(fileName, items);
  return record;
}

function update(fileName, id, fields) {
  const items = readJSON(fileName);
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return null;
  items[index] = { ...items[index], ...fields, id, updatedAt: new Date().toISOString() };
  writeJSON(fileName, items);
  return items[index];
}

function remove(fileName, id) {
  const items = readJSON(fileName);
  const filtered = items.filter((item) => item.id !== id);
  if (filtered.length === items.length) return false;
  writeJSON(fileName, filtered);
  return true;
}

module.exports = { readJSON, writeJSON, getAll, getById, create, update, remove };
