export function getAccountOrFail(db, name) {
  const row = db.prepare('SELECT * FROM accounts WHERE name = ?').get(name);
  if (!row) throw new Error(`Account '${name}' not found in DB`);
  row.paused = !!row.paused;
  return row;
}

export function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export function isFatalExitCode(code) {
  return code === 4 || code === 6;
}

// Stores the openPersonPage completion (the action object: { actionType, success,
// data: { ...personInfo }, then }) minus the long free-text `about` field, which is
// dropped to keep the stored payload compact.
export function trimBasicInfoForStorage(completion) {
  try {
    const clone = JSON.parse(JSON.stringify(completion));
    if (clone?.data?.about) delete clone.data.about;
    return JSON.stringify(clone);
  } catch {
    return JSON.stringify(completion);
  }
}
