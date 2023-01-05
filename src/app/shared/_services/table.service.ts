import {Injectable} from '@angular/core';
import * as XLSX from 'xlsx';
import * as Papa from 'papaparse';
import {saveAs} from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({
    providedIn: 'root'
})
export class TableService {
    private date: Date = new Date();

    public constructor() {
    }

    public exportAsPdf(tableId: string, fileName: string): void {
        const doc = new jsPDF();
        // TODO: fix for cyrillic
        autoTable(doc, {
            html: `#${tableId}`
        });
        doc.save(`${fileName}.pdf`);
    }

    public exportAsExcel(data: any, fileName: string): void {
        const workSheet = XLSX.utils.json_to_sheet(data);
        const workBook: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workBook, workSheet, 'SheetName');
        XLSX.writeFile(workBook, `${this.date.toLocaleDateString()}_${fileName}.xlsx`);
    }

    public exportAsCsv(data: any, fileName: string): void {
        const csv = Papa.unparse(data);
        saveAs(new Blob([csv]), `${this.date.toLocaleDateString()}_${fileName}.csv`);
    }
}
