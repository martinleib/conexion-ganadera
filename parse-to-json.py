import pdfplumber
import json
import re

def extract_data_from_pdf(pdf_path, output_json):
    data = []
    
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            if text:
                lines = text.split("\n")
                for line in lines:
                    match = re.match(r"(\d+)\s+([\w\s,ñÑáéíóúÁÉÍÓÚ.-]+)\s+([\d.,]+)", line)
                    if match:
                        dador = int(match.group(1))
                        nombre = match.group(2).strip()
                        cantidad = float(match.group(3).replace(".", "").replace(",", "."))
                        
                        data.append({
                            "dador": dador,
                            "nombre": nombre,
                            "cantidad": cantidad
                        })
    
    with open(output_json, "w", encoding="utf-8") as json_file:
        json.dump(data, json_file, indent=2, ensure_ascii=False)

    print(f"Data successfully extracted to {output_json}")
    
pdf_path = "input.pdf"
output_json = "output.json"
extract_data_from_pdf(pdf_path, output_json)
