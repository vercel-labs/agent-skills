export function recordRunStart(db, { leadHashedUrl, account, action }) {
  const r = db
    .prepare(
      `INSERT INTO runs (lead_hashed_url, account, action, started_at)
       VALUES (?, ?, ?, datetime('now'))`,
    )
    .run(leadHashedUrl ?? null, account ?? null, action);
  return r.lastInsertRowid;
}

export function recordRunFinish(db, runId, { success, rawResponse, errorMessage }) {
  db.prepare(
    `UPDATE runs SET finished_at = datetime('now'), success = ?, raw_response_json = ?, error_message = ?
     WHERE id = ?`,
  ).run(
    success ? 1 : 0,
    rawResponse !== undefined ? JSON.stringify(rawResponse) : null,
    errorMessage ?? null,
    runId,
  );
}
