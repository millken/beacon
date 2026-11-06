from pathlib import Path
import base64,re,sys
p=Path(sys.argv[1]); dest=Path(sys.argv[2])
s=p.read_text(); m=re.search(r'"([A-Za-z0-9+/=]{100,})"',s)
if not m: raise ValueError('No base64 image data in '+str(p))
data=base64.b64decode(m[1]); assert data.startswith(b'\x89PNG') or data.startswith(b'<svg')
dest.parent.mkdir(exist_ok=True,parents=True);dest.write_bytes(data);print(dest,len(data))
