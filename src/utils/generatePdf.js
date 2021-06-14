import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const generatePdf = (title, subtitle, content, filename) => {
  const doc = new jsPDF();

  doc.setFontSize(15);
  doc.setFont('courier', 'normal');

  doc.text(title, 105, 10, 'center');
  doc.text(subtitle, 105, 20, 'center');
  doc.text(content, 10, 30);
  doc.text('[SEMNAT DIGITAL]', 200, 150, 'right');
  doc.save(`${filename}.pdf`);
};

export const generatePdfFromTable = (title, content, tableId, filename) => {
  const doc = new jsPDF();

  doc.setFontSize(15);
  doc.setFont('courier', 'normal');

  doc.text(content, 10, 10);
  doc.text(title, 105, 80, 'center');
  doc.autoTable({ html: `#${tableId}`, startY: 85 });

  let finalY = doc.previousAutoTable.finalY;
  const today = new Date().toISOString().slice(0, 10);

  doc.text(`\tDATA ELIBERARII: ${today}`, 10, finalY + 20);
  doc.text('[SEMNAT DIGITAL]', 200, finalY + 25, 'right');
  doc.save(`${filename}.pdf`)
};
