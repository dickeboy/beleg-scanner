let belege = [];

async function scanBeleg() {
  const file = document.getElementById('imageInput').files[0];
  if (!file) return alert("Bitte ein Bild auswählen");

  const result = await Tesseract.recognize(file, 'ron'); // rumänisch für Moldau
  const text = result.data.text;
  document.getElementById('output').textContent = text;

  // Daten extrahieren
  const idMatch = text.match(/\b\d{13}\b/); // Steuer-ID (13 Ziffern)
  const nameMatch = text.match(/([A-Z\s]+)(?=\s+S\.R\.L)/);
  const totalMatch = text.match(/Total\s*[:\-]?\s*(\d+[,.]\d{2})/i);
  const tvaMatch = text.match(/TVA\s*[:\-]?\s*(\d+[,.]\d{2})/i);

  belege.push({
    'Steuer-ID': idMatch ? idMatch[0] : '',
    'Unternehmen': nameMatch ? nameMatch[1].trim() : '',
    'Rechnungsbetrag': totalMatch ? totalMatch[1] : '',
    'TVA': tvaMatch ? tvaMatch[1] : ''
  });
}

function downloadExcel() {
  const ws = XLSX.utils.json_to_sheet(belege);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Belege");

  XLSX.writeFile(wb, "belege_moldau.xlsx");
}
