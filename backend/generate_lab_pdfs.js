import fs from 'fs-extra';
import PDFDocument from 'pdfkit';
import path from 'path';
import labData from './src/uploads/labresults/lab_results_seed.json' assert { type: 'json' };

const LAB_DIR = path.join(process.cwd(), 'lab_reports');

async function generatePDFs() {
  await fs.ensureDir(LAB_DIR);

  for (const item of labData) {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const filePath = path.join(LAB_DIR, item.fileName);
    doc.pipe(fs.createWriteStream(filePath));

    doc.fontSize(16).text('City Clinic - Lab Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Patient: ${item.patientName}`);
    doc.text(`DOB: ${item.patientDOB}`);
    doc.text(`Report Date: ${new Date(item.uploadedAt).toDateString()}`);
    doc.text(`Referring Doctor: ${item.referringDoctor}`);
    doc.moveDown();

    doc.text('Test Results:');
    Object.entries(item.remarks).forEach(([test, value]) => {
      doc.text(`${test}: ${value}`);
    });

    doc.moveDown();
    doc.text('Authorized signatory: Dr. Lab Incharge', { align: 'right' });

    doc.end();
    console.log('Generated PDF:', item.fileName);
  }
}

generatePDFs();
