import base64

with open("/tmp/file_attachments/image.png", "rb") as image_file:
    encoded_string = base64.b64encode(image_file.read()).decode("utf-8")
    print(f"data:image/png;base64,{encoded_string[:100]}...") # Just print a prefix to verify it worked
