import React, { useState, useCallback } from 'react';
import { Upload, FileText, Download, AlertCircle, CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

interface CSVRow {
  id: string;
  data: Record<string, string>;
  errors: string[];
  isValid: boolean;
}

interface CSVUploaderProps {
  onUpload: (rows: CSVRow[]) => void;
  onPreview: () => void;
}

const CSVUploader: React.FC<CSVUploaderProps> = ({ onUpload, onPreview }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<CSVRow[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const validateRow = (row: Record<string, string>, index: number): string[] => {
    const rowErrors: string[] = [];
    
    // Required fields validation
    const requiredFields = ['name', 'email', 'phone', 'pickup_date', 'pickup_address', 'delivery_address'];
    requiredFields.forEach(field => {
      if (!row[field] || row[field].trim() === '') {
        rowErrors.push(`Missing required field: ${field}`);
      }
    });

    // Date format validation
    if (row.pickup_date) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(row.pickup_date)) {
        rowErrors.push(`Invalid date format (expected YYYY-MM-DD)`);
      }
    }

    // Email validation
    if (row.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(row.email)) {
        rowErrors.push(`Invalid email format`);
      }
    }

    // Phone validation
    if (row.phone) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(row.phone.replace(/\s/g, ''))) {
        rowErrors.push(`Invalid phone format`);
      }
    }

    return rowErrors;
  };

  const parseCSV = (csvText: string): CSVRow[] => {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length === 0) return [];

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const rows: CSVRow[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      const rowData: Record<string, string> = {};
      
      headers.forEach((header, index) => {
        rowData[header] = values[index] || '';
      });

      const rowErrors = validateRow(rowData, i);
      rows.push({
        id: `row-${i}`,
        data: rowData,
        errors: rowErrors,
        isValid: rowErrors.length === 0
      });
    }

    return rows;
  };

  const handleFileUpload = useCallback(async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      setErrors(['Please upload a CSV file']);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadedFile(file);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 10;
        });
      }, 100);

      const text = await file.text();
      const rows = parseCSV(text);
      
      setParsedRows(rows);
      
      const totalErrors = rows.reduce((acc, row) => acc + row.errors.length, 0);
      if (totalErrors > 0) {
        setErrors([`Found ${totalErrors} validation errors across ${rows.length} rows`]);
      } else {
        setErrors([]);
      }

      onUpload(rows);
    } catch (error) {
      setErrors(['Failed to parse CSV file. Please check the format and try again.']);
    } finally {
      setIsUploading(false);
    }
  }, [onUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const downloadSampleCSV = () => {
    const sampleData = [
      'name,email,phone,pickup_date,pickup_address,delivery_address,special_instructions',
      'John Doe,john@example.com,+1234567890,2024-02-15,123 Main St New York NY,456 Oak Ave Boston MA,Handle with care',
      'Jane Smith,jane@example.com,+1987654321,2024-02-16,789 Pine St Chicago IL,321 Elm St Miami FL,Fragile items'
    ].join('\n');

    const blob = new Blob([sampleData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample-bulk-booking.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadErrorCSV = () => {
    const errorRows = parsedRows.filter(row => !row.isValid);
    if (errorRows.length === 0) return;

    const headers = Object.keys(errorRows[0].data);
    const csvContent = [
      headers.join(','),
      ...errorRows.map(row => 
        headers.map(header => `"${row.data[header] || ''}"`).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'errors-only.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const validRows = parsedRows.filter(row => row.isValid);
  const errorRows = parsedRows.filter(row => !row.isValid);

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
        <CardContent className="p-8">
          <div
            className={`text-center space-y-4 ${
              isDragOver ? 'bg-gray-50' : ''
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <Upload className="w-6 h-6 text-gray-600" />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold">Upload your CSV file</h3>
              <p className="text-sm text-gray-600">
                Drag and drop your CSV file here, or click to browse
              </p>
            </div>

            <input
              type="file"
              accept=".csv"
              onChange={handleFileInput}
              className="hidden"
              id="csv-upload"
            />
            <label htmlFor="csv-upload">
              <Button asChild variant="outline">
                <span>Choose File</span>
              </Button>
            </label>

            <div className="text-xs text-gray-500">
              <Button variant="link" onClick={downloadSampleCSV} className="p-0 h-auto">
                Download sample CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload Progress */}
      {isUploading && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Uploading {uploadedFile?.name}</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Results */}
      {parsedRows.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Upload Results
            </CardTitle>
            <CardDescription>
              {parsedRows.length} rows processed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-1">
                <div className="text-2xl font-bold text-green-600">{validRows.length}</div>
                <div className="text-sm text-gray-600">Valid rows</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-red-600">{errorRows.length}</div>
                <div className="text-sm text-gray-600">Error rows</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-blue-600">{parsedRows.length}</div>
                <div className="text-sm text-gray-600">Total rows</div>
              </div>
            </div>

            {errors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {errors.map((error, index) => (
                    <div key={index}>{error}</div>
                  ))}
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2">
              {errorRows.length > 0 && (
                <Button variant="outline" onClick={downloadErrorCSV}>
                  <Download className="w-4 h-4 mr-2" />
                  Download errors only
                </Button>
              )}
              
              <Button 
                onClick={onPreview}
                disabled={validRows.length === 0}
                className="flex-1"
              >
                {errorRows.length > 0 ? 'Preview Valid Rows' : 'Continue to Preview'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CSVUploader;
