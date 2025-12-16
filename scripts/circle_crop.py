from PIL import Image, ImageDraw, ImageOps, ImageChops
import sys

def crop_to_circle_and_transparent(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    
    # 1. Trim borders (assuming background is black or uniform color at 0,0)
    bg = Image.new(img.mode, img.size, img.getpixel((0,0)))
    diff = ImageChops.difference(img, bg)
    diff = ImageChops.add(diff, diff, 2.0, -100)
    bbox = diff.getbbox()
    if bbox:
        img = img.crop(bbox)
        
    # 2. Resize to be square to ensure perfect circle
    size = min(img.size)
    img = ImageOps.fit(img, (size, size), centering=(0.5, 0.5))

    # 3. Create circular mask
    mask = Image.new('L', (size, size), 0)
    draw = ImageDraw.Draw(mask) 
    # Draw circle slightly smaller to avoid edge artifacts
    draw.ellipse((0, 0, size, size), fill=255)
    
    # 4. Apply mask
    output = ImageOps.fit(img, mask.size, centering=(0.5, 0.5))
    output.putalpha(mask)
    
    # 5. Save
    output.save(output_path, "PNG")
    print(f"Saved circular transparent logo to {output_path}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python circle_crop.py input output")
    else:
        crop_to_circle_and_transparent(sys.argv[1], sys.argv[2])
