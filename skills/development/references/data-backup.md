# Data Backup Guidelines

Always backup data before destructive operations. Data loss is often irreversible.

## When to Backup

| Operation | Backup Required |
|-----------|-----------------|
| Database reset/clear | YES |
| Schema migrations | YES |
| Testing with production data | YES |
| Major refactors | Recommended |
| Before experiments | YES |

## Backup Commands

### SQLite
```bash
# Safe backup (works even if db is in use)
sqlite3 /path/to/database.db ".backup '/path/to/database.db.backup.$(date +%Y%m%d_%H%M%S)'"

# Dump to SQL
sqlite3 /path/to/database.db .dump > /path/to/database.sql.backup.$(date +%Y%m%d_%H%M%S)
```

### PostgreSQL
```bash
pg_dump dbname > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Generic Files
```bash
cp -r /path/to/data /path/to/data.backup.$(date +%Y%m%d_%H%M%S)
```

## Restore

```bash
# SQLite
cp /path/to/backup.db /path/to/database.db

# PostgreSQL
psql dbname < backup.sql
```

## Quick Reference

| Destructive Operation | Backup First |
|-----------------------|--------------|
| `DELETE FROM table` | `sqlite3 $DB ".backup '$DB.bak.$(date +%s)'"` |
| Schema migration | `sqlite3 $DB .dump > schema_backup.sql` |
| Fresh import | `cp $DB $DB.pre_import.$(date +%s)` |
