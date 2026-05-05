import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const BRAND_BLUE = '#1673CA';
const BRAND_GREY = '#808080';

function addBrandedHeader(doc: jsPDF): number {
  doc.setFillColor(BRAND_BLUE);
  doc.rect(0, 0, doc.internal.pageSize.getWidth(), 28, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('NX RaahNuma', 14, 14);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('AI Career Counselor — by NerithonX Technologies', 14, 22);
  doc.setTextColor(0, 0, 0);
  return 36;
}

function addBrandedFooter(doc: jsPDF): void {
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const h = doc.internal.pageSize.getHeight();
    const w = doc.internal.pageSize.getWidth();
    doc.setDrawColor(BRAND_GREY);
    doc.line(14, h - 16, w - 14, h - 16);
    doc.setFontSize(8);
    doc.setTextColor(BRAND_GREY);
    doc.text('Powered by NerithonX Technologies (Pvt.) Ltd. © 2026', 14, h - 10);
    doc.text(`Page ${i} of ${pageCount}`, w - 14, h - 10, { align: 'right' });
  }
}

export async function exportElementAsPDF(elementId: string, filename: string): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) throw new Error('Element not found');
  const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const startY = addBrandedHeader(pdf);
  const imgWidth = pdfWidth - 28;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  const availableHeight = pdfHeight - startY - 24;

  if (imgHeight <= availableHeight) {
    pdf.addImage(imgData, 'PNG', 14, startY, imgWidth, imgHeight);
  } else {
    let yOffset = 0;
    let firstPage = true;
    while (yOffset < imgHeight) {
      if (!firstPage) {
        pdf.addPage();
        addBrandedHeader(pdf);
      }
      const currentStartY = firstPage ? startY : 36;
      const sliceHeight = Math.min(availableHeight, imgHeight - yOffset);
      pdf.addImage(imgData, 'PNG', 14, currentStartY - yOffset, imgWidth, imgHeight);
      yOffset += sliceHeight;
      firstPage = false;
    }
  }
  addBrandedFooter(pdf);
  pdf.save(filename);
}

export function exportTextAsPDF(title: string, content: string, filename: string): void {
  const doc = new jsPDF('p', 'mm', 'a4');
  const startY = addBrandedHeader(doc);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(BRAND_BLUE);
  doc.text(title, 14, startY);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(50, 50, 50);
  const lines = doc.splitTextToSize(content, doc.internal.pageSize.getWidth() - 28);
  let y = startY + 10;
  for (const line of lines) {
    if (y > doc.internal.pageSize.getHeight() - 24) {
      doc.addPage();
      addBrandedHeader(doc);
      y = 36;
    }
    doc.text(line, 14, y);
    y += 5;
  }
  addBrandedFooter(doc);
  doc.save(filename);
}

export function exportChatAsPDF(
  chatTitle: string,
  messages: { role: string; content: string; timestamp: string }[],
  filename: string
): void {
  const doc = new jsPDF('p', 'mm', 'a4');
  let y = addBrandedHeader(doc);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(BRAND_BLUE);
  doc.text(chatTitle, 14, y);
  y += 10;
  const pageW = doc.internal.pageSize.getWidth();
  for (const msg of messages) {
    const label = msg.role === 'user' ? 'You' : 'NX RaahNuma';
    const color = msg.role === 'user' ? '#1673CA' : '#374151';
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(color);
    doc.text(`${label} — ${new Date(msg.timestamp).toLocaleString()}`, 14, y);
    y += 5;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(50, 50, 50);
    const lines = doc.splitTextToSize(msg.content.replace(/\*\*/g, '').replace(/#{1,6}\s/g, ''), pageW - 28);
    for (const line of lines) {
      if (y > doc.internal.pageSize.getHeight() - 24) { doc.addPage(); y = addBrandedHeader(doc); }
      doc.text(line, 14, y);
      y += 5;
    }
    y += 4;
  }
  addBrandedFooter(doc);
  doc.save(filename);
}
