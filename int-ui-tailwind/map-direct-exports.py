from pathlib import Path
import xml.etree.ElementTree as ET,json
# Node exports preserve the source layer id; match that to the generated asset filename.
name_by_guid={x['guid']:x['name'] for x in json.loads(Path('source/assets-to-export.json').read_text())}
used=set(name_by_guid.values());count=0
for p in Path('source/direct-exports').glob('*.svg'):
 try: root=ET.parse(p).getroot()
 except:continue
 ids=[e.attrib.get('id','') for e in root.iter()]
 # Asset suffix digits are generated deduplication suffixes, not part of layer names.
 candidates=[]
 for e in root.iter():
  i=e.attrib.get('id','')
  if not i:continue
  for n,g in name_by_guid.items():
   if n in used and (i.lower().replace(' ','').replace('/','').replace('-','').replace('_','') == Path(n).stem.lower().replace('20x20','').replace('_','').rstrip('0123456789')):
    candidates.append(n)
 # Direct export file contents can be mapped by matching unique small layer name; prefer root id.
 if not candidates:continue
 n=candidates[0]
 Path('assets/icons',n).write_bytes(p.read_bytes());count+=1
print('mapped',count)
