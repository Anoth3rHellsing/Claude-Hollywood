import sys, glob
from PIL import Image, ImageDraw
pat, out = sys.argv[1], sys.argv[2]; cols=int(sys.argv[3]) if len(sys.argv)>3 else 3
fs=sorted(glob.glob(pat)); tw,th=640,360; rows=(len(fs)+cols-1)//cols
S=Image.new('RGB',(cols*tw,rows*th),'white'); d=ImageDraw.Draw(S)
for i,f in enumerate(fs):
    S.paste(Image.open(f).convert('RGB').resize((tw,th)),((i%cols)*tw,(i//cols)*th)); d.text(((i%cols)*tw+4,(i//cols)*th+4),f.split('/')[-1],fill='yellow')
S.save(out,quality=85)
