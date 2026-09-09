let inMemoryHistory = [];

export const ServerHistoryStore = {
  getAll() {
    return inMemoryHistory;
  },

  add(scan) {
    inMemoryHistory = [scan, ...inMemoryHistory.filter(s => s.url !== scan.url)].slice(0, 100);
    return inMemoryHistory;
  },

  delete(id) {
    inMemoryHistory = inMemoryHistory.filter(s => s.id !== id);
    return inMemoryHistory;
  },

  clear() {
    inMemoryHistory = [];
    return inMemoryHistory;
  }
};
