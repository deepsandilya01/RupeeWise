import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import {
  X,
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2,
} from 'lucide-react';

export const CsvImportModal = ({ isOpen, onClose, onImport, loading = false }) => {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [parsedRows, setParsedRows] = useState([]);
  const [parseError, setParseError] = useState(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      processCsv(selected);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0];
    if (dropped && dropped.name.endsWith('.csv')) {
      processCsv(dropped);
    } else {
      setParseError('Please upload a valid .csv file');
    }
  };

  const processCsv = (uploadedFile) => {
    setFile(uploadedFile);
    setParseError(null);

    Papa.parse(uploadedFile, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        if (!results.data || results.data.length === 0) {
          setParseError('The selected CSV file contains no data rows.');
          return;
        }

        // Normalize columns and validate
        const normalized = results.data.map((row, idx) => {
          // Look for title/merchant
          const title =
            row.title ||
            row.merchant ||
            row.Merchant ||
            row.Description ||
            row.description ||
            row.Name ||
            row.name ||
            `Transaction #${idx + 1}`;

          // Look for amount
          let rawAmount =
            row.amount ||
            row.Amount ||
            row.value ||
            row.Value ||
            row.INR ||
            row.inr ||
            0;
          if (typeof rawAmount === 'string') {
            rawAmount = parseFloat(rawAmount.replace(/[^0-9.-]+/g, ''));
          }
          const amount = Math.abs(Number(rawAmount)) || 0;

          // Look for type
          let type = 'expense';
          const rawType = String(
            row.type || row.Type || row['Transaction Type'] || ''
          ).toLowerCase();
          if (
            rawType.includes('credit') ||
            rawType === 'income' ||
            rawType === 'cr'
          ) {
            type = 'income';
          }

          // Look for category
          const category =
            row.category ||
            row.Category ||
            (type === 'income' ? 'Salary & Income' : 'Other');

          // Look for date
          const rawDate = row.date || row.Date || row.Timestamp;
          let date = new Date().toISOString().split('T')[0];
          if (rawDate && !isNaN(Date.parse(rawDate))) {
            date = new Date(rawDate).toISOString().split('T')[0];
          }

          // Payment method
          const paymentMethod = row.paymentMethod || row.payment_mode || 'UPI';

          const isValid = Boolean(title && amount > 0);

          return {
            title: String(title).trim(),
            amount,
            type,
            category: String(category).trim(),
            date,
            paymentMethod: String(paymentMethod).trim(),
            isValid,
            error: !isValid ? 'Missing title or positive amount' : null,
          };
        });

        setParsedRows(normalized);
      },
      error: (err) => {
        setParseError(`CSV parsing failed: ${err.message}`);
      },
    });
  };

  const handleReset = () => {
    setFile(null);
    setParsedRows([]);
    setParseError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const validTransactions = parsedRows.filter((r) => r.isValid);

  const handleConfirmImport = () => {
    if (validTransactions.length === 0) return;
    onImport(
      validTransactions.map((t) => ({
        title: t.title,
        amount: t.amount,
        type: t.type,
        category: t.category,
        date: t.date,
        paymentMethod: t.paymentMethod,
      }))
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs select-none">
      <div className="bg-white rounded-3xl w-full max-w-2xl border border-gray-200/90 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-[#FAF7F2]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#0C3846] text-white flex items-center justify-center font-bold">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#0B1D33]">
                Import Transactions (CSV)
              </h2>
              <p className="text-[11px] text-gray-500">
                Upload your bank statement or CSV file to bulk import records
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {!file ? (
            /* Upload Dropzone */
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-200 hover:border-[#0C3846] rounded-2xl p-8 text-center cursor-pointer transition-colors bg-gray-50/50 hover:bg-gray-50"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-2xl bg-peach-100 text-coral-500 flex items-center justify-center mx-auto mb-3">
                <UploadCloud className="w-6 h-6" />
              </div>
              <h4 className="text-xs font-bold text-[#0B1D33]">
                Click to upload or drag &amp; drop
              </h4>
              <p className="text-[11px] text-gray-400 mt-1">
                Supports bank statements or CSV files up to 5MB
              </p>
              <div className="mt-3 inline-block px-3 py-1 rounded-full bg-white border border-gray-200 text-[10px] font-semibold text-gray-500">
                Columns: Title/Merchant, Amount, Type, Category, Date
              </div>
            </div>
          ) : (
            /* Preview of Parsed Rows */
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-200 text-xs">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-[#0C3846]" />
                  <span className="font-bold text-[#0B1D33] truncate max-w-xs">
                    {file.name}
                  </span>
                  <span className="text-gray-400">
                    ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1 text-[11px] text-red-500 hover:text-red-700 font-semibold"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              </div>

              {/* Status Summary */}
              <div className="flex items-center justify-between text-xs px-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold text-gray-700">
                    {validTransactions.length} valid transactions ready
                  </span>
                </div>
                {parsedRows.length - validTransactions.length > 0 && (
                  <div className="flex items-center gap-1 text-red-500 font-semibold text-[11px]">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>
                      {parsedRows.length - validTransactions.length} invalid rows skipped
                    </span>
                  </div>
                )}
              </div>

              {/* Preview Table */}
              <div className="border border-gray-200 rounded-xl overflow-hidden max-h-60 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF7F2] text-gray-600 font-bold sticky top-0 border-b border-gray-200">
                    <tr>
                      <th className="py-2 px-3">Title / Merchant</th>
                      <th className="py-2 px-3">Type</th>
                      <th className="py-2 px-3">Category</th>
                      <th className="py-2 px-3">Date</th>
                      <th className="py-2 px-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {parsedRows.slice(0, 25).map((row, idx) => (
                      <tr
                        key={idx}
                        className={
                          row.isValid
                            ? 'hover:bg-gray-50/50'
                            : 'bg-red-50/40 text-red-700'
                        }
                      >
                        <td className="py-2 px-3 font-medium truncate max-w-[140px]">
                          {row.title}
                        </td>
                        <td className="py-2 px-3">
                          <span
                            className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              row.type === 'income'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {row.type}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-gray-500 truncate max-w-[100px]">
                          {row.category}
                        </td>
                        <td className="py-2 px-3 text-gray-400 text-[11px]">
                          {row.date}
                        </td>
                        <td className="py-2 px-3 text-right font-bold text-[#0B1D33]">
                          ₹{row.amount.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {parsedRows.length > 25 && (
                <p className="text-[10px] text-gray-400 text-center italic">
                  Showing first 25 of {parsedRows.length} total rows
                </p>
              )}
            </div>
          )}

          {parseError && (
            <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs flex items-center gap-2 border border-red-200">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{parseError}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-800 rounded-xl hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmImport}
            disabled={loading || validTransactions.length === 0}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-[#0C3846] hover:bg-[#124e60] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all shadow-sm"
          >
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>Import {validTransactions.length} Transactions</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CsvImportModal;
