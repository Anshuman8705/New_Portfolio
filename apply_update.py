"""Apply a changes-only portfolio update after verifying original file hashes."""
from __future__ import annotations
import argparse
import hashlib
import json
import shutil
import tempfile
from pathlib import Path


def digest(path: Path) -> str | None:
    return hashlib.sha256(path.read_bytes()).hexdigest() if path.is_file() else None


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('project', type=Path, help='Existing New_Portfolio folder')
    parser.add_argument('--check', action='store_true', help='Validate only; make no changes')
    args = parser.parse_args()
    base = Path(__file__).resolve().parent
    target = args.project.expanduser().resolve()
    if not (target / 'package.json').is_file():
        parser.error('The target must contain the original portfolio package.json.')
    manifest = json.loads((base / 'manifest.json').read_text(encoding='utf-8'))
    changes = []
    conflicts = []
    for item in manifest['files']:
        relative = Path(item['path'])
        if relative.is_absolute() or '..' in relative.parts:
            parser.error('Unsafe path in manifest.')
        source = base / 'files' / relative
        destination = target / relative
        if destination.is_symlink() or not destination.resolve().is_relative_to(target):
            parser.error(f'Unsafe target path: {relative}')
        if digest(source) != item['updated_sha256']:
            parser.error(f'Update file does not match its manifest: {relative}')
        current = digest(destination)
        if current == item['updated_sha256']:
            continue
        if current != item['original_sha256'] or (destination.exists() and not destination.is_file()):
            conflicts.append(str(relative))
        else:
            changes.append((source, destination, relative))
    if conflicts:
        parser.error('No changes applied. These files differ from the supplied ZIP: ' + ', '.join(conflicts))
    print(f'Verified {len(manifest["files"])} files; {len(changes)} need updating.')
    if args.check or not changes:
        return
    backup = Path(tempfile.mkdtemp(prefix=f'{target.name}-update-backup-', dir=target.parent))
    for _, destination, relative in changes:
        if destination.is_file():
            saved = backup / relative
            saved.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(destination, saved)
    (backup / 'updated-files.json').write_text(json.dumps([
        {'path': str(r), 'existed_before': d.is_file()} for _, d, r in changes
    ], indent=2), encoding='utf-8')
    for source, destination, _ in changes:
        destination.parent.mkdir(parents=True, exist_ok=True)
        with tempfile.NamedTemporaryFile(dir=destination.parent, delete=False) as stream:
            temporary = Path(stream.name)
            stream.write(source.read_bytes())
        temporary.replace(destination)
    print(f'Applied. Original files backed up to: {backup}')
    print('Run the content checks, npm ci and npm run build before publishing.')


if __name__ == '__main__':
    main()
